import { useEffect } from 'react'
import { useGiaoDichById, useDeleteGiaoDich } from '../hooks/use-giao-dich'
import { GenericDetailView, DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import { useBreadcrumb } from '@/components/layout/breadcrumb-context'
// LOAI_GIAO_DICH không còn cần thiết trong detail view
import type { GiaoDichWithRelations } from '@/types/giao-dich'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { getHangMucBadgeVariant } from '../config'

interface GiaoDichDetailViewProps {
  id: number
  onEdit: () => void
  onDelete?: () => void
  onBack: () => void
}

/**
 * GiaoDichDetailView component - Hiển thị chi tiết giao dịch
 */
export function GiaoDichDetailView({
  id,
  onEdit,
  onDelete,
  onBack,
}: GiaoDichDetailViewProps) {
  const { data: giaoDich, isLoading, error } = useGiaoDichById(id)
  const { setDetailLabel } = useBreadcrumb()
  const deleteGiaoDich = useDeleteGiaoDich()

  const handleDelete = async () => {
    try {
      await deleteGiaoDich.mutateAsync(id)
      toast.success('Xóa giao dịch thành công')
      onDelete?.()
      if (!onDelete) {
        onBack()
      }
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa giao dịch này'}`)
    }
  }

  useEffect(() => {
    if (giaoDich?.hang_muc || giaoDich?.loai) {
      setDetailLabel(giaoDich.hang_muc || giaoDich.loai || 'Giao dịch')
    }
    return () => {
      setDetailLabel(null)
    }
  }, [giaoDich?.hang_muc, giaoDich?.loai, setDetailLabel])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (error || !giaoDich) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">
          Lỗi: {error?.message || 'Không tìm thấy giao dịch'}
        </div>
      </div>
    )
  }

  const fieldGroups: DetailFieldGroup<GiaoDichWithRelations>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ngay',
          label: 'Ngày',
          accessor: 'ngay',
          render: (value) => {
            if (!value) return '—'
            return new Date(value).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          },
        },
        {
          key: 'hang_muc',
          label: 'Hạng mục',
          accessor: (data) => data.hang_muc || data.loai || null,
          render: (value) => {
            if (!value) return '—'
            return <Badge variant={getHangMucBadgeVariant(value)}>{value}</Badge>
          },
        },
        {
          key: 'ten_danh_muc',
          label: 'Danh mục',
          accessor: (data) => data.ten_danh_muc || data.danh_muc?.ten_danh_muc || data.danh_muc?.ten || null,
          render: (value) => value || '—',
        },
        {
          key: 'mo_ta',
          label: 'Mô tả',
          accessor: 'mo_ta',
        },
      ],
    },
    {
      title: 'Thông tin tài chính',
      fields: [
        {
          key: 'so_tien',
          label: 'Số tiền',
          accessor: 'so_tien',
          render: (value) => {
            const donVi =
              giaoDich.tai_khoan_den?.don_vi || giaoDich.tai_khoan_di?.don_vi || 
              giaoDich.tai_khoan_den?.loai_tien || giaoDich.tai_khoan?.loai_tien || 'VND'
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: donVi === 'USD' ? 'USD' : 'VND',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(value || 0))
          },
        },
        {
          key: 'so_ty_gia',
          label: 'Tỷ giá',
          accessor: (data) => data.so_ty_gia || data.ty_gia?.ty_gia || null,
          render: (value) => {
            if (value === null || value === undefined) return '—'
            return new Intl.NumberFormat('vi-VN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            }).format(Number(value))
          },
        },
        {
          key: 'so_tien_quy_doi',
          label: 'Số tiền quy đổi',
          accessor: (data) => data.so_tien_quy_doi || data.so_tien_vnd || null,
          render: (value) => {
            if (value === null || value === undefined) return '—'
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(value))
          },
        },
        {
          key: 'ten_tai_khoan_di',
          label: 'Tài khoản đi',
          accessor: (data) => data.ten_tai_khoan_di || data.tai_khoan_di?.ten_tai_khoan || data.tai_khoan?.ten || null,
          render: (value) => value || '—',
        },
        {
          key: 'ten_tai_khoan_den',
          label: 'Tài khoản đến',
          accessor: (data) => data.ten_tai_khoan_den || data.tai_khoan_den?.ten_tai_khoan || data.tai_khoan_den?.ten || null,
          render: (value) => value || '—',
        },
        {
          key: 'chung_tu',
          label: 'Chứng từ',
          accessor: (data) => data.chung_tu || data.so_chung_tu || null,
          render: (value) => value || '—',
        },
      ],
    },
    {
      title: 'Hình ảnh và ghi chú',
      fields: [
        {
          key: 'hinh_anh',
          label: 'Hình ảnh',
          accessor: 'hinh_anh',
          span: 3,
          render: (value) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return '—'
            const images = Array.isArray(value) ? value : []
            return (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {images.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Hình ${index + 1}`}
                    className="w-full h-32 object-cover rounded border cursor-pointer hover:opacity-80"
                    onClick={() => window.open(url, '_blank')}
                  />
                ))}
              </div>
            )
          },
        },
        {
          key: 'ghi_chu',
          label: 'Ghi chú',
          accessor: 'ghi_chu',
        },
      ],
    },
    {
      title: 'Thông tin hệ thống',
      fields: [
        {
          key: 'nguoi_tao',
          label: 'Người tạo',
          accessor: (data) => data.nguoi_tao?.ho_va_ten || data.nguoi_tao?.ho_ten || null,
          render: (value) => value || '—',
        },
        {
          key: 'tg_tao',
          label: 'Ngày tạo',
          accessor: (data: any) => data.tg_tao || data.created_at || null,
          render: (value) => {
            if (!value) return '—'
            return new Date(value).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          },
        },
        {
          key: 'tg_cap_nhat',
          label: 'Ngày cập nhật',
          accessor: (data: any) => data.tg_cap_nhat || data.updated_at || null,
          render: (value) => {
            if (!value) return '—'
            return new Date(value).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })
          },
        },
      ],
    },
  ]

  return (
    <GenericDetailView<GiaoDichWithRelations>
      data={giaoDich}
      groups={fieldGroups}
      title="Chi tiết giao dịch"
      onEdit={onEdit}
      onDelete={handleDelete}
      onBack={onBack}
      deleteConfirmTitle="Xác nhận xóa giao dịch"
      deleteConfirmDescription={`Bạn có chắc chắn muốn xóa giao dịch "${giaoDich.hang_muc || giaoDich.loai || 'này'}"? Hành động này không thể hoàn tác.`}
    />
  )
}

