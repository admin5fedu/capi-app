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
 * 
 * TẠM THỜI: Đã tắt tất cả kiểm tra phân quyền, chỉ giữ lại kiểm tra đăng nhập
 */
export function KiemTraQuyen({
  children,
  allowedVaiTroIds,
  requireAll = false,
  noPermissionMessage = 'Bạn không có quyền truy cập trang này',
}: KiemTraQuyenProps) {
  const { user, nguoiDung, isLoading } = useAuthStore()

  // Chỉ hiển thị loading khi thực sự chưa có data (lần đầu load)
  // Không hiển thị loading khi đang fetch background (isFetchingSession)
  if (isLoading && !user && !nguoiDung) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Đang kiểm tra quyền...</div>
      </div>
    )
  }

  // Chưa đăng nhập - vẫn kiểm tra đăng nhập
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

  // TẠM THỜI: Bỏ qua tất cả kiểm tra phân quyền
  // Chỉ cần đăng nhập là đủ để truy cập
  // TODO: Bật lại kiểm tra phân quyền khi cần
  
  // Kiểm tra người dùng có active không - TẠM THỜI BỎ QUA
  // if (!nguoiDung.is_active) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center space-y-4 p-8">
  //         <AlertCircle className="h-16 w-16 mx-auto text-destructive" />
  //         <h2 className="text-2xl font-bold">Tài khoản đã bị vô hiệu hóa</h2>
  //         <p className="text-muted-foreground">
  //           Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.
  //         </p>
  //       </div>
  //     </div>
  //   )
  // }

  // TẠM THỜI: Luôn cho phép truy cập nếu đã đăng nhập
  // Bỏ qua tất cả kiểm tra vai trò và quyền
  return <>{children}</>

  // CODE CŨ - Đã comment out để tạm thời bỏ phân quyền
  /*
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
              <p>Vai trò hiện tại: {vaiTro.ten_vai_tro || vaiTro.ten} ({vaiTro.id})</p>
              <p>Vai trò được phép: {allowedVaiTroIds.join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Có quyền, render children
  return <>{children}</>
  */
}

