import { useState, useMemo } from 'react'
import { GenericListView } from '@/shared/components/generic/generic-list-view'
import { ConfirmDeleteDialog } from '@/shared/components/generic/confirm-delete-dialog'
import type { QuickFilter } from '@/shared/components/generic/types'
import { useTyGiaList, useDeleteTyGia } from '../hooks/use-ty-gia'
import { COT_HIEN_THI, TEN_LUU_TRU_COT } from '../config'
import { getBulkActions, handleXuatExcel, handleNhapExcel } from '../actions'
import type { TyGia } from '@/types/ty-gia'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface TyGiaListViewProps {
  onEdit: (id: number) => void
  onAddNew: () => void
  onView?: (id: number) => void
}

/**
 * TyGiaListView component - Sử dụng GenericListView
 */
export function TyGiaListView({ onEdit, onAddNew, onView }: TyGiaListViewProps) {
  const { data: danhSach, isLoading, error, refetch } = useTyGiaList()
  const deleteTyGia = useDeleteTyGia()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleXoa = async (tyGia: TyGia) => {
    try {
      setDeletingId(tyGia.id)
      await deleteTyGia.mutateAsync(tyGia.id)
      toast.success('Xóa tỷ giá thành công')
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa tỷ giá này'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState<TyGia[]>([])

  const handleXoaNhieu = async (selectedRows: TyGia[]) => {
    setSelectedRowsForDelete(selectedRows)
    setBulkDeleteOpen(true)
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRowsForDelete.map((tyGia) => deleteTyGia.mutateAsync(tyGia.id))
      )
      toast.success(`Đã xóa ${selectedRowsForDelete.length} tỷ giá thành công`)
      setBulkDeleteOpen(false)
      setSelectedRowsForDelete([])
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa các tỷ giá này'}`)
    }
  }

  // Hành động cho mỗi row - chỉ Sửa và Xóa (icon only)
  const hanhDongItems = [
    {
      label: 'Chỉnh sửa',
      icon: Pencil,
      onClick: (row: TyGia) => onEdit(row.id),
      variant: 'default' as const,
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: handleXoa,
      variant: 'destructive' as const,
      hidden: (row: TyGia) => deletingId === row.id, // Ẩn khi đang xóa
      requiresConfirm: true,
      confirmTitle: 'Xác nhận xóa tỷ giá',
      confirmDescription: (row: TyGia) =>
        `Bạn có chắc chắn muốn xóa tỷ giá ngày ${new Date(row.ngay_ap_dung).toLocaleDateString('vi-VN')}? Hành động này không thể hoàn tác.`,
    },
  ]

  // Thao tác hàng loạt
  const bulkActions = getBulkActions({ onBulkDelete: handleXoaNhieu })

  // Quick filters
  const quickFilters: QuickFilter[] = useMemo(() => [], [])

  return (
    <>
      <GenericListView<TyGia>
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
        timKiemPlaceholder="Tìm kiếm theo ghi chú..."
        onTimKiem={() => {}} // GenericListView sẽ tự filter dữ liệu
        enableRowSelection={true}
        pageSize={50}
      />
      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={confirmBulkDelete}
        title="Xác nhận xóa nhiều tỷ giá"
        description={`Bạn có chắc chắn muốn xóa ${selectedRowsForDelete.length} tỷ giá đã chọn? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
      />
    </>
  )
}

