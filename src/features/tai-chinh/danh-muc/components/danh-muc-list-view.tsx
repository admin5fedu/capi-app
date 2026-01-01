import { useState, useMemo } from 'react'
import { Edit2, Trash2, FolderPlus } from 'lucide-react'
import { GenericListView } from '@/shared/components/generic/generic-list-view'
import { useDanhMucList, useDeleteDanhMuc, useDeleteDanhMucCascade } from '../hooks/use-danh-muc'
import { isLevel1, sortDanhMucForListView } from '../utils/danh-muc-helpers'
import { COT_HIEN_THI, TEN_LUU_TRU_COT, LOAI_DANH_MUC } from '../config'
import { getBulkActions, handleXuatExcel, handleNhapExcel } from '../actions'
import type { DanhMucWithParent } from '@/types/danh-muc'
import { toast } from 'sonner'
import type { QuickFilter } from '@/shared/components/generic/types'

interface DanhMucListViewProps {
  onEdit: (id: number) => void
  onAddNew: () => void
  onAddChild?: (parentId: number, parentLoai: string) => void
  onView?: (id: number) => void
}

/**
 * DanhMucListView component - Sử dụng GenericListView với sắp xếp phân cấp
 */
export function DanhMucListView({ onEdit, onAddNew, onAddChild, onView }: DanhMucListViewProps) {
  const { data: danhSach, isLoading, error, refetch } = useDanhMucList()
  const deleteDanhMuc = useDeleteDanhMuc()
  const deleteDanhMucCascade = useDeleteDanhMucCascade()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Sắp xếp dữ liệu: Thu trước, Chi sau. Trong mỗi loại: cấp 1 trước, cấp 2 của nó ngay sau
  const sortedData = useMemo(() => {
    if (!danhSach) return []
    return sortDanhMucForListView(danhSach)
  }, [danhSach])

  const handleXoa = async (danhMuc: DanhMucWithParent) => {
    try {
      setDeletingId(danhMuc.id)

      // Nếu là cấp 1, dùng cascade delete (tự động xóa cấp 2)
      if (isLevel1(danhMuc)) {
        await deleteDanhMucCascade.mutateAsync(String(danhMuc.id))
      } else {
        // Nếu là cấp 2, xóa bình thường
        await deleteDanhMuc.mutateAsync(String(danhMuc.id))
      }
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa danh mục này'}`)
    } finally {
      setDeletingId(null)
    }
  }

  // Hành động cho mỗi row - sắp xếp thẳng cột
  const hanhDongItems = [
    {
      label: 'Chỉnh sửa',
      icon: Edit2,
      onClick: (row: DanhMucWithParent) => onEdit(row.id),
      variant: 'default' as const,
    },
    {
      label: 'Thêm danh mục con',
      icon: FolderPlus,
      onClick: (row: DanhMucWithParent) => {
        if (onAddChild && isLevel1(row)) {
          onAddChild(row.id, row.loai || '')
        }
      },
      variant: 'default' as const,
      hidden: (row: DanhMucWithParent) => !isLevel1(row), // Chỉ hiển thị cho cấp 1
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: handleXoa,
      variant: 'destructive' as const,
      hidden: (row: DanhMucWithParent) => deletingId === row.id,
      requiresConfirm: true,
      confirmTitle: 'Xác nhận xóa danh mục',
      confirmDescription: (row: DanhMucWithParent) =>
        `Bạn có chắc chắn muốn xóa danh mục "${row.ten}"? Hành động này không thể hoàn tác.`,
    },
  ]

  // Handler xóa nhiều
  const handleBulkDelete = async (selectedRows: DanhMucWithParent[]) => {
    if (selectedRows.length === 0) {
      toast.error('Vui lòng chọn ít nhất một danh mục để xóa')
      return
    }

    try {
      // Phân loại: cấp 1 dùng cascade, cấp 2 xóa bình thường
      const level1Items = selectedRows.filter((row) => isLevel1(row))
      const level2Items = selectedRows.filter((row) => !isLevel1(row))

      // Xóa cấp 1 (cascade - tự động xóa cấp 2 con)
      for (const item of level1Items) {
        await deleteDanhMucCascade.mutateAsync(String(item.id))
      }

      // Xóa cấp 2
      for (const item of level2Items) {
        await deleteDanhMuc.mutateAsync(String(item.id))
      }

      toast.success(`Đã xóa ${selectedRows.length} danh mục thành công`)
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa danh mục'}`)
    }
  }

  // Thao tác hàng loạt
  const bulkActions = getBulkActions({ onBulkDelete: handleBulkDelete })

  // Quick filters
  const quickFilters: QuickFilter[] = useMemo(
    () => [
      {
        key: 'loai',
        label: 'Loại',
        type: 'select',
        multiSelect: true,
        options: LOAI_DANH_MUC.map((loai) => ({
          value: loai.value,
          label: loai.label,
        })),
      },
    ],
    []
  )

  return (
    <>
      <GenericListView<DanhMucWithParent>
        data={sortedData}
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
        onTimKiem={() => {}}
        enableRowSelection={true}
        pageSize={50}
      />
    </>
  )
}

