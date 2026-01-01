import { useState, useEffect, useMemo } from 'react'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GenericListView } from '@/shared/components/generic/generic-list-view'
import { ConfirmDeleteDialog } from '@/shared/components/generic/confirm-delete-dialog'
import type { QuickFilter } from '@/shared/components/generic/types'
import { useNhomDoiTacList, useDeleteNhomDoiTac } from '../hooks/use-nhom-doi-tac'
import { useNguoiDungList } from '@/features/thiet-lap/nguoi-dung'
import { COT_HIEN_THI, TEN_LUU_TRU_COT, TabType } from '../config'
import { getBulkActions, handleXuatExcel, handleNhapExcel } from '../actions'
import type { NhomDoiTac } from '@/types/nhom-doi-tac'
import { Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface NhomDoiTacListViewProps {
  onEdit: (id: number) => void
  onAddNew: () => void
  onView?: (id: number) => void
  defaultTab?: TabType
  hideTabs?: boolean // Ẩn tab group khi được gọi từ module wrapper
}

/**
 * NhomDoiTacListView component - Sử dụng GenericListView với 2 tabs
 */
export function NhomDoiTacListView({
  onEdit,
  onAddNew,
  onView,
  defaultTab,
  hideTabs = false,
}: NhomDoiTacListViewProps) {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Detect tab từ URL
  const pathParts = location.pathname.split('/').filter(Boolean)
  const modulePath = pathParts[1] || '' // 'nhom-khach-hang', 'nhom-nha-cung-cap', etc.
  
  // Xác định tab từ URL
  let currentTabFromUrl: TabType = 'nha_cung_cap'
  if (modulePath.includes('khach-hang')) {
    currentTabFromUrl = 'khach_hang'
  } else if (modulePath.includes('nha-cung-cap')) {
    currentTabFromUrl = 'nha_cung_cap'
  }
  
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab || currentTabFromUrl)
  const { data: danhSach, isLoading, error, refetch } = useNhomDoiTacList(activeTab)
  const { data: danhSachNguoiDung } = useNguoiDungList()
  const deleteNhomDoiTac = useDeleteNhomDoiTac()
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Tạo map để tra cứu tên người dùng nhanh
  const nguoiDungMap = useMemo(() => {
    if (!danhSachNguoiDung) return new Map<string | number, string>()
    return new Map(
      danhSachNguoiDung.map((nd) => [
        nd.id,
        nd.ho_va_ten || nd.ho_ten || nd.email || 'N/A',
      ])
    )
  }, [danhSachNguoiDung])

  // Cập nhật cột hiển thị để map tên người tạo
  const cotHienThiWithNguoiTao = useMemo(() => {
    return COT_HIEN_THI.map((cot) => {
      if (cot.key === 'nguoi_tao_id') {
        return {
          ...cot,
          cell: (value: number | string | null) => {
            if (!value) return '—'
            const tenNguoiTao = nguoiDungMap.get(typeof value === 'string' ? value : Number(value))
            return React.createElement('span', {}, tenNguoiTao || String(value))
          },
        }
      }
      return cot
    })
  }, [nguoiDungMap])

  // Sync activeTab với URL
  useEffect(() => {
    setActiveTab(currentTabFromUrl)
  }, [currentTabFromUrl])
  
  // Handler khi chuyển tab - navigate đến URL mới
  const handleTabChange = (newTab: TabType) => {
    if (hideTabs) return // Không navigate nếu đang ẩn tabs
    const tabPath = newTab === 'khach_hang' ? 'nhom-khach-hang' : 'nhom-nha-cung-cap'
    navigate(`/doi-tac/${tabPath}`)
  }

  const handleXoa = async (nhomDoiTac: NhomDoiTac) => {
    try {
      setDeletingId(nhomDoiTac.id)
      await deleteNhomDoiTac.mutateAsync(String(nhomDoiTac.id))
      toast.success('Xóa nhóm đối tác thành công')
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa nhóm đối tác này'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [selectedRowsForDelete, setSelectedRowsForDelete] = useState<NhomDoiTac[]>([])

  const handleXoaNhieu = async (selectedRows: NhomDoiTac[]) => {
    setSelectedRowsForDelete(selectedRows)
    setBulkDeleteOpen(true)
  }

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedRowsForDelete.map((nhomDoiTac) => deleteNhomDoiTac.mutateAsync(String(nhomDoiTac.id)))
      )
      toast.success(`Đã xóa ${selectedRowsForDelete.length} nhóm đối tác thành công`)
      setBulkDeleteOpen(false)
      setSelectedRowsForDelete([])
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa các nhóm đối tác này'}`)
    }
  }

  // Hành động cho mỗi row - chỉ Sửa và Xóa (icon only)
  const hanhDongItems = [
    {
      label: 'Chỉnh sửa',
      icon: Edit2,
      onClick: (row: NhomDoiTac) => onEdit(row.id),
      variant: 'default' as const,
    },
    {
      label: 'Xóa',
      icon: Trash2,
      onClick: handleXoa,
      variant: 'destructive' as const,
      hidden: (row: NhomDoiTac) => deletingId === row.id, // Ẩn khi đang xóa
      requiresConfirm: true,
      confirmTitle: 'Xác nhận xóa nhóm đối tác',
      confirmDescription: (row: NhomDoiTac) =>
        `Bạn có chắc chắn muốn xóa nhóm đối tác "${row.ten_nhom || ''}"? Hành động này không thể hoàn tác.`,
    },
  ]

  // Thao tác hàng loạt
  const bulkActions = getBulkActions({ onBulkDelete: handleXoaNhieu })

  // Filter columns - Ẩn cột "Loại" vì đã có tab phân biệt
  const filteredCotHienThi = cotHienThiWithNguoiTao.filter((cot) => cot.key !== 'hang_muc')

  // Tạo quickFilters với Người tạo (hỗ trợ multi-select)
  const quickFilters: QuickFilter[] = useMemo(() => {
    const filters: QuickFilter[] = []

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

    return filters
  }, [danhSachNguoiDung])

  // Nếu hideTabs = true, chỉ render GenericListView không có tabs
  if (hideTabs) {
    return (
      <>
        <div className="flex flex-col h-full min-h-0 overflow-hidden">
          <GenericListView<NhomDoiTac>
            data={danhSach || []}
            cotHienThi={filteredCotHienThi}
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
            timKiemPlaceholder="Tìm kiếm theo tên, mô tả..."
            onTimKiem={() => {}} // GenericListView sẽ tự filter dữ liệu
            enableRowSelection={true}
            pageSize={50}
          />
        </div>
        <ConfirmDeleteDialog
          open={bulkDeleteOpen}
          onOpenChange={setBulkDeleteOpen}
          onConfirm={confirmBulkDelete}
          title="Xác nhận xóa nhiều nhóm đối tác"
          description={`Bạn có chắc chắn muốn xóa ${selectedRowsForDelete.length} nhóm đối tác đã chọn? Hành động này không thể hoàn tác.`}
          confirmLabel="Xóa"
          cancelLabel="Hủy"
        />
      </>
    )
  }

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
            <GenericListView<NhomDoiTac>
              data={danhSach || []}
              cotHienThi={filteredCotHienThi}
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
              timKiemPlaceholder="Tìm kiếm theo tên, mô tả..."
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
        title="Xác nhận xóa nhiều nhóm đối tác"
        description={`Bạn có chắc chắn muốn xóa ${selectedRowsForDelete.length} nhóm đối tác đã chọn? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
      />
    </>
  )
}

