
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';
import { Edit, Trash2, ArrowDown, ArrowUp, ArrowRightLeft, CornerDownRight, Landmark, User } from 'lucide-react';
import { GiaoDich } from '../core/types';
import { formatDate, formatCurrency, formatDualCurrency } from '../../../shared/utils/format';
import { cn } from '../../../lib/utils';

interface GiaoDichTableProps {
  data: GiaoDich[];
  onEdit: (item: GiaoDich) => void;
  onDelete: (item: GiaoDich) => void;
  onView: (item: GiaoDich) => void;
}

const GiaoDichTable: React.FC<GiaoDichTableProps> = ({ data, onEdit, onDelete, onView }) => {
  const renderIcon = (hang_muc: string | null) => {
    switch (hang_muc) {
      case 'thu': return <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><ArrowDown size={14} /></div>;
      case 'chi': return <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><ArrowUp size={14} /></div>;
      case 'chuyen_tien': return <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><ArrowRightLeft size={14} /></div>;
      default: return <div className="w-8 h-8 rounded-lg bg-slate-100"></div>;
    }
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Mô tả & Danh mục</TableHead>
              <TableHead>Tài khoản</TableHead>
              <TableHead className="text-right">Số tiền</TableHead>
              <TableHead className="text-right w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((gd) => (
              <TableRow key={gd.id} className="group cursor-pointer" onClick={() => onView(gd)}>
                <TableCell className="text-xs text-slate-400 font-medium">{formatDate(gd.ngay || '')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {renderIcon(gd.hang_muc)}
                    <div>
                      <p className="font-bold text-slate-700">{gd.mo_ta || 'Giao dịch'}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        {gd.ten_danh_muc && (
                          <div className="flex items-center gap-1.5">
                            <CornerDownRight size={12} />
                            <span>{gd.ten_danh_muc}</span>
                          </div>
                        )}
                        {gd.ten_doi_tac && (
                          <div className="flex items-center gap-1.5">
                            <User size={12} />
                            <span>{gd.ten_doi_tac}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Landmark size={14} />
                    {gd.hang_muc === 'thu' && <span>{gd.ten_tai_khoan_den}</span>}
                    {gd.hang_muc === 'chi' && <span>{gd.ten_tai_khoan_di}</span>}
                    {gd.hang_muc === 'chuyen_tien' && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <span>{gd.ten_tai_khoan_di}</span>
                        <ArrowRightLeft size={12} className="text-blue-400" />
                        <span>{gd.ten_tai_khoan_den}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {(() => {
                    const soTienQuyDoi = gd.hang_muc === 'thu' ? gd.so_tien_quy_doi_den : gd.so_tien_quy_doi_di;
                    console.log('GD:', gd.mo_ta, 'Don vi:', gd.don_vi, 'So tien:', gd.so_tien, 'Quy doi:', soTienQuyDoi);
                    const { primary, secondary } = formatDualCurrency(gd.so_tien || 0, gd.don_vi, soTienQuyDoi);
                    console.log('Primary:', primary, 'Secondary:', secondary);
                    return (
                      <div>
                        <p className={cn("font-bold",
                          gd.hang_muc === 'thu' && 'text-emerald-600',
                          gd.hang_muc === 'chi' && 'text-rose-600',
                          gd.hang_muc === 'chuyen_tien' && 'text-slate-700'
                        )}>
                          {gd.hang_muc !== 'chi' && '+ '}{gd.hang_muc === 'chi' && '- '}{primary}
                        </p>
                        {secondary && (
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            ≈ {secondary}
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(gd)}><Edit size={16} className="text-primary" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(gd)}><Trash2 size={16} className="text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 px-4 py-4">
        {data.map((gd) => (
          <div key={gd.id} className="bg-white rounded-2xl p-4 shadow-soft border border-slate-50" onClick={() => onView(gd)}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {renderIcon(gd.hang_muc)}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 truncate">{gd.mo_ta}</p>
                  <p className="text-xs text-slate-400 font-medium">{formatDate(gd.ngay || '')}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                {(() => {
                  const soTienQuyDoi = gd.hang_muc === 'thu' ? gd.so_tien_quy_doi_den : gd.so_tien_quy_doi_di;
                  const { primary, secondary } = formatDualCurrency(gd.so_tien || 0, gd.don_vi, soTienQuyDoi);
                  return (
                    <>
                      <p className={cn("font-bold text-sm",
                        gd.hang_muc === 'thu' && 'text-emerald-600',
                        gd.hang_muc === 'chi' && 'text-rose-600'
                      )}>
                        {gd.hang_muc !== 'chi' && '+ '}{gd.hang_muc === 'chi' && '- '}{primary}
                      </p>
                      {secondary && (
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          ≈ {secondary}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-500 truncate">
                {gd.hang_muc === 'thu' && <> <Landmark size={12} /> <span>{gd.ten_tai_khoan_den}</span> </>}
                {gd.hang_muc === 'chi' && <> <Landmark size={12} /> <span>{gd.ten_tai_khoan_di}</span> </>}
              </div>
              <div onClick={(e) => e.stopPropagation()} className="flex gap-1">
                <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg" onClick={() => onEdit(gd)}><Edit size={12} className="text-primary" /></Button>
                <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg" onClick={() => onDelete(gd)}><Trash2 size={12} className="text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GiaoDichTable;