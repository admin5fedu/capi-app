import { useState, useEffect, useMemo } from 'react'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GenericListView } from '@/shared/components/generic/generic-list-view'
import { ConfirmDeleteDialog } from '@/shared/components/generic/confirm-delete-dialog'
import type { QuickFilter } from '@/shared/components/generic/types'
import { useDoiTacList, useDeleteDoiTac } from '../hooks/use-doi-tac'
import { useNguoiDungList } from '@/features/thiet-lap/nguoi-dung'
import { useNhomDoiTacList } from '@/features/doi-tac/nhom-doi-tac/hooks'
import { COT_HIEN_THI, TEN_LUU_TRU_COT, TabType } from '../config'
import { getBulkActions, handleXuatExcel, handleNhapExcel } from '../actions'
import type { DoiTac } from '@/types/doi-tac'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface DoiTacListViewProps {
  onEdit: (id: string) => void
  onAddNew: () => void
  onView?: (id: string) => void
  defaultTab?: TabType
}

/**
 * DoiTacListView component - Sử dụng GenericListView với 2 tabs
 */
export function DoiTacListView({
  onEdit,
  onAddNew,
  onView,
  // defaultTab = 'nha_cung_cap', // Unused parameter
}: DoiTacListViewProps) {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Detect tab từ URL
  // Pattern: /doi-tac/danh-sach-{tab-name}
  const pathParts = location.pathname.split('/').filter(Boolean)
  const modulePath = pathParts[1] || '' // 'danh-sach-nha-cung-cap' hoặc 'danh-sach-khach-hang'
  const tabName = modulePath.replace('danh-sach-', '')
  const currentTabFromUrl: TabType = tabName === 'khach-hang' ? 'khach_hang' : 'nha_cung_cap'
  
  const [activeTab, setActiveTab] = useState<TabType>(currentTabFromUrl)
  const { data: danhSach, isLoading, error, refetch } = useDoiTacList(activeTab)
  const { data: danhSachNguoiDung } = useNguoiDungList()
  const { data: danhSachNhomDoiTac } = useNhomDoiTacList(activeTab)
  const deleteDoiTac = useDeleteDoiTac()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Tạo map để tra cứu tên người dùng nhanh
  const nguoiDungMap = useMemo(() => {
    if (!danhSachNguoiDung) return new Map<string, string>()
    return new Map(
      danhSachNguoiDung.map((nd) => [
        nd.id,
        nd.ho_ten || nd.email || 'N/A',
      ])
    )
  }, [danhSachNguoiDung])

  // Tạo map để tra cứu tên nhóm đối tác nhanh
  const nhomDoiTacMap = useMemo(() => {
    if (!danhSachNhomDoiTac) return new Map<string, string>()
    return new Map(
      danhSachNhomDoiTac.map((nhom: any) => [
        nhom.id,
        nhom.ten,
      ])
    )
  }, [danhSachNhomDoiTac])

  // Cập nhật cột hiển thị để map tên người tạo và nhóm đối tác
  const cotHienThiWithMaps = useMemo(() => {
    return COT_HIEN_THI.map((cot) => {
      if (cot.key === 'nguoi_tao_id') {
        return {
          ...cot,
          cell: (value: string | null) => {
            if (!value) return '—'
            const tenNguoiTao = nguoiDungMap.get(value)
            return React.createElement('span', {}, tenNguoiTao || value)
          },
        }
      }
      if (cot.key === 'nhom_doi_tac_id') {
        return {
          ...cot,
          cell: (value: string | null) => {
            if (!value) return '—'
            const tenNhom = nhomDoiTacMap.get(value)
            return React.createElement('span', {}, tenNhom || String(value))
          },
        }
      }
      return cot
    })
  }, [nguoiDungMap, nhomDoiTacMap])

  // Sync activeTab với URL
  useEffect(() => {
    setActiveTab(currentTabFromUrl)
  }, [currentTabFromUrl])
  
  // Handler khi chuyển tab - navigate đến URL mới
  const handleTabChange = (newTab: TabType) => {
    const tabPath = newTab === 'khach_hang' ? 'khach-hang' : 'nha-cung-cap'
    navigate(`/doi-tac/danh-sach-${tabPath}`)
  }

  const handleXoa = async (doiTac: DoiTac) => {
    try {
      setDeletingId(doiTac.id)
      await deleteDoiTac.mutateAsync(doiTac.id)
      toast.success('Xóa đối tác thành công')
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa đối tác này'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState<DoiTac[]>([])

  const handleXoaNhieu = async (selectedRows: DoiTac[]) => {
    setSelectedRowsForDelete(selectedRows)
    setBulkDeleteOpen(true)
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRowsForDelete.map((doiTac) => deleteDoiTac.mutateAsync(doiTac.id))
      )
      toast.success(`Đã xóa ${selectedRowsForDelete.length} đối tác thành công`)
      setBulkDeleteOpen(false)
      setSelectedRowsForDelete([])
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa các đối tác này'}`)
    }
  }

  // Hành động cho mỗi row - chỉ Sửa và Xóa (icon only)
  const hanhDongItems = [
    {
      label: 'Chỉnh sửa',
      icon: Pencil,
      onClick: (row: DoiTac) => onEdit(row.id),
      variant: 'default' as const,
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: handleXoa,
      variant: 'destructive' as const,
      hidden: (row: DoiTac) => deletingId === row.id, // Ẩn khi đang xóa
      requiresConfirm: true,
      confirmTitle: 'Xác nhận xóa đối tác',
      confirmDescription: (row: DoiTac) =>
        `Bạn có chắc chắn muốn xóa đối tác "${row.ten}"? Hành động này không thể hoàn tác.`,
    },
  ]

  // Thao tác hàng loạt
  const bulkActions = getBulkActions({ onBulkDelete: handleXoaNhieu })

  // Tạo quickFilters với Trạng thái và Người tạo (hỗ trợ multi-select)
  const quickFilters: QuickFilter[] = useMemo(() => {
    const filters: QuickFilter[] = [
      {
        key: 'trang_thai',
        label: 'Trạng thái',
        type: 'boolean',
        multiSelect: true, // Cho phép chọn nhiều trạng thái
        options: [
          { value: true, label: 'Hoạt động' },
          { value: false, label: 'Vô hiệu hóa' },
        ],
      },
    ]

    // Thêm filter Người tạo nếu có danh sách người dùng
    if (danhSachNguoiDung && danhSachNguoiDung.length > 0) {
      filters.push({
        key: 'nguoi_tao_id',
        label: 'Người tạo',
        type: 'select',
        multiSelect: true, // Cho phép chọn nhiều người tạo
        options: danhSachNguoiDung.map((nd) => ({
          value: nd.id,
          label: nd.ho_ten || nd.email || 'N/A',
        })),
      })
    }

    // Thêm filter Nhóm đối tác nếu có danh sách nhóm đối tác
    if (danhSachNhomDoiTac && danhSachNhomDoiTac.length > 0) {
      filters.push({
        key: 'nhom_doi_tac_id',
        label: 'Nhóm đối tác',
        type: 'select',
        multiSelect: true,
        options: danhSachNhomDoiTac.map((nhom: any) => ({
          value: nhom.id,
          label: nhom.ten,
        })),
      })
    }

    return filters
  }, [danhSachNguoiDung, danhSachNhomDoiTac])

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Tab Navigation - Shadcn UI Style */}
        <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as TabType)} className="w-full flex flex-col h-full overflow-hidden">
          <TabsList className="grid w-full max-w-xs grid-cols-2 mb-4 flex-shrink-0">
            <TabsTrigger value="nha_cung_cap">Nhà cung cấp</TabsTrigger>
            <TabsTrigger value="khach_hang">Khách hàng</TabsTrigger>
          </TabsList>

          {/* Tab Content - Chỉ render content của tab hiện tại */}
          <TabsContent value={activeTab} className="mt-0 flex-1 min-h-0 overflow-hidden">
            <GenericListView<DoiTac>
              data={danhSach || []}
              cotHienThi={cotHienThiWithMaps}
              hanhDongItems={hanhDongItems}
              bulkActions={bulkActions}
              quickFilters={quickFilters}
              isLoading={isLoading}
              error={error}
              onRefresh={() => refetch()}
              onAddNew={() => onAddNew()}
              onRowClick={(row) => onView?.(row.id)}
              tenLuuTru={`${TEN_LUU_TRU_COT}-${activeTab}`}
              onXuatExcel={handleXuatExcel}
              onNhapExcel={handleNhapExcel}
              timKiemPlaceholder="Tìm kiếm theo mã, tên, email, điện thoại..."
              onTimKiem={() => {}} // GenericListView sẽ tự filter dữ liệu
              enableRowSelection={true}
              pageSize={50}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={confirmBulkDelete}
        title="Xác nhận xóa nhiều đối tác"
        description={`Bạn có chắc chắn muốn xóa ${selectedRowsForDelete.length} đối tác đã chọn? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
      />
    </>
  )
}

