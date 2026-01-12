
import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Filter, Wallet, Users, Truck } from 'lucide-react';
import { TaiKhoan } from '../../tai-khoan/core/types';
import { NhomDoiTac } from '../../khach-hang/core/types';

interface ReportFilterBarProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
  // Dynamic filters
  taiKhoanList?: TaiKhoan[];
  selectedTaiKhoanId?: number | null;
  onTaiKhoanChange?: (id: string) => void;
  isTaiKhoanLoading?: boolean;

  nhomKHList?: NhomDoiTac[];
  selectedNhomKHId?: number | null;
  onNhomKHChange?: (id: string) => void;
  isNhomKHLoading?: boolean;
  
  nhomNCCList?: NhomDoiTac[];
  selectedNhomNCCId?: number | null;
  onNhomNCCChange?: (id: string) => void;
  isNhomNCCLoading?: boolean;
}

const ReportFilterBar: React.FC<ReportFilterBarProps> = (props) => {
  const {
    startDate, endDate, onStartDateChange, onEndDateChange, onApply,
    taiKhoanList, selectedTaiKhoanId, onTaiKhoanChange, isTaiKhoanLoading,
    nhomKHList, selectedNhomKHId, onNhomKHChange, isNhomKHLoading,
    nhomNCCList, selectedNhomNCCId, onNhomNCCChange, isNhomNCCLoading
  } = props;
  return (
    <Card className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {onNhomKHChange && (
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-1.5"><Users size={14} />Nhóm khách hàng</label>
            <select value={selectedNhomKHId || ''} onChange={(e) => onNhomKHChange(e.target.value)} disabled={isNhomKHLoading} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50">
              <option value="">-- Tất cả nhóm --</option>
              {nhomKHList?.map(g => <option key={g.id} value={g.id}>{g.ten_nhom}</option>)}
            </select>
          </div>
        )}

        {onNhomNCCChange && (
           <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-1.5"><Truck size={14} />Nhóm nhà cung cấp</label>
            <select value={selectedNhomNCCId || ''} onChange={(e) => onNhomNCCChange(e.target.value)} disabled={isNhomNCCLoading} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50">
              <option value="">-- Tất cả nhóm --</option>
              {nhomNCCList?.map(g => <option key={g.id} value={g.id}>{g.ten_nhom}</option>)}
            </select>
          </div>
        )}
        
        {onTaiKhoanChange && (
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 ml-0.5 flex items-center gap-1.5"><Wallet size={14} />Tài khoản/Quỹ</label>
            <select value={selectedTaiKhoanId || ''} onChange={(e) => onTaiKhoanChange(e.target.value)} disabled={isTaiKhoanLoading} className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50">
              <option value="">-- {onTaiKhoanChange.length > 0 ? "Vui lòng chọn" : "Tất cả tài khoản"} --</option>
              {taiKhoanList?.map(tk => <option key={tk.id} value={tk.id}>{tk.ten_tai_khoan}</option>)}
            </select>
          </div>
        )}

        <Input label="Từ ngày" type="date" value={startDate} onChange={(e) => onStartDateChange(e.target.value)} />
        <Input label="Đến ngày" type="date" value={endDate} onChange={(e) => onEndDateChange(e.target.value)} />
        <Button onClick={onApply} className="gap-2 h-10 md:w-auto">
          <Filter size={16} />
          Xem báo cáo
        </Button>
      </div>
    </Card>
  );
};

export default ReportFilterBar;
