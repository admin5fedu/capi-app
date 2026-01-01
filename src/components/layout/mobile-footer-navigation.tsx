import { useNavigate, useLocation } from 'react-router-dom'
import { Home, ChevronLeft, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMobile } from '@/shared/components/generic/hooks/use-mobile'
import { useBreadcrumb } from '@/components/layout/breadcrumb-context'
import { getBreadcrumbLabels } from '@/components/layout/breadcrumb-config'
import { cn } from '@/lib/utils'

/**
 * Mobile Footer Navigation - Thanh điều hướng dưới cùng cho mobile
 * - Nút Home lớn ở giữa (quay về trang chủ)
 * - Nút Back bên trái
 * - Nút Notification bên phải
 */
export function MobileFooterNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMobile()
  const { detailLabel } = useBreadcrumb()

  // Lấy breadcrumb labels từ pathname
  const hasDetailLabel = !!detailLabel
  const breadcrumbLabels = getBreadcrumbLabels(location.pathname, hasDetailLabel)
  
  // Tính toán path của breadcrumb item trước đó
  const getPreviousPath = (): string => {
    // Nếu chỉ có 1 item (Trang chủ), không thể quay lại
    if (breadcrumbLabels.length <= 1) {
      return '/'
    }

    // Lấy index của item trước đó (trừ 2 vì index cuối cùng là item hiện tại)
    const previousIndex = breadcrumbLabels.length - 2
    
    // Nếu previousIndex = 0, quay về trang chủ
    if (previousIndex === 0) {
      return '/'
    }

    // Build path từ location.pathname dựa trên previousIndex
    // Logic tương tự như trong navbar.tsx
    const pathParts = location.pathname.split('/').filter(Boolean)
    
    // Nếu có detail label, bỏ qua ID ở cuối
    let partsToUse = pathParts
    if (hasDetailLabel && pathParts.length > 0) {
      partsToUse = pathParts.slice(0, -1)
    }

    // Build path: '/' + pathParts.slice(0, previousIndex).join('/')
    // previousIndex tương ứng với số lượng path parts cần lấy
    if (previousIndex <= partsToUse.length) {
      return '/' + partsToUse.slice(0, previousIndex).join('/')
    }

    // Nếu previousIndex vượt quá partsToUse.length, có thể là do breadcrumb có thêm detail label
    // Trong trường hợp này, quay về path hiện tại (bỏ ID nếu có)
    if (partsToUse.length > 0) {
      return '/' + partsToUse.join('/')
    }

    // Fallback: quay về trang chủ
    return '/'
  }

  const previousPath = getPreviousPath()
  const canGoBack = location.pathname !== '/' && breadcrumbLabels.length > 1

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    if (canGoBack) {
      navigate(previousPath)
    }
  }

  const handleNotification = () => {
    // TODO: Navigate to notification page or open notification panel
    console.log('Notification clicked')
  }

  // Luôn render nhưng ẩn bằng CSS để tránh unmount/remount issues
  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t shadow-lg transition-opacity duration-200',
      isMobile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none lg:hidden'
    )}>
      <div className="grid grid-cols-3 items-center justify-items-center px-4 py-3 h-20 max-w-md mx-auto">
        {/* Nút Back - Bên trái */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          disabled={!canGoBack}
          className={cn(
            'h-14 w-14 rounded-full transition-all duration-200',
            'active:scale-95 active:bg-accent',
            'hover:bg-accent hover:text-accent-foreground',
            !canGoBack && 'opacity-40 cursor-not-allowed'
          )}
          title="Quay lại"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        {/* Nút Home - Ở giữa, lớn hơn */}
        <Button
          variant="default"
          size="icon"
          onClick={handleGoHome}
          className={cn(
            'h-16 w-16 rounded-full shadow-lg transition-all duration-200',
            'active:scale-95 active:shadow-md',
            'hover:shadow-xl hover:scale-105',
            location.pathname === '/' && 'bg-primary shadow-primary/50'
          )}
          title="Trang chủ"
        >
          <Home className="h-7 w-7" />
        </Button>

        {/* Nút Notification - Bên phải */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNotification}
          className={cn(
            'h-14 w-14 rounded-full relative transition-all duration-200',
            'active:scale-95 active:bg-accent',
            'hover:bg-accent hover:text-accent-foreground'
          )}
          title="Thông báo"
        >
          <Bell className="h-6 w-6" />
          {/* Badge thông báo mới (nếu có) */}
          <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 bg-destructive rounded-full ring-2 ring-background"></span>
        </Button>
      </div>
    </div>
  )
}

