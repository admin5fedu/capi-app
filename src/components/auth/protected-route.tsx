import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth-store'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/dang-nhap" replace />
  }

  return <>{children}</>
}

