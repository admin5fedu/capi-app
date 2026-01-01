import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVaiTroById, useDeleteVaiTro } from '../hooks/use-vai-tro'
import { GenericDetailView, DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import { RelatedDataSection } from '@/shared/components/generic/related-data-section'
import { useBreadcrumb } from '@/components/layout/breadcrumb-context'
import { useNguoiDungByVaiTroId, useXoaNguoiDung } from '@/features/thiet-lap/nguoi-dung/hooks/use-nguoi-dung'
import { COT_HIEN_THI } from '@/features/thiet-lap/nguoi-dung/config'
import { NguoiDungDetailView, NguoiDungFormView } from '@/features/thiet-lap/nguoi-dung/components'
import type { VaiTro } from '@/types/vai-tro'
import type { NguoiDung } from '@/types/nguoi-dung'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { toast } from 'sonner'

interface VaiTroDetailViewProps {
  id: string
  onEdit: () => void
  onDelete?: () => void // Callback sau khi xóa thành công
  onBack: () => void
}

/**
 * VaiTroDetailView component - Hiển thị chi tiết vai trò
 */
export function VaiTroDetailView({ id, onEdit, onDelete, onBack }: VaiTroDetailViewProps) {
  const navigate = useNavigate()
  const { data: vaiTro, isLoading, error } = useVaiTroById(id)
  const { data: nguoiDungList, isLoading: isLoadingNguoiDung, refetch: refetchNguoiDung } = useNguoiDungByVaiTroId(id)
  const { setDetailLabel } = useBreadcrumb()
  const deleteVaiTro = useDeleteVaiTro()
  const deleteNguoiDung = useXoaNguoiDung()

  // Filter COT_HIEN_THI để bỏ cột vai_tro (vì đang xem trong vai trò)
  const cotHienThiNguoiDung = COT_HIEN_THI.filter((cot) => cot.key !== 'vai_tro')

  const handleDelete = async () => {
    try {
      await deleteVaiTro.mutateAsync(id)
      toast.success('Xóa vai trò thành công')
      onDelete?.() // Callback để module xử lý (ví dụ: quay lại list)
      if (!onDelete) {
        onBack() // Nếu không có callback, quay lại list
      }
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa vai trò này'}`)
    }
  }

  // Update breadcrumb với title của vai trò
  useEffect(() => {
    if (vaiTro?.ten_vai_tro || vaiTro?.ten) {
      setDetailLabel(vaiTro.ten_vai_tro || vaiTro.ten || '')
    }
    // Cleanup khi unmount
    return () => {
      setDetailLabel(null)
    }
  }, [vaiTro?.ten_vai_tro, vaiTro?.ten, setDetailLabel])

  // Định nghĩa các nhóm fields
  const fieldGroups: DetailFieldGroup<VaiTro>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ten_vai_tro',
          label: 'Tên vai trò',
          accessor: (data: VaiTro) => data.ten_vai_tro || data.ten || '—',
        },
        {
          key: 'mo_ta',
          label: 'Mô tả',
          accessor: 'mo_ta',
          span: 3,
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
      ],
    },
    {
      title: 'Thông tin hệ thống',
      fields: [
        {
          key: 'tg_tao',
          label: 'Ngày tạo',
          accessor: (data: VaiTro) => data.tg_tao || data.created_at || null,
          render: (value) => {
            if (!value) return <span className="text-muted-foreground">—</span>
            return dayjs(value).locale('vi').format('DD/MM/YYYY HH:mm')
          },
        },
        {
          key: 'tg_cap_nhat',
          label: 'Ngày cập nhật',
          accessor: (data: VaiTro) => data.tg_cap_nhat || data.updated_at || null,
          render: (value) => {
            if (!value) return <span className="text-muted-foreground">—</span>
            return dayjs(value).locale('vi').format('DD/MM/YYYY HH:mm')
          },
        },
      ],
    },
  ]

  // Handlers cho related data section
  const handleAddNguoiDung = () => {
    // Không cần làm gì, formViewComponent sẽ xử lý
  }

  const handleDeleteNguoiDung = async (nguoiDung: NguoiDung) => {
    try {
      await deleteNguoiDung.mutateAsync(String(nguoiDung.id))
      toast.success('Xóa người dùng thành công')
      refetchNguoiDung()
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa người dùng này'}`)
    }
  }

  const handleViewNguoiDung = () => {
    // Xem trong popup - không cần làm gì, RelatedDataSection sẽ xử lý
  }

  const handleNavigateToNguoiDungDetail = (nguoiDung: NguoiDung) => {
    navigate(`/thiet-lap/nguoi-dung/${nguoiDung.id}`)
  }

  // Render section danh sách người dùng
  const renderNguoiDungSection = () => {
    return (
      <RelatedDataSection<NguoiDung>
        title="Người dùng"
        data={nguoiDungList}
        isLoading={isLoadingNguoiDung}
        emptyMessage="Chưa có người dùng nào được gán vai trò này"
        cotHienThi={cotHienThiNguoiDung}
        onAdd={handleAddNguoiDung}
        onDelete={handleDeleteNguoiDung}
        onView={handleViewNguoiDung}
        onNavigateToDetail={handleNavigateToNguoiDungDetail}
        detailViewComponent={({ id, onClose, onEdit }) => (
          <NguoiDungDetailView
            id={id}
            onEdit={onEdit ? () => onEdit(id) : () => {}}
            onDelete={() => {
              refetchNguoiDung()
              onClose()
            }}
            onBack={onClose}
          />
        )}
        formViewComponent={({ onClose, onComplete, initialData }) => {
          // Tạo wrapper component để sử dụng NguoiDungFormView trong popup
          // Truyền vai_tro_id vào initialData
          return (
            <NguoiDungFormView
              editId={null}
              onComplete={() => {
                refetchNguoiDung()
                onComplete()
                onClose()
              }}
              onCancel={onClose}
              mode="modal"
              initialData={{
                vai_tro_id: id != null ? (typeof id === 'string' ? id : String(id)) : undefined, // Tự động set vai_tro_id từ vai trò hiện tại
                ...(initialData && {
                  ...initialData,
                  avatar_url: initialData.avatar_url ?? undefined,
                }),
              } as any}
            />
          )
        }}
        editFormComponent={({ id, onClose, onComplete }) => {
          // Edit form trong popup - quay về popup DetailView sau khi hoàn thành
          return (
            <NguoiDungFormView
              editId={id}
              onComplete={() => {
                refetchNguoiDung()
                onComplete()
                onClose()
              }}
              onCancel={onClose}
              mode="modal"
            />
          )
        }}
        navigatePreferenceKey="vai-tro-navigate-to-nguoi-dung"
      />
    )
  }

  return (
    <GenericDetailView<VaiTro>
      data={vaiTro || null}
      isLoading={isLoading}
      error={error || null}
      title={(data) => data.ten_vai_tro || data.ten || ''}
      onEdit={onEdit}
      onDelete={handleDelete}
      onBack={onBack}
      groups={fieldGroups}
      renderSections={renderNguoiDungSection}
      emptyMessage="Không tìm thấy vai trò"
      deleteConfirmTitle="Xác nhận xóa vai trò"
      deleteConfirmDescription={
        vaiTro
          ? `Bạn có chắc chắn muốn xóa vai trò "${vaiTro.ten_vai_tro || vaiTro.ten}"? Hành động này không thể hoàn tác.`
          : 'Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể hoàn tác.'
      }
    />
  )
}

