import { useState, useMemo } from 'react'
import { Pencil, Trash2, FolderPlus } from 'lucide-react'
import { GenericListView } from '@/shared/components/generic/generic-list-view'
import { useDanhMucList, useDeleteDanhMuc, useDeleteDanhMucCascade } from '../hooks/use-danh-muc'
import { isLevel1, sortDanhMucForListView } from '../utils/danh-muc-helpers'
import { COT_HIEN_THI, TEN_LUU_TRU_COT, LOAI_DANH_MUC } from '../config'
import { getBulkActions, handleXuatExcel, handleNhapExcel } from '../actions'
import type { DanhMucWithParent } from '@/types/danh-muc'
import { toast } from 'sonner'
import type { QuickFilter } from '@/shared/components/generic/types'

interface DanhMucListViewProps {
  onEdit: (id: string) => void
  onAddNew: () => void
  onAddChild?: (parentId: string, parentLoai: string) => void
  onView?: (id: string) => void
}

/**
 * DanhMucListView component - Sử dụng GenericListView với sắp xếp phân cấp
 */
export function DanhMucListView({ onEdit, onAddNew, onAddChild, onView }: DanhMucListViewProps) {
  const { data: danhSach, isLoading, error, refetch } = useDanhMucList()
  const deleteDanhMuc = useDeleteDanhMuc()
  const deleteDanhMucCascade = useDeleteDanhMucCascade()
  const [deletingId, setDeletingId] = useState<string | null>(null)

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
        await deleteDanhMucCascade.mutateAsync(danhMuc.id)
      } else {
        // Nếu là cấp 2, xóa bình thường
        await deleteDanhMuc.mutateAsync(danhMuc.id)
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
      icon: Pencil,
      onClick: (row: DanhMucWithParent) => onEdit(row.id),
      variant: 'default' as const,
    },
    {
      label: 'Thêm danh mục con',
      icon: FolderPlus,
      onClick: (row: DanhMucWithParent) => {
        if (onAddChild && isLevel1(row)) {
          onAddChild(row.id, row.loai)
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

  // Thao tác hàng loạt
  const bulkActions = getBulkActions({ onBulkDelete: () => {} })

  // Quick filters
  const quickFilters: QuickFilter[] = useMemo(
    () => [
      {
        key: 'is_active',
        label: 'Trạng thái',
        type: 'boolean',
        multiSelect: true,
      },
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

