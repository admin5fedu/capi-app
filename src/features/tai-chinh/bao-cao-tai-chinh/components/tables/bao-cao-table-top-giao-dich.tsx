import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { GiaoDichWithRelations } from '@/types/giao-dich'
import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import { formatCurrency } from '../bao-cao-table-utils'
import { BaoCaoTableWrapper } from '../bao-cao-table-wrapper'
import { BaoCaoTableTopGiaoDichMobile } from './mobile/bao-cao-table-top-giao-dich-mobile'

interface BaoCaoTableTopGiaoDichProps {
  data: GiaoDichWithRelations[]
}

export function BaoCaoTableTopGiaoDich({ data }: BaoCaoTableTopGiaoDichProps) {
  const tableContent = (
    <div className="rounded-md border overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="h-9 text-xs">STT</TableHead>
              <TableHead className="h-9 text-xs">Ngày</TableHead>
              <TableHead className="h-9 text-xs">Mã phiếu</TableHead>
              <TableHead className="h-9 text-xs">Mô tả</TableHead>
              <TableHead className="h-9 text-xs">Danh mục</TableHead>
              <TableHead className="h-9 text-xs">Loại</TableHead>
              <TableHead className="h-9 text-xs text-right">Số tiền</TableHead>
              <TableHead className="h-9 text-xs">Đối tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const soTien = item.so_tien_vnd || item.so_tien
              const loaiLabel = item.loai === 'thu' ? 'Thu' : item.loai === 'chi' ? 'Chi' : 'Luân chuyển'
              const loaiColor = item.loai === 'thu' ? 'text-green-600 dark:text-green-400' : 
                               item.loai === 'chi' ? 'text-red-600 dark:text-red-400' : 
                               'text-blue-600 dark:text-blue-400'
              return (
                <TableRow key={item.id}>
                  <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                  <TableCell>{dayjs(item.ngay).format('DD/MM/YYYY')}</TableCell>
                  <TableCell className="font-medium">{item.ma_phieu}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.mo_ta || '—'}</TableCell>
                  <TableCell>{item.danh_muc?.ten || '—'}</TableCell>
                  <TableCell>
                    <span className={cn('font-medium', loaiColor)}>{loaiLabel}</span>
                  </TableCell>
                  <TableCell className={cn('text-right font-medium', loaiColor)}>
                    {formatCurrency(soTien)}
                  </TableCell>
                  <TableCell>{item.doi_tac?.ten || '—'}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  return (
    <BaoCaoTableWrapper
      title="Top 10 Giao dịch lớn nhất"
      icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
      mobileView={<BaoCaoTableTopGiaoDichMobile data={data} />}
    >
      {tableContent}
    </BaoCaoTableWrapper>
  )
}

