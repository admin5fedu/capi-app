
import React from 'react';
import { TyGia } from '../core/types';
import { DollarSign, Calendar, Clock } from 'lucide-react';
import { formatDate } from '../../../shared/utils/format';

interface TyGiaDetailViewProps {
  data: TyGia;
}

const TyGiaDetailView: React.FC<TyGiaDetailViewProps> = ({ data }) => {

  const timeItems = [
    { label: 'Ngày áp dụng', value: data.tg_tao ? formatDate(data.tg_tao) : 'N/A', icon: Calendar },
    { label: 'Cập nhật lần cuối', value: data.tg_cap_nhat ? formatDate(data.tg_cap_nhat) : 'Chưa có', icon: Clock },
  ];
  
  const formatRate = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
        <div className="w-24 h-24 rounded-[32px] bg-green-50 text-green-600 flex items-center justify-center shadow-lg shadow-green-500/10 mb-4">
          <DollarSign size={40} />
        </div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tỷ giá USD/VND</p>
        <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight mt-1">{formatRate(data.ty_gia)}</h3>
        <p className="text-sm text-slate-500 mt-2">ID: #{data.id}</p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Thông tin hệ thống</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

export default TyGiaDetailView;
