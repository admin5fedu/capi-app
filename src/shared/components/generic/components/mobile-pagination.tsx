import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table } from '@tanstack/react-table'

interface MobilePaginationProps<TData extends Record<string, any>> {
  table: Table<TData>
  currentPageSize: number
  setCurrentPageSize: (size: number) => void
  filteredDataLength: number
  enableRowSelection: boolean
  selectedRowsCount: number
}

export function MobilePagination<TData extends Record<string, any>>({
  table,
  currentPageSize,
  setCurrentPageSize,
  filteredDataLength,
  enableRowSelection,
  selectedRowsCount,
}: MobilePaginationProps<TData>) {
  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t shadow-lg">
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
        {/* Left: Info */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-muted-foreground whitespace-nowrap">
            <strong className="text-foreground">{filteredDataLength}</strong>
            {enableRowSelection && selectedRowsCount > 0 && (
              <> • <strong className="text-foreground">{selectedRowsCount}</strong></>
            )}
          </span>
        </div>

        {/* Center: Pagination - chỉ hiện khi có nhiều hơn 1 trang */}
        {table.getPageCount() > 1 && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-foreground font-medium min-w-[50px] text-center">
              {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Right: Page Size (nếu có nhiều trang) */}
        {table.getPageCount() > 1 && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <select
              value={currentPageSize}
              onChange={(e) => {
                const newSize = parseInt(e.target.value)
                setCurrentPageSize(newSize)
                table.setPageSize(newSize)
                table.setPageIndex(0)
              }}
              className="h-7 px-1.5 text-xs border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

