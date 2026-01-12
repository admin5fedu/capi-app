
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { LedgerDataPoint } from '../core/types';
import { formatDate, formatCurrency } from '../../../shared/utils/format';

interface SoQuyTableProps {
  data: LedgerDataPoint[];
}

const SoQuyTable: React.FC<SoQuyTableProps> = ({ data }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ngày</TableHead>
          <TableHead>Chứng từ</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead className="text-right">Thu</TableHead>
          <TableHead className="text-right">Chi</TableHead>
          <TableHead className="text-right">Tồn cuối</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="text-xs text-slate-500 whitespace-nowrap">{formatDate(item.ngay)}</TableCell>
            <TableCell className="text-xs font-bold text-slate-400">{item.chung_tu || '-'}</TableCell>
            <TableCell className="font-semibold text-slate-700">{item.mo_ta}</TableCell>
            <TableCell className="text-right font-medium text-emerald-600">
              {item.thu > 0 ? formatCurrency(item.thu) : '-'}
            </TableCell>
            <TableCell className="text-right font-medium text-rose-600">
              {item.chi > 0 ? formatCurrency(item.chi) : '-'}
            </TableCell>
            <TableCell className="text-right font-bold text-slate-800">
              {formatCurrency(item.ton_cuoi)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SoQuyTable;
