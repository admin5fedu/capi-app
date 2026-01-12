
import React from 'react';
import { DoiTac } from '../core/types';
import Badge from '../../../components/ui/Badge';
import { 
  Truck, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Layers, 
  FileText,
  Calendar,
  Clock
} from 'lucide-react';
import { formatDate } from '../../../shared/utils/format';

interface NhaCungCapDetailViewProps {
  data: DoiTac;
}

const NhaCungCapDetailView: React.FC<NhaCungCapDetailViewProps> = ({ data }) => {
  const contactItems = [
    { label: 'Người đại diện', value: data.ten_doi_tac, icon: Truck },
    { label: 'Tên công ty', value: data.cong_ty, icon: Building2 },
    { label: 'Số điện thoại', value: data.so_dien_thoai, icon: Phone },
    { label: 'Email', value: data.email, icon: Mail },
    { label: 'Địa chỉ', value: data.dia_chi, icon: MapPin },
  ];

  const timeItems = [
    { label: 'Ngày tạo', value: data.tg_tao ? formatDate(data.tg_tao) : 'N/A', icon: Calendar },
    { label: 'Cập nhật lần cuối', value: data.tg_cap_nhat ? formatDate(data.tg_cap_nhat) : 'Chưa có', icon: Clock },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/10">
          <Truck size={32} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">{data.ten_doi_tac}</h3>
          <p className="text-sm text-slate-500 mt-1">{data.cong_ty || 'Đối tác cá nhân'}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Thông tin liên hệ</h4>
          <div className="space-y-4">
            {contactItems.map((item, idx) => item.value && (
              <div key={idx} className="flex items-start gap-4">
                <item.icon className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Phân loại & Ghi chú</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Layers className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">Nhóm nhà cung cấp</p>
                <Badge variant="warning" className="mt-1">
                  {data.zz_capi_nhom_doi_tac?.ten_nhom || 'Mặc định'}
                </Badge>
              </div>
            </div>
            {data.thong_tin_khac && (
              <div className="flex items-start gap-4">
                <FileText className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">Ghi chú</p>
                  <p className="text-sm font-medium text-slate-600 whitespace-pre-wrap">{data.thong_tin_khac}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Thông tin hệ thống</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {timeItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                <item.icon size={16} className="text-slate-400" />
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

export default NhaCungCapDetailView;
