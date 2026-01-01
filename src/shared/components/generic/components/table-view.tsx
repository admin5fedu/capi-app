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
    <div className="absolute inset-0 overflow-auto">
      <table className="w-full">
        <thead className="bg-muted sticky top-0 z-30">
          {table.getHeaderGroups().map((headerGroup: any) => {
            // Tìm index của checkbox và cột đầu tiên
            const selectIndex = headerGroup.headers.findIndex((h: any) => h.column.id === 'select')
            const firstDataIndex = selectIndex >= 0 ? selectIndex + 1 : 0
            const checkboxWidth = selectIndex >= 0 ? headerGroup.headers[selectIndex].getSize() : 0
            
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any, index: number) => {
                  const isSelectColumn = header.column.id === 'select'
                  const isActionsColumn = header.column.id === 'actions'
                  const isFirstDataColumn = index === firstDataIndex && !isSelectColumn
                  
                  return (
                    <th
                      key={header.id}
                    className={cn(
                      'px-0 py-0 text-left text-sm font-medium whitespace-nowrap',
                      isSelectColumn && 'sticky left-0 bg-muted z-20 border-r border-border/50',
                      isFirstDataColumn && cn(
                        'sticky bg-muted z-20',
                        selectIndex >= 0 && 'border-r border-border/50'
                      ),
                      isActionsColumn && 'sticky right-0 bg-muted z-20 border-l border-border/50'
                    )}
                    style={{
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                      left: isFirstDataColumn 
                        ? (selectIndex >= 0 ? `${checkboxWidth}px` : '0px')
                        : undefined,
                    }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  )
                })}
              </tr>
            )
          })}
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
            table.getRowModel().rows.map((row: any) => {
              // Tìm index của checkbox và cột đầu tiên
              const visibleCells = row.getVisibleCells()
              const selectIndex = visibleCells.findIndex((c: any) => c.column.id === 'select')
              const firstDataIndex = selectIndex >= 0 ? selectIndex + 1 : 0
              const checkboxWidth = selectIndex >= 0 ? visibleCells[selectIndex].column.getSize() : 0
              
              return (
                <tr
                  key={row.id}
                  className={cn(
                    'border-t transition-colors group',
                    row.getIsSelected() 
                      ? 'bg-primary/5 hover:bg-primary/10' 
                      : 'hover:bg-muted/50',
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
                  {visibleCells.map((cell: any, index: number) => {
                    const isSelectColumn = cell.column.id === 'select'
                    const isActionsColumn = cell.column.id === 'actions'
                    const isFirstDataColumn = index === firstDataIndex && !isSelectColumn
                    
                    // Tính toán background cho các cột sticky - sử dụng màu đặc tương đương với opacity
                    // để tránh cộng dồn màu và đảm bảo màu hover giống hệt cột thường
                    const getStickyBg = () => {
                      if (row.getIsSelected()) {
                        // Trạng thái Selected:
                        // - Normal: màu đặc tương đương với bg-primary/5 trên nền trắng
                        // - Hover: màu đặc tương đương với bg-primary/10 trên nền trắng
                        // Tính toán: primary/5 = mix 5% primary với 95% white
                        // primary/10 = mix 10% primary với 90% white
                        return cn(
                          'bg-[hsl(221_20%_98%)] dark:bg-[hsl(221_30%_15%)]', // Tương đương primary/5
                          'group-hover:bg-[hsl(221_25%_97%)] dark:group-hover:bg-[hsl(221_35%_18%)]', // Tương đương primary/10
                          'transition-colors'
                        )
                      }
                      // Trạng thái Normal:
                      // - Normal: bg-background (màu nền mặc định)
                      // - Hover: màu đặc tương đương với bg-muted/50 trên nền trắng
                      // Tính toán: muted/50 = mix 50% muted với 50% white
                      // Light: muted = hsl(210, 40%, 96.1%), mix với white = hsl(210, 20%, 98%)
                      return cn(
                        'bg-background',
                        'group-hover:bg-[hsl(210_20%_98%)] dark:group-hover:bg-[hsl(217_25%_20%)]', // Tương đương muted/50
                        'transition-colors'
                      )
                    }
                    
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          'px-4 py-3 text-sm',
                          isSelectColumn && cn(
                            'sticky left-0 z-20',
                            getStickyBg(),
                            'border-r border-border/50',
                            'bg-clip-padding' // Tránh lộ border khi có background
                          ),
                          isFirstDataColumn && cn(
                            'sticky z-20',
                            getStickyBg(),
                            selectIndex >= 0 && 'border-r border-border/50',
                            'bg-clip-padding' // Tránh lộ border khi có background
                          ),
                          isActionsColumn && cn(
                            'sticky right-0 z-20',
                            getStickyBg(),
                            'border-l border-border/50',
                            'bg-clip-padding' // Tránh lộ border khi có background
                          )
                        )}
                        style={{
                          left: isFirstDataColumn 
                            ? (selectIndex >= 0 ? `${checkboxWidth}px` : '0px')
                            : undefined,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

