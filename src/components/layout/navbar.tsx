import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Bell, LogOut, User, Menu, Settings, KeyRound, UserCircle } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useState } from 'react'
import { toast } from 'sonner'
import { getBreadcrumbLabels } from './breadcrumb-config'
import { useBreadcrumb } from './breadcrumb-context'
import { useMobile } from '@/shared/components/generic/hooks/use-mobile'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DoiMatKhauDialog } from '@/components/dialog/doi-mat-khau-dialog'

interface NavbarProps {
  onToggleSidebar?: () => void
  onToggleDesktopSidebar?: () => void
}

export function Navbar({ onToggleSidebar, onToggleDesktopSidebar }: NavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { nguoiDung, vaiTro, dangXuat } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showDoiMatKhauDialog, setShowDoiMatKhauDialog] = useState(false)
  const { detailLabel } = useBreadcrumb()
  const isMobile = useMobile()

  // Get base breadcrumb labels from path
  // Pass hasDetailLabel để skip ID ở cuối path nếu có detailLabel
  let breadcrumbLabels = getBreadcrumbLabels(location.pathname, !!detailLabel)
  
  // Add detail label if exists
  if (detailLabel) {
    breadcrumbLabels = [...breadcrumbLabels, detailLabel]
  }

  // Chỉ hiển thị 2 router cuối cùng trên mobile, desktop hiển thị hết
  const displayBreadcrumbs = isMobile && breadcrumbLabels.length > 2 
    ? breadcrumbLabels.slice(-2) 
    : breadcrumbLabels
  const hasMoreBreadcrumbs = isMobile && breadcrumbLabels.length > 2

  const handleDangXuat = async () => {
    try {
      await dangXuat()
      toast.success('Đăng xuất thành công')
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`)
    }
    setShowUserMenu(false)
    setShowLogoutDialog(false)
  }

  const handleMenuClick = (action: string) => {
    setShowUserMenu(false)
    switch (action) {
      case 'profile':
        navigate('/ho-so')
        break
      case 'settings':
        navigate('/thiet-lap/cai-dat')
        break
      case 'change-password':
        setShowDoiMatKhauDialog(true)
        break
      case 'logout':
        setShowLogoutDialog(true)
        break
    }
  }

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu - Mobile */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-muted rounded-md transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        
        {/* Hamburger Menu - Desktop */}
        {onToggleDesktopSidebar && (
          <button
            onClick={onToggleDesktopSidebar}
            className="hidden lg:flex p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm">
          {hasMoreBreadcrumbs && (
            <>
              <span className="text-muted-foreground">...</span>
              <span className="text-muted-foreground">/</span>
            </>
          )}
          {displayBreadcrumbs.map((label, displayIndex) => {
            // Tính index thực tế trong breadcrumbLabels gốc
            const actualIndex = hasMoreBreadcrumbs 
              ? breadcrumbLabels.length - displayBreadcrumbs.length + displayIndex
              : displayIndex
            const isLast = actualIndex === breadcrumbLabels.length - 1
            
            // Build path từ breadcrumb labels để đảm bảo đúng
            let path = '/'
            if (actualIndex > 0) {
              // Build path từ location.pathname dựa trên actualIndex
              const pathParts = location.pathname.split('/').filter(Boolean)
              if (actualIndex <= pathParts.length) {
                path = '/' + pathParts.slice(0, actualIndex).join('/')
              } else {
                // Nếu là detail label (actualIndex vượt quá pathParts), link về page trước
                path = location.pathname
              }
            }
            
            return (
              <span key={actualIndex} className="flex items-center gap-2">
                {displayIndex > 0 && <span className="text-muted-foreground">/</span>}
                {isLast ? (
                  <span className="text-foreground font-medium">{label}</span>
                ) : (
                  <Link
                    to={path}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </span>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          className="p-2 hover:bg-muted rounded-md transition-colors relative"
          title="Thông báo"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative z-[100]">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors"
          >
            {nguoiDung?.avatar_url ? (
              <img
                src={nguoiDung.avatar_url}
                alt={nguoiDung.ho_va_ten || nguoiDung.ho_ten || 'Người dùng'}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium">
                {nguoiDung?.ho_va_ten || nguoiDung?.ho_ten || 'Người dùng'}
              </div>
              {(vaiTro?.ten_vai_tro || vaiTro?.ten) && (
                <div className="text-xs text-muted-foreground">
                  {vaiTro.ten_vai_tro || vaiTro.ten}
                </div>
              )}
            </div>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-[9998]"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-card border rounded-md shadow-lg z-[9999]">
                <div className="p-3 border-b">
                  <p className="text-sm font-medium">{nguoiDung?.ho_va_ten || nguoiDung?.ho_ten || 'Người dùng'}</p>
                  <p className="text-xs text-muted-foreground">{nguoiDung?.email}</p>
                  {(vaiTro?.ten_vai_tro || vaiTro?.ten) && (
                    <p className="text-xs text-primary mt-1 font-medium">{vaiTro.ten_vai_tro || vaiTro.ten}</p>
                  )}
                </div>
                <div className="py-1">
                  <button
                    onClick={() => handleMenuClick('profile')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                  >
                    <UserCircle className="h-4 w-4" />
                    Hồ sơ
                  </button>
                  <button
                    onClick={() => handleMenuClick('settings')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                  >
                    <Settings className="h-4 w-4" />
                    Cài đặt
                  </button>
                  <button
                    onClick={() => handleMenuClick('change-password')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                  >
                    <KeyRound className="h-4 w-4" />
                    Đổi mật khẩu
                  </button>
                  <div className="border-t my-1" />
                  <button
                    onClick={() => handleMenuClick('logout')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDangXuat}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Đăng xuất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Change Password Dialog */}
      <DoiMatKhauDialog open={showDoiMatKhauDialog} onOpenChange={setShowDoiMatKhauDialog} />
    </header>
  )
}
