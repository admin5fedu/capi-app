import { useState, useMemo } from 'react'
import { GenericListView } from '@/shared/components/generic/generic-list-view'
import { ConfirmDeleteDialog } from '@/shared/components/generic/confirm-delete-dialog'
import type { QuickFilter } from '@/shared/components/generic/types'
import { useTaiKhoanList, useDeleteTaiKhoan } from '../hooks/use-tai-khoan'
import { COT_HIEN_THI, TEN_LUU_TRU_COT, LOAI_TAI_KHOAN, LOAI_TIEN } from '../config'
import { getBulkActions, handleXuatExcel, handleNhapExcel } from '../actions'
import type { TaiKhoan } from '@/types/tai-khoan'
import { Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface TaiKhoanListViewProps {
  onEdit: (id: number) => void
  onAddNew: () => void
  onView?: (id: number) => void
}

/**
 * TaiKhoanListView component - Sử dụng GenericListView
 */
export function TaiKhoanListView({ onEdit, onAddNew, onView }: TaiKhoanListViewProps) {
  const { data: danhSach, isLoading, error, refetch } = useTaiKhoanList()
  const deleteTaiKhoan = useDeleteTaiKhoan()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleXoa = async (taiKhoan: TaiKhoan) => {
    try {
      setDeletingId(String(taiKhoan.id))
      await deleteTaiKhoan.mutateAsync(String(taiKhoan.id))
      toast.success('Xóa tài khoản thành công')
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa tài khoản này'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState<TaiKhoan[]>([])

  const handleXoaNhieu = async (selectedRows: TaiKhoan[]) => {
    setSelectedRowsForDelete(selectedRows)
    setBulkDeleteOpen(true)
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRowsForDelete.map((taiKhoan) => deleteTaiKhoan.mutateAsync(String(taiKhoan.id)))
      )
      toast.success(`Đã xóa ${selectedRowsForDelete.length} tài khoản thành công`)
      setBulkDeleteOpen(false)
      setSelectedRowsForDelete([])
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa các tài khoản này'}`)
    }
  }

  // Hành động cho mỗi row - chỉ Sửa và Xóa (icon only)
  const hanhDongItems = [
    {
      label: 'Chỉnh sửa',
      icon: Edit2,
      onClick: (row: TaiKhoan) => onEdit(row.id),
      variant: 'default' as const,
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: handleXoa,
      variant: 'destructive' as const,
      hidden: (row: TaiKhoan) => deletingId === String(row.id), // Ẩn khi đang xóa
      requiresConfirm: true,
      confirmTitle: 'Xác nhận xóa tài khoản',
      confirmDescription: (row: TaiKhoan) =>
        `Bạn có chắc chắn muốn xóa tài khoản "${row.ten}"? Hành động này không thể hoàn tác.`,
    },
  ]

  // Thao tác hàng loạt
  const bulkActions = getBulkActions({ onBulkDelete: handleXoaNhieu })

  // Tạo quickFilters với Trạng thái, Loại tài khoản và Loại tiền
  const quickFilters: QuickFilter[] = useMemo(() => [
    {
      key: 'is_active',
      label: 'Trạng thái',
      type: 'boolean',
      multiSelect: true, // Cho phép chọn nhiều trạng thái
    },
    {
      key: 'loai',
      label: 'Loại tài khoản',
      type: 'select',
      multiSelect: true, // Cho phép chọn nhiều loại
      options: LOAI_TAI_KHOAN.map((loai) => ({
        value: loai.value,
        label: loai.label,
      })),
    },
    {
      key: 'loai_tien',
      label: 'Loại tiền',
      type: 'select',
      multiSelect: true, // Cho phép chọn nhiều loại tiền
      options: LOAI_TIEN.map((loai) => ({
        value: loai.value,
        label: loai.label,
      })),
    },
  ], [])

  return (
    <>
      <GenericListView<TaiKhoan>
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
        timKiemPlaceholder="Tìm kiếm theo tên, số tài khoản, ngân hàng..."
        onTimKiem={() => {}} // GenericListView sẽ tự filter dữ liệu
        enableRowSelection={true}
        pageSize={50}
      />
      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={confirmBulkDelete}
        title="Xác nhận xóa nhiều tài khoản"
        description={`Bạn có chắc chắn muốn xóa ${selectedRowsForDelete.length} tài khoản đã chọn? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
      />
    </>
  )
}

