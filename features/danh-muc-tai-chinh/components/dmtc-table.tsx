
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { Edit, Trash2, ChevronDown, ChevronRight, CornerDownRight, Folder, File, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { DanhMucTaiChinh } from '../core/types';
import { cn } from '../../../lib/utils';

interface DMTCTableProps {
  data: DanhMucTaiChinh[];
  onEdit: (item: DanhMucTaiChinh) => void;
  onDelete: (item: DanhMucTaiChinh) => void;
  onView: (item: DanhMucTaiChinh) => void;
  onAddChild: (item: DanhMucTaiChinh) => void;
}

const DMTCTable: React.FC<DMTCTableProps> = ({ data, onEdit, onDelete, onView, onAddChild }) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
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

  const renderRow = (item: DanhMucTaiChinh, level = 0) => {
    const isExpanded = expandedRows.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <React.Fragment key={item.id}>
        <TableRow className="group cursor-pointer" onClick={() => onView(item)}>
          <TableCell style={{ paddingLeft: `${1.5 + level * 2}rem` }}>
            <div className="flex items-center gap-3">
              {hasChildren ? (
                <button onClick={(e) => { e.stopPropagation(); toggleRow(item.id); }} className="p-1 -ml-1 hover:bg-slate-100 rounded-md">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <span className="w-6 inline-block"></span>
              )}
               <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.hang_muc === 'thu' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                {hasChildren ? <Folder size={16} /> : <File size={16} />}
              </div>
              <span className="font-bold text-slate-700">{item.ten_danh_muc}</span>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant={item.hang_muc === 'thu' ? 'success' : 'destructive'}>{item.hang_muc}</Badge>
          </TableCell>
          <TableCell className="text-xs text-slate-500 max-w-xs truncate">{item.mo_ta}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
              {item.cap === 1 && (
                <Button variant="ghost" size="sm" onClick={() => onAddChild(item)} title="Thêm mục con">
                  <Plus size={16} className="text-emerald-500" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => onEdit(item)}><Edit size={16} className="text-primary" /></Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(item)}><Trash2 size={16} className="text-destructive" /></Button>
            </div>
          </TableCell>
        </TableRow>
        {isExpanded && hasChildren && item.children.map(child => renderRow(child, level + 1))}
      </React.Fragment>
    );
  };
  
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên danh mục</TableHead>
              <TableHead>Hạng mục</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => renderRow(item))}
          </TableBody>
        </Table>
      </div>

       {/* Mobile Card View */}
      <div className="md:hidden space-y-4 px-4 py-4">
        {data.flatMap(parent => [parent, ...(parent.children || [])]).map(item => (
           <div 
            key={item.id}
            className="bg-white rounded-2xl p-4 shadow-soft border border-slate-50 cursor-pointer"
            onClick={() => onView(item)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.hang_muc === 'thu' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                   {item.hang_muc === 'thu' ? <ArrowDown size={20} /> : <ArrowUp size={20} />}
                 </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{item.ten_danh_muc}</p>
                  {item.danh_muc_cha_id && (
                     <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <CornerDownRight size={12} />
                        <span>{item.ten_danh_muc_cha}</span>
                     </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                {item.cap === 1 && (
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onAddChild(item)} title="Thêm mục con">
                    <Plus size={14} className="text-emerald-500" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onEdit(item)}><Edit size={14} className="text-primary" /></Button>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" onClick={() => onDelete(item)}><Trash2 size={14} className="text-destructive" /></Button>
              </div>
            </div>
            {item.mo_ta && (
              <div className="mt-4 pt-3 border-t border-slate-50">
                <p className="text-xs text-slate-500 italic">{item.mo_ta}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default DMTCTable;
