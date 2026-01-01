import { useEffect } from 'react'
import { useTaiKhoanById, useDeleteTaiKhoan } from '../hooks/use-tai-khoan'
import { GenericDetailView, DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import { useBreadcrumb } from '@/components/layout/breadcrumb-context'
import { LOAI_TAI_KHOAN } from '../config'
import type { TaiKhoan } from '@/types/tai-khoan'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { Badge } from '@/components/ui/badge'
import { getTaiKhoanLoaiBadgeVariant, getStatusBadgeVariant } from '@/shared/utils/color-utils'

interface TaiKhoanDetailViewProps {
  id: string
  onEdit: () => void
  onDelete?: () => void
  onBack: () => void
}

/**
 * TaiKhoanDetailView component - Hiển thị chi tiết tài khoản
 */
export function TaiKhoanDetailView({ id, onEdit, onDelete, onBack }: TaiKhoanDetailViewProps) {
  const { data: taiKhoan, isLoading, error } = useTaiKhoanById(id)
  const { setDetailLabel } = useBreadcrumb()
  const deleteTaiKhoan = useDeleteTaiKhoan()

  const handleDelete = async () => {
    try {
      await deleteTaiKhoan.mutateAsync(id)
      toast.success('Xóa tài khoản thành công')
      onDelete?.()
      if (!onDelete) {
        onBack()
      }
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa tài khoản này'}`)
    }
  }

  // Update breadcrumb với title của tài khoản
  useEffect(() => {
    if (taiKhoan?.ten) {
      setDetailLabel(taiKhoan.ten)
    }
    return () => {
      setDetailLabel(null)
    }
  }, [taiKhoan?.ten, setDetailLabel])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (error || !taiKhoan) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">Lỗi: {error?.message || 'Không tìm thấy tài khoản'}</div>
      </div>
    )
  }

  const fieldGroups: DetailFieldGroup<TaiKhoan>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ten',
          label: 'Tên tài khoản',
          accessor: 'ten',
        },
        {
          key: 'loai',
          label: 'Loại tài khoản',
          accessor: 'loai',
          render: (value) => {
            const loai = LOAI_TAI_KHOAN.find((l) => l.value === value)
            const label = loai ? loai.label : value || '—'
            return <Badge variant={getTaiKhoanLoaiBadgeVariant(value)}>{label}</Badge>
          },
        },
        {
          key: 'loai_tien',
          label: 'Loại tiền',
          accessor: 'loai_tien',
        },
        {
          key: 'so_du_ban_dau',
          label: 'Số dư ban đầu',
          accessor: 'so_du_ban_dau',
          render: (value) => {
            if (value === null || value === undefined) return '—'
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(Number(value))
          },
        },
        {
          key: 'is_active',
          label: 'Trạng thái',
          accessor: 'is_active',
          render: (value) => (
            <Badge variant={getStatusBadgeVariant(value)}>
              {value ? 'Hoạt động' : 'Vô hiệu hóa'}
            </Badge>
          ),
        },
      ],
    },
    {
      title: 'Thông tin ngân hàng',
      fields: [
        {
          key: 'so_tai_khoan',
          label: 'Số tài khoản',
          accessor: 'so_tai_khoan',
          render: (value) => value || '—',
        },
        {
          key: 'ngan_hang',
          label: 'Ngân hàng',
          accessor: 'ngan_hang',
          render: (value) => value || '—',
        },
        {
          key: 'chu_tai_khoan',
          label: 'Chủ tài khoản',
          accessor: 'chu_tai_khoan',
          render: (value) => value || '—',
        },
        {
          key: 'ma_qr',
          label: 'Mã QR',
          accessor: 'ma_qr',
          render: (value) => value || '—',
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
    <GenericDetailView<TaiKhoan>
      data={taiKhoan}
      groups={fieldGroups}
      onEdit={onEdit}
      onDelete={handleDelete}
      onBack={onBack}
      title="Chi tiết tài khoản"
      deleteConfirmTitle="Xác nhận xóa tài khoản"
      deleteConfirmDescription={`Bạn có chắc chắn muốn xóa tài khoản "${taiKhoan.ten}"? Hành động này không thể hoàn tác.`}
    />
  )
}

