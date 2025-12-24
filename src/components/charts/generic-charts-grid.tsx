import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface GenericChartsGridProps {
  children: ReactNode
  className?: string
  /**
   * Maximum columns per row on large screens
   * @default 4
   */
  maxCols?: 1 | 2 | 3 | 4
}

/**
 * Generic Charts Grid Component
 * Provides consistent grid layout for charts with responsive columns
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: up to maxCols columns (default 4)
 */
export function GenericChartsGrid({
  children,
  className,
  maxCols = 4,
}: GenericChartsGridProps) {
  const gridColsClass = getGridColsClass(maxCols)

  return (
    <div className={cn('grid gap-4 grid-cols-1 md:grid-cols-2', gridColsClass, className)}>
      {children}
    </div>
  )
}

function getGridColsClass(maxCols: 1 | 2 | 3 | 4): string {
  switch (maxCols) {
    case 1:
      return 'lg:grid-cols-1'
    case 2:
      return 'lg:grid-cols-2'
    case 3:
      return 'lg:grid-cols-3'
    case 4:
      return 'lg:grid-cols-4'
    default:
      return 'lg:grid-cols-4'
  }
}

