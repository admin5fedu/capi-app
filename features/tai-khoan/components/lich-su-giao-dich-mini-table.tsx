
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { GiaoDich } from '../../giao-dich/core/types';
import { formatDate, formatCurrency } from '../../../shared/utils/format';
import { cn } from '../../../lib/utils';
import { ArrowDown, ArrowUp, ArrowRightLeft, FileText } from 'lucide-react';

interface LichSuGiaoDichMiniTableProps {
  transactions: GiaoDich[];
  accountId: number;
}

const LichSuGiaoDichMiniTable: React.FC<LichSuGiaoDichMiniTableProps> = ({ transactions, accountId }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="text-center py-16 px-6">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                    <FileText size={32} className="text-slate-300" />
                </div>
                <p className="text-base font-bold text-slate-900">Không có giao dịch</p>
                <p className="text-sm text-slate-400 mt-1">Tài khoản này chưa có giao dịch nào được ghi nhận.</p>
            </div>
        );
    }

    const renderIcon = (gd: GiaoDich) => {
      const iconProps = { size: 14 };
      if (gd.hang_muc === 'chuyen_tien') {
        return <ArrowRightLeft {...iconProps} className="text-blue-500" />;
      }
      if (gd.tai_khoan_den_id === accountId) {
        return <ArrowDown {...iconProps} className="text-emerald-500" />;
      }
      return <ArrowUp {...iconProps} className="text-rose-500" />;
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Chi tiết giao dịch</TableHead>
                    <TableHead className="text-right">Số tiền</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map(gd => {
                    const isIncoming = gd.tai_khoan_den_id === accountId;
                    const isTransfer = gd.hang_muc === 'chuyen_tien';
                    
                    let amountClass = '';
                    let prefix = '';

                    if (isTransfer) {
                        amountClass = isIncoming ? 'text-emerald-600' : 'text-rose-600';
                        prefix = isIncoming ? '+ ' : '- ';
                    } else if (isIncoming) {
                        amountClass = 'text-emerald-600';
                        prefix = '+ ';
                    } else { // isOutgoing
                        amountClass = 'text-rose-600';
                        prefix = '- ';
                    }
                    
                    return (
                        <TableRow key={gd.id} className="cursor-default">
                            <TableCell className="text-xs text-slate-400 font-medium whitespace-nowrap">
                                {formatDate(gd.ngay || '')}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50/80 flex items-center justify-center shrink-0">
                                        {renderIcon(gd)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 text-sm leading-tight">{gd.mo_ta}</p>
                                        <p className="text-xs text-slate-400">{gd.ten_danh_muc || gd.hang_muc?.replace('_', ' ')}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className={cn("text-right font-bold whitespace-nowrap", amountClass)}>
                                {prefix}{formatCurrency(gd.so_tien || 0)}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

export default LichSuGiaoDichMiniTable;
