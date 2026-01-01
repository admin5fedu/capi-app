import { useMemo, useEffect, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
} from '@tanstack/react-table'
import { ConfirmDeleteDialog } from './confirm-delete-dialog'
import type { GenericListViewProps, HanhDongItem } from './types'
import { createSelectColumn, createDataColumns, createActionsColumn } from './utils/table-config'
import { useMobile } from './hooks/use-mobile'
import { useListState } from './hooks/use-list-state'
import { useColumnVisibility } from './hooks/use-column-visibility'
import { MobileCardView } from './mobile-card-view'
import { ListToolbar } from './components/list-toolbar'
import { QuickFilters } from './components/quick-filters'
import { TableView } from './components/table-view'
import { TablePagination } from './components/table-pagination'
import { MobilePagination } from './components/mobile-pagination'

export function GenericListView<TData extends Record<string, any>>({
  data,
  cotHienThi,
  hanhDongItems = [],
  bulkActions = [],
  quickFilters = [],
  isLoading = false,
  error = null,
  onRefresh,
  onAddNew,
  onBack,
  onRowClick,
  tenLuuTru = 'generic-list-columns',
  onXuatExcel,
  onNhapExcel,
  timKiemPlaceholder = 'Tìm kiếm...',
  onTimKiem,
  enableRowSelection = true,
  pageSize = 50,
  onQuickFilterChange,
  imageField,
}: GenericListViewProps<TData>) {
  const isMobile = useMobile()

  // State management hooks
  const listState = useListState({
    data,
    cotHienThi,
    quickFilters,
    pageSize,
    onQuickFilterChange,
  })

  const columnVisibility = useColumnVisibility(cotHienThi, tenLuuTru)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<TData | null>(null)
  const [deleteAction, setDeleteAction] = useState<HanhDongItem<TData> | null>(null)

  // Convert cotHienThi thành ColumnDef
  const columns = useMemo<ColumnDef<TData>[]>(() => {
    const cols: ColumnDef<TData>[] = []

    // Thêm cột checkbox nếu enable row selection
    if (enableRowSelection) {
      cols.push(createSelectColumn<TData>())
    }

    // Thêm các cột từ cotHienThi
    cols.push(...createDataColumns(cotHienThi, columnVisibility.columnVisibility))

    // Thêm cột hành động
    if (hanhDongItems.length > 0) {
      const actionsColumn = createActionsColumn(hanhDongItems, (item, action) => {
        setDeleteItem(item)
        setDeleteAction(action)
        setDeleteDialogOpen(true)
      })
      if (actionsColumn) {
        cols.push(actionsColumn)
      }
    }

    return cols
  }, [cotHienThi, columnVisibility.columnVisibility, hanhDongItems, enableRowSelection])

  const table = useReactTable({
    data: listState.filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: listState.setSorting,
    onRowSelectionChange: listState.setRowSelection,
    enableRowSelection,
    state: {
      sorting: listState.sorting,
      columnVisibility: columnVisibility.columnVisibility,
      rowSelection: listState.rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: listState.currentPageSize,
      },
    },
    onColumnVisibilityChange: columnVisibility.setColumnVisibility,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPagination = updater(table.getState().pagination)
        if (newPagination.pageSize !== listState.currentPageSize) {
          listState.setCurrentPageSize(newPagination.pageSize)
        }
      }
    },
    initialState: {
      pagination: {
        pageSize: listState.currentPageSize,
      },
    },
  })

  // Sync pageInputValue with current page
  useEffect(() => {
    listState.setPageInputValue(String(table.getState().pagination.pageIndex + 1))
  }, [table.getState().pagination.pageIndex])

  // Handle row selection cho mobile card view
  const handleMobileRowSelect = (row: TData, selected: boolean) => {
    const rowIndex = listState.filteredData.findIndex((r) => r === row)
    if (rowIndex !== -1) {
      listState.setRowSelection((prev) => ({
        ...prev,
        [String(rowIndex)]: selected,
      }))
    }
  }

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (deleteItem && deleteAction) {
      deleteAction.onClick(deleteItem)
      setDeleteDialogOpen(false)
      setDeleteItem(null)
      setDeleteAction(null)
    }
  }

  const getDeleteDescription = () => {
    if (deleteAction?.confirmDescription && deleteItem) {
      return typeof deleteAction.confirmDescription === 'function'
        ? deleteAction.confirmDescription(deleteItem)
        : deleteAction.confirmDescription
    }
    return 'Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.'
  }

  // Handle clear all filters
  const handleClearFilters = () => {
    listState.setQuickFilterValues({})
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">Lỗi: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Confirm Delete Dialog */}
      {deleteItem && deleteAction && (
        <ConfirmDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          title={deleteAction.confirmTitle || 'Xác nhận xóa'}
          description={getDeleteDescription()}
          confirmLabel="Xóa"
          cancelLabel="Hủy"
        />
      )}

      {/* Toolbar - Fixed */}
      <div className="flex-shrink-0 mb-3">
        <ListToolbar
          timKiem={listState.timKiem}
          setTimKiem={listState.setTimKiem}
          timKiemPlaceholder={timKiemPlaceholder}
          onTimKiem={onTimKiem}
          quickFilters={quickFilters}
          quickFilterValues={listState.quickFilterValues}
          setQuickFilterValues={listState.setQuickFilterValues}
          onClearFilters={handleClearFilters}
          dataAfterSearch={listState.dataAfterSearch}
          selectedRows={listState.selectedRows}
          bulkActions={bulkActions}
          enableRowSelection={enableRowSelection}
          cotHienThi={cotHienThi}
          columnVisibility={columnVisibility.columnVisibility}
          setColumnVisibility={columnVisibility.setColumnVisibility}
          showColumnMenu={columnVisibility.showColumnMenu}
          setShowColumnMenu={columnVisibility.setShowColumnMenu}
          onBack={onBack}
          onRefresh={onRefresh}
          isLoading={isLoading}
          onAddNew={onAddNew}
          onXuatExcel={onXuatExcel}
          onNhapExcel={onNhapExcel}
          filteredData={listState.filteredData}
        />
      </div>

      {/* Quick Filters - Fixed */}
      {quickFilters.length > 0 && (
        <div className="flex-shrink-0 mb-3">
          <QuickFilters
            quickFilters={quickFilters}
            quickFilterValues={listState.quickFilterValues}
            setQuickFilterValues={listState.setQuickFilterValues}
            dataAfterSearch={listState.dataAfterSearch}
            onClearFilters={handleClearFilters}
          />
        </div>
      )}

      {/* Mobile Card View */}
      {isMobile ? (
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <MobileCardView
              data={listState.filteredData}
              cotHienThi={cotHienThi}
              hanhDongItems={hanhDongItems}
              isLoading={isLoading}
              onRowClick={onRowClick}
              selectedRows={listState.selectedRows}
              onRowSelect={handleMobileRowSelect}
              enableRowSelection={enableRowSelection}
              imageField={imageField}
              currentPage={table.getState().pagination.pageIndex}
              pageSize={listState.currentPageSize}
              onDeleteClick={(item, action) => {
                setDeleteItem(item)
                setDeleteAction(action)
                setDeleteDialogOpen(true)
              }}
            />
          </div>
          {/* Mobile Footer - Cố định ở dưới cùng của trang nội dung */}
          <div className="flex-shrink-0">
            <MobilePagination
              table={table}
              currentPageSize={listState.currentPageSize}
              setCurrentPageSize={listState.setCurrentPageSize}
              filteredDataLength={listState.filteredData.length}
              enableRowSelection={enableRowSelection}
              selectedRowsCount={listState.selectedRows.length}
            />
          </div>
        </div>
      ) : (
        /* Desktop Table View - Scrollable container với sticky footer */
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="border rounded-lg flex flex-col flex-1 min-h-0 bg-card overflow-hidden">
            {/* Table Content - scrollable */}
            <div className="flex-1 min-h-0 overflow-hidden relative">
              <TableView
                table={table}
                columns={columns}
                isLoading={isLoading}
                onRowClick={onRowClick}
              />
            </div>
            {/* Footer - Sticky bottom, luôn nằm sát mép dưới */}
            <div className="flex-shrink-0 mt-auto">
              <TablePagination
                table={table}
                currentPageSize={listState.currentPageSize}
                setCurrentPageSize={listState.setCurrentPageSize}
                pageInputValue={listState.pageInputValue}
                setPageInputValue={listState.setPageInputValue}
                filteredDataLength={listState.filteredData.length}
                enableRowSelection={enableRowSelection}
                selectedRowsCount={listState.selectedRows.length}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
