import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { BaoCaoGroupedByLoai } from '@/types/bao-cao-tai-chinh'
import { Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercent } from '../bao-cao-table-utils'
import { BaoCaoTableWrapper } from '../bao-cao-table-wrapper'
import { BaoCaoTableLoaiMobile } from './mobile/bao-cao-table-loai-mobile'

interface BaoCaoTableLoaiProps {
  data: BaoCaoGroupedByLoai[]
}

export function BaoCaoTableLoai({ data }: BaoCaoTableLoaiProps) {
  const total = data.reduce((sum, item) => sum + item.tongTien, 0)

  const tableContent = (
    <div className="rounded-md border overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="h-9 text-xs">Loại</TableHead>
              <TableHead className="h-9 text-xs text-right">Tổng tiền</TableHead>
              <TableHead className="h-9 text-xs text-right">Số lượng GD</TableHead>
              <TableHead className="h-9 text-xs text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              .sort((a, b) => b.tongTien - a.tongTien)
              .map((item) => {
                const label = item.loai === 'thu' ? 'Thu' : item.loai === 'chi' ? 'Chi' : 'Luân chuyển'
                const color = item.loai === 'thu' ? 'text-green-600 dark:text-green-400' : 
                             item.loai === 'chi' ? 'text-red-600 dark:text-red-400' : 
                             'text-blue-600 dark:text-blue-400'
                return (
                  <TableRow key={item.loai}>
                    <TableCell className="font-medium">{label}</TableCell>
                    <TableCell className={cn('text-right font-medium', color)}>
                      {formatCurrency(item.tongTien)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {item.soLuongGiaoDich.toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatPercent(item.tongTien, total)}
                    </TableCell>
                  </TableRow>
                )
              })}
            <TableRow className="bg-muted/50 font-medium">
              <TableCell>Tổng cộng</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(data.reduce((sum, item) => sum + item.tongTien, 0))}
              </TableCell>
              <TableCell className="text-right">
                {data.reduce((sum, item) => sum + item.soLuongGiaoDich, 0).toLocaleString('vi-VN')}
              </TableCell>
              <TableCell className="text-right">100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )

  return (
    <BaoCaoTableWrapper
      title="Theo Loại giao dịch"
      icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
      mobileView={<BaoCaoTableLoaiMobile data={data} />}
    >
      {tableContent}
    </BaoCaoTableWrapper>
  )
}

