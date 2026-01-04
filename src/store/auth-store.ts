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

          // Reset state và đảm bảo isLoading = false
          get().reset()
          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      /**
       * Lấy phiên làm việc hiện tại
       * So sánh user auth với cột email trong bảng zz_capi_nguoi_dung để nhận diện người dùng
       */
      layPhienLamViecHienTai: async () => {
        // Tránh gọi nhiều lần đồng thời
        if (get().isFetchingSession) {
          return
        }

        const currentState = get()
        // Nếu đã có session và user, chỉ refresh nếu cần (không set loading)
        const hasExistingData = currentState.session && currentState.user && currentState.nguoiDung

        try {
          // Chỉ set loading nếu chưa có data (lần đầu load)
          if (!hasExistingData) {
            set({ isLoading: true, isFetchingSession: true })
          } else {
            set({ isFetchingSession: true }) // Chỉ set flag, không set loading
          }

          // Lấy user hiện tại từ Supabase Auth (getUser() đảm bảo lấy user mới nhất)
          const {
            data: { user: authUser },
            error: userError,
          } = await supabase.auth.getUser()
          
          // Lấy session để có access token
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession()

          if (userError) {
            throw userError
          }

          if (sessionError) {
            throw sessionError
          }

          // Set cả user và session
          set({ session, user: authUser ?? null })

          // Nếu có user, lấy thông tin từ bảng zz_capi_nguoi_dung bằng cách so sánh email
          // Logic: So sánh user auth email với cột email trong bảng zz_capi_nguoi_dung
          if (session?.user?.email) {
            // Normalize email: lowercase và trim để đảm bảo so sánh chính xác
            const userEmail = session.user.email.toLowerCase().trim()

            try {
              // Query riêng để tránh lỗi 400 với join
              // Nếu foreign key relationship chưa được setup đúng trong Supabase
              const { data: nguoiDungData, error: nguoiDungError } = await supabase
                .from('zz_capi_nguoi_dung')
                .select('*')
                .eq('email', userEmail)
                .single()

              if (nguoiDungError) {
                // Nếu không tìm thấy user trong bảng (PGRST116 = no rows returned)
                if (nguoiDungError.code === 'PGRST116') {
                  set({ nguoiDung: null, vaiTro: null })
                } else {
                  set({ nguoiDung: null, vaiTro: null })
                }
              } else if (nguoiDungData) {
                // Nếu có vai_tro_id, query thêm thông tin vai trò
                let vaiTroData: VaiTro | null = null
                if (nguoiDungData.vai_tro_id) {
                  try {
                    const { data: vaiTro, error: vaiTroError } = await supabase
                      .from('zz_capi_vai_tro')
                      .select('*')
                      .eq('id', nguoiDungData.vai_tro_id)
                      .single()

                    if (!vaiTroError && vaiTro) {
                      vaiTroData = vaiTro as VaiTro
                    }
                  } catch (vaiTroErr) {
                    // Ignore error khi query vai tro
                  }
                }

                set({
                  nguoiDung: nguoiDungData as NguoiDung,
                  vaiTro: vaiTroData,
                })
              } else {
                set({ nguoiDung: null, vaiTro: null })
              }
            } catch (err) {
              set({ nguoiDung: null, vaiTro: null })
            }
          } else {
            set({ nguoiDung: null, vaiTro: null })
          }

          set({ isLoading: false, isFetchingSession: false })
        } catch (error) {
          set({ isLoading: false, isFetchingSession: false })
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

