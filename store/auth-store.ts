
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { NhanVien } from '../features/thiet-lap/nhan-vien/core/types';

interface AuthState {
  user: any | null;
  session: any | null;
  profile: NhanVien | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (session: any) => Promise<void>;
  logout: () => Promise<void>;
}

const fetchProfile = async (email: string): Promise<NhanVien | null> => {
  if (!email) return null;
  try {
    const { data, error } = await supabase
      .from('zz_capi_nguoi_dung')
      .select('*')
      .eq('email', email)
      .single();
    if (error) {
      console.warn("Không thể tải hồ sơ người dùng:", error.message);
      return null;
    }
    return data as NhanVien;
  } catch (e) {
    console.error("Lỗi khi tải hồ sơ:", e);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  setAuth: async (session) => {
    const profile = session?.user?.email ? await fetchProfile(session.user.email) : null;
    set({ 
      session, 
      user: session?.user ?? null, 
      profile,
      isAuthenticated: !!session,
      isLoading: false 
    });
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null, isAuthenticated: false, isLoading: false });
  },
}));
