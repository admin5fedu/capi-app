import { flexRender } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import type { Table } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

interface TableViewProps<TData extends Record<string, any>> {
  table: Table<TData>
  columns: ColumnDef<TData>[]
  isLoading: boolean
  onRowClick?: (row: TData) => void
}

export function TableView<TData extends Record<string, any>>({
  table,
  columns,
  isLoading,
  onRowClick,
}: TableViewProps<TData>) {
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col relative flex-1 min-h-0">
      {/* Table Container - Scrollable */}
      <div className="overflow-auto flex-1 pb-16">
        <table className="w-full">
          <thead className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <th
                    key={header.id}
                    className="px-0 py-0 text-left text-sm font-medium whitespace-nowrap"
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row: any) => (
                <tr
                  key={row.id}
                  className={cn(
                    'border-t hover:bg-muted/50 transition-colors',
                    row.getIsSelected() && 'bg-primary/5',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={(e) => {
                    // Không trigger nếu click vào checkbox hoặc action buttons
                    const target = e.target as HTMLElement
                    if (
                      target.closest('input[type="checkbox"]') ||
                      target.closest('button') ||
                      target.closest('a')
                    ) {
                      return
                    }
                    if (onRowClick) {
                      onRowClick(row.original)
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

