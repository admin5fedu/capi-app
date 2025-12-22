import { useState, useMemo } from 'react'
import { GenericListView } from '@/shared/components/generic/generic-list-view'
import { ConfirmDeleteDialog } from '@/shared/components/generic/confirm-delete-dialog'
import type { QuickFilter } from '@/shared/components/generic/types'
import { useDanhSachNguoiDung, useNguoiDungList } from '../hooks/use-nguoi-dung'
import { useVaiTroList } from '@/features/thiet-lap/vai-tro'
import { useXoaNguoiDung } from '../hooks/use-nguoi-dung'
import { COT_HIEN_THI, TEN_LUU_TRU_COT } from '../config'
import { getBulkActions, handleXuatExcel, handleNhapExcel } from '../actions'
import type { NguoiDung } from '@/types/nguoi-dung'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface NguoiDungListViewProps {
  onEdit: (id: string) => void
  onAddNew: () => void
  onView?: (id: string) => void
}

/**
 * NguoiDungListView component - Sử dụng GenericListView
 */
export function NguoiDungListView({ onEdit, onAddNew, onView }: NguoiDungListViewProps) {
  const { data: danhSach, isLoading, error, refetch } = useDanhSachNguoiDung()
  const { data: danhSachVaiTro } = useVaiTroList()
  const deleteNguoiDung = useXoaNguoiDung()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleXoa = async (nguoiDung: NguoiDung) => {
    try {
      setDeletingId(nguoiDung.id)
      await deleteNguoiDung.mutateAsync(nguoiDung.id)
      toast.success('Xóa người dùng thành công')
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa người dùng này'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState<NguoiDung[]>([])

  const handleXoaNhieu = async (selectedRows: NguoiDung[]) => {
    setSelectedRowsForDelete(selectedRows)
    setBulkDeleteOpen(true)
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(selectedRowsForDelete.map((nguoiDung) => deleteNguoiDung.mutateAsync(nguoiDung.id)))
      toast.success(`Đã xóa ${selectedRowsForDelete.length} người dùng thành công`)
      setBulkDeleteOpen(false)
      setSelectedRowsForDelete([])
    } catch (error: any) {
      toast.error(`Lỗi khi xóa: ${error.message || 'Không thể xóa các người dùng này'}`)
    }
  }

  // Hành động cho mỗi row - chỉ Sửa và Xóa (icon only)
  const hanhDongItems = [
    {
      label: 'Chỉnh sửa',
      icon: Pencil,
      onClick: (row: NguoiDung) => onEdit(row.id),
      variant: 'default' as const,
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: handleXoa,
      variant: 'destructive' as const,
      hidden: (row: NguoiDung) => deletingId === row.id, // Ẩn khi đang xóa
      requiresConfirm: true,
      confirmTitle: 'Xác nhận xóa người dùng',
      confirmDescription: (row: NguoiDung) =>
        `Bạn có chắc chắn muốn xóa người dùng "${row.ho_ten}"? Hành động này không thể hoàn tác.`,
    },
  ]

  // Thao tác hàng loạt
  const bulkActions = getBulkActions({ onBulkDelete: handleXoaNhieu })

  // Tạo quickFilters với Trạng thái và Vai trò
  const quickFilters: QuickFilter[] = useMemo(() => {
    const filters: QuickFilter[] = [
      {
        key: 'is_active',
        label: 'Trạng thái',
        type: 'boolean',
        multiSelect: true, // Cho phép chọn nhiều trạng thái
      },
    ]

    // Thêm filter Vai trò nếu có danh sách vai trò
    if (danhSachVaiTro && danhSachVaiTro.length > 0) {
      filters.push({
        key: 'vai_tro_id',
        label: 'Vai trò',
        type: 'select',
        multiSelect: true, // Cho phép chọn nhiều vai trò
        options: danhSachVaiTro.map((vt) => ({
          value: vt.id,
          label: vt.ten,
        })),
      })
    }

    return filters
  }, [danhSachVaiTro])

  return (
    <>
      <GenericListView<NguoiDung>
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
        timKiemPlaceholder="Tìm kiếm theo họ tên, email..."
        onTimKiem={() => {}} // GenericListView sẽ tự filter dữ liệu
        enableRowSelection={true}
        pageSize={50}
        imageField="avatar_url" // Field chứa URL ảnh cho mobile card view
      />
      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={confirmBulkDelete}
        title="Xác nhận xóa nhiều người dùng"
        description={`Bạn có chắc chắn muốn xóa ${selectedRowsForDelete.length} người dùng đã chọn? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
      />
    </>
  )
}

