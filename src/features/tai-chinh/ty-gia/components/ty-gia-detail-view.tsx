import { useEffect } from 'react'
import { useTyGiaById, useDeleteTyGia } from '../hooks/use-ty-gia'
import { GenericDetailView, DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import { useBreadcrumb } from '@/components/layout/breadcrumb-context'
import type { TyGia } from '@/types/ty-gia'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

interface TyGiaDetailViewProps {
  id: number
  onEdit: () => void
  onDelete?: () => void
  onBack: () => void
}

/**
 * TyGiaDetailView component - Hiển thị chi tiết tỷ giá
 */
export function TyGiaDetailView({ id, onEdit, onDelete, onBack }: TyGiaDetailViewProps) {
  const { data: tyGia, isLoading, error } = useTyGiaById(id)
  const { setDetailLabel } = useBreadcrumb()
  const deleteTyGia = useDeleteTyGia()

  const handleDelete = async () => {
    try {
      await deleteTyGia.mutateAsync(id)
      toast.success('Xóa tỷ giá thành công')
      onDelete?.()
      if (!onDelete) {
        onBack()
      }
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa tỷ giá này'}`)
    }
  }

  // Update breadcrumb với ngày áp dụng
  useEffect(() => {
    if (tyGia?.ngay_ap_dung) {
      const ngay = new Date(tyGia.ngay_ap_dung).toLocaleDateString('vi-VN')
      setDetailLabel(`Tỷ giá ${ngay}`)
    }
    return () => {
      setDetailLabel(null)
    }
  }, [tyGia?.ngay_ap_dung, setDetailLabel])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (error || !tyGia) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">Lỗi: {error?.message || 'Không tìm thấy tỷ giá'}</div>
      </div>
    )
  }

  const fieldGroups: DetailFieldGroup<TyGia>[] = [
    {
      title: 'Thông tin tỷ giá',
      fields: [
        {
          key: 'ty_gia',
          label: 'Tỷ giá',
          accessor: 'ty_gia',
          render: (value) => {
            if (value === null || value === undefined) return '—'
            return new Intl.NumberFormat('vi-VN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 4,
            }).format(Number(value))
          },
        },
        {
          key: 'ngay_ap_dung',
          label: 'Ngày áp dụng',
          accessor: 'ngay_ap_dung',
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
          key: 'ghi_chu',
          label: 'Ghi chú',
          accessor: 'ghi_chu',
          span: 3,
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
      ],
    },
    {
      title: 'Thông tin khác',
      fields: [
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

  const ngayApDung = tyGia.ngay_ap_dung
    ? new Date(tyGia.ngay_ap_dung).toLocaleDateString('vi-VN')
    : ''

  return (
    <GenericDetailView<TyGia>
      data={tyGia}
      groups={fieldGroups}
      onEdit={onEdit}
      onDelete={handleDelete}
      onBack={onBack}
      title="Chi tiết tỷ giá"
      deleteConfirmTitle="Xác nhận xóa tỷ giá"
      deleteConfirmDescription={`Bạn có chắc chắn muốn xóa tỷ giá ngày ${ngayApDung}? Hành động này không thể hoàn tác.`}
    />
  )
}

