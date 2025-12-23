import { GenericMetricCard } from '@/components/dashboard'
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Receipt } from 'lucide-react'
import type { BaoCaoTaiKhoanSummary } from '@/types/bao-cao-tai-khoan'
import { formatCurrencyCompact as formatCurrency } from '@/shared/utils/format-utils'

interface BaoCaoTaiKhoanDashboardProps {
  summary: BaoCaoTaiKhoanSummary
  isLoading?: boolean
}

export function BaoCaoTaiKhoanDashboard({ summary, isLoading }: BaoCaoTaiKhoanDashboardProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <GenericMetricCard
            key={i}
            label="Loading..."
            value="—"
            icon={<Wallet className="h-5 w-5" />}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
      <GenericMetricCard
        label="Số dư đầu kỳ"
        value={formatCurrency(summary.soDuDauKy)}
        icon={<Wallet />}
        iconBackground="default"
      />

      <GenericMetricCard
        label="Tổng thu"
        value={formatCurrency(summary.tongThu)}
        icon={<ArrowUpRight />}
        iconBackground="green"
        valueClassName="text-green-600 dark:text-green-400"
      />

      <GenericMetricCard
        label="Tổng chi"
        value={formatCurrency(summary.tongChi)}
        icon={<ArrowDownRight />}
        iconBackground="red"
        valueClassName="text-red-600 dark:text-red-400"
      />

      <GenericMetricCard
        label="Tồn cuối"
        value={formatCurrency(summary.tonCuoi)}
        icon={summary.tonCuoi >= 0 ? <TrendingUp /> : <TrendingDown />}
        iconBackground={summary.tonCuoi >= 0 ? 'green' : 'red'}
        valueClassName={
          summary.tonCuoi >= 0
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }
      />

      <GenericMetricCard
        label="Số lượng GD"
        value={summary.soLuongGiaoDich.toLocaleString('vi-VN')}
        icon={<Receipt />}
        iconBackground="default"
      />
    </div>
  )
}

