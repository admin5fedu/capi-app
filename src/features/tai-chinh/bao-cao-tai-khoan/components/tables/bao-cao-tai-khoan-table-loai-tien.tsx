import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { BaoCaoTaiKhoanGroupedByLoaiTien } from '@/types/bao-cao-tai-khoan'
import { BaoCaoTableWrapper } from '@/features/tai-chinh/bao-cao-tai-chinh/components/bao-cao-table-wrapper'
import { formatCurrency } from '../bao-cao-tai-khoan-table-utils'
import { Coins } from 'lucide-react'

interface BaoCaoTaiKhoanTableLoaiTienProps {
  data?: BaoCaoTaiKhoanGroupedByLoaiTien[]
}

export function BaoCaoTaiKhoanTableLoaiTien({ data = [] }: BaoCaoTaiKhoanTableLoaiTienProps) {
  if (data.length === 0) return null

  const tableContent = (
    <div className="rounded-md border overflow-hidden">
      <div className="max-h-[400px] overflow-y-auto">
        <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="w-[150px]">Loại tiền</TableHead>
            <TableHead className="text-right w-[150px]">Số dư đầu kỳ</TableHead>
            <TableHead className="text-right w-[150px]">Tổng thu</TableHead>
            <TableHead className="text-right w-[150px]">Tổng chi</TableHead>
            <TableHead className="text-right w-[150px]">Tồn cuối</TableHead>
            <TableHead className="text-right w-[120px]">Số lượng GD</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.loaiTien}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.soDuDauKy)}</TableCell>
              <TableCell className="text-right text-green-600 dark:text-green-400">
                {formatCurrency(item.tongThu)}
              </TableCell>
              <TableCell className="text-right text-red-600 dark:text-red-400">
                {formatCurrency(item.tongChi)}
              </TableCell>
              <TableCell
                className={`text-right font-semibold ${
                  item.tonCuoi >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {formatCurrency(item.tonCuoi)}
              </TableCell>
              <TableCell className="text-right">{item.soLuongGiaoDich.toLocaleString('vi-VN')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  )

  return (
    <BaoCaoTableWrapper
      title="Theo loại tiền"
      icon={<Coins className="h-4 w-4" />}
      mobileView={null}
    >
      {tableContent}
    </BaoCaoTableWrapper>
  )
}

