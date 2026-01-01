import { useEffect } from 'react'
import { useDanhMucById, useDeleteDanhMuc, useDeleteDanhMucCascade, useDanhMucChildren } from '../hooks/use-danh-muc'
import { isLevel1, isLevel2 } from '../utils/danh-muc-helpers'
import { GenericDetailView, DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import { useBreadcrumb } from '@/components/layout/breadcrumb-context'
import { LOAI_DANH_MUC } from '../config'
import type { DanhMucWithParent } from '@/types/danh-muc'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { Badge } from '@/components/ui/badge'
import { getThuChiBadgeVariant, getStatusBadgeVariant } from '@/shared/utils/color-utils'

interface DanhMucDetailViewProps {
  id: string
  onEdit: () => void
  onDelete?: () => void
  onBack: () => void
}

/**
 * DanhMucDetailView component - Hiển thị chi tiết danh mục
 */
export function DanhMucDetailView({ id, onEdit, onDelete, onBack }: DanhMucDetailViewProps) {
  const { data: danhMuc, isLoading, error } = useDanhMucById(id)
  const { data: danhMucCon } = useDanhMucChildren(id)
  const { setDetailLabel } = useBreadcrumb()
  const deleteDanhMuc = useDeleteDanhMuc()
  const deleteDanhMucCascade = useDeleteDanhMucCascade()

  const handleDelete = async () => {
    try {
      if (!danhMuc) return

      // Nếu là cấp 1, dùng cascade delete (tự động xóa cấp 2)
      if (isLevel1(danhMuc)) {
        await deleteDanhMucCascade.mutateAsync(id)
      } else {
        // Nếu là cấp 2, xóa bình thường
        await deleteDanhMuc.mutateAsync(id)
      }

      onDelete?.()
      if (!onDelete) {
        onBack()
      }
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa danh mục này'}`)
    }
  }

  // Update breadcrumb với title của danh mục
  useEffect(() => {
    if (danhMuc?.ten) {
      setDetailLabel(danhMuc.ten)
    }
    return () => {
      setDetailLabel(null)
    }
  }, [danhMuc?.ten, setDetailLabel])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (error || !danhMuc) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">Lỗi: {error?.message || 'Không tìm thấy danh mục'}</div>
      </div>
    )
  }

  // Xác định cấp độ
  const level = isLevel1(danhMuc) ? 1 : isLevel2(danhMuc) ? 2 : 0

  const fieldGroups: DetailFieldGroup<DanhMucWithParent>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ten',
          label: 'Tên danh mục',
          accessor: 'ten',
        },
        {
          key: 'level',
          label: 'Cấp độ',
          accessor: () => level,
          render: () => (
            <Badge variant={level === 1 ? 'default' : 'secondary'}>
              Cấp {level}
            </Badge>
          ),
        },
        {
          key: 'loai',
          label: 'Loại danh mục',
          accessor: 'loai',
          render: (value) => {
            const loai = LOAI_DANH_MUC.find((l) => l.value === value)
            const label = loai ? loai.label : value || '—'
            return <Badge variant={getThuChiBadgeVariant(value)}>{label}</Badge>
          },
        },
        {
          key: 'parent_ten',
          label: 'Danh mục cha',
          accessor: 'parent_ten',
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        {
          key: 'thu_tu',
          label: 'Thứ tự',
          accessor: 'thu_tu',
          render: (value) => value ?? 0,
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
      title: 'Thông tin khác',
      fields: [
        {
          key: 'mo_ta',
          label: 'Mô tả',
          accessor: 'mo_ta',
          span: 3,
          render: (value) => value || <span className="text-muted-foreground">—</span>,
        },
        ...(isLevel1(danhMuc) && danhMucCon && danhMucCon.length > 0
          ? [
              {
                key: 'children',
                label: 'Danh mục con',
                accessor: () => danhMucCon,
                span: 3 as 1 | 2 | 3,
                render: () => (
                  <div className="space-y-1">
                    {danhMucCon.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-2 border rounded-md hover:bg-accent/50"
                      >
                        <span>{child.ten}</span>
                        <Badge variant={getStatusBadgeVariant(child.is_active)}>
                          {child.is_active ? 'Hoạt động' : 'Vô hiệu hóa'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ),
              },
            ]
          : []),
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
    <GenericDetailView<DanhMucWithParent>
      data={danhMuc}
      groups={fieldGroups}
      onEdit={onEdit}
      onDelete={handleDelete}
      onBack={onBack}
      title="Chi tiết danh mục"
      deleteConfirmTitle="Xác nhận xóa danh mục"
      deleteConfirmDescription={`Bạn có chắc chắn muốn xóa danh mục "${danhMuc.ten}"? ${
        danhMucCon && danhMucCon.length > 0
          ? `Cảnh báo: Danh mục này có ${danhMucCon.length} danh mục con. `
          : ''
      }Hành động này không thể hoàn tác.`}
    />
  )
}

