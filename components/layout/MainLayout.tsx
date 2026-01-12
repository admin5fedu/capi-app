
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuthStore } from '../../store/auth-store';
import { useAppStore } from '../../store/app-store';
import { useMediaQuery } from '../../shared/hooks/useMediaQuery';
import { cn } from '../../lib/utils';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen } = useAppStore();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Đang kết nối hệ thống...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const isMobileSidebarVisible = isSidebarOpen && !isDesktop;

  return (
    <div className="flex h-screen bg-[#F1F5F9]">
      <Sidebar />
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 lg:ml-20",
          isSidebarOpen && "lg:ml-64"
        )}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarVisible && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden animate-in fade-in-20"
        />
      )}
    </div>
  );
};

export default MainLayout;
