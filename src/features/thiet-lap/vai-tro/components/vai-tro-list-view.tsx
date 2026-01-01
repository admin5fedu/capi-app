import { useState } from 'react'
import { GenericListView } from '@/shared/components/generic/generic-list-view'
import { ConfirmDeleteDialog } from '@/shared/components/generic/confirm-delete-dialog'
import { useVaiTroList, useDeleteVaiTro } from '../hooks/use-vai-tro'
import { COT_HIEN_THI, TEN_LUU_TRU_COT } from '../config'
import { getBulkActions, handleXuatExcel, handleNhapExcel } from '../actions'
import type { VaiTro } from '@/types/vai-tro'
import { Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface VaiTroListViewProps {
  onEdit: (id: number) => void
  onAddNew: () => void
  onView?: (id: number) => void
}

/**
 * VaiTroListView component - Sử dụng GenericListView
 */
export function VaiTroListView({ onEdit, onAddNew, onView }: VaiTroListViewProps) {
  const { data: danhSach, isLoading, error, refetch } = useVaiTroList()
  const deleteVaiTro = useDeleteVaiTro()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleXoa = async (vaiTro: VaiTro) => {
    try {
      setDeletingId(vaiTro.id)
      await deleteVaiTro.mutateAsync(String(vaiTro.id))
      toast.success('Xóa vai trò thành công')
    } catch (error: any) {
      // Backend sẽ validate và trả về lỗi nếu vai trò đang được sử dụng
      toast.error(`Lỗi: ${error.message || 'Không thể xóa vai trò này'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState<VaiTro[]>([])

  const handleXoaNhieu = async (selectedRows: VaiTro[]) => {
    setSelectedRowsForDelete(selectedRows)
    setBulkDeleteOpen(true)
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(selectedRowsForDelete.map((vaiTro) => deleteVaiTro.mutateAsync(String(vaiTro.id))))
      toast.success(`Đã xóa ${selectedRowsForDelete.length} vai trò thành công`)
      setBulkDeleteOpen(false)
      setSelectedRowsForDelete([])
    } catch (error: any) {
      toast.error(`Lỗi khi xóa: ${error.message || 'Không thể xóa các vai trò này'}`)
    }
  }

  // Hành động cho mỗi row - chỉ Sửa và Xóa (icon only)
  const hanhDongItems = [
    {
      label: 'Chỉnh sửa',
      icon: Edit2,
      onClick: (row: VaiTro) => onEdit(row.id),
      variant: 'default' as const,
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: handleXoa,
      variant: 'destructive' as const,
      hidden: (row: VaiTro) => deletingId === row.id, // Ẩn khi đang xóa
      requiresConfirm: true,
      confirmTitle: 'Xác nhận xóa vai trò',
      confirmDescription: (row: VaiTro) =>
        `Bạn có chắc chắn muốn xóa vai trò "${row.ten}"? Hành động này không thể hoàn tác.`,
    },
  ]

  // Thao tác hàng loạt
  const bulkActions = getBulkActions({ onBulkDelete: handleXoaNhieu })

  return (
    <>
      <GenericListView<VaiTro>
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
        title="Xác nhận xóa nhiều vai trò"
        description={`Bạn có chắc chắn muốn xóa ${selectedRowsForDelete.length} vai trò đã chọn? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
      />
    </>
  )
}

