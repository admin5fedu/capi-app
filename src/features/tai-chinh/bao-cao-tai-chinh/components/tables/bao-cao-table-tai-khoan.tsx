import type { BaoCaoGroupedByTaiKhoan } from '@/types/bao-cao-tai-chinh'
import { GenericFinancialTableWrapper, GenericFinancialTable } from '@/components/tables'
import { CreditCard } from 'lucide-react'
import { formatCurrency, formatPercent, formatNumber } from '@/shared/utils/format-utils'
import { cn } from '@/lib/utils'
import { BaoCaoTableTaiKhoanMobile } from './mobile/bao-cao-table-tai-khoan-mobile'

interface BaoCaoTableTaiKhoanProps {
  data: BaoCaoGroupedByTaiKhoan[]
}

export function BaoCaoTableTaiKhoan({ data }: BaoCaoTableTaiKhoanProps) {
  const total = data.reduce((sum, item) => sum + item.tongThu + item.tongChi, 0)

  const columns = [
    {
      key: 'taiKhoanTen',
      label: 'Tài khoản',
      accessor: (row: BaoCaoGroupedByTaiKhoan) => row.taiKhoanTen,
      className: 'font-medium',
    },
    {
      key: 'loaiTien',
      label: 'Loại tiền',
      accessor: (row: BaoCaoGroupedByTaiKhoan) => row.loaiTien,
      formatter: (_value: string, row: BaoCaoGroupedByTaiKhoan) => (
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
          {row.loaiTien}
        </span>
      ),
    },
    {
      key: 'tongThu',
      label: 'Tổng thu',
      accessor: (row: BaoCaoGroupedByTaiKhoan) => row.tongThu,
      formatter: (value: number) => formatCurrency(value),
      align: 'right' as const,
      className: 'text-green-600 dark:text-green-400',
    },
    {
      key: 'tongChi',
      label: 'Tổng chi',
      accessor: (row: BaoCaoGroupedByTaiKhoan) => row.tongChi,
      formatter: (value: number) => formatCurrency(value),
      align: 'right' as const,
      className: 'text-red-600 dark:text-red-400',
    },
    {
      key: 'soDu',
      label: 'Số dư',
      accessor: (row: BaoCaoGroupedByTaiKhoan) => row.soDu,
      formatter: (value: number) => formatCurrency(value),
      align: 'right' as const,
      cellClassName: (row: BaoCaoGroupedByTaiKhoan) =>
        cn(
          'font-medium',
          row.soDu >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        ),
    },
    {
      key: 'soLuongGiaoDich',
      label: 'SL GD',
      accessor: (row: BaoCaoGroupedByTaiKhoan) => row.soLuongGiaoDich,
      formatter: (value: number) => formatNumber(value),
      align: 'right' as const,
      className: 'text-muted-foreground',
    },
    {
      key: 'percent',
      label: '%',
      accessor: (row: BaoCaoGroupedByTaiKhoan) => {
        const itemTotal = row.tongThu + row.tongChi
        return formatPercent(itemTotal, total)
      },
      align: 'right' as const,
      className: 'text-muted-foreground',
    },
  ]

  const summaryRow = {
    label: 'Tổng cộng',
    labelColSpan: 2,
    values: [
      {
        key: 'tongThu',
        value: (data: BaoCaoGroupedByTaiKhoan[]) => data.reduce((sum, item) => sum + item.tongThu, 0),
        formatter: (value: number) => formatCurrency(value),
        align: 'right' as const,
        className: 'text-green-600 dark:text-green-400',
      },
      {
        key: 'tongChi',
        value: (data: BaoCaoGroupedByTaiKhoan[]) => data.reduce((sum, item) => sum + item.tongChi, 0),
        formatter: (value: number) => formatCurrency(value),
        align: 'right' as const,
        className: 'text-red-600 dark:text-red-400',
      },
      {
        key: 'soDu',
        value: (data: BaoCaoGroupedByTaiKhoan[]) => data.reduce((sum, item) => sum + item.soDu, 0),
        formatter: (value: number) => formatCurrency(value),
        align: 'right' as const,
        className: 'font-medium',
      },
      {
        key: 'soLuongGiaoDich',
        value: (data: BaoCaoGroupedByTaiKhoan[]) => data.reduce((sum, item) => sum + item.soLuongGiaoDich, 0),
        formatter: (value: number) => formatNumber(value),
        align: 'right' as const,
      },
      {
        key: 'percent',
        value: () => '100%',
        align: 'right' as const,
      },
    ],
  }

  return (
    <GenericFinancialTableWrapper
      title="Theo Tài khoản"
      icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
      mobileView={<BaoCaoTableTaiKhoanMobile data={data} />}
    >
      <GenericFinancialTable
        data={data}
        columns={columns}
        summaryRow={summaryRow}
        maxHeight="400px"
        sortBy={(a, b) => (b.tongThu + b.tongChi) - (a.tongThu + a.tongChi)}
      />
    </GenericFinancialTableWrapper>
  )
}

