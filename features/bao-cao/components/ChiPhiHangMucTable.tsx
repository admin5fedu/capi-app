
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { HangMucReportDataPoint } from '../core/types';
import { formatCurrency } from '../../../shared/utils/format';
import { ChevronDown, ChevronRight, Folder, File } from 'lucide-react';

interface ChiPhiHangMucTableProps {
  data: HangMucReportDataPoint[];
  total: number;
}

const ChiPhiHangMucTable: React.FC<ChiPhiHangMucTableProps> = ({ data, total }) => {
  const [expandedRows, setExpandedRows] = useState<Set<number | string>>(new Set(data.map(d => d.id)));

  const toggleRow = (id: number | string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderRow = (item: HangMucReportDataPoint, level = 0) => {
    const isExpanded = expandedRows.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(2) : '0.00';

    return (
      <React.Fragment key={item.id}>
        <TableRow className="group">
          <TableCell style={{ paddingLeft: `${1.5 + level * 2}rem` }}>
            <div className="flex items-center gap-3">
              {hasChildren ? (
                <button onClick={() => toggleRow(item.id)} className="p-1 -ml-1 hover:bg-slate-100 rounded-md">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <span className="w-6 inline-block"></span>
              )}
               <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                {hasChildren ? <Folder size={16} /> : <File size={16} />}
              </div>
              <span className="font-bold text-slate-700">{item.name}</span>
            </div>
          </TableCell>
          <TableCell className="text-right font-bold text-rose-600">{formatCurrency(item.value)}</TableCell>
          <TableCell className="text-right">
             <div className="flex items-center justify-end gap-2">
                <span className="text-sm font-semibold text-slate-500">{percentage}%</span>
                <div className="w-24 bg-slate-200 rounded-full h-1.5">
                    <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
             </div>
          </TableCell>
        </TableRow>
        {isExpanded && hasChildren && item.children.sort((a,b) => b.value - a.value).map(child => renderRow(child, level + 1))}
      </React.Fragment>
    );
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Hạng mục chi phí</TableHead>
          <TableHead className="text-right">Tổng chi</TableHead>
          <TableHead className="text-right w-[200px]">Tỷ trọng</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(item => renderRow(item))}
      </TableBody>
    </Table>
  );
};

export default ChiPhiHangMucTable;
