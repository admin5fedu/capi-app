import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { formatCurrency, formatNumber } from '@/shared/utils/format-utils'

export interface FinancialTableColumn<TData = any> {
  key: string
  label: string
  accessor: (row: TData) => any
  formatter?: (value: any, row: TData) => string | React.ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
  headerClassName?: string
  cellClassName?: (row: TData) => string
  width?: string | number
}

export interface GenericFinancialTableProps<TData = any> {
  data: TData[]
  columns: FinancialTableColumn<TData>[]
  summaryRow?: {
    label?: string
    labelColSpan?: number
    values: Array<{
      key: string
      value: (data: TData[]) => any
      formatter?: (value: any) => string | React.ReactNode
      align?: 'left' | 'right' | 'center'
      className?: string
    }>
  }
  highlightPositive?: boolean
  highlightNegative?: boolean
  positiveColor?: string
  negativeColor?: string
  maxHeight?: string
  sortBy?: (a: TData, b: TData) => number
  emptyMessage?: string
  className?: string
}

/**
 * Generic Financial Summary Table
 * Reusable table component for financial reports
 */
export function GenericFinancialTable<TData extends Record<string, any>>({
  data,
  columns,
  summaryRow,
  highlightPositive = true,
  highlightNegative = true,
  positiveColor = 'text-green-600 dark:text-green-400',
  negativeColor = 'text-red-600 dark:text-red-400',
  maxHeight = '400px',
  sortBy,
  emptyMessage = 'Không có dữ liệu',
  className,
}: GenericFinancialTableProps<TData>) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  const sortedData = sortBy ? [...data].sort(sortBy) : data

  const getCellValue = (column: FinancialTableColumn<TData>, row: TData) => {
    const value = column.accessor(row)
    
    if (column.formatter) {
      return column.formatter(value, row)
    }

    // Default formatters based on value type
    if (typeof value === 'number') {
      // Check if it's a currency value (large numbers)
      if (Math.abs(value) >= 1000) {
        return formatCurrency(value)
      }
      return formatNumber(value)
    }

    return value ?? '—'
  }

  const getCellClassName = (column: FinancialTableColumn<TData>, row: TData, value: any) => {
    const classes: string[] = []
    
    // Alignment
    if (column.align === 'right') {
      classes.push('text-right')
    } else if (column.align === 'center') {
      classes.push('text-center')
    }

    // Custom cell className
    if (column.cellClassName) {
      classes.push(column.cellClassName(row))
    }

    // Custom column className
    if (column.className) {
      classes.push(column.className)
    }

    // Highlight positive/negative values
    if (typeof value === 'number' && highlightPositive && value > 0) {
      classes.push(positiveColor)
    }
    if (typeof value === 'number' && highlightNegative && value < 0) {
      classes.push(negativeColor)
    }

    return cn(classes)
  }

  return (
    <div className={cn('rounded-md border overflow-hidden', className)}>
      <div className="overflow-y-auto" style={{ maxHeight }}>
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    'h-9 text-xs',
                    column.align === 'right' && 'text-right',
                    column.align === 'center' && 'text-center',
                    column.headerClassName
                  )}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => {
                  const value = column.accessor(row)
                  const cellValue = getCellValue(column, row)
                  const cellClassName = getCellClassName(column, row, value)

                  return (
                    <TableCell
                      key={column.key}
                      className={cellClassName}
                    >
                      {cellValue}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
            {summaryRow && (
              <TableRow className="bg-muted/50 font-medium">
                {summaryRow.label && (
                  <TableCell colSpan={summaryRow.labelColSpan || 1}>
                    {summaryRow.label}
                  </TableCell>
                )}
                {summaryRow.values.map((summary, index) => {
                  const value = summary.value(data)
                  const formattedValue = summary.formatter
                    ? summary.formatter(value)
                    : typeof value === 'number'
                    ? formatCurrency(value)
                    : value

                  return (
                    <TableCell
                      key={summary.key || index}
                      className={cn(
                        summary.align === 'right' && 'text-right',
                        summary.align === 'center' && 'text-center',
                        summary.className
                      )}
                    >
                      {formattedValue}
                    </TableCell>
                  )
                })}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

