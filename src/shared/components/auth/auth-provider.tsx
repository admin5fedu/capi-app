import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth-store'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Auth Provider component
 * Lắng nghe sự thay đổi của Supabase auth state và tự động cập nhật Zustand Store
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { layPhienLamViecHienTai, reset } = useAuthStore()
  const isInitialized = useRef(false)

  useEffect(() => {
    // Lấy session ban đầu khi component mount
    const initAuth = async () => {
      if (!isInitialized.current) {
        isInitialized.current = true
        await layPhienLamViecHienTai()
      }
    }
    initAuth()

    // Lắng nghe sự thay đổi auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event, session)

      // Bỏ qua INITIAL_SESSION vì đã xử lý trong initAuth
      if (event === 'INITIAL_SESSION') {
        return
      }

      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
          // Gọi lại layPhienLamViecHienTai để đồng bộ toàn bộ state
          await layPhienLamViecHienTai()
          break

        case 'SIGNED_OUT':
          reset()
          break

        case 'USER_UPDATED':
          // Chỉ cần refresh session khi user info thay đổi
          await layPhienLamViecHienTai()
          break

        default:
          // Các events khác không cần xử lý
          break
      }
    })

    // Cleanup subscription khi unmount
    return () => {
      subscription.unsubscribe()
      isInitialized.current = false
    }
  }, [layPhienLamViecHienTai, reset])

  return <>{children}</>
}
