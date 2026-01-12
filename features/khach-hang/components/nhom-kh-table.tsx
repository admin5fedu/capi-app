
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import { Edit, Trash2, Users2, FileText } from 'lucide-react';
import { NhomDoiTac } from '../core/types';
import { formatDate } from '../../../shared/utils/format';

interface NhomKHTableProps {
  data: NhomDoiTac[];
  onEdit: (item: NhomDoiTac) => void;
  onDelete: (item: NhomDoiTac) => void;
}

const NhomKHTable: React.FC<NhomKHTableProps> = ({ data, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">ID</TableHead>
          <TableHead>Tên nhóm khách hàng</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id} className="group">
            <TableCell className="font-bold text-slate-400">#{item.id}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center shadow-sm">
                  <Users2 size={18} />
                </div>
                <span className="font-bold text-slate-700">{item.ten_nhom || 'Không tên'}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-slate-500 max-w-[300px] truncate">
                <FileText size={14} className="shrink-0 opacity-40" />
                <span className="text-sm italic">{item.mo_ta || 'Không có mô tả'}</span>
              </div>
            </TableCell>
            <TableCell className="text-slate-400 text-xs">
              {item.tg_tao ? formatDate(item.tg_tao) : '-'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
  );
};

export default NhomKHTable;
