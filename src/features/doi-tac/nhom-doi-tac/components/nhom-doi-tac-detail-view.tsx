import { useEffect } from 'react'
import { useNhomDoiTacById, useDeleteNhomDoiTac } from '../hooks/use-nhom-doi-tac'
import { useNguoiDungById } from '@/features/thiet-lap/nguoi-dung'
import { GenericDetailView, DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import { useBreadcrumb } from '@/components/layout/breadcrumb-context'
import type { NhomDoiTac } from '@/types/nhom-doi-tac'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { Badge } from '@/components/ui/badge'

interface NhomDoiTacDetailViewProps {
  id: string
  onEdit: () => void
  onDelete?: () => void
  onBack: () => void
}

/**
 * NhomDoiTacDetailView component - Hiển thị chi tiết nhóm đối tác
 */
export function NhomDoiTacDetailView({
  id,
  onEdit,
  onDelete,
  onBack,
}: NhomDoiTacDetailViewProps) {
  const { data: nhomDoiTac, isLoading, error } = useNhomDoiTacById(id)
  const { data: nguoiTao } = useNguoiDungById(nhomDoiTac?.nguoi_tao_id || null)
  const { setDetailLabel } = useBreadcrumb()
  const deleteNhomDoiTac = useDeleteNhomDoiTac()

  const handleDelete = async () => {
    try {
      await deleteNhomDoiTac.mutateAsync(id)
      toast.success('Xóa nhóm đối tác thành công')
      onDelete?.()
      if (!onDelete) {
        onBack()
      }
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa nhóm đối tác này'}`)
    }
  }

  // Update breadcrumb với title của nhóm đối tác
  useEffect(() => {
    if (nhomDoiTac?.ten) {
      setDetailLabel(nhomDoiTac.ten)
    }
    return () => {
      setDetailLabel(null)
    }
  }, [nhomDoiTac?.ten, setDetailLabel])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (error || !nhomDoiTac) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">
          Lỗi: {error?.message || 'Không tìm thấy nhóm đối tác'}
        </div>
      </div>
    )
  }

  const fieldGroups: DetailFieldGroup<NhomDoiTac>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ten',
          label: 'Tên nhóm',
          accessor: 'ten',
        },
        {
          key: 'loai',
          label: 'Loại đối tác',
          accessor: 'loai',
          render: (value) => {
            const label = value === 'nha_cung_cap' ? 'Nhà cung cấp' : 'Khách hàng'
            const variant = value === 'nha_cung_cap' ? 'default' : 'secondary'
            return <Badge variant={variant}>{label}</Badge>
          },
        },
        {
          key: 'trang_thai',
          label: 'Trạng thái',
          accessor: 'trang_thai',
          render: (value) => (
            <Badge variant={value ? 'default' : 'destructive'}>
              {value ? 'Hoạt động' : 'Vô hiệu hóa'}
            </Badge>
          ),
        },
      ],
    },
    {
      title: 'Thông tin khác',
      fields: [
        {
          key: 'mo_ta',
          label: 'Mô tả',
          accessor: 'mo_ta',
          span: 3,
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'nguoi_tao_id',
          label: 'Người tạo',
          accessor: 'nguoi_tao_id',
          render: () => {
            if (!nhomDoiTac?.nguoi_tao_id) return <span className="text-muted-foreground">—</span>
            if (nguoiTao) {
              return <span>{nguoiTao.ho_ten || nguoiTao.email}</span>
            }
            return <span className="text-muted-foreground">Đang tải...</span>
          },
        },
        {
          key: 'created_at',
          label: 'Ngày tạo',
          accessor: 'created_at',
          render: (value) => {
            if (!value) return '—'
            return dayjs(value).locale('vi').format('DD/MM/YYYY HH:mm')
          },
        },
        {
          key: 'updated_at',
          label: 'Ngày cập nhật',
          accessor: 'updated_at',
          render: (value) => {
            if (!value) return '—'
            return dayjs(value).locale('vi').format('DD/MM/YYYY HH:mm')
          },
        },
      ],
    },
  ]

  return (
    <GenericDetailView<NhomDoiTac>
      data={nhomDoiTac}
      groups={fieldGroups}
      onEdit={onEdit}
      onDelete={handleDelete}
      onBack={onBack}
      title="Chi tiết nhóm đối tác"
      deleteConfirmTitle="Xác nhận xóa nhóm đối tác"
      deleteConfirmDescription={`Bạn có chắc chắn muốn xóa nhóm đối tác "${nhomDoiTac.ten}"? Hành động này không thể hoàn tác.`}
    />
  )
}

