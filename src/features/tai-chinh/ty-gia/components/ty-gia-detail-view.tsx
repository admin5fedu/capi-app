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

  // Update breadcrumb với tỷ giá
  useEffect(() => {
    if (tyGia?.ty_gia) {
      const tyGiaFormatted = new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(Number(tyGia.ty_gia))
      setDetailLabel(`Tỷ giá ${tyGiaFormatted}`)
    }
    return () => {
      setDetailLabel(null)
    }
  }, [tyGia?.ty_gia, setDetailLabel])

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
      ],
    },
    {
      title: 'Thông tin khác',
      fields: [
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

  const tyGiaFormatted = tyGia.ty_gia
    ? new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(Number(tyGia.ty_gia))
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
      deleteConfirmDescription={`Bạn có chắc chắn muốn xóa tỷ giá ${tyGiaFormatted}? Hành động này không thể hoàn tác.`}
    />
  )
}

