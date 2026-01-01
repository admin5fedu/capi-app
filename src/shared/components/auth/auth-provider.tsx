import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/auth-store'
import { useCurrentUser } from '@/hooks/use-current-user'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Auth Provider component
 * Lắng nghe sự thay đổi của Supabase auth state và tự động cập nhật Zustand Store
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { layPhienLamViecHienTai, reset, session } = useAuthStore()
  const isInitialized = useRef(false)
  const initPromiseRef = useRef<Promise<void> | null>(null)
  
  // Sử dụng TanStack Query để fetch user profile khi đã có session
  // Hook này sẽ tự động sync data vào auth store
  const { user, nguoiDung, isLoading: isLoadingUser } = useCurrentUser()

  useEffect(() => {
    // Lấy session ban đầu khi component mount
    const initAuth = async () => {
      // Tránh gọi nhiều lần đồng thời
      if (initPromiseRef.current) {
        return initPromiseRef.current
      }

      if (!isInitialized.current) {
        isInitialized.current = true
        // Check trong store trước khi gọi
        const currentState = useAuthStore.getState()
        if (currentState.session && currentState.user && currentState.nguoiDung) {
          return
        }
        initPromiseRef.current = layPhienLamViecHienTai()
        await initPromiseRef.current
        initPromiseRef.current = null
      }
    }
    initAuth()

    // Lắng nghe sự thay đổi auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      // Bỏ qua INITIAL_SESSION vì đã xử lý trong initAuth
      if (event === 'INITIAL_SESSION') {
        return
      }

      switch (event) {
        case 'SIGNED_IN':
          // Chỉ refresh khi đăng nhập mới
          await layPhienLamViecHienTai()
          break

        case 'TOKEN_REFRESHED':
          // Token refresh không cần refresh lại user data
          // Chỉ cần cập nhật session trong store nếu cần
          // Tránh gọi layPhienLamViecHienTai để không trigger re-render
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
      // KHÔNG reset isInitialized khi unmount vì có thể remount khi quay lại tab
    }
  }, []) // Bỏ dependencies để không trigger lại khi quay lại tab

  return <>{children}</>
}
