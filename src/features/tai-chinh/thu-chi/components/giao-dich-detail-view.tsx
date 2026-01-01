import { useEffect } from 'react'
import { useGiaoDichById, useDeleteGiaoDich } from '../hooks/use-giao-dich'
import { GenericDetailView, DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import { useBreadcrumb } from '@/components/layout/breadcrumb-context'
import { LOAI_GIAO_DICH } from '../config'
import type { GiaoDichWithRelations } from '@/types/giao-dich'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { getLoaiGiaoDichBadgeVariant } from '../config'

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
    if (giaoDich?.ma_phieu) {
      setDetailLabel(giaoDich.ma_phieu)
    }
    return () => {
      setDetailLabel(null)
    }
  }, [giaoDich?.ma_phieu, setDetailLabel])

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
          key: 'ma_phieu',
          label: 'Mã phiếu',
          accessor: 'ma_phieu',
        },
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
          key: 'loai',
          label: 'Loại',
          accessor: 'loai',
          render: (value) => {
            const loai = LOAI_GIAO_DICH.find((l) => l.value === value)
            const label = loai ? loai.label : value || '—'
            return <Badge variant={getLoaiGiaoDichBadgeVariant(value)}>{label}</Badge>
          },
        },
        {
          key: 'danh_muc',
          label: 'Danh mục',
          accessor: (data) => data.danh_muc?.ten || null,
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
            const loaiTien =
              giaoDich.tai_khoan_den?.loai_tien || giaoDich.tai_khoan?.loai_tien || 'VND'
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: loaiTien === 'USD' ? 'USD' : 'VND',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(Number(value))
          },
        },
        {
          key: 'ty_gia',
          label: 'Tỷ giá',
          accessor: (data) => data.ty_gia?.ty_gia || null,
          render: (value) => {
            if (!value) return '—'
            return new Intl.NumberFormat('vi-VN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            }).format(Number(value))
          },
        },
        {
          key: 'so_tien_vnd',
          label: 'Số tiền VND',
          accessor: 'so_tien_vnd',
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
          key: 'tai_khoan',
          label: 'Tài khoản đi',
          accessor: (data) => data.tai_khoan?.ten || null,
          render: (value) => value || '—',
        },
        {
          key: 'tai_khoan_den',
          label: 'Tài khoản đến',
          accessor: (data) => data.tai_khoan_den?.ten || null,
          render: (value) => value || '—',
        },
        {
          key: 'doi_tac',
          label: 'Đối tác',
          accessor: (data) => data.doi_tac?.ten || null,
          render: (value) => value || '—',
        },
        {
          key: 'so_chung_tu',
          label: 'Số chứng từ',
          accessor: 'so_chung_tu',
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
      deleteConfirmDescription={`Bạn có chắc chắn muốn xóa giao dịch "${giaoDich.ma_phieu}"? Hành động này không thể hoàn tác.`}
    />
  )
}

