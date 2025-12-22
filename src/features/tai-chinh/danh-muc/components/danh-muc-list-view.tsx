import { useState, useMemo } from 'react'
import { GenericListView } from '@/shared/components/generic/generic-list-view'
import { ConfirmDeleteDialog } from '@/shared/components/generic/confirm-delete-dialog'
import type { QuickFilter } from '@/shared/components/generic/types'
import { useDanhMucList, useDeleteDanhMuc } from '../hooks/use-danh-muc'
import { checkDanhMucHasChildren } from '@/api/danh-muc'
import { COT_HIEN_THI, TEN_LUU_TRU_COT, LOAI_DANH_MUC } from '../config'
import { getBulkActions, handleXuatExcel, handleNhapExcel } from '../actions'
import type { DanhMucWithParent } from '@/types/danh-muc'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface DanhMucListViewProps {
  onEdit: (id: string) => void
  onAddNew: () => void
  onView?: (id: string) => void
}

/**
 * DanhMucListView component - Sử dụng GenericListView
 */
export function DanhMucListView({ onEdit, onAddNew, onView }: DanhMucListViewProps) {
  const { data: danhSach, isLoading, error, refetch } = useDanhMucList()
  const deleteDanhMuc = useDeleteDanhMuc()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleXoa = async (danhMuc: DanhMucWithParent) => {
    try {
      setDeletingId(danhMuc.id)
      
      // Kiểm tra xem có danh mục con không
      const hasChildren = await checkDanhMucHasChildren(danhMuc.id)
      if (hasChildren) {
        toast.error('Không thể xóa danh mục này vì có danh mục con')
        setDeletingId(null)
        return
      }
      
      await deleteDanhMuc.mutateAsync(danhMuc.id)
      toast.success('Xóa danh mục thành công')
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa danh mục này'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState<DanhMucWithParent[]>([])

  const handleXoaNhieu = async (selectedRows: DanhMucWithParent[]) => {
    setSelectedRowsForDelete(selectedRows)
    setBulkDeleteOpen(true)
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRowsForDelete.map((danhMuc) => deleteDanhMuc.mutateAsync(danhMuc.id))
      )
      toast.success(`Đã xóa ${selectedRowsForDelete.length} danh mục thành công`)
      setBulkDeleteOpen(false)
      setSelectedRowsForDelete([])
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa các danh mục này'}`)
    }
  }

  // Hành động cho mỗi row - chỉ Sửa và Xóa (icon only)
  const hanhDongItems = [
    {
      label: 'Chỉnh sửa',
      icon: Pencil,
      onClick: (row: DanhMucWithParent) => onEdit(row.id),
      variant: 'default' as const,
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: handleXoa,
      variant: 'destructive' as const,
      hidden: (row: DanhMucWithParent) => deletingId === row.id, // Ẩn khi đang xóa
      requiresConfirm: true,
      confirmTitle: 'Xác nhận xóa danh mục',
      confirmDescription: (row: DanhMucWithParent) =>
        `Bạn có chắc chắn muốn xóa danh mục "${row.ten}"? Hành động này không thể hoàn tác.`,
    },
  ]

  // Thao tác hàng loạt
  const bulkActions = getBulkActions({ onBulkDelete: handleXoaNhieu })

  // Tạo quickFilters với Trạng thái và Loại
  const quickFilters: QuickFilter[] = useMemo(() => [
    {
      key: 'is_active',
      label: 'Trạng thái',
      type: 'boolean',
      multiSelect: true, // Cho phép chọn nhiều trạng thái
    },
    {
      key: 'loai',
      label: 'Loại',
      type: 'select',
      multiSelect: true, // Cho phép chọn nhiều loại
      options: LOAI_DANH_MUC.map((loai) => ({
        value: loai.value,
        label: loai.label,
      })),
    },
  ], [])

  return (
    <>
      <GenericListView<DanhMucWithParent>
        data={danhSach || []}
        cotHienThi={COT_HIEN_THI}
        hanhDongItems={hanhDongItems}
        bulkActions={bulkActions}
        quickFilters={quickFilters}
        isLoading={isLoading}
        error={error}
        onRefresh={() => refetch()}
        onAddNew={onAddNew}
        onRowClick={(row) => onView?.(row.id)}
        tenLuuTru={TEN_LUU_TRU_COT}
        onXuatExcel={handleXuatExcel}
        onNhapExcel={handleNhapExcel}
        timKiemPlaceholder="Tìm kiếm theo tên, mô tả..."
        onTimKiem={() => {}} // GenericListView sẽ tự filter dữ liệu
        enableRowSelection={true}
        pageSize={50}
      />
      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={confirmBulkDelete}
        title="Xác nhận xóa nhiều danh mục"
        description={`Bạn có chắc chắn muốn xóa ${selectedRowsForDelete.length} danh mục đã chọn? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
      />
    </>
  )
}

