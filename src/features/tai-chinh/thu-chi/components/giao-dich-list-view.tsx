import { useState, useMemo } from 'react'
import { GenericListView } from '@/shared/components/generic/generic-list-view'
import { ConfirmDeleteDialog } from '@/shared/components/generic/confirm-delete-dialog'
import type { QuickFilter } from '@/shared/components/generic/types'
import { useGiaoDichList, useDeleteGiaoDich } from '../hooks/use-giao-dich'
import { COT_HIEN_THI, TEN_LUU_TRU_COT, LOAI_GIAO_DICH } from '../config'
import type { GiaoDich } from '@/types/giao-dich'
import { Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface GiaoDichListViewProps {
  onEdit: (id: number) => void
  onAddNew: () => void
  onView?: (id: number) => void
}

/**
 * GiaoDichListView component - Sử dụng GenericListView
 */
export function GiaoDichListView({ onEdit, onAddNew, onView }: GiaoDichListViewProps) {
  const { data: danhSach, isLoading, error, refetch } = useGiaoDichList()
  const deleteGiaoDich = useDeleteGiaoDich()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleXoa = async (giaoDich: GiaoDich) => {
    try {
      setDeletingId(giaoDich.id)
      await deleteGiaoDich.mutateAsync(giaoDich.id)
      toast.success('Xóa giao dịch thành công')
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa giao dịch này'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState<GiaoDich[]>([])

  const handleXoaNhieu = async (selectedRows: GiaoDich[]) => {
    setSelectedRowsForDelete(selectedRows)
    setBulkDeleteOpen(true)
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRowsForDelete.map((giaoDich) => deleteGiaoDich.mutateAsync(giaoDich.id))
      )
      toast.success(`Đã xóa ${selectedRowsForDelete.length} giao dịch thành công`)
      setBulkDeleteOpen(false)
      setSelectedRowsForDelete([])
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa các giao dịch này'}`)
    }
  }

  // Hành động cho mỗi row
  const hanhDongItems = [
    {
      label: 'Chỉnh sửa',
      icon: Edit2,
      onClick: (row: GiaoDich) => onEdit(row.id),
      variant: 'default' as const,
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: handleXoa,
      variant: 'destructive' as const,
      hidden: (row: GiaoDich) => deletingId === row.id,
      requiresConfirm: true,
      confirmTitle: 'Xác nhận xóa giao dịch',
      confirmDescription: (row: GiaoDich) =>
        `Bạn có chắc chắn muốn xóa giao dịch "${row.hang_muc || row.loai || 'này'}"? Hành động này không thể hoàn tác.`,
    },
  ]

  // Thao tác hàng loạt
  const bulkActions = [
    {
      label: 'Xóa nhiều',
      icon: Trash2,
      onClick: handleXoaNhieu,
      variant: 'destructive' as const,
    },
  ]

  // Quick filters
  const quickFilters: QuickFilter[] = useMemo(
    () => [
      {
        key: 'hang_muc',
        label: 'Hạng mục',
        type: 'select',
        multiSelect: true,
        options: LOAI_GIAO_DICH.map((loai) => ({
          value: loai.value,
          label: loai.label,
        })),
      },
    ],
    []
  )

  return (
    <>
      <GenericListView<GiaoDich>
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
        timKiemPlaceholder="Tìm kiếm theo hạng mục, mô tả, chứng từ..."
        onTimKiem={() => {}}
        enableRowSelection={true}
        pageSize={50}
      />
      <ConfirmDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={confirmBulkDelete}
        title="Xác nhận xóa nhiều giao dịch"
        description={`Bạn có chắc chắn muốn xóa ${selectedRowsForDelete.length} giao dịch đã chọn? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
      />
    </>
  )
}

