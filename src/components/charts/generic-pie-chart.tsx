import {
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { GenericChartCard } from './generic-chart-card'

export interface PieChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}

export interface GenericPieChartProps {
  title: string
  icon?: React.ReactNode
  data: PieChartDataPoint[]
  nameKey?: string
  valueKey?: string
  colors?: string[]
  config?: ChartConfig
  height?: string
  className?: string
  gridCols?: 1 | 2 | 3 | 4
  outerRadius?: number
  innerRadius?: number
  paddingAngle?: number
  showLabel?: boolean
  labelFormatter?: (props: { name?: string; percent?: number }) => string
}

const DEFAULT_COLORS = [
  'hsl(12 76% 61%)',      // Orange
  'hsl(173 58% 45%)',     // Teal
  'hsl(43 74% 66%)',      // Yellow
  'hsl(280 65% 65%)',     // Purple
  'hsl(340 75% 60%)',     // Pink
  'hsl(217 91% 65%)',     // Blue
  'hsl(142 76% 40%)',     // Green
  'hsl(30 80% 60%)',      // Orange-Yellow
]

/**
 * Generic Pie Chart Component
 * Reusable pie chart for distribution and proportion data
 */
export function GenericPieChart({
  title,
  icon,
  data,
  valueKey = 'value',
  colors = DEFAULT_COLORS,
  config,
  height = '250px',
  className,
  gridCols,
  outerRadius = 80,
  innerRadius = 0,
  paddingAngle = 0,
  showLabel = true,
  labelFormatter = ({ name, percent }: { name?: string; percent?: number }) => {
    if (percent === undefined) return ''
    return `${name}: ${(percent * 100).toFixed(0)}%`
  },
}: GenericPieChartProps) {
  if (!data || data.length === 0) {
    return null
  }

  const chartContent = (
    <ChartContainer config={config || {}} className={className}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={showLabel ? labelFormatter : false}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          paddingAngle={paddingAngle}
          fill="#8884d8"
          dataKey={valueKey}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
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

