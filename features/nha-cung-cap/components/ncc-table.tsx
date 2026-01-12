
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Edit, Trash2, Truck, Building2, Phone, Mail, MapPin, Layers } from 'lucide-react';
import { DoiTac } from '../core/types';

interface NCCTableProps {
  data: DoiTac[];
  onEdit: (item: DoiTac) => void;
  onDelete: (item: DoiTac) => void;
  onView: (item: DoiTac) => void;
}

const NCCTable: React.FC<NCCTableProps> = ({ data, onEdit, onDelete, onView }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Nhà cung cấp & Công ty</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Phân nhóm</TableHead>
              <TableHead>Vị trí</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((ncc) => (
              <TableRow 
                key={ncc.id} 
                className="group cursor-pointer"
                onClick={() => onView(ncc)}
              >
                <TableCell className="font-bold text-slate-400">#{ncc.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Truck size={14} />
                      </div>
                      <span className="font-bold text-slate-900 leading-none">{ncc.ten_doi_tac || 'N/A'}</span>
                    </div>
                    {ncc.cong_ty && (
                      <div className="flex items-center gap-2 ml-10 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                        <Building2 size={10} />
                        {ncc.cong_ty}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    {ncc.so_dien_thoai && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <Phone size={12} className="text-emerald-500" />
                        {ncc.so_dien_thoai}
                      </div>
                    )}
                    {ncc.email && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={12} className="text-amber-500/70" />
                        {ncc.email}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Layers size={12} className="text-slate-300" />
                    <Badge variant="warning" className="bg-amber-50 text-amber-700 border-amber-100">
                      {ncc.zz_capi_nhom_doi_tac?.ten_nhom || 'Mặc định'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs text-slate-500 max-w-[200px] truncate">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    {ncc.dia_chi || '-'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div 
                    className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" onClick={() => onEdit(ncc)}>
                      <Edit size={16} className="text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(ncc)}>
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
        {data.map((ncc) => (
           <div 
            key={ncc.id}
            className="bg-white rounded-2xl p-4 shadow-soft border border-slate-50 cursor-pointer"
            onClick={() => onView(ncc)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Truck size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{ncc.ten_doi_tac}</p>
                  <p className="text-xs text-slate-500 font-medium truncate">{ncc.cong_ty || `ID: #${ncc.id}`}</p>
                </div>
              </div>
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onEdit(ncc)}>
                  <Edit size={14} className="text-primary" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onDelete(ncc)}>
                  <Trash2 size={14} className="text-destructive" />
                </Button>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 space-y-2 text-xs">
              {ncc.so_dien_thoai && (
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Phone size={14} className="text-emerald-500" />
                  {ncc.so_dien_thoai}
                </div>
              )}
              {ncc.dia_chi && (
                <div className="flex items-center gap-2 text-slate-500 truncate">
                  <MapPin size={14} className="text-slate-400" />
                  {ncc.dia_chi}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-slate-400" />
                <Badge variant="warning">
                  {ncc.zz_capi_nhom_doi_tac?.ten_nhom || 'Mặc định'}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NCCTable;
