import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Edit, Trash2, Wallet, Landmark, CreditCard, Banknote } from 'lucide-react';
import { TaiKhoan } from '../core/types';
import { formatCurrency } from '../../../shared/utils/format';

interface TaiKhoanTableProps {
  data: TaiKhoan[];
  onEdit: (item: TaiKhoan) => void;
  onDelete: (item: TaiKhoan) => void;
  onView: (item: TaiKhoan) => void;
}

const formatUSD = (val: number | null | undefined) => {
  if (val === null || val === undefined) val = 0;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

const TaiKhoanTable: React.FC<TaiKhoanTableProps> = ({ data, onEdit, onDelete, onView }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Tên tài khoản / Quỹ</TableHead>
              <TableHead>Thông tin ngân hàng</TableHead>
              <TableHead>Đơn vị</TableHead>
              <TableHead className="text-right">Số dư hiện tại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((tk) => (
              <TableRow 
                key={tk.id} 
                className="group cursor-pointer"
                onClick={() => onView(tk)}
              >
                <TableCell className="font-bold text-slate-400">#{tk.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                      tk.loai_tai_khoan === 'tien_mat' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {tk.loai_tai_khoan === 'tien_mat' ? <Banknote size={18} /> : <Landmark size={18} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{tk.ten_tai_khoan || 'N/A'}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {tk.loai_tai_khoan === 'tien_mat' ? 'Tiền mặt' : 'Ngân hàng'}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {tk.loai_tai_khoan === 'tai_khoan' ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <CreditCard size={12} className="text-blue-400" />
                        {tk.so_tai_khoan || '-'}
                      </div>
                      <div className="text-[11px] text-slate-400 max-w-[200px] truncate">
                        {tk.ngan_hang}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs italic text-slate-300">Không áp dụng</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={tk.don_vi === 'VND' ? 'info' : 'warning'}>
                    {tk.don_vi}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-extrabold text-slate-900">
                      {tk.don_vi === 'VND' ? formatCurrency(tk.so_du_cuoi || 0) : formatUSD(tk.so_du_cuoi)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Đầu kỳ: {tk.don_vi === 'VND' ? formatCurrency(tk.so_du_dau_ky || 0) : formatUSD(tk.so_du_dau_ky)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={tk.trang_thai === 'hoat_dong' ? 'success' : 'outline'}>
                    {tk.trang_thai === 'hoat_dong' ? 'Hoạt động' : 'Ngừng'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div 
                    className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" onClick={() => onEdit(tk)}>
                      <Edit size={16} className="text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(tk)}>
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 px-4 py-4">
        {data.map((tk) => (
          <div 
            key={tk.id}
            className="bg-white rounded-2xl p-4 shadow-soft border border-slate-50 cursor-pointer"
            onClick={() => onView(tk)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  tk.loai_tai_khoan === 'tien_mat' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {tk.loai_tai_khoan === 'tien_mat' ? <Banknote size={20} /> : <Landmark size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{tk.ten_tai_khoan}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {tk.loai_tai_khoan === 'tien_mat' ? `Quỹ tiền mặt • ${tk.don_vi}` : `${tk.ngan_hang || 'Ngân hàng'} • ${tk.don_vi}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onEdit(tk)}>
                  <Edit size={14} className="text-primary" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onDelete(tk)}>
                  <Trash2 size={14} className="text-destructive" />
                </Button>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số dư hiện tại</p>
              <p className="text-xl font-extrabold text-slate-800 mt-0.5">
                {tk.don_vi === 'VND' ? formatCurrency(tk.so_du_cuoi || 0) : formatUSD(tk.so_du_cuoi)}
              </p>
              <div className="mt-2">
                <Badge variant={tk.trang_thai === 'hoat_dong' ? 'success' : 'outline'}>
                  {tk.trang_thai === 'hoat_dong' ? 'Hoạt động' : 'Ngừng'}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TaiKhoanTable;