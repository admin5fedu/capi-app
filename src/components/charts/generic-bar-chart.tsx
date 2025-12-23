import {
  BarChart,
  Bar,
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

export interface BarChartDataPoint {
  [key: string]: string | number
}

export interface GenericBarChartProps {
  title: string
  icon?: React.ReactNode
  data: BarChartDataPoint[]
  xKey: string
  yKeys: Array<{
    key: string
    label: string
    color: string
    radius?: [number, number, number, number]
  }>
  config?: ChartConfig
  height?: string
  className?: string
  gridCols?: 1 | 2 | 3 | 4
  orientation?: 'horizontal' | 'vertical'
  xAxisAngle?: number
  xAxisHeight?: number
  formatYAxis?: (value: number) => string
  formatXAxis?: (value: string | number) => string
}

/**
 * Generic Bar Chart Component
 * Reusable bar chart for comparisons and rankings
 */
export function GenericBarChart({
  title,
  icon,
  data,
  xKey,
  yKeys,
  config,
  height = '250px',
  className,
  gridCols,
  orientation = 'vertical',
  xAxisAngle = 0,
  xAxisHeight = 60,
  formatYAxis = (value) => formatCurrencyCompact(value),
  formatXAxis,
}: GenericBarChartProps) {
  if (!data || data.length === 0) {
    return null
  }

  const chartContent = (
    <ChartContainer config={config || {}} className={className}>
      <BarChart
        data={data}
        layout={orientation === 'horizontal' ? 'vertical' : undefined}
      >
        <CartesianGrid strokeDasharray="3 3" />
        {orientation === 'vertical' ? (
          <>
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 12 }}
              angle={xAxisAngle}
              textAnchor={xAxisAngle !== 0 ? 'end' : 'middle'}
              height={xAxisAngle !== 0 ? xAxisHeight : undefined}
              tickFormatter={formatXAxis}
            />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatYAxis} />
          </>
        ) : (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={formatYAxis}
            />
            <YAxis
              type="category"
              dataKey={xKey}
              tick={{ fontSize: 10 }}
              width={100}
              tickFormatter={formatXAxis}
            />
          </>
        )}
        <ChartTooltip content={<ChartTooltipContent />} />
        {yKeys.map((yKey) => {
          // Extract HSL values for dark mode
          const hslMatch = yKey.color.match(/hsl\(([^)]+)\)/)
          const darkColor = hslMatch ? `hsl(${hslMatch[1].replace(/\s+/g, '_')})` : yKey.color
          
          return (
            <Bar
              key={yKey.key}
              dataKey={yKey.key}
              fill={yKey.color}
              radius={yKey.radius || [4, 4, 0, 0]}
              name={yKey.label}
              className={`dark:fill-[${darkColor}]`}
            />
          )
        })}
      </BarChart>
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

