
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Edit, Trash2, User, Building2, Phone, Mail, MapPin, Tag } from 'lucide-react';
import { DoiTac } from '../core/types';

interface KHTableProps {
  data: DoiTac[];
  onEdit: (item: DoiTac) => void;
  onDelete: (item: DoiTac) => void;
  onView: (item: DoiTac) => void;
}

const KHTable: React.FC<KHTableProps> = ({ data, onEdit, onDelete, onView }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Khách hàng & Công ty</TableHead>
              <TableHead>Thông tin liên hệ</TableHead>
              <TableHead>Nhóm khách hàng</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((kh) => (
              <TableRow 
                key={kh.id} 
                className="group cursor-pointer"
                onClick={() => onView(kh)}
              >
                <TableCell className="font-bold text-slate-400">#{kh.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <User size={14} />
                      </div>
                      <span className="font-bold text-slate-900 leading-none">{kh.ten_doi_tac || 'Chưa đặt tên'}</span>
                    </div>
                    {kh.cong_ty && (
                      <div className="flex items-center gap-2 ml-10 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                        <Building2 size={10} />
                        {kh.cong_ty}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    {kh.so_dien_thoai ? (
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Phone size={12} className="text-emerald-500" />
                        {kh.so_dien_thoai}
                      </div>
                    ) : (
                      <span className="text-[10px] italic text-slate-300">Không có SĐT</span>
                    )}
                    {kh.email && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={12} className="text-primary/60" />
                        {kh.email}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Tag size={12} className="text-slate-300" />
                    <Badge variant="info" className="bg-blue-50 text-blue-600 border-blue-100">
                      {kh.zz_capi_nhom_doi_tac?.ten_nhom || 'Vãng lai'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs text-slate-500 max-w-[200px] truncate">
                    <MapPin size={12} className="text-rose-400 shrink-0" />
                    {kh.dia_chi || 'Chưa cập nhật'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div 
                    className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" onClick={() => onEdit(kh)}>
                      <Edit size={16} className="text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(kh)}>
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
        {data.map((kh) => (
          <div 
            key={kh.id}
            className="bg-white rounded-2xl p-4 shadow-soft border border-slate-50 cursor-pointer"
            onClick={() => onView(kh)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{kh.ten_doi_tac}</p>
                  <p className="text-xs text-slate-500 font-medium truncate">{kh.cong_ty || `ID: #${kh.id}`}</p>
                </div>
              </div>
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onEdit(kh)}>
                  <Edit size={14} className="text-primary" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onDelete(kh)}>
                  <Trash2 size={14} className="text-destructive" />
                </Button>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 space-y-2 text-xs">
              {kh.so_dien_thoai && (
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Phone size={14} className="text-emerald-500" />
                  {kh.so_dien_thoai}
                </div>
              )}
              {kh.email && (
                <div className="flex items-center gap-2 text-slate-500 truncate">
                  <Mail size={14} className="text-primary/60" />
                  {kh.email}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-slate-400" />
                <Badge variant="info" className="bg-blue-50 text-blue-600 border-blue-100">
                  {kh.zz_capi_nhom_doi_tac?.ten_nhom || 'Vãng lai'}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default KHTable;
