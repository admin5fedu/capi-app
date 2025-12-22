import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table } from '@tanstack/react-table'
import { normalizePageNumber, getPaginationRange } from '../utils/pagination-helpers'

interface TablePaginationProps<TData extends Record<string, any>> {
  table: Table<TData>
  currentPageSize: number
  setCurrentPageSize: (size: number) => void
  pageInputValue: string
  setPageInputValue: (value: string) => void
  filteredDataLength: number
  enableRowSelection: boolean
  selectedRowsCount: number
}

export function TablePagination<TData extends Record<string, any>>({
  table,
  currentPageSize,
  setCurrentPageSize,
  pageInputValue,
  setPageInputValue,
  filteredDataLength,
  enableRowSelection,
  selectedRowsCount,
}: TablePaginationProps<TData>) {
  // Handle jump to page
  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault()
    const page = normalizePageNumber(pageInputValue, table.getPageCount())
    table.setPageIndex(page - 1)
    setPageInputValue(String(page))
  }

  // Get pagination range
  const paginationRange = getPaginationRange(
    table.getState().pagination.pageIndex,
    currentPageSize,
    filteredDataLength
  )

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 px-3 py-2 border-t bg-muted/50">
      {/* Left: Info & Page Size - Responsive */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm text-muted-foreground">
        {/* Desktop: Full info */}
        <span className="hidden sm:inline whitespace-nowrap">
          Tổng: <strong className="text-foreground">{filteredDataLength}</strong>
        </span>
        {enableRowSelection && selectedRowsCount > 0 && (
          <>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline whitespace-nowrap">
              Đã chọn: <strong className="text-foreground">{selectedRowsCount}</strong>
            </span>
          </>
        )}

        {/* Page Size Selector - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <span className="hidden sm:inline">•</span>
          <span className="whitespace-nowrap">Hiển thị:</span>
          <select
            value={currentPageSize}
            onChange={(e) => {
              const newSize = parseInt(e.target.value)
              setCurrentPageSize(newSize)
              table.setPageSize(newSize)
              table.setPageIndex(0)
            }}
            className="h-7 px-2 py-1 text-xs border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>

        {/* Mobile: Compact info */}
        <span className="sm:hidden whitespace-nowrap">
          <strong className="text-foreground">{filteredDataLength}</strong>
          {enableRowSelection && selectedRowsCount > 0 && (
            <> • <strong className="text-foreground">{selectedRowsCount}</strong></>
          )}
        </span>
      </div>

      {/* Right: Pagination Controls - Responsive */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Desktop: Full pagination */}
        <div className="hidden lg:flex items-center gap-1">
          {/* First page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="h-7 w-7 p-0"
            title="Trang đầu"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-7 w-7 p-0"
            title="Trang trước"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          {/* Jump to page input */}
          <form onSubmit={handleJumpToPage} className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Trang</span>
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              value={pageInputValue}
              onChange={(e) => setPageInputValue(e.target.value)}
              onBlur={(e) => {
                const page = normalizePageNumber(e.target.value, table.getPageCount())
                table.setPageIndex(page - 1)
                setPageInputValue(String(page))
              }}
              className="h-7 w-12 px-1.5 text-xs text-center border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              / {table.getPageCount()}
            </span>
          </form>

          {/* Range display */}
          <span className="text-xs text-muted-foreground min-w-[100px] text-center whitespace-nowrap px-2">
            {paginationRange.start} - {paginationRange.end} / {paginationRange.total}
          </span>

          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-7 w-7 p-0"
            title="Trang sau"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="h-7 w-7 p-0"
            title="Trang cuối"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Tablet: Medium pagination */}
        <div className="hidden md:flex lg:hidden items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-7 w-7 p-0"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <form onSubmit={handleJumpToPage} className="flex items-center gap-1">
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              value={pageInputValue}
              onChange={(e) => setPageInputValue(e.target.value)}
              onBlur={(e) => {
                const page = normalizePageNumber(e.target.value, table.getPageCount())
                table.setPageIndex(page - 1)
                setPageInputValue(String(page))
              }}
              className="h-7 w-10 px-1 text-xs text-center border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground">/{table.getPageCount()}</span>
          </form>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-7 w-7 p-0"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Mobile: Compact single line */}
        <div className="flex md:hidden items-center gap-1">
          {/* Page Size - Mobile (compact) */}
          <select
            value={currentPageSize}
            onChange={(e) => {
              const newSize = parseInt(e.target.value)
              setCurrentPageSize(newSize)
              table.setPageSize(newSize)
              table.setPageIndex(0)
            }}
            className="h-6 px-1.5 text-xs border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>

          {/* Compact pagination */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-6 w-6 p-0"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <span className="text-xs text-foreground font-medium min-w-[35px] text-center">
            {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-6 w-6 p-0"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

