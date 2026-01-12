
import React from 'react';
import { DanhMucTaiChinh } from '../core/types';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { 
  Folder, 
  File, 
  ArrowUp, 
  ArrowDown, 
  Info, 
  Calendar, 
  Clock, 
  CornerDownRight,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { formatDate } from '../../../shared/utils/format';

interface DMTCDetailViewProps {
  data: DanhMucTaiChinh;
  onAddChild: (parent: DanhMucTaiChinh) => void;
  onEdit: (item: DanhMucTaiChinh) => void;
  onDelete: (item: DanhMucTaiChinh) => void;
}

const DMTCDetailView: React.FC<DMTCDetailViewProps> = ({ data, onAddChild, onEdit, onDelete }) => {
  const isThu = data.hang_muc === 'thu';
  const hasChildren = data.children && data.children.length > 0;

  const infoItems = [
    { label: 'Tên danh mục', value: data.ten_danh_muc, icon: hasChildren ? Folder : File },
    { label: 'Hạng mục', value: isThu ? 'Thu' : 'Chi', icon: isThu ? ArrowDown : ArrowUp, badge: true },
    { label: 'Danh mục cha', value: data.ten_danh_muc_cha, icon: CornerDownRight },
  ];
  
  const timeItems = [
    { label: 'Ngày tạo', value: data.tg_tao ? formatDate(data.tg_tao) : 'N/A', icon: Calendar },
    { label: 'Cập nhật lần cuối', value: data.tg_cap_nhat ? formatDate(data.tg_cap_nhat) : 'Chưa có', icon: Clock },
  ];

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
          isThu ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' : 'bg-rose-50 text-rose-600 shadow-rose-500/10'
        }`}>
          {isThu ? <ArrowDown size={32} /> : <ArrowUp size={32} />}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">{data.ten_danh_muc}</h3>
          <p className="text-sm text-slate-500 mt-1">ID: #{data.id} • Cấp {data.cap}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Thông tin cơ bản</h4>
          <div className="space-y-4">
            {infoItems.map((item, idx) => item.value && (
              <div key={idx} className="flex items-start gap-4">
                <item.icon className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">{item.label}</p>
                  {item.badge ? (
                    <Badge variant={isThu ? 'success' : 'destructive'} className="mt-1">{item.value}</Badge>
                  ) : (
                    <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
            {data.mo_ta && (
              <div className="flex items-start gap-4">
                <Info className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">Mô tả</p>
                  <p className="text-sm font-medium text-slate-600 whitespace-pre-wrap">{data.mo_ta}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {hasChildren && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Danh mục con ({data.children?.length})</h4>
              <Button size="sm" variant="outline" className="gap-2 h-8 rounded-lg" onClick={() => onAddChild(data)}>
                <Plus size={14} /> Thêm mới
              </Button>
            </div>
            <div className="space-y-2 rounded-xl bg-slate-50/50 p-3 border border-slate-100">
              {data.children?.map(child => (
                <div key={child.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-white">
                  <div className="flex items-center gap-3">
                    <File size={16} className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">{child.ten_danh_muc}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => onEdit(child)}>
                      <Edit size={14} className="text-primary" />
                    </Button>
                    <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => onDelete(child)}>
                      <Trash2 size={14} className="text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
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

export default DMTCDetailView;
