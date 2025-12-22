import { useEffect } from 'react'
import { useDoiTacById, useDeleteDoiTac } from '../hooks/use-doi-tac'
import { useNguoiDungById } from '@/features/thiet-lap/nguoi-dung'
import { useNhomDoiTacById } from '@/features/doi-tac/nhom-doi-tac'
import { GenericDetailView, DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import { useBreadcrumb } from '@/components/layout/breadcrumb-context'
import type { DoiTac } from '@/types/doi-tac'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { Badge } from '@/components/ui/badge'

interface DoiTacDetailViewProps {
  id: string
  onEdit: () => void
  onDelete?: () => void
  onBack: () => void
}

/**
 * DoiTacDetailView component - Hiển thị chi tiết đối tác
 */
export function DoiTacDetailView({
  id,
  onEdit,
  onDelete,
  onBack,
}: DoiTacDetailViewProps) {
  const { data: doiTac, isLoading, error } = useDoiTacById(id)
  const { data: nguoiTao } = useNguoiDungById(doiTac?.nguoi_tao_id || null)
  const { data: nhomDoiTac } = useNhomDoiTacById(doiTac?.nhom_doi_tac_id || null)
  const { setDetailLabel } = useBreadcrumb()
  const deleteDoiTac = useDeleteDoiTac()

  const handleDelete = async () => {
    try {
      await deleteDoiTac.mutateAsync(id)
      toast.success('Xóa đối tác thành công')
      onDelete?.()
      if (!onDelete) {
        onBack()
      }
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa đối tác này'}`)
    }
  }

  // Update breadcrumb với title của đối tác
  useEffect(() => {
    if (doiTac?.ten) {
      setDetailLabel(doiTac.ten)
    }
    return () => {
      setDetailLabel(null)
    }
  }, [doiTac?.ten, setDetailLabel])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (error || !doiTac) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">
          Lỗi: {error?.message || 'Không tìm thấy đối tác'}
        </div>
      </div>
    )
  }

  const fieldGroups: DetailFieldGroup<DoiTac>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ma',
          label: 'Mã đối tác',
          accessor: 'ma',
        },
        {
          key: 'ten',
          label: 'Tên đối tác',
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
          key: 'nhom_doi_tac_id',
          label: 'Nhóm đối tác',
          accessor: 'nhom_doi_tac_id',
          render: () => {
            if (!doiTac?.nhom_doi_tac_id) return <span className="text-muted-foreground">—</span>
            if (nhomDoiTac) {
              return <span>{nhomDoiTac.ten}</span>
            }
            return <span className="text-muted-foreground">Đang tải...</span>
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
      title: 'Thông tin liên hệ',
      fields: [
        {
          key: 'email',
          label: 'Email',
          accessor: 'email',
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'dien_thoai',
          label: 'Điện thoại',
          accessor: 'dien_thoai',
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'dia_chi',
          label: 'Địa chỉ',
          accessor: 'dia_chi',
          span: 3,
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
      ],
    },
    {
      title: 'Thông tin khác',
      fields: [
        {
          key: 'ma_so_thue',
          label: 'Mã số thuế',
          accessor: 'ma_so_thue',
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'nguoi_lien_he',
          label: 'Người liên hệ',
          accessor: 'nguoi_lien_he',
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'ghi_chu',
          label: 'Ghi chú',
          accessor: 'ghi_chu',
          span: 3,
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'nguoi_tao_id',
          label: 'Người tạo',
          accessor: 'nguoi_tao_id',
          render: () => {
            if (!doiTac?.nguoi_tao_id) return <span className="text-muted-foreground">—</span>
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
    <GenericDetailView<DoiTac>
      data={doiTac}
      groups={fieldGroups}
      onEdit={onEdit}
      onDelete={handleDelete}
      onBack={onBack}
      title="Chi tiết đối tác"
      deleteConfirmTitle="Xác nhận xóa đối tác"
      deleteConfirmDescription={`Bạn có chắc chắn muốn xóa đối tác "${doiTac.ten}"? Hành động này không thể hoàn tác.`}
    />
  )
}

