import {
  LineChart,
  Line,
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

export interface LineChartDataPoint {
  [key: string]: string | number
}

export interface GenericLineChartProps {
  title: string
  icon?: React.ReactNode
  data: LineChartDataPoint[]
  xKey: string
  yKeys: Array<{
    key: string
    label: string
    color: string
    strokeWidth?: number
    strokeDasharray?: string
  }>
  config?: ChartConfig
  height?: string
  className?: string
  gridCols?: 1 | 2 | 3 | 4
  xAxisAngle?: number
  xAxisHeight?: number
  formatYAxis?: (value: number) => string
}

/**
 * Generic Line Chart Component
 * Reusable line chart for time series and trend data
 */
export function GenericLineChart({
  title,
  icon,
  data,
  xKey,
  yKeys,
  config,
  height = '250px',
  className,
  gridCols,
  xAxisAngle = 0,
  xAxisHeight = 60,
  formatYAxis = (value) => formatCurrencyCompact(value),
}: GenericLineChartProps) {
  if (!data || data.length === 0) {
    return null
  }

  const chartContent = (
    <ChartContainer config={config || {}} className={className}>
      <LineChart data={data}>
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
        {yKeys.map((yKey) => {
          // Extract HSL values for dark mode
          const hslMatch = yKey.color.match(/hsl\(([^)]+)\)/)
          const darkColor = hslMatch ? `hsl(${hslMatch[1].replace(/\s+/g, '_')})` : yKey.color
          
          return (
            <Line
              key={yKey.key}
              type="monotone"
              dataKey={yKey.key}
              stroke={yKey.color}
              strokeWidth={yKey.strokeWidth || 2}
              strokeDasharray={yKey.strokeDasharray}
              dot={{ fill: yKey.color, r: 4 }}
              activeDot={{ r: 6 }}
              name={yKey.label}
              className={`dark:stroke-[${darkColor}] [&_circle]:dark:fill-[${darkColor}]`}
            />
          )
        })}
      </LineChart>
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

