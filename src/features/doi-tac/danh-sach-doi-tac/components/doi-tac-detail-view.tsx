import { useEffect } from 'react'
import { useDoiTacById, useDeleteDoiTac } from '../hooks/use-doi-tac'
import { useNguoiDungById } from '@/features/thiet-lap/nguoi-dung'
import { useNhomDoiTacById } from '@/features/doi-tac/nhom-doi-tac/hooks'
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
  const { data: nguoiTao } = useNguoiDungById(
    doiTac?.nguoi_tao_id ? String(doiTac.nguoi_tao_id) : null
  )
  const { data: nhomDoiTac } = useNhomDoiTacById(
    doiTac?.nhom_doi_tac_id ? String(doiTac.nhom_doi_tac_id) : null
  )
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
    if (doiTac?.ten_doi_tac) {
      setDetailLabel(doiTac.ten_doi_tac)
    }
    return () => {
      setDetailLabel(null)
    }
  }, [doiTac?.ten_doi_tac, setDetailLabel])

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

  // Xác định label cho nhóm đối tác dựa trên loại
  const nhomLabel = doiTac?.hang_muc === 'khach_hang' ? 'Nhóm khách hàng' : 'Nhóm nhà cung cấp'

  const fieldGroups: DetailFieldGroup<DoiTac>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ten_doi_tac',
          label: 'Tên đối tác',
          accessor: 'ten_doi_tac',
        },
        {
          key: 'cong_ty',
          label: 'Công ty',
          accessor: 'cong_ty',
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'hang_muc',
          label: 'Loại đối tác',
          accessor: 'hang_muc',
          render: (value) => {
            if (!value) return <span className="text-muted-foreground">—</span>
            const label = value === 'nha_cung_cap' ? 'Nhà cung cấp' : 'Khách hàng'
            const variant = value === 'nha_cung_cap' ? 'default' : 'secondary'
            return <Badge variant={variant}>{label}</Badge>
          },
        },
        {
          key: 'ten_nhom_doi_tac',
          label: nhomLabel,
          accessor: 'ten_nhom_doi_tac',
          render: () => {
            if (!doiTac?.nhom_doi_tac_id) return <span className="text-muted-foreground">—</span>
            if (doiTac.ten_nhom_doi_tac) {
              return <span>{doiTac.ten_nhom_doi_tac}</span>
            }
            if (nhomDoiTac) {
              return <span>{nhomDoiTac.ten_nhom || String(nhomDoiTac.id)}</span>
            }
            return <span className="text-muted-foreground">Đang tải...</span>
          },
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
          key: 'so_dien_thoai',
          label: 'Số điện thoại',
          accessor: 'so_dien_thoai',
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
          key: 'thong_tin_khac',
          label: 'Thông tin khác',
          accessor: 'thong_tin_khac',
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
              return <span>{nguoiTao.ho_va_ten || nguoiTao.ho_ten || nguoiTao.email}</span>
            }
            return <span className="text-muted-foreground">Đang tải...</span>
          },
        },
        {
          key: 'tg_tao',
          label: 'Ngày tạo',
          accessor: (data: any) => data.tg_tao || data.created_at || null,
          render: (value) => {
            if (!value) return '—'
            return dayjs(value).locale('vi').format('DD/MM/YYYY HH:mm')
          },
        },
        {
          key: 'tg_cap_nhat',
          label: 'Ngày cập nhật',
          accessor: (data: any) => data.tg_cap_nhat || data.updated_at || null,
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
      deleteConfirmDescription={`Bạn có chắc chắn muốn xóa đối tác "${doiTac.ten_doi_tac || ''}"? Hành động này không thể hoàn tác.`}
    />
  )
}

