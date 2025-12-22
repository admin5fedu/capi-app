import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { NguoiDung, VaiTro } from '@/types'

interface AuthState {
  user: User | null
  nguoiDung: NguoiDung | null
  vaiTro: VaiTro | null
  session: Session | null
  isLoading: boolean
  isFetchingSession: boolean // Flag để tránh gọi nhiều lần đồng thời
}

interface AuthActions {
  dangNhap: (email: string, password: string) => Promise<void>
  dangNhapGoogle: () => Promise<void>
  dangXuat: () => Promise<void>
  layPhienLamViecHienTai: () => Promise<void>
  setUser: (user: User | null) => void
  setNguoiDung: (nguoiDung: NguoiDung | null) => void
  setVaiTro: (vaiTro: VaiTro | null) => void
  setSession: (session: AuthState['session']) => void
  setLoading: (isLoading: boolean) => void
  reset: () => void
}

const initialState: AuthState = {
  user: null,
  nguoiDung: null,
  vaiTro: null,
  session: null,
  isLoading: true,
  isFetchingSession: false,
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Đăng nhập
       */
      dangNhap: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error) throw error

          if (data.user) {
            await get().layPhienLamViecHienTai()
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      /**
       * Đăng nhập bằng Google
       */
      dangNhapGoogle: async () => {
        try {
          set({ isLoading: true })
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/`,
            },
          })

          if (error) throw error
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      /**
       * Đăng xuất
       */
      dangXuat: async () => {
        try {
          set({ isLoading: true })
          const { error } = await supabase.auth.signOut()
          if (error) throw error

          get().reset()
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      /**
       * Lấy phiên làm việc hiện tại
       * So sánh user auth với cột email trong bảng zz_cst_nguoi_dung để nhận diện người dùng
       */
      layPhienLamViecHienTai: async () => {
        // Tránh gọi nhiều lần đồng thời
        if (get().isFetchingSession) {
          console.log('[Auth Store] ⏸️ Already fetching session, skipping...')
          return
        }

        const currentState = get()
        // Nếu đã có session và user, chỉ refresh nếu cần (không set loading)
        const hasExistingData = currentState.session && currentState.user && currentState.nguoiDung

        try {
          console.log('[Auth Store] ⏳ Starting layPhienLamViecHienTai...')
          // Chỉ set loading nếu chưa có data (lần đầu load)
          if (!hasExistingData) {
            set({ isLoading: true, isFetchingSession: true })
          } else {
            set({ isFetchingSession: true }) // Chỉ set flag, không set loading
          }

          // Lấy session hiện tại từ Supabase Auth
          console.log('[Auth Store] 📡 Fetching session from Supabase Auth...')
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession()
          console.log('[Auth Store] ✅ getSession completed')

          if (sessionError) {
            console.error('[Auth Store] ❌ Session error:', sessionError)
            throw sessionError
          }

          console.log('[Auth Store] ✅ Session retrieved:', {
            hasSession: !!session,
            hasUser: !!session?.user,
            userEmail: session?.user?.email,
          })

          set({ session, user: session?.user ?? null })

          // Nếu có user, lấy thông tin từ bảng zz_cst_nguoi_dung bằng cách so sánh email
          // Logic: So sánh user auth email với cột email trong bảng zz_cst_nguoi_dung
          if (session?.user?.email) {
            // Normalize email: lowercase và trim để đảm bảo so sánh chính xác
            const userEmail = session.user.email.toLowerCase().trim()
            console.log('[Auth Store] 🔍 Looking up user in zz_cst_nguoi_dung table by email:', userEmail)

            try {
              const { data: nguoiDungData, error: nguoiDungError } = await supabase
                .from('zz_cst_nguoi_dung')
                .select(`
                  *,
                  vai_tro:zz_cst_vai_tro (*)
                `)
                .eq('email', userEmail)
                .single()

              console.log('[Auth Store] 📊 Query result:', {
                hasData: !!nguoiDungData,
                hasError: !!nguoiDungError,
                errorCode: nguoiDungError?.code,
                errorMessage: nguoiDungError?.message,
                data: nguoiDungData ? {
                  id: nguoiDungData.id,
                  email: nguoiDungData.email,
                  ho_ten: nguoiDungData.ho_ten,
                  hasVaiTro: !!(nguoiDungData as any).vai_tro,
                } : null,
              })

              if (nguoiDungError) {
                // Nếu không tìm thấy user trong bảng (PGRST116 = no rows returned)
                if (nguoiDungError.code === 'PGRST116') {
                  console.warn(
                    '[Auth Store] ⚠️ User not found in zz_cst_nguoi_dung table for email:',
                    userEmail
                  )
                  set({ nguoiDung: null, vaiTro: null })
                } else {
                  console.error('[Auth Store] ❌ Error fetching user data:', {
                    code: nguoiDungError.code,
                    message: nguoiDungError.message,
                    details: nguoiDungError,
                  })
                  set({ nguoiDung: null, vaiTro: null })
                }
              } else if (nguoiDungData) {
                console.log('[Auth Store] ✅ User data found and set:', {
                  id: nguoiDungData.id,
                  email: nguoiDungData.email,
                  ho_ten: nguoiDungData.ho_ten,
                })
                set({
                  nguoiDung: nguoiDungData as NguoiDung,
                  vaiTro: (nguoiDungData as any).vai_tro as VaiTro | null,
                })
              } else {
                console.warn('[Auth Store] ⚠️ No user data returned (data is null/undefined)')
                set({ nguoiDung: null, vaiTro: null })
              }
            } catch (err) {
              console.error('[Auth Store] ❌ Exception in nguoiDung query:', err)
              set({ nguoiDung: null, vaiTro: null })
            }
          } else {
            console.log('[Auth Store] ℹ️ No user email in session, clearing nguoiDung')
            set({ nguoiDung: null, vaiTro: null })
          }

          console.log('[Auth Store] ✅ Setting isLoading to false')
          set({ isLoading: false, isFetchingSession: false })
          console.log('[Auth Store] 🎉 layPhienLamViecHienTai completed successfully')
        } catch (error) {
          console.error('[Auth Store] ❌ Error in layPhienLamViecHienTai:', error)
          set({ isLoading: false, isFetchingSession: false })
          console.log('[Auth Store] 🔧 Error handled, isLoading set to false')
        }
      },

      /**
       * Set user
       */
      setUser: (user) => set({ user }),

      /**
       * Set nguoi dung
       */
      setNguoiDung: (nguoiDung) => set({ nguoiDung }),

      /**
       * Set vai tro
       */
      setVaiTro: (vaiTro) => set({ vaiTro }),

      /**
       * Set session
       */
      setSession: (session: Session | null) => set({ session }),

      /**
       * Set loading
       */
      setLoading: (isLoading) => set({ isLoading }),

      /**
       * Reset state
       */
      reset: () => set({ ...initialState, isLoading: false, isFetchingSession: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        nguoiDung: state.nguoiDung,
        vaiTro: state.vaiTro,
      }),
    }
  )
)

