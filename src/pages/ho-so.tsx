import { useState } from 'react'
import { KeyRound, Edit2, User, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/auth-store'
import { GenericDetailView, DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import { DoiMatKhauDialog } from '@/components/dialog/doi-mat-khau-dialog'
import { AvatarUploadDialog } from '@/components/avatar/avatar-upload-dialog'
import { useUpdateNguoiDungAvatar } from '@/features/thiet-lap/nguoi-dung/hooks/use-nguoi-dung'
import type { NguoiDung } from '@/types'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'

export function HoSoPage() {
  const { nguoiDung, vaiTro, layPhienLamViecHienTai } = useAuthStore()
  const [showDoiMatKhauDialog, setShowDoiMatKhauDialog] = useState(false)
  const [showAvatarUploadDialog, setShowAvatarUploadDialog] = useState(false)
  const updateAvatarMutation = useUpdateNguoiDungAvatar()

  const handleAvatarUploadComplete = async (avatarUrl: string) => {
    if (!nguoiDung?.id) return

    try {
      await updateAvatarMutation.mutateAsync({
        id: String(nguoiDung.id),
        avatarUrl,
      })
      // Refresh auth store để cập nhật avatar trong navbar
      await layPhienLamViecHienTai()
    } catch (error) {
      // Error đã được xử lý trong mutation
    }
  }

  // Get user initial
  const getUserInitial = (name?: string | null) => {
    if (!name) return null
    const parts = name.trim().split(' ')
    if (parts.length > 0) {
      return parts[parts.length - 1].charAt(0).toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  // Render title with avatar
  const renderTitle = (data: NguoiDung) => {
    const hoTen = data.ho_va_ten || data.ho_ten || 'Người dùng'
    const hasAvatar = data.avatar_url && data.avatar_url.trim() !== ''

    return (
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative group">
          <Avatar className="h-12 w-12 border-2 border-border">
            {hasAvatar ? (
              <AvatarImage src={data.avatar_url!} alt={hoTen} />
            ) : null}
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {getUserInitial(hoTen) || <User className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => setShowAvatarUploadDialog(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Sửa hình ảnh"
          >
            <Edit2 className="h-4 w-4 text-white" />
          </button>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold truncate">{hoTen}</h1>
      </div>
    )
  }

  const fieldGroups: DetailFieldGroup<NguoiDung>[] = [
    {
      title: 'Thông tin cá nhân',
      fields: [
        {
          key: 'ho_va_ten',
          label: 'Họ tên',
          accessor: (data: NguoiDung) => data.ho_va_ten || data.ho_ten || '—',
        },
        {
          key: 'email',
          label: 'Email',
          accessor: 'email',
        },
        {
          key: 'ten_phong_ban',
          label: 'Phòng ban',
          accessor: (data: NguoiDung) => data.ten_phong_ban || '—',
        },
        {
          key: 'trang_thai',
          label: 'Trạng thái',
          accessor: 'trang_thai',
          render: (value) => (
            <span className={value?.toLowerCase() === 'hoạt động' ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
              {value || '—'}
            </span>
          ),
        },
      ],
    },
    {
      title: 'Thông tin hệ thống',
      fields: [
        {
          key: 'ten_vai_tro',
          label: 'Vai trò',
          accessor: (data: NguoiDung) => data.ten_vai_tro || vaiTro?.ten_vai_tro || vaiTro?.ten || '—',
          render: (value) => (
            <span className={value !== '—' ? 'text-primary font-medium' : 'text-muted-foreground'}>
              {value}
            </span>
          ),
        },
        {
          key: 'tg_tao',
          label: 'Ngày tạo',
          accessor: (data: NguoiDung) => data.tg_tao || data.created_at || null,
          render: (value) => {
            if (!value) return <span className="text-muted-foreground">—</span>
            return dayjs(value).locale('vi').format('DD/MM/YYYY HH:mm')
          },
        },
        {
          key: 'tg_cap_nhat',
          label: 'Ngày cập nhật',
          accessor: (data: NguoiDung) => data.tg_cap_nhat || data.updated_at || null,
          render: (value) => {
            if (!value) return <span className="text-muted-foreground">—</span>
            return dayjs(value).locale('vi').format('DD/MM/YYYY HH:mm')
          },
        },
      ],
    },
  ]

  return (
    <>
      <GenericDetailView<NguoiDung>
        data={nguoiDung || null}
        isLoading={false}
        error={null}
        title="Hồ sơ"
        renderTitle={renderTitle}
        groups={fieldGroups}
        emptyMessage="Không có thông tin hồ sơ"
        renderHeaderActions={() => (
          <>
            <Button
              onClick={() => setShowAvatarUploadDialog(true)}
              variant="outline"
              size="sm"
              className="flex-1 min-w-[100px] gap-2 h-11"
            >
              <Image className="h-4 w-4" />
              Đổi avatar
            </Button>
            <Button
              onClick={() => setShowDoiMatKhauDialog(true)}
              variant="outline"
              size="sm"
              className="flex-1 min-w-[100px] gap-2 h-11"
            >
              <KeyRound className="h-4 w-4" />
              Đổi mật khẩu
            </Button>
          </>
        )}
      />
      <DoiMatKhauDialog open={showDoiMatKhauDialog} onOpenChange={setShowDoiMatKhauDialog} />
      <AvatarUploadDialog
        open={showAvatarUploadDialog}
        onOpenChange={setShowAvatarUploadDialog}
        currentAvatarUrl={nguoiDung?.avatar_url || null}
        userName={nguoiDung?.ho_va_ten || nguoiDung?.ho_ten || 'Người dùng'}
        onUploadComplete={handleAvatarUploadComplete}
      />
    </>
  )
}

