import React, { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { createDataColumns, createActionsColumn } from './utils/table-config'
import type { CotHienThi, HanhDongItem } from './types'

export interface RelatedDataSectionProps<TData = any> {
  title: string
  data: TData[] | undefined
  isLoading?: boolean
  emptyMessage?: string
  cotHienThi: CotHienThi<TData>[]
  onAdd?: () => void // Callback khi thêm (nếu không dùng formViewComponent)
  onEdit?: (item: TData) => void // Callback khi sửa (nếu không dùng editFormComponent)
  onDelete?: (item: TData) => void
  onView?: (item: TData) => void // Xem trong popup
  onNavigateToDetail?: (item: TData) => void // Chuyển sang module con để xem
  detailViewComponent?: (props: { id: string; onClose: () => void; onEdit?: (id: string) => void }) => React.ReactNode
  formViewComponent?: (props: { onClose: () => void; onComplete: () => void; initialData?: Partial<TData> }) => React.ReactNode
  editFormComponent?: (props: { id: string; onClose: () => void; onComplete: () => void }) => React.ReactNode
  getItemId?: (item: TData) => string
  className?: string
  navigatePreferenceKey?: string // Key để lưu preference trong localStorage
}

/**
 * RelatedDataSection - Component hiển thị danh sách dữ liệu liên quan dạng bảng
 * Sử dụng trong detail view để hiển thị các items có liên quan
 */
export function RelatedDataSection<TData extends Record<string, any>>({
  title,
  data,
  isLoading = false,
  emptyMessage = 'Không có dữ liệu',
  cotHienThi,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onNavigateToDetail,
  detailViewComponent,
  formViewComponent,
  editFormComponent,
  getItemId = (item) => (item as any).id,
  className,
  navigatePreferenceKey = 'related-data-navigate-preference',
}: RelatedDataSectionProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedItem, setSelectedItem] = useState<TData | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showFormDialog, setShowFormDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<TData | null>(null)
  const [showNavigateDialog, setShowNavigateDialog] = useState(false)
  const [rememberPreference, setRememberPreference] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<TData | null>(null)

  // Tạo hanhDongItems từ props
  const hanhDongItems: HanhDongItem<TData>[] = useMemo(() => {
    const items: HanhDongItem<TData>[] = []
    
    if (onEdit || editFormComponent) {
      items.push({
        label: 'Sửa',
        icon: Edit2,
        onClick: (item) => {
          if (editFormComponent) {
            // Mở popup edit form
            setItemToEdit(item)
            setShowEditDialog(true)
          } else if (onEdit) {
            // Navigate ra ngoài (backward compatibility)
            onEdit(item)
          }
        },
        variant: 'default',
      })
    }
    
    if (onDelete) {
      items.push({
        label: 'Xóa',
        icon: Trash2,
        onClick: (item) => {
          setItemToDelete(item)
          setDeleteDialogOpen(true)
        },
        variant: 'destructive',
        requiresConfirm: true,
      })
    }
    
    // Thêm nút con mắt nếu có onNavigateToDetail
    if (onNavigateToDetail) {
      items.push({
        label: 'Xem chi tiết',
        icon: Eye,
        onClick: (item) => {
          // Kiểm tra preference
          const savedPreference = localStorage.getItem(navigatePreferenceKey)
          if (savedPreference === 'true') {
            // Tự động chuyển sang module con
            onNavigateToDetail(item)
          } else {
            // Hiển thị dialog xác nhận
            setSelectedItem(item)
            setShowNavigateDialog(true)
          }
        },
        variant: 'default',
      })
    }
    
    return items
  }, [onEdit, editFormComponent, onDelete, onNavigateToDetail, navigatePreferenceKey])

  // Tạo columns
  const columns = useMemo<ColumnDef<TData>[]>(() => {
    const cols: ColumnDef<TData>[] = []
    
    // Thêm các cột từ cotHienThi
    cols.push(...createDataColumns(cotHienThi, {}))
    
    // Thêm cột actions
    const actionsCol = createActionsColumn(hanhDongItems, (item, action) => {
      if (action.onClick) {
        action.onClick(item)
      }
    })
    if (actionsCol) {
      cols.push(actionsCol)
    }
    
    return cols
  }, [cotHienThi, hanhDongItems])

  // Table instance
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  // Xử lý click vào row
  const handleRowClick = (item: TData) => {
    if (detailViewComponent) {
      setSelectedItem(item)
      setShowDetailDialog(true)
    } else if (onView) {
      onView(item)
    }
  }

  // Xử lý xác nhận navigate
  const handleNavigateConfirm = () => {
    if (selectedItem && onNavigateToDetail) {
      // Lưu preference nếu được chọn
      if (rememberPreference) {
        localStorage.setItem(navigatePreferenceKey, 'true')
      }
      
      onNavigateToDetail(selectedItem)
      setShowNavigateDialog(false)
      setSelectedItem(null)
      setRememberPreference(false)
    }
  }

  // Xử lý xác nhận xóa
  const handleDeleteConfirm = () => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary border-b pb-2 flex-1">{title}</h2>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Đang tải dữ liệu...</div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary border-b pb-2 flex-1">{title}</h2>
          {(onAdd || formViewComponent) && (
            <Button 
              onClick={() => {
                if (formViewComponent) {
                  setShowFormDialog(true)
                } else if (onAdd) {
                  onAdd()
                }
              }} 
              size="sm" 
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm
            </Button>
          )}
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">{emptyMessage}</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={cn('space-y-4', className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary border-b pb-2 flex-1">
            {title} ({data.length})
          </h2>
          {(onAdd || formViewComponent) && (
            <Button 
              onClick={() => {
                if (formViewComponent) {
                  setShowFormDialog(true)
                } else if (onAdd) {
                  onAdd()
                }
              }} 
              size="sm" 
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm
            </Button>
          )}
        </div>

        {/* Bảng */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={cn(
                          'px-4 py-3 text-left text-sm font-medium text-muted-foreground',
                          header.column.columnDef.id === 'actions' && 'text-center'
                        )}
                        style={{
                          width: header.getSize() !== 150 ? header.getSize() : undefined,
                        }}
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
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => handleRowClick(row.original)}
                      className={cn(
                        'border-b transition-colors',
                        (detailViewComponent || onView) && 'cursor-pointer hover:bg-muted/50'
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={cn(
                            'px-4 py-3 text-sm',
                            cell.column.columnDef.id === 'actions' && 'text-center'
                          )}
                        >
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
      </div>

      {/* Detail Dialog */}
      {showDetailDialog && selectedItem && detailViewComponent && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {detailViewComponent({
                id: getItemId(selectedItem),
                onClose: () => {
                  setShowDetailDialog(false)
                  setSelectedItem(null)
                },
                onEdit: editFormComponent
                  ? (id: string) => {
                      // Đóng detail dialog và mở edit dialog
                      setShowDetailDialog(false)
                      const item = data?.find((d) => getItemId(d) === id)
                      if (item) {
                        setItemToEdit(item)
                        setShowEditDialog(true)
                      }
                    }
                  : undefined,
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Form Dialog */}
      {showEditDialog && itemToEdit && editFormComponent && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {editFormComponent({
                id: getItemId(itemToEdit),
                onClose: () => {
                  setShowEditDialog(false)
                  setItemToEdit(null)
                },
                onComplete: () => {
                  setShowEditDialog(false)
                  setItemToEdit(null)
                  // Có thể thêm callback để refresh data nếu cần
                },
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Form Dialog */}
      {showFormDialog && formViewComponent && (
        <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm mới</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {formViewComponent({
                onClose: () => {
                  setShowFormDialog(false)
                },
                onComplete: () => {
                  setShowFormDialog(false)
                  // Có thể thêm callback để refresh data nếu cần
                },
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Navigate Confirmation Dialog */}
      <AlertDialog open={showNavigateDialog} onOpenChange={setShowNavigateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Chuyển sang module con?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có muốn chuyển sang module con để xem chi tiết không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Checkbox
              id="remember-preference"
              checked={rememberPreference}
              onCheckedChange={(checked) => setRememberPreference(!!checked)}
            />
            <label
              htmlFor="remember-preference"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Không hỏi lại lần sau
            </label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleNavigateConfirm}>Chuyển</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
