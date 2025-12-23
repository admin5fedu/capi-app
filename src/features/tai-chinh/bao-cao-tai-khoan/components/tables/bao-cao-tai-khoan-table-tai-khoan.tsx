import type { BaoCaoTaiKhoanGroupedByTaiKhoan } from '@/types/bao-cao-tai-khoan'
import { GenericFinancialTableWrapper, GenericFinancialTable } from '@/components/tables'
import { CreditCard } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/shared/utils/format-utils'
import { cn } from '@/lib/utils'

interface BaoCaoTaiKhoanTableTaiKhoanProps {
  data?: BaoCaoTaiKhoanGroupedByTaiKhoan[]
}

export function BaoCaoTaiKhoanTableTaiKhoan({ data = [] }: BaoCaoTaiKhoanTableTaiKhoanProps) {
  if (data.length === 0) return null

  const columns = [
    {
      key: 'taiKhoanTen',
      label: 'Tài khoản',
      accessor: (row: BaoCaoTaiKhoanGroupedByTaiKhoan) => row.taiKhoanTen,
      className: 'font-medium',
      width: '200px',
    },
    {
      key: 'loaiTaiKhoan',
      label: 'Loại TK',
      accessor: (row: BaoCaoTaiKhoanGroupedByTaiKhoan) => row.loaiTaiKhoan,
      width: '120px',
    },
    {
      key: 'loaiTien',
      label: 'Loại tiền',
      accessor: (row: BaoCaoTaiKhoanGroupedByTaiKhoan) => row.loaiTien,
      width: '100px',
    },
    {
      key: 'soDuDauKy',
      label: 'Số dư đầu kỳ',
      accessor: (row: BaoCaoTaiKhoanGroupedByTaiKhoan) => row.soDuDauKy,
      formatter: (value: number) => formatCurrency(value),
      align: 'right' as const,
      width: '150px',
    },
    {
      key: 'tongThu',
      label: 'Tổng thu',
      accessor: (row: BaoCaoTaiKhoanGroupedByTaiKhoan) => row.tongThu,
      formatter: (value: number) => formatCurrency(value),
      align: 'right' as const,
      className: 'text-green-600 dark:text-green-400',
      width: '150px',
    },
    {
      key: 'tongChi',
      label: 'Tổng chi',
      accessor: (row: BaoCaoTaiKhoanGroupedByTaiKhoan) => row.tongChi,
      formatter: (value: number) => formatCurrency(value),
      align: 'right' as const,
      className: 'text-red-600 dark:text-red-400',
      width: '150px',
    },
    {
      key: 'tonCuoi',
      label: 'Tồn cuối',
      accessor: (row: BaoCaoTaiKhoanGroupedByTaiKhoan) => row.tonCuoi,
      formatter: (value: number) => formatCurrency(value),
      align: 'right' as const,
      cellClassName: (row: BaoCaoTaiKhoanGroupedByTaiKhoan) =>
        cn(
          'font-semibold',
          row.tonCuoi >= 0
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        ),
      width: '150px',
    },
    {
      key: 'soLuongGiaoDich',
      label: 'Số lượng GD',
      accessor: (row: BaoCaoTaiKhoanGroupedByTaiKhoan) => row.soLuongGiaoDich,
      formatter: (value: number) => formatNumber(value),
      align: 'right' as const,
      width: '120px',
    },
  ]

  return (
    <GenericFinancialTableWrapper
      title="Theo tài khoản"
      icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
    >
      <GenericFinancialTable
        data={data}
        columns={columns}
        maxHeight="400px"
      />
    </GenericFinancialTableWrapper>
  )
}

