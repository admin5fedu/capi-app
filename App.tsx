
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MainLayout from './components/layout/MainLayout';
import NhanVienModule from './features/thiet-lap/nhan-vien';
import VaiTroModule from './features/thiet-lap/vai-tro';
import KhachHangModule from './features/khach-hang';
import NhaCungCapModule from './features/nha-cung-cap';
import TaiKhoanModule from './features/tai-khoan';
import DanhMucTaiChinhModule from './features/danh-muc-tai-chinh';
import TyGiaModule from './features/ty-gia';
import GiaoDichModule from './features/giao-dich';
import HoSoModule from './features/thiet-lap/ho-so';
import BaoCaoModule from './features/bao-cao';
import CaiDatHeThongModule from './features/thiet-lap/he-thong';
import ThemeInitializer from './components/ThemeInitializer';
import { useAuthStore } from './store/auth-store';
import { supabase } from './lib/supabase';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth(session);
    });

    return () => subscription.unsubscribe();
  }, [setAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeInitializer />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Navigate to="/" replace />} />
            <Route path="nhan-su" element={<NhanVienModule />} />
            <Route path="vai-tro" element={<VaiTroModule />} />
            <Route path="khach-hang" element={<KhachHangModule />} />
            <Route path="nha-cung-cap" element={<NhaCungCapModule />} />
            <Route path="tai-khoan" element={<TaiKhoanModule />} />
            <Route path="danh-muc-tai-chinh" element={<DanhMucTaiChinhModule />} />
            <Route path="ty-gia" element={<TyGiaModule />} />
            <Route path="giao-dich" element={<GiaoDichModule />} />
            <Route path="ho-so" element={<HoSoModule />} />
            <Route path="bao-cao" element={<BaoCaoModule />} />
            <Route path="cai-dat" element={<CaiDatHeThongModule />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
};

export default App;