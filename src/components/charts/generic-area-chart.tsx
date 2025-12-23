import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { GenericChartCard } from './generic-chart-card'
import { formatCurrencyCompact } from '@/shared/utils/format-utils'

export interface AreaChartDataPoint {
  [key: string]: string | number
}

export interface GenericAreaChartProps {
  title: string
  icon?: React.ReactNode
  data: AreaChartDataPoint[]
  xKey: string
  yKey: string
  label: string
  color: string
  config?: ChartConfig
  height?: string
  className?: string
  gridCols?: 1 | 2 | 3 | 4
  xAxisAngle?: number
  xAxisHeight?: number
  formatYAxis?: (value: number) => string
  fillOpacity?: number
}

/**
 * Generic Area Chart Component
 * Reusable area chart for cumulative and trend data
 */
export function GenericAreaChart({
  title,
  icon,
  data,
  xKey,
  yKey,
  label,
  color,
  config,
  height = '250px',
  className,
  gridCols,
  xAxisAngle = 0,
  xAxisHeight = 60,
  formatYAxis = (value) => formatCurrencyCompact(value),
  fillOpacity = 0.3,
}: GenericAreaChartProps) {
  if (!data || data.length === 0) {
    return null
  }

  const chartContent = (
    <ChartContainer config={config || {}} className={className}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12 }}
          angle={xAxisAngle}
          textAnchor={xAxisAngle !== 0 ? 'end' : 'middle'}
          height={xAxisAngle !== 0 ? xAxisHeight : undefined}
        />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={formatYAxis} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={color}
          fill={color}
          fillOpacity={fillOpacity}
          name={label}
        />
      </AreaChart>
    </ChartContainer>
  )

  return (
    <GenericChartCard
      title={title}
      icon={icon}
      content={chartContent}
      config={config}
      height={height}
      gridCols={gridCols}
      className={className}
    />
  )
}

