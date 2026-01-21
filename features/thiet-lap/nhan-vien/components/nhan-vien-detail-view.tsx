
import React from 'react';
import { NhanVien } from '../core/types';
import Badge from '../../../../components/ui/Badge';
import {
  Mail,
  Shield,
  Calendar,
  Clock,
  User,
  Info,
  ChevronRight
} from 'lucide-react';
import { formatDate } from '../../../../shared/utils/format';
import { cn } from '../../../../lib/utils';
import { useAvatarUrl } from '../../../../shared/hooks/use-avatar-url';

interface NhanVienDetailViewProps {
  data: NhanVien;
}

const NhanVienDetailView: React.FC<NhanVienDetailViewProps> = ({ data }) => {
  const { avatarUrl } = useAvatarUrl(data.avatar, data.id);

  const infoItems = [
    {
      label: 'Họ và tên',
      value: data.ho_va_ten || 'Chưa cập nhật',
      icon: User,
      color: 'text-blue-500'
    },
    {
      label: 'Email công việc',
      value: data.email || 'N/A',
      icon: Mail,
      color: 'text-indigo-500'
    },
    {
      label: 'Trạng thái tài khoản',
      value: data.trang_thai === 'dang_hoat_dong' ? 'Đang hoạt động' : 'Đã khóa',
      icon: Info,
      color: 'text-emerald-500',
      badge: true
    },
    {
      label: 'Vai trò hệ thống',
      value: data.zz_capi_vai_tro?.ten_vai_tro || `Mã ID: ${data.vai_tro_id || '0'}`,
      icon: Shield,
      color: 'text-orange-500'
    },
  ];

  const timeItems = [
    { label: 'Ngày tạo hệ thống', value: data.tg_tao ? formatDate(data.tg_tao) : 'N/A', icon: Calendar },
    { label: 'Cập nhật lần cuối', value: data.tg_cap_nhat ? formatDate(data.tg_cap_nhat) : 'Chưa có cập nhật', icon: Clock },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Avatar Section */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
        <div className="w-24 h-24 rounded-[32px] bg-white p-1 shadow-xl ring-1 ring-slate-100 overflow-hidden mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
          <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-[28px] object-cover" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">{data.ho_va_ten}</h3>
        <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest font-bold">
          ID: #{data.id}
        </p>
      </div>

      {/* Info Sections */}
      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Thông tin cơ bản</h4>
          <div className="space-y-3">
            {infoItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className={cn("p-2 rounded-lg bg-white shadow-sm ring-1 ring-slate-200", item.color)}>
                  <item.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{item.label}</p>
                  {item.badge ? (
                    <Badge variant={data.trang_thai === 'dang_hoat_dong' ? 'success' : 'destructive'} className="mt-0.5">
                      {item.value}
                    </Badge>
                  ) : (
                    <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                  )}
                </div>
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Thời gian & Hệ thống</h4>
          <div className="grid grid-cols-1 gap-3">
            {timeItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                <item.icon size={18} className="text-slate-400" />
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-600">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NhanVienDetailView;
