import { useAuthStore } from '@/store/auth-store'
import { AlertCircle } from 'lucide-react'

interface KiemTraQuyenProps {
  children: React.ReactNode
  /**
   * Danh sách vai trò ID được phép truy cập
   * Nếu không truyền, chỉ cần đăng nhập là đủ
   */
  allowedVaiTroIds?: string[]
  /**
   * Cho phép nhiều vai trò (OR) hay tất cả vai trò (AND)
   * Default: true (OR - chỉ cần một trong các vai trò)
   */
  requireAll?: boolean
  /**
   * Custom message khi không có quyền
   */
  noPermissionMessage?: string
}

/**
 * Component kiểm tra quyền truy cập
 * Bọc các module/pages cần bảo vệ bằng quyền
 */
export function KiemTraQuyen({
  children,
  allowedVaiTroIds,
  requireAll = false,
  noPermissionMessage = 'Bạn không có quyền truy cập trang này',
}: KiemTraQuyenProps) {
  const { user, nguoiDung, vaiTro, isLoading } = useAuthStore()

  // Đang tải thông tin auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Đang kiểm tra quyền...</div>
      </div>
    )
  }

  // Chưa đăng nhập
  if (!user || !nguoiDung) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 p-8">
          <AlertCircle className="h-16 w-16 mx-auto text-destructive" />
          <h2 className="text-2xl font-bold">Yêu cầu đăng nhập</h2>
          <p className="text-muted-foreground">
            Vui lòng đăng nhập để truy cập trang này
          </p>
        </div>
      </div>
    )
  }

  // Kiểm tra người dùng có active không
  if (!nguoiDung.is_active) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 p-8">
          <AlertCircle className="h-16 w-16 mx-auto text-destructive" />
          <h2 className="text-2xl font-bold">Tài khoản đã bị vô hiệu hóa</h2>
          <p className="text-muted-foreground">
            Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.
          </p>
        </div>
      </div>
    )
  }

  // Nếu không có yêu cầu vai trò cụ thể, cho phép truy cập
  if (!allowedVaiTroIds || allowedVaiTroIds.length === 0) {
    return <>{children}</>
  }

  // Kiểm tra vai trò
  if (!vaiTro) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 p-8">
          <AlertCircle className="h-16 w-16 mx-auto text-destructive" />
          <h2 className="text-2xl font-bold">Không có quyền</h2>
          <p className="text-muted-foreground">{noPermissionMessage}</p>
        </div>
      </div>
    )
  }

  // Kiểm tra vai trò có trong danh sách được phép không
  const hasPermission = requireAll
    ? allowedVaiTroIds.every((id) => vaiTro.id === id) // AND - cần tất cả
    : allowedVaiTroIds.includes(vaiTro.id) // OR - chỉ cần một

  if (!hasPermission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 p-8">
          <AlertCircle className="h-16 w-16 mx-auto text-destructive" />
          <h2 className="text-2xl font-bold">Không có quyền</h2>
          <p className="text-muted-foreground">{noPermissionMessage}</p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Vai trò hiện tại: {vaiTro.ten} ({vaiTro.id})</p>
              <p>Vai trò được phép: {allowedVaiTroIds.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Có quyền, render children
  return <>{children}</>
}

