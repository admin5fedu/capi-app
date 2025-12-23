import { GenericMetricCard } from '@/components/dashboard'
import { TrendingUp, TrendingDown, DollarSign, Receipt } from 'lucide-react'
import type { BaoCaoSummary, BaoCaoSoSanhKy } from '@/types/bao-cao-tai-chinh'
import { formatCurrency } from '@/shared/utils/format-utils'
import { cn } from '@/lib/utils'

interface BaoCaoDashboardProps {
  summary: BaoCaoSummary
  soSanhKy?: BaoCaoSoSanhKy
  isLoading?: boolean
}

export function BaoCaoDashboard({ summary, soSanhKy }: BaoCaoDashboardProps) {
  const getTrend = (value: number) => {
    if (value > 0) return { value, isPositive: true }
    if (value < 0) return { value: Math.abs(value), isPositive: false }
    return { value: 0, isPositive: undefined }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <GenericMetricCard
        label="Tổng thu"
        value={formatCurrency(summary.tongThu)}
        icon={<TrendingUp className="h-3.5 w-3.5" />}
        trend={soSanhKy ? getTrend(soSanhKy.thayDoi.tongThu) : undefined}
        className="border-green-200 dark:border-green-900"
        size="sm"
        layout="vertical"
      />
      <GenericMetricCard
        label="Tổng chi"
        value={formatCurrency(summary.tongChi)}
        icon={<TrendingDown className="h-3.5 w-3.5" />}
        trend={soSanhKy ? getTrend(-soSanhKy.thayDoi.tongChi) : undefined}
        className="border-red-200 dark:border-red-900"
        size="sm"
        layout="vertical"
      />
      <GenericMetricCard
        label="Số dư"
        value={formatCurrency(summary.soDu)}
        icon={<DollarSign className="h-3.5 w-3.5" />}
        trend={soSanhKy ? getTrend(soSanhKy.thayDoi.soDu) : undefined}
        className={cn(
          'border-blue-200 dark:border-blue-900',
          summary.soDu >= 0 ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'
        )}
        size="sm"
        layout="vertical"
      />
      <GenericMetricCard
        label="Số lượng giao dịch"
        value={summary.soLuongGiaoDich.toLocaleString('vi-VN')}
        icon={<Receipt className="h-3.5 w-3.5" />}
        trend={soSanhKy ? getTrend(soSanhKy.thayDoi.soLuongGiaoDich) : undefined}
        size="sm"
        layout="vertical"
      />
    </div>
  )
}

