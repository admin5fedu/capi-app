import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { GenericMetricCard } from './generic-metric-card'

export interface DashboardMetric {
  id: string
  label: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  description?: string
  className?: string
}

export interface DashboardChart {
  id: string
  title: string
  icon?: ReactNode
  content: ReactNode
  className?: string
}

export interface DashboardTable {
  id: string
  title: string
  icon?: ReactNode
  content: ReactNode
  mobileView?: ReactNode
  className?: string
}

export interface GenericDashboardProps {
  metrics?: DashboardMetric[]
  charts?: DashboardChart[]
  tables?: DashboardTable[]
  className?: string
  metricsGridCols?: 1 | 2 | 3 | 4 | 5
  chartsGridCols?: 1 | 2 | 3 | 4
  tablesGridCols?: 1 | 2 | 3 | 4
  isLoading?: boolean
  useMetricCard?: boolean // Use GenericMetricCard instead of default Card
}

const GRID_COLS_CLASSES = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
}

export function GenericDashboard({
  metrics = [],
  charts = [],
  tables = [],
  className,
  metricsGridCols = 4,
  chartsGridCols = 4,
  tablesGridCols = 2,
  isLoading = false,
  useMetricCard = false,
}: GenericDashboardProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Metrics Section */}
      {metrics.length > 0 && (
        <div className={cn('grid gap-4', GRID_COLS_CLASSES[metricsGridCols])}>
          {isLoading
            ? metrics.map((metric) => (
                <Card key={metric.id} className={cn(metric.className)}>
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                  </CardContent>
                </Card>
              ))
            : metrics.map((metric) =>
                useMetricCard ? (
                  <GenericMetricCard
                    key={metric.id}
                    label={metric.label}
                    value={metric.value}
                    icon={metric.icon}
                    trend={metric.trend}
                    description={metric.description}
                    className={metric.className}
                  />
                ) : (
                  <Card key={metric.id} className={cn(metric.className)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {metric.icon && (
                            <div className="text-muted-foreground">{metric.icon}</div>
                          )}
                          <CardTitle className="text-sm text-muted-foreground">
                            {metric.label}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">{metric.value}</div>
                        {metric.trend && (
                          <div
                            className={cn(
                              'text-xs flex items-center gap-1',
                              metric.trend.isPositive
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            )}
                          >
                            <span>{metric.trend.isPositive ? '↑' : '↓'}</span>
                            <span>{metric.trend.value}%</span>
                            <span className="text-muted-foreground">
                              {metric.trend.label}
                            </span>
                          </div>
                        )}
                        {metric.description && (
                          <div className="text-xs text-muted-foreground">
                            {metric.description}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
        </div>
      )}

      {/* Charts Section */}
      {charts.length > 0 && (
        <div className={cn('grid gap-4', GRID_COLS_CLASSES[chartsGridCols])}>
          {charts.map((chart) => (
            <Card key={chart.id} className={cn('overflow-hidden', chart.className)}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {chart.icon && (
                    <div className="text-muted-foreground">{chart.icon}</div>
                  )}
                  <CardTitle className="text-sm text-primary">{chart.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 overflow-hidden">
                {chart.content}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tables Section */}
      {tables.length > 0 && (
        <div className={cn('grid gap-4', GRID_COLS_CLASSES[tablesGridCols])}>
          {tables.map((table) => (
            <div key={table.id} className={cn(table.className)}>
              {table.content}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

