
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../components/ui/Table';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import { Edit, Trash2, Eye, UserCheck, Shield, MoreVertical, Mail } from 'lucide-react';
import { NhanVien } from '../core/types';
import { formatDate } from '../../../../shared/utils/format';

interface NhanVienTableProps {
  data: NhanVien[];
  onEdit: (nv: NhanVien) => void;
  onDelete: (nv: NhanVien) => void;
  onView: (nv: NhanVien) => void;
}

const NhanVienTable: React.FC<NhanVienTableProps> = ({ data, onEdit, onDelete, onView }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((nv) => (
              <TableRow 
                key={nv.id} 
                className="group cursor-pointer hover:bg-slate-50/80 transition-colors"
                onClick={() => onView(nv)}
              >
                <TableCell className="font-bold text-slate-400">#{nv.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-all overflow-hidden border border-slate-50">
                      {nv.avatar ? (
                        <img src={nv.avatar} alt={nv.ho_va_ten || ''} className="w-full h-full object-cover" />
                      ) : (
                        <UserCheck size={18} />
                      )}
                    </div>
                    <span className="font-semibold text-slate-900">{nv.ho_va_ten || 'Chưa cập nhật'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">{nv.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Shield size={14} className="text-primary/60" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                      {nv.zz_capi_vai_tro?.ten_vai_tro || 'Chưa gán'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={nv.trang_thai === 'dang_hoat_dong' ? 'success' : 'outline'}>
                    {nv.trang_thai === 'dang_hoat_dong' ? 'Đang hoạt động' : (nv.trang_thai || 'N/A')}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-xs">
                  {nv.tg_tao ? formatDate(nv.tg_tao) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div 
                    className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" onClick={() => onView(nv)}>
                      <Eye size={16} className="text-slate-400" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(nv)}>
                      <Edit size={16} className="text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(nv)}>
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
        {data.map((nv) => (
          <div 
            key={nv.id}
            className="bg-white rounded-2xl p-4 shadow-soft border border-slate-50 cursor-pointer"
            onClick={() => onView(nv)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden border border-slate-100">
                  {nv.avatar ? (
                    <img src={nv.avatar} alt={nv.ho_va_ten || ''} className="w-full h-full object-cover" />
                  ) : (
                    <UserCheck size={20} />
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{nv.ho_va_ten}</p>
                  <p className="text-xs text-slate-500 font-medium">ID: #{nv.id}</p>
                </div>
              </div>
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                 <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onEdit(nv)}>
                    <Edit size={14} className="text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onDelete(nv)}>
                    <Trash2 size={14} className="text-destructive" />
                  </Button>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
               <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} className="text-slate-400" />
                  <span>{nv.email}</span>
                </div>
               <div className="flex items-center gap-2">
                  <Shield size={14} className="text-slate-400" />
                  <span className="font-bold text-slate-700 uppercase">
                    {nv.zz_capi_vai_tro?.ten_vai_tro || 'Chưa gán'}
                  </span>
                </div>
              <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                <Badge variant={nv.trang_thai === 'dang_hoat_dong' ? 'success' : 'outline'}>
                  {nv.trang_thai === 'dang_hoat_dong' ? 'Đang hoạt động' : (nv.trang_thai || 'N/A')}
                </Badge>
                <span className="text-slate-400 font-medium">
                  Ngày tạo: {nv.tg_tao ? formatDate(nv.tg_tao) : '-'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NhanVienTable;
