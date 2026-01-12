
import React from 'react';
import { VaiTro } from '../core/types';
import { ShieldCheck, Calendar, Clock, Info, ChevronRight } from 'lucide-react';
import { formatDate } from '../../../../shared/utils/format';
import { cn } from '../../../../lib/utils';

interface VaiTroDetailViewProps {
  data: VaiTro;
}

const VaiTroDetailView: React.FC<VaiTroDetailViewProps> = ({ data }) => {
  const infoItems = [
    { 
      label: 'Tên vai trò', 
      value: data.ten_vai_tro || 'Chưa cập nhật', 
      icon: ShieldCheck,
      color: 'text-indigo-500'
    },
    { 
      label: 'Mã định danh (ID)', 
      value: `#${data.id}`, 
      icon: Info,
      color: 'text-slate-500'
    },
  ];

  const timeItems = [
    { label: 'Ngày tạo', value: data.tg_tao ? formatDate(data.tg_tao) : 'N/A', icon: Calendar },
    { label: 'Cập nhật lần cuối', value: data.tg_cap_nhat ? formatDate(data.tg_cap_nhat) : 'Chưa có', icon: Clock },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
        <div className="w-24 h-24 rounded-[32px] bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/10 mb-4">
          <ShieldCheck size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">{data.ten_vai_tro}</h3>
        <p className="text-sm text-slate-500 mt-1">Vai trò trong hệ thống Capi ERP</p>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Thông tin vai trò</h4>
          <div className="space-y-3">
            {infoItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className={cn("p-2 rounded-lg bg-white shadow-sm ring-1 ring-slate-200", item.color)}>
                  <item.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Thông tin hệ thống</h4>
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

export default VaiTroDetailView;
