import { Search, RefreshCw, Plus, ArrowLeft, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { GenericListViewProps, BulkActionItem } from '../types'
import { ColumnVisibilityMenu } from './column-visibility-menu'
import { ExcelActions } from './excel-actions'
import { BulkActionsBar } from './bulk-actions-bar'

interface ListToolbarProps<TData extends Record<string, any>> {
  // Search
  timKiem: string
  setTimKiem: (value: string) => void
  timKiemPlaceholder?: string
  onTimKiem?: (keyword: string) => void

  // Quick filters
  quickFilterValues: Record<string, any>
  onClearFilters: () => void

  // Bulk actions
  selectedRows: TData[]
  bulkActions: BulkActionItem<TData>[]
  enableRowSelection: boolean

  // Column visibility
  cotHienThi: GenericListViewProps<TData>['cotHienThi']
  columnVisibility: Record<string, boolean>
  setColumnVisibility: (visibility: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void
  showColumnMenu: boolean
  setShowColumnMenu: (show: boolean) => void

  // Actions
  onBack?: () => void
  onRefresh?: () => void
  isLoading?: boolean
  onAddNew?: () => void
  onXuatExcel?: (data: TData[]) => void
  onNhapExcel?: (file: File) => void
  filteredData: TData[]
}

export function ListToolbar<TData extends Record<string, any>>({
  timKiem,
  setTimKiem,
  timKiemPlaceholder = 'Tìm kiếm...',
  onTimKiem,
  quickFilterValues,
  onClearFilters,
  selectedRows,
  bulkActions,
  enableRowSelection,
  cotHienThi,
  columnVisibility,
  setColumnVisibility,
  showColumnMenu,
  setShowColumnMenu,
  onBack,
  onRefresh,
  isLoading,
  onAddNew,
  onXuatExcel,
  onNhapExcel,
  filteredData,
}: ListToolbarProps<TData>) {
  // Tính số lượng filter active
  const activeFiltersCount = Object.entries(quickFilterValues).reduce((count, [, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        return count + value.length
      }
      return count + 1
    }
    return count
  }, 0)

  return (
    <div className="flex flex-wrap gap-3 items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} title="Quay lại">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Search input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={timKiem}
            onChange={(e) => {
              setTimKiem(e.target.value)
              onTimKiem?.(e.target.value)
            }}
            placeholder={timKiemPlaceholder}
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Clear All Filters Button */}
        {activeFiltersCount > 0 && (
          <div
            className="flex items-center gap-1.5 px-2 py-1 bg-destructive/10 border border-destructive/20 rounded-md hover:bg-destructive/20 transition-colors cursor-pointer group"
            onClick={onClearFilters}
            title="Xóa tất cả bộ lọc"
          >
            <X className="h-3.5 w-3.5 text-destructive group-hover:text-destructive" />
            <span className="text-xs font-medium text-destructive">Xóa lọc</span>
            <Badge variant="destructive" className="h-4 px-1.5 text-[10px] font-semibold">
              {activeFiltersCount}
            </Badge>
          </div>
        )}

        {/* Bulk Actions */}
        {enableRowSelection && selectedRows.length > 0 && bulkActions.length > 0 && (
          <BulkActionsBar selectedRows={selectedRows} bulkActions={bulkActions} />
        )}
      </div>

      {/* Right side toolbar */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Column visibility */}
        <ColumnVisibilityMenu
          cotHienThi={cotHienThi}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          showColumnMenu={showColumnMenu}
          setShowColumnMenu={setShowColumnMenu}
        />

        {/* Excel actions */}
        <ExcelActions
          onXuatExcel={onXuatExcel}
          onNhapExcel={onNhapExcel}
          selectedRows={selectedRows}
          filteredData={filteredData}
        />

        {/* Refresh */}
        {onRefresh && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
            title="Làm mới"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
        )}

        {/* Add new */}
        {onAddNew && (
          <Button onClick={onAddNew} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Thêm mới
          </Button>
        )}
      </div>
    </div>
  )
}

