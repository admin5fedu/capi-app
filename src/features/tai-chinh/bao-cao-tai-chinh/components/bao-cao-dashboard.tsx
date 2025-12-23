import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { BaoCaoSummary, BaoCaoSoSanhKy } from '@/types/bao-cao-tai-chinh'
import { cn } from '@/lib/utils'

interface BaoCaoDashboardProps {
  summary: BaoCaoSummary
  soSanhKy?: BaoCaoSoSanhKy
  isLoading?: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value)
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

export function BaoCaoDashboard({ summary, soSanhKy }: BaoCaoDashboardProps) {
  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    className,
  }: {
    title: string
    value: string | number
    icon: React.ComponentType<{ className?: string }>
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
    className?: string
  }) => {
    const trendColors = {
      up: 'text-green-600 dark:text-green-400',
      down: 'text-red-600 dark:text-red-400',
      neutral: 'text-muted-foreground',
    }

    const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : null

    return (
      <Card className={cn('relative overflow-hidden', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-4 px-4">
          <CardTitle className="text-xs font-medium">{title}</CardTitle>
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="text-xl font-bold">{value}</div>
          {trend && trendValue && (
            <div className={cn('flex items-center gap-1 text-[10px] mt-0.5', trendColors[trend])}>
              {TrendIcon && <TrendIcon className="h-2.5 w-2.5" />}
              <span>{trendValue}</span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const getTrend = (value: number): 'up' | 'down' | 'neutral' => {
    if (value > 0) return 'up'
    if (value < 0) return 'down'
    return 'neutral'
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Tổng thu"
        value={formatCurrency(summary.tongThu)}
        icon={TrendingUp}
        trend={soSanhKy ? getTrend(soSanhKy.thayDoi.tongThu) : undefined}
        trendValue={soSanhKy ? formatPercent(soSanhKy.thayDoi.tongThu) : undefined}
        className="border-green-200 dark:border-green-900"
      />
      <StatCard
        title="Tổng chi"
        value={formatCurrency(summary.tongChi)}
        icon={TrendingDown}
        trend={soSanhKy ? getTrend(-soSanhKy.thayDoi.tongChi) : undefined}
        trendValue={soSanhKy ? formatPercent(-soSanhKy.thayDoi.tongChi) : undefined}
        className="border-red-200 dark:border-red-900"
      />
      <StatCard
        title="Số dư"
        value={formatCurrency(summary.soDu)}
        icon={DollarSign}
        trend={soSanhKy ? getTrend(soSanhKy.thayDoi.soDu) : undefined}
        trendValue={soSanhKy ? formatPercent(soSanhKy.thayDoi.soDu) : undefined}
        className={cn(
          'border-blue-200 dark:border-blue-900',
          summary.soDu >= 0 ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'
        )}
      />
      <StatCard
        title="Số lượng giao dịch"
        value={summary.soLuongGiaoDich.toLocaleString('vi-VN')}
        icon={Receipt}
        trend={soSanhKy ? getTrend(soSanhKy.thayDoi.soLuongGiaoDich) : undefined}
        trendValue={soSanhKy ? formatPercent(soSanhKy.thayDoi.soLuongGiaoDich) : undefined}
      />
    </div>
  )
}

