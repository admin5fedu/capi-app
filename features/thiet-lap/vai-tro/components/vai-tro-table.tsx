
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../../components/ui/Table';
import Button from '../../../../components/ui/Button';
import { Edit, Trash2, ShieldCheck } from 'lucide-react';
import { VaiTro } from '../core/types';
import { formatDate } from '../../../../shared/utils/format';

interface VaiTroTableProps {
  data: VaiTro[];
  onEdit: (vt: VaiTro) => void;
  onDelete: (vt: VaiTro) => void;
  onView: (vt: VaiTro) => void;
}

const VaiTroTable: React.FC<VaiTroTableProps> = ({ data, onEdit, onDelete, onView }) => {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Tên vai trò</TableHead>
              <TableHead>Ngày khởi tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((vt) => (
              <TableRow 
                key={vt.id} 
                className="group cursor-pointer"
                onClick={() => onView(vt)}
              >
                <TableCell className="font-bold text-slate-400">#{vt.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500">
                      <ShieldCheck size={18} />
                    </div>
                    <span className="font-bold text-slate-700">{vt.ten_vai_tro || 'Chưa đặt tên'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-500 text-xs">
                  {vt.tg_tao ? formatDate(vt.tg_tao) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div 
                    className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" onClick={() => onEdit(vt)}>
                      <Edit size={16} className="text-primary" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(vt)}>
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
        {data.map((vt) => (
          <div 
            key={vt.id}
            className="bg-white rounded-2xl p-4 shadow-soft border border-slate-50 cursor-pointer"
            onClick={() => onView(vt)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{vt.ten_vai_tro}</p>
                  <p className="text-xs text-slate-500 font-medium">ID: #{vt.id}</p>
                </div>
              </div>
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onEdit(vt)}>
                  <Edit size={14} className="text-primary" />
                </Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onDelete(vt)}>
                  <Trash2 size={14} className="text-destructive" />
                </Button>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex justify-end items-center">
              <span className="text-xs text-slate-400 font-medium">
                Ngày tạo: {vt.tg_tao ? formatDate(vt.tg_tao) : '-'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default VaiTroTable;
