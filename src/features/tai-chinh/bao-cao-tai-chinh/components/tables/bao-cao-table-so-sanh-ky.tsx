import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { BaoCaoSoSanhKy } from '@/types/bao-cao-tai-chinh'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '../bao-cao-table-utils'
import { BaoCaoTableWrapper } from '../bao-cao-table-wrapper'
import { BaoCaoTableSoSanhKyMobile } from './mobile/bao-cao-table-so-sanh-ky-mobile'

interface BaoCaoTableSoSanhKyProps {
  data: BaoCaoSoSanhKy
}

export function BaoCaoTableSoSanhKy({ data }: BaoCaoTableSoSanhKyProps) {
  const tableContent = (
    <div className="rounded-md border overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="h-9 text-xs">Chỉ số</TableHead>
              <TableHead className="h-9 text-xs text-right">Kỳ hiện tại</TableHead>
              <TableHead className="h-9 text-xs text-right">Kỳ trước</TableHead>
              <TableHead className="h-9 text-xs text-right">Thay đổi</TableHead>
              <TableHead className="h-9 text-xs text-right">Xu hướng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Tổng thu</TableCell>
              <TableCell className="text-right text-green-600 dark:text-green-400">
                {formatCurrency(data.kyHienTai.tongThu)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatCurrency(data.kyTruoc.tongThu)}
              </TableCell>
              <TableCell className={cn(
                'text-right font-medium',
                data.thayDoi.tongThu >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {data.thayDoi.tongThu >= 0 ? '+' : ''}{data.thayDoi.tongThu.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right">
                {data.thayDoi.tongThu >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 inline" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400 inline" />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Tổng chi</TableCell>
              <TableCell className="text-right text-red-600 dark:text-red-400">
                {formatCurrency(data.kyHienTai.tongChi)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {formatCurrency(data.kyTruoc.tongChi)}
              </TableCell>
              <TableCell className={cn(
                'text-right font-medium',
                data.thayDoi.tongChi >= 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
              )}>
                {data.thayDoi.tongChi >= 0 ? '+' : ''}{data.thayDoi.tongChi.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right">
                {data.thayDoi.tongChi >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400 inline" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400 inline" />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Số dư</TableCell>
              <TableCell className={cn(
                'text-right font-medium',
                data.kyHienTai.soDu >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {formatCurrency(data.kyHienTai.soDu)}
              </TableCell>
              <TableCell className={cn(
                'text-right text-muted-foreground',
                data.kyTruoc.soDu >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {formatCurrency(data.kyTruoc.soDu)}
              </TableCell>
              <TableCell className={cn(
                'text-right font-medium',
                data.thayDoi.soDu >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {data.thayDoi.soDu >= 0 ? '+' : ''}{data.thayDoi.soDu.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right">
                {data.thayDoi.soDu >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 inline" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400 inline" />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Số lượng giao dịch</TableCell>
              <TableCell className="text-right">
                {data.kyHienTai.soLuongGiaoDich.toLocaleString('vi-VN')}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {data.kyTruoc.soLuongGiaoDich.toLocaleString('vi-VN')}
              </TableCell>
              <TableCell className={cn(
                'text-right font-medium',
                data.thayDoi.soLuongGiaoDich >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {data.thayDoi.soLuongGiaoDich >= 0 ? '+' : ''}{data.thayDoi.soLuongGiaoDich.toFixed(1)}%
              </TableCell>
              <TableCell className="text-right">
                {data.thayDoi.soLuongGiaoDich >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 inline" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400 inline" />
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )

  return (
    <BaoCaoTableWrapper
      title="So sánh kỳ"
      icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      mobileView={<BaoCaoTableSoSanhKyMobile data={data} />}
    >
      {tableContent}
    </BaoCaoTableWrapper>
  )
}

