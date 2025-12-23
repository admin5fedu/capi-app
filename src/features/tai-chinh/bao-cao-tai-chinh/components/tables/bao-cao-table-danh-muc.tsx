import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { BaoCaoGroupedByDanhMuc } from '@/types/bao-cao-tai-chinh'
import { FolderTree } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency, formatPercent } from '../bao-cao-table-utils'
import { BaoCaoTableWrapper } from '../bao-cao-table-wrapper'
import { BaoCaoTableDanhMucMobile } from './mobile/bao-cao-table-danh-muc-mobile'

interface BaoCaoTableDanhMucProps {
  data: BaoCaoGroupedByDanhMuc[]
}

export function BaoCaoTableDanhMuc({ data }: BaoCaoTableDanhMucProps) {
  const total = data.reduce((sum, item) => sum + item.tongThu + item.tongChi, 0)

  const tableContent = (
    <div className="rounded-md border overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="h-9 text-xs">Danh mục</TableHead>
              <TableHead className="h-9 text-xs text-right">Tổng thu</TableHead>
              <TableHead className="h-9 text-xs text-right">Tổng chi</TableHead>
              <TableHead className="h-9 text-xs text-right">Số dư</TableHead>
              <TableHead className="h-9 text-xs text-right">SL GD</TableHead>
              <TableHead className="h-9 text-xs text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              .sort((a, b) => (b.tongThu + b.tongChi) - (a.tongThu + a.tongChi))
              .map((item) => {
                const itemTotal = item.tongThu + item.tongChi
                return (
                  <TableRow key={item.danhMucId}>
                    <TableCell className="font-medium">{item.danhMucTen}</TableCell>
                    <TableCell className="text-right text-green-600 dark:text-green-400">
                      {formatCurrency(item.tongThu)}
                    </TableCell>
                    <TableCell className="text-right text-red-600 dark:text-red-400">
                      {formatCurrency(item.tongChi)}
                    </TableCell>
                    <TableCell className={cn(
                      'text-right font-medium',
                      item.soDu >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    )}>
                      {formatCurrency(item.soDu)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {item.soLuongGiaoDich.toLocaleString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatPercent(itemTotal, total)}
                    </TableCell>
                  </TableRow>
                )
              })}
            <TableRow className="bg-muted/50 font-medium">
              <TableCell>Tổng cộng</TableCell>
              <TableCell className="text-right text-green-600 dark:text-green-400">
                {formatCurrency(data.reduce((sum, item) => sum + item.tongThu, 0))}
              </TableCell>
              <TableCell className="text-right text-red-600 dark:text-red-400">
                {formatCurrency(data.reduce((sum, item) => sum + item.tongChi, 0))}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(data.reduce((sum, item) => sum + item.soDu, 0))}
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
      title="Theo Danh mục"
      icon={<FolderTree className="h-4 w-4 text-muted-foreground" />}
      mobileView={<BaoCaoTableDanhMucMobile data={data} />}
    >
      {tableContent}
    </BaoCaoTableWrapper>
  )
}

