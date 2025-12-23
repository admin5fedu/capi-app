import { Search, RefreshCw, Plus, ArrowLeft, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { GenericListViewProps, BulkActionItem, QuickFilter } from '../types'
import { ColumnVisibilityMenu } from './column-visibility-menu'
import { ExcelActions } from './excel-actions'
import { BulkActionsBar } from './bulk-actions-bar'
import { MoreMenu } from './more-menu'
import { MobileFilterPopover } from './mobile-filter-popover'

interface ListToolbarProps<TData extends Record<string, any>> {
  // Search
  timKiem: string
  setTimKiem: (value: string) => void
  timKiemPlaceholder?: string
  onTimKiem?: (keyword: string) => void

  // Quick filters
  quickFilters?: QuickFilter[]
  quickFilterValues: Record<string, any>
  setQuickFilterValues?: (values: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void
  onClearFilters: () => void
  dataAfterSearch?: any[] // Data sau khi search để tính số lượng trong filter

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
  // timKiemPlaceholder = 'Tìm kiếm...', // Unused
  onTimKiem,
  quickFilters = [],
  quickFilterValues,
  setQuickFilterValues,
  onClearFilters,
  dataAfterSearch = [],
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
    <div className="flex flex-col gap-2 flex-shrink-0">
      {/* Hàng 1: Back + Search + MoreMenu + Add button */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            title="Quay lại"
            className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Search input - Compact trên mobile */}
        <div className="relative flex-1 min-w-0 max-w-[calc(100%-180px)] sm:flex-none sm:max-w-[320px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          <input
            type="text"
            value={timKiem}
            onChange={(e) => {
              setTimKiem(e.target.value)
              onTimKiem?.(e.target.value)
            }}
            placeholder="Tìm kiếm..."
            className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Clear All Filters Button - Desktop: Ngay bên phải ô tìm kiếm */}
        {activeFiltersCount > 0 && (
          <div className="hidden sm:flex flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              title="Xóa tất cả bộ lọc"
              className="h-8 sm:h-9 px-2 sm:px-3 gap-1.5 sm:gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">Xóa lọc</span>
              <Badge variant="destructive" className="h-4 sm:h-5 px-1.5 sm:px-2 text-[10px] sm:text-xs font-semibold">
                {activeFiltersCount}
              </Badge>
            </Button>
          </div>
        )}

        {/* Spacer để đẩy actions sang bên phải trên desktop */}
        <div className="hidden sm:block flex-1" />

        {/* Mobile: Filter Popover - Chỉ hiển thị nếu có quickFilters */}
        {quickFilters.length > 0 && setQuickFilterValues && (
          <div className="sm:hidden flex-shrink-0">
            <MobileFilterPopover
              quickFilters={quickFilters}
              quickFilterValues={quickFilterValues}
              setQuickFilterValues={setQuickFilterValues}
              dataAfterSearch={dataAfterSearch}
              onClearFilters={onClearFilters}
            />
          </div>
        )}

        {/* Mobile: MoreMenu - Gom tất cả actions ít dùng */}
        <div className="sm:hidden flex-shrink-0">
          <MoreMenu
            cotHienThi={cotHienThi}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            showColumnMenu={showColumnMenu}
            setShowColumnMenu={setShowColumnMenu}
            onXuatExcel={onXuatExcel}
            onNhapExcel={onNhapExcel}
            selectedRows={selectedRows}
            filteredData={filteredData}
            onRefresh={onRefresh}
            isLoading={isLoading}
          />
        </div>

        {/* Desktop: Hiển thị riêng lẻ */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          {/* Bulk Actions - Di chuyển lên hàng 1, bên trái Column visibility */}
          {enableRowSelection && selectedRows.length > 0 && bulkActions.length > 0 && (
            <BulkActionsBar selectedRows={selectedRows} bulkActions={bulkActions} />
          )}

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
        </div>

        {/* Add new - Luôn hiển thị */}
        {onAddNew && (
          <Button 
            onClick={onAddNew} 
            size="sm" 
            className="h-8 sm:h-9 px-2 sm:px-3 gap-1 sm:gap-2 flex-shrink-0"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Thêm</span>
            <span className="hidden sm:inline"> mới</span>
          </Button>
        )}
      </div>

      {/* Hàng 2: Mobile Clear filters + Bulk Actions */}
      {(activeFiltersCount > 0 || (enableRowSelection && selectedRows.length > 0 && bulkActions.length > 0)) && (
        <div className="flex items-center gap-2 flex-wrap sm:hidden">
          {/* Clear All Filters Button - Mobile: Compact */}
          {activeFiltersCount > 0 && (
            <div
              className="flex items-center gap-1 px-1.5 py-1 bg-destructive/10 border border-destructive/20 rounded-md hover:bg-destructive/20 transition-colors cursor-pointer group flex-shrink-0"
              onClick={onClearFilters}
              title="Xóa tất cả bộ lọc"
            >
              <X className="h-3 w-3 text-destructive" />
              <span className="text-xs font-medium text-destructive">Xóa lọc</span>
              <Badge variant="destructive" className="h-3.5 px-1 text-[10px] font-semibold">
                {activeFiltersCount}
              </Badge>
            </div>
          )}

          {/* Bulk Actions */}
          {enableRowSelection && selectedRows.length > 0 && bulkActions.length > 0 && (
            <BulkActionsBar selectedRows={selectedRows} bulkActions={bulkActions} />
          )}
        </div>
      )}

    </div>
  )
}

