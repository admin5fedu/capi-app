import { useState } from 'react'
import { GenericListView } from '@/shared/components/generic/generic-list-view'
import { ConfirmDeleteDialog } from '@/shared/components/generic/confirm-delete-dialog'
import { usePhongBanList, useDeletePhongBan } from '../hooks/use-phong-ban'
import { COT_HIEN_THI, TEN_LUU_TRU_COT } from '../config'
import { getBulkActions, handleXuatExcel, handleNhapExcel } from '../actions'
import type { PhongBan } from '@/types/phong-ban'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface PhongBanListViewProps {
  onEdit: (id: string) => void
  onAddNew: () => void
  onView?: (id: string) => void
}

/**
 * PhongBanListView component - Sử dụng GenericListView
 */
export function PhongBanListView({ onEdit, onAddNew, onView }: PhongBanListViewProps) {
  const { data: danhSach, isLoading, error, refetch } = usePhongBanList()
  const deletePhongBan = useDeletePhongBan()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleXoa = async (phongBan: PhongBan) => {
    try {
      setDeletingId(phongBan.id)
      await deletePhongBan.mutateAsync(phongBan.id)
      toast.success('Xóa phòng ban thành công')
    } catch (error: any) {
      // Backend sẽ validate và trả về lỗi nếu phòng ban đang được sử dụng
      toast.error(`Lỗi: ${error.message || 'Không thể xóa phòng ban này'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState<PhongBan[]>([])

  const handleXoaNhieu = async (selectedRows: PhongBan[]) => {
    setSelectedRowsForDelete(selectedRows)
    setBulkDeleteOpen(true)
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(selectedRowsForDelete.map((phongBan) => deletePhongBan.mutateAsync(phongBan.id)))
      toast.success(`Đã xóa ${selectedRowsForDelete.length} phòng ban thành công`)
      setBulkDeleteOpen(false)
      setSelectedRowsForDelete([])
    } catch (error: any) {
      toast.error(`Lỗi khi xóa: ${error.message || 'Không thể xóa các phòng ban này'}`)
    }
  }

  // Hành động cho mỗi row - chỉ Sửa và Xóa (icon only)
  const hanhDongItems = [
    {
      label: 'Chỉnh sửa',
      icon: Pencil,
      onClick: (row: PhongBan) => onEdit(row.id),
      variant: 'default' as const,
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: handleXoa,
      variant: 'destructive' as const,
      hidden: (row: PhongBan) => deletingId === row.id, // Ẩn khi đang xóa
      requiresConfirm: true,
      confirmTitle: 'Xác nhận xóa phòng ban',
      confirmDescription: (row: PhongBan) =>
        `Bạn có chắc chắn muốn xóa phòng ban "${row.ten_phong_ban}"? Hành động này không thể hoàn tác.`,
    },
  ]

  // Thao tác hàng loạt
  const bulkActions = getBulkActions({ onBulkDelete: handleXoaNhieu })

  return (
    <>
      <GenericListView<PhongBan>
        data={danhSach || []}
        cotHienThi={COT_HIEN_THI}
        hanhDongItems={hanhDongItems}
        bulkActions={bulkActions}
        isLoading={isLoading}
        error={error}
        onRefresh={() => refetch()}
        onAddNew={onAddNew}
        onRowClick={(row) => onView?.(row.id)}
        tenLuuTru={TEN_LUU_TRU_COT}
        onXuatExcel={handleXuatExcel}
        onNhapExcel={handleNhapExcel}
        timKiemPlaceholder="Tìm kiếm theo mã, tên, mô tả..."
        onTimKiem={() => {}} // GenericListView sẽ tự filter dữ liệu
        enableRowSelection={true}
        pageSize={50}
      />
      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={confirmBulkDelete}
        title="Xác nhận xóa nhiều phòng ban"
        description={`Bạn có chắc chắn muốn xóa ${selectedRowsForDelete.length} phòng ban đã chọn? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
      />
    </>
  )
}

