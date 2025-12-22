import { useEffect } from 'react'
import React from 'react'
import { useChiTietNguoiDung, useXoaNguoiDung } from '../hooks/use-nguoi-dung'
import { GenericDetailView, DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import { useBreadcrumb } from '@/components/layout/breadcrumb-context'
import type { NguoiDung } from '@/types/nguoi-dung'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { toast } from 'sonner'
import { User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getStatusBadgeVariant } from '@/shared/utils/color-utils'

interface NguoiDungDetailViewProps {
  id: string
  onEdit: () => void
  onDelete?: () => void // Callback sau khi xóa thành công
  onBack: () => void
}

/**
 * NguoiDungDetailView component - Hiển thị chi tiết người dùng
 */
export function NguoiDungDetailView({ id, onEdit, onDelete, onBack }: NguoiDungDetailViewProps) {
  const { data: nguoiDung, isLoading, error } = useChiTietNguoiDung(id)
  const { setDetailLabel } = useBreadcrumb()
  const deleteNguoiDung = useXoaNguoiDung()
  const [avatarError, setAvatarError] = React.useState(false)

  const handleDelete = async () => {
    try {
      await deleteNguoiDung.mutateAsync(id)
      toast.success('Xóa người dùng thành công')
      onDelete?.() // Callback để module xử lý (ví dụ: quay lại list)
      if (!onDelete) {
        onBack() // Nếu không có callback, quay lại list
      }
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message || 'Không thể xóa người dùng này'}`)
    }
  }

  // Update breadcrumb với tên người dùng
  useEffect(() => {
    if (nguoiDung?.ho_ten) {
      setDetailLabel(nguoiDung.ho_ten)
    }
    // Cleanup khi unmount
    return () => {
      setDetailLabel(null)
    }
  }, [nguoiDung?.ho_ten, setDetailLabel])

  // Reset avatar error khi nguoiDung thay đổi
  useEffect(() => {
    setAvatarError(false)
  }, [nguoiDung?.avatar_url])

  // Hàm lấy initial từ tên
  const getInitial = (name: string): string => {
    if (!name) return ''
    const words = name.trim().split(/\s+/)
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase()
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
  }

  // Render title với avatar
  const renderTitle = (data: NguoiDung) => {
    const hasAvatar = data.avatar_url && data.avatar_url.trim() !== ''
    
    return (
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {hasAvatar && !avatarError ? (
          <img
            src={data.avatar_url!}
            alt={data.ho_ten}
            className="h-12 w-12 rounded-full object-cover border-2 border-border flex-shrink-0"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg flex-shrink-0">
            {getInitial(data.ho_ten) || <User className="h-6 w-6" />}
          </div>
        )}
        <h1 className="text-2xl font-bold truncate">{data.ho_ten}</h1>
      </div>
    )
  }

  // Định nghĩa các nhóm fields
  const fieldGroups: DetailFieldGroup<NguoiDung>[] = [
    {
      title: 'Thông tin cơ bản',
      fields: [
        {
          key: 'ho_ten',
          label: 'Họ tên',
          accessor: 'ho_ten',
        },
        {
          key: 'email',
          label: 'Email',
          accessor: 'email',
        },
        {
          key: 'vai_tro_id',
          label: 'Vai trò ID',
          accessor: 'vai_tro_id',
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
        {
          key: 'avatar_url',
          label: 'Avatar URL',
          accessor: 'avatar_url',
          span: 3,
          render: (value) => {
            if (!value) return <span className="text-muted-foreground">—</span>
            return (
              <div className="space-y-2">
                <p className="break-all">{value}</p>
                {value && (
                  <img
                    src={value}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
              </div>
            )
          },
        },
      ],
    },
    {
      title: 'Thông tin hệ thống',
      fields: [
        {
          key: 'created_at',
          label: 'Ngày tạo',
          accessor: 'created_at',
          render: (value) => {
            if (!value) return <span className="text-muted-foreground">—</span>
            return dayjs(value).locale('vi').format('DD/MM/YYYY HH:mm')
          },
        },
        {
          key: 'updated_at',
          label: 'Ngày cập nhật',
          accessor: 'updated_at',
          render: (value) => {
            if (!value) return <span className="text-muted-foreground">—</span>
            return dayjs(value).locale('vi').format('DD/MM/YYYY HH:mm')
          },
        },
      ],
    },
  ]

  return (
    <GenericDetailView<NguoiDung>
      data={nguoiDung || null}
      isLoading={isLoading}
      error={error || null}
      title={(data) => data.ho_ten}
      renderTitle={renderTitle}
      onEdit={onEdit}
      onDelete={handleDelete}
      onBack={onBack}
      groups={fieldGroups}
      emptyMessage="Không tìm thấy người dùng"
      deleteConfirmTitle="Xác nhận xóa người dùng"
      deleteConfirmDescription={
        nguoiDung
          ? `Bạn có chắc chắn muốn xóa người dùng "${nguoiDung.ho_ten}"? Hành động này không thể hoàn tác.`
          : 'Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.'
      }
    />
  )
}

