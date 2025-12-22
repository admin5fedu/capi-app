import { useNavigate, useLocation } from 'react-router-dom'
import { Home, ArrowLeft, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMobile } from '@/shared/components/generic/hooks/use-mobile'
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

  // Kiểm tra xem có thể quay lại không (không phải trang chủ)
  const canGoBack = location.pathname !== '/'

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    if (canGoBack) {
      navigate(-1)
    }
  }

  const handleNotification = () => {
    // TODO: Navigate to notification page or open notification panel
    console.log('Notification clicked')
  }

  // Luôn render nhưng ẩn bằng CSS để tránh unmount/remount issues
  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg transition-opacity duration-200',
      isMobile ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none lg:hidden'
    )}>
      <div className="flex items-center justify-between px-4 py-2 h-16">
        {/* Nút Back - Bên trái */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          disabled={!canGoBack}
          className={cn(
            'h-12 w-12 rounded-full',
            !canGoBack && 'opacity-50 cursor-not-allowed'
          )}
          title="Quay lại"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Nút Home - Ở giữa, lớn hơn */}
        <Button
          variant="default"
          size="icon"
          onClick={handleGoHome}
          className={cn(
            'h-14 w-14 rounded-full shadow-lg',
            location.pathname === '/' && 'bg-primary/80'
          )}
          title="Trang chủ"
        >
          <Home className="h-6 w-6" />
        </Button>

        {/* Nút Notification - Bên phải */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNotification}
          className="h-12 w-12 rounded-full relative"
          title="Thông báo"
        >
          <Bell className="h-5 w-5" />
          {/* Badge thông báo mới (nếu có) */}
          <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full"></span>
        </Button>
      </div>
    </div>
  )
}

