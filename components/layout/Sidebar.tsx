
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  X,
  ShieldAlert,
  Truck,
  Wallet,
  ListTree,
  TrendingUp,
  ArrowRightLeft,
  PieChart
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store/app-store';
import { useAuthStore } from '../../store/auth-store';
import { toast } from 'sonner';
import ConfirmModal from '../common/ConfirmModal';

const navigation = [
  { group: 'Chính', items: [
    { name: 'Tổng quan', href: '/', icon: LayoutDashboard },
    { name: 'Báo cáo', href: '/bao-cao', icon: PieChart },
  ]},
  { group: 'Quản lý', items: [
    { name: 'Nhân sự', href: '/nhan-su', icon: Users },
    { name: 'Khách hàng', href: '/khach-hang', icon: Users },
    { name: 'Nhà cung cấp', href: '/nha-cung-cap', icon: Truck },
  ]},
  { group: 'Tài chính', items: [
    { name: 'Giao dịch', href: '/giao-dich', icon: ArrowRightLeft },
    { name: 'Tài khoản', href: '/tai-khoan', icon: Wallet },
    { name: 'Danh mục TC', href: '/danh-muc-tai-chinh', icon: ListTree },
    { name: 'Tỷ giá', href: '/ty-gia', icon: TrendingUp },
  ]},
  { group: 'Hệ thống', items: [
    { name: 'Vai trò', href: '/vai-tro', icon: ShieldAlert },
    { name: 'Cài đặt', href: '/cai-dat', icon: Settings },
  ]}
];

const Sidebar: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen } = useAppStore();
  const { logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
      toast.info('Hệ thống đã đăng xuất.');
      navigate('/login');
    } catch (error) {
      toast.error('Lỗi khi đăng xuất.');
    }
  };

  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-100 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex items-center justify-between h-20 px-6">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
            <span className="text-white font-extrabold text-lg">C</span>
          </div>
          <span className={cn("font-bold text-lg tracking-tight text-slate-900 transition-opacity duration-200", isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0')}>Capi ERP</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {navigation.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <p className={cn("px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 transition-opacity duration-200", isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:text-center')}>
              {isSidebarOpen ? group.group : group.group.substring(0, 1)}
            </p>
            {group.items.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                    !isSidebarOpen && 'justify-center',
                    isActive 
                      ? "bg-primary text-white shadow-primary-glow" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} size={20} />
                  <span className={cn('transition-opacity', isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden')}>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all",
            !isSidebarOpen && "justify-center"
          )}
        >
          <LogOut size={20} />
          <span className={cn('transition-opacity', isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden')}>Đăng xuất</span>
        </button>
      </div>

      <ConfirmModal 
        isOpen={showLogoutConfirm}
        title="Đăng xuất"
        message="Xác nhận kết thúc phiên làm việc hiện tại?"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </aside>
  );
};

export default Sidebar;