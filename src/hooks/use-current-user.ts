/**
 * Hook để lấy thông tin user hiện tại từ Supabase Auth và bảng người dùng
 * Sử dụng TanStack Query với enabled condition để đảm bảo chỉ chạy khi có session
 */

import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth-store'
import { getNguoiDungByEmail } from '@/api/nguoi-dung'
// import type { NguoiDung } from '@/types/nguoi-dung' // Unused

/**
 * Lấy thông tin user từ Supabase Auth
 */
async function getCurrentAuthUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) throw error
  return user
}

/**
 * Hook: Lấy thông tin user hiện tại từ Supabase Auth
 * Chỉ chạy khi chưa có user trong store
 */
export function useCurrentAuthUser() {
  const { user, session } = useAuthStore()

  return useQuery({
    queryKey: ['current-auth-user'],
    queryFn: getCurrentAuthUser,
    enabled: !user && !!session, // Chỉ chạy nếu chưa có user nhưng đã có session
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: 1,
    meta: {
      skipPersist: true, // Không persist query này vì nó phụ thuộc vào session động
    },
  })
}

/**
 * Hook: Lấy thông tin người dùng từ bảng zz_capi_nguoi_dung dựa trên email
 * Chỉ chạy khi đã có email từ auth user
 */
export function useCurrentNguoiDung() {
  const { user, nguoiDung } = useAuthStore()
  const userEmail = user?.email

  return useQuery({
    queryKey: ['current-nguoi-dung', userEmail],
    queryFn: () => {
      if (!userEmail) throw new Error('No user email available')
      return getNguoiDungByEmail(userEmail)
    },
    enabled: !!userEmail && !nguoiDung, // Chỉ chạy nếu có email nhưng chưa có nguoiDung trong store
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: 1,
    meta: {
      skipPersist: true, // Không persist query này vì nó phụ thuộc vào user email động
    },
  })
}

/**
 * Hook tổng hợp: Lấy cả auth user và nguoiDung
 * Tự động sync với auth store
 */
export function useCurrentUser() {
  const { user, nguoiDung, setUser, setNguoiDung, setVaiTro } = useAuthStore()
  const { data: authUser } = useCurrentAuthUser()
  const { data: profileData } = useCurrentNguoiDung()

  // Sync auth user vào store khi có data
  useEffect(() => {
    if (authUser && !user) {
      setUser(authUser)
    }
  }, [authUser, user, setUser])

  // Sync profile data vào store khi có data
  useEffect(() => {
    if (profileData && !nguoiDung) {
      setNguoiDung(profileData)
      // Extract vai_tro từ profileData nếu có
      if ((profileData as any).vai_tro) {
        setVaiTro((profileData as any).vai_tro)
      }
    }
  }, [profileData, nguoiDung, setNguoiDung, setVaiTro])

  return {
    user: user || authUser,
    nguoiDung: nguoiDung || profileData,
    isLoading: !user || !nguoiDung,
  }
}

