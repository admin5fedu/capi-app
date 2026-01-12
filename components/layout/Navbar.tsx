
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, Settings, LogOut, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAppStore } from '../../store/app-store';
import { useAuthStore } from '../../store/auth-store';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '../../features/thiet-lap/ho-so/services/profile-service';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const Navbar: React.FC = () => {
  const { setSidebarOpen } = useAppStore();
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: profile } = useQuery({
    queryKey: ['my_profile', user?.email],
    queryFn: () => profileService.getCurrentUserProfile(user?.email || ''),
    enabled: !!user?.email,
  });

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    toast.info(`Đã chuyển sang chế độ ${newMode ? 'Tối' : 'Sáng'}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('Hệ thống đã đăng xuất.');
      navigate('/login');
    } catch (error) {
      toast.error('Lỗi khi đăng xuất.');
    }
  };

  const avatarUrl = profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'CapiAdmin'}`;

  return (
    <header className="h-20 flex items-center justify-between px-4 sm:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-50 dark:border-slate-800 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2.5 rounded-xl text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="h-6 w-px bg-slate-100 dark:bg-slate-800 mx-2 hidden sm:block"></div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer group",
              isDropdownOpen && "bg-slate-50 dark:bg-slate-800"
            )}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">
                {profile?.ho_va_ten || user?.email?.split('@')[0] || 'Admin Capi'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">Quản trị viên</p>
            </div>
            <div className="relative shrink-0">
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="w-10 h-10 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm">
                <ChevronDown size={10} className={cn("text-slate-400 transition-transform duration-200", isDropdownOpen && "rotate-180")} />
              </div>
            </div>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-50 dark:border-slate-800 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
              <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 mb-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tài khoản</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">{user?.email}</p>
              </div>

              <Link 
                to="/ho-so"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User size={18} />
                <span>Xem hồ sơ</span>
              </Link>

              <button 
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-all"
                onClick={() => { toast.info('Chức năng Cài đặt đang phát triển.'); setIsDropdownOpen(false); }}
              >
                <Settings size={18} />
                <span>Cài đặt hệ thống</span>
              </button>

              <div className="h-px bg-slate-50 dark:bg-slate-800 my-2"></div>

              <button 
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                onClick={toggleDarkMode}
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-500" />}
                  <span>Chế độ {isDarkMode ? 'Sáng' : 'Tối'}</span>
                </div>
                <div className={cn(
                  "w-10 h-5 rounded-full relative transition-colors duration-200",
                  isDarkMode ? "bg-primary" : "bg-slate-200"
                )}>
                  <div className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200",
                    isDarkMode ? "translate-x-6" : "translate-x-1"
                  )}></div>
                </div>
              </button>

              <div className="h-px bg-slate-50 dark:bg-slate-800 my-2"></div>

              <button 
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
