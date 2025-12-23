import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, type ChartConfig } from '@/components/ui/chart'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface GenericChartCardProps {
  title: string
  icon?: ReactNode
  content: ReactNode
  config?: ChartConfig
  className?: string
  height?: string
  gridCols?: 1 | 2 | 3 | 4
}

/**
 * Generic chart card component
 * Wraps chart content in a consistent card layout
 */
export function GenericChartCard({
  title,
  icon,
  content,
  config,
  className,
  height = '250px',
  gridCols,
}: GenericChartCardProps) {
  return (
    <Card className={cn('overflow-hidden', className, gridCols && getGridColsClass(gridCols))}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-primary flex items-center gap-2">
          {icon && <div className="text-muted-foreground">{icon}</div>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 overflow-hidden">
        {config ? (
          <ChartContainer config={config} className={cn('w-full', `h-[${height}]`)}>
            {content}
          </ChartContainer>
        ) : (
          <div className={cn('w-full', `h-[${height}]`)}>{content}</div>
        )}
      </CardContent>
    </Card>
  )
}

function getGridColsClass(cols: 1 | 2 | 3 | 4): string {
  switch (cols) {
    case 1:
      return ''
    case 2:
      return 'lg:col-span-2'
    case 3:
      return 'lg:col-span-3'
    case 4:
      return 'lg:col-span-4'
    default:
      return ''
  }
}

