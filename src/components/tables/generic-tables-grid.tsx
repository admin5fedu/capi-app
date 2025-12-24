import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface GenericTablesGridProps {
  children: ReactNode
  className?: string
  /**
   * Maximum columns per row on large screens
   * @default 2
   */
  maxCols?: 1 | 2
}

/**
 * Generic Tables Grid Component
 * Provides consistent grid layout for tables with responsive columns
 * - Mobile: 1 column
 * - Tablet: 1 column
 * - Desktop: up to maxCols columns (default 2)
 */
export function GenericTablesGrid({
  children,
  className,
  maxCols = 2,
}: GenericTablesGridProps) {
  const gridColsClass = getGridColsClass(maxCols)

  return (
    <div className={cn('grid gap-4 grid-cols-1', gridColsClass, className)}>
      {children}
    </div>
  )
}

function getGridColsClass(maxCols: 1 | 2): string {
  switch (maxCols) {
    case 1:
      return 'lg:grid-cols-1'
    case 2:
      return 'lg:grid-cols-2'
    default:
      return 'lg:grid-cols-2'
  }
}

