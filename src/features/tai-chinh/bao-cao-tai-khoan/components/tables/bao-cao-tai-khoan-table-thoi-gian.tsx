import type { BaoCaoTaiKhoanGroupedByTime } from '@/types/bao-cao-tai-khoan'
import { GenericFinancialTableWrapper, GenericFinancialTable } from '@/components/tables'
import { Calendar } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/shared/utils/format-utils'
import { cn } from '@/lib/utils'

interface BaoCaoTaiKhoanTableThoiGianProps {
  data?: BaoCaoTaiKhoanGroupedByTime[]
}

export function BaoCaoTaiKhoanTableThoiGian({ data = [] }: BaoCaoTaiKhoanTableThoiGianProps) {
  if (data.length === 0) return null

  const columns = [
    {
      key: 'period',
      label: 'Kỳ',
      accessor: (row: BaoCaoTaiKhoanGroupedByTime) => row.period,
      className: 'font-medium',
      width: '150px',
    },
    {
      key: 'soDuDauKy',
      label: 'Số dư đầu kỳ',
      accessor: (row: BaoCaoTaiKhoanGroupedByTime) => row.soDuDauKy,
      formatter: (value: number) => formatCurrency(value),
      align: 'right' as const,
      width: '150px',
    },
    {
      key: 'tongThu',
      label: 'Tổng thu',
      accessor: (row: BaoCaoTaiKhoanGroupedByTime) => row.tongThu,
      formatter: (value: number) => formatCurrency(value),
      align: 'right' as const,
      className: 'text-green-600 dark:text-green-400',
      width: '150px',
    },
    {
      key: 'tongChi',
      label: 'Tổng chi',
      accessor: (row: BaoCaoTaiKhoanGroupedByTime) => row.tongChi,
      formatter: (value: number) => formatCurrency(value),
      align: 'right' as const,
      className: 'text-red-600 dark:text-red-400',
      width: '150px',
    },
    {
      key: 'tonCuoi',
      label: 'Tồn cuối',
      accessor: (row: BaoCaoTaiKhoanGroupedByTime) => row.tonCuoi,
      formatter: (value: number) => formatCurrency(value),
      align: 'right' as const,
      cellClassName: (row: BaoCaoTaiKhoanGroupedByTime) =>
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
      accessor: (row: BaoCaoTaiKhoanGroupedByTime) => row.soLuongGiaoDich,
      formatter: (value: number) => formatNumber(value),
      align: 'right' as const,
      width: '120px',
    },
  ]

  return (
    <GenericFinancialTableWrapper
      title="Theo thời gian"
      icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
    >
      <GenericFinancialTable
        data={data}
        columns={columns}
        maxHeight="400px"
      />
    </GenericFinancialTableWrapper>
  )
}

