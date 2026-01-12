
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import { Edit, Trash2, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { TyGia } from '../core/types';
import { formatDate } from '../../../shared/utils/format';

interface TyGiaTableProps {
  data: TyGia[];
  onEdit: (item: TyGia) => void;
  onDelete: (item: TyGia) => void;
  onView: (item: TyGia) => void;
}

const formatRate = (value: number | null) => {
  if (value === null) return '-';
  return new Intl.NumberFormat('vi-VN').format(value);
};

const TyGiaTable: React.FC<TyGiaTableProps> = ({ data, onEdit, onDelete, onView }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Tỷ giá (USD/VND)</TableHead>
              <TableHead>Ngày áp dụng</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="group cursor-pointer" onClick={() => onView(item)}>
                <TableCell className="font-bold text-slate-400">#{item.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shadow-sm">
                      <DollarSign size={18} />
                    </div>
                    <span className="font-extrabold text-slate-800 text-lg tracking-tight">
                      {formatRate(item.ty_gia)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Calendar size={14} />
                    <span>{item.tg_tao ? formatDate(item.tg_tao) : '-'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                      <Edit size={16} className="text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
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
        {data.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-2xl p-4 shadow-soft border border-slate-50 cursor-pointer"
            onClick={() => onView(item)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <DollarSign size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">{formatRate(item.ty_gia)}</p>
                  <p className="text-xs text-slate-500 font-medium">ID: #{item.id}</p>
                </div>
              </div>
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onEdit(item)}>
                  <Edit size={14} className="text-primary" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onDelete(item)}>
                  <Trash2 size={14} className="text-destructive" />
                </Button>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end items-center">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Calendar size={12} />
                <span>{item.tg_tao ? formatDate(item.tg_tao) : '-'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TyGiaTable;
