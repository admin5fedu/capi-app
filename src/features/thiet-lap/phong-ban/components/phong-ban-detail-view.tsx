import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePhongBanById, useDeletePhongBan } from '../hooks/use-phong-ban'
import { GenericDetailView, DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import { RelatedDataSection } from '@/shared/components/generic/related-data-section'
import { useBreadcrumb } from '@/components/layout/breadcrumb-context'
import { useNguoiDungByPhongBanId, useXoaNguoiDung } from '@/features/thiet-lap/nguoi-dung/hooks/use-nguoi-dung'
import { COT_HIEN_THI } from '@/features/thiet-lap/nguoi-dung/config'
import { NguoiDungDetailView, NguoiDungFormView } from '@/features/thiet-lap/nguoi-dung/components'
import type { PhongBan } from '@/types/phong-ban'
import type { NguoiDung } from '@/types/nguoi-dung'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { toast } from 'sonner'

interface PhongBanDetailViewProps {
  id: string
  onEdit: () => void
  onDelete?: () => void // Callback sau khi xóa thành công
  onBack: () => void
}

/**
 * PhongBanDetailView component - Hiển thị chi tiết phòng ban
 */
export function PhongBanDetailView({ id, onEdit, onDelete, onBack }: PhongBanDetailViewProps) {
  const navigate = useNavigate()
  const { data: phongBan, isLoading, error } = usePhongBanById(id)
  const { data: nguoiDungList, isLoading: isLoadingNguoiDung, refetch: refetchNguoiDung } = useNguoiDungByPhongBanId(id)
  const { setDetailLabel } = useBreadcrumb()
  const deletePhongBan = useDeletePhongBan()
  const deleteNguoiDung = useXoaNguoiDung()

  // Filter COT_HIEN_THI để bỏ cột phong_ban (vì đang xem trong phòng ban)
  const cotHienThiNguoiDung = COT_HIEN_THI.filter((cot) => cot.key !== 'phong_ban')

  const handleDelete = async () => {
    try {
      await deletePhongBan.mutateAsync(id)
      toast.success('Xóa phòng ban thành công')
      onDelete?.() // Callback để module xử lý (ví dụ: quay lại list)
      if (!onDelete) {
        onBack() // Nếu không có callback, quay lại list
      }
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa phòng ban này'}`)
    }
  }

  // Update breadcrumb với title của phòng ban
  useEffect(() => {
    if (phongBan?.ten_phong_ban) {
      setDetailLabel(phongBan.ten_phong_ban)
    }
    // Cleanup khi unmount
    return () => {
      setDetailLabel(null)
    }
  }, [phongBan?.ten_phong_ban, setDetailLabel])

  // Định nghĩa các nhóm fields
  const fieldGroups: DetailFieldGroup<PhongBan>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ma_phong_ban',
          label: 'Mã phòng ban',
          accessor: 'ma_phong_ban',
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'ten_phong_ban',
          label: 'Tên phòng ban',
          accessor: 'ten_phong_ban',
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
          accessor: (data: PhongBan) => data.tg_tao || data.created_at || null,
          render: (value) => {
            if (!value) return <span className="text-muted-foreground">—</span>
            return dayjs(value).locale('vi').format('DD/MM/YYYY HH:mm')
          },
        },
        {
          key: 'tg_cap_nhat',
          label: 'Ngày cập nhật',
          accessor: (data: PhongBan) => data.tg_cap_nhat || data.updated_at || null,
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
      await deleteNguoiDung.mutateAsync(nguoiDung.id)
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
        emptyMessage="Chưa có người dùng nào thuộc phòng ban này"
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
          // Truyền phong_ban_id vào initialData
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
                phong_ban_id: Number(id) || null, // Tự động set phong_ban_id từ phòng ban hiện tại
                ...(initialData && {
                  ...initialData,
                  avatar_url: initialData.avatar_url ?? undefined,
                }),
              }}
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
        navigatePreferenceKey="phong-ban-navigate-to-nguoi-dung"
      />
    )
  }

  return (
    <GenericDetailView<PhongBan>
      data={phongBan || null}
      isLoading={isLoading}
      error={error || null}
      title={(data) => data.ten_phong_ban || ''}
      onEdit={onEdit}
      onDelete={handleDelete}
      onBack={onBack}
      groups={fieldGroups}
      renderSections={renderNguoiDungSection}
      emptyMessage="Không tìm thấy phòng ban"
      deleteConfirmTitle="Xác nhận xóa phòng ban"
      deleteConfirmDescription={
        phongBan
          ? `Bạn có chắc chắn muốn xóa phòng ban "${phongBan.ten_phong_ban}"? Hành động này không thể hoàn tác.`
          : 'Bạn có chắc chắn muốn xóa phòng ban này? Hành động này không thể hoàn tác.'
      }
    />
  )
}

