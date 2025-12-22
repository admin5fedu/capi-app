import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  path?: string
}

export function Breadcrumbs() {
  const location = useLocation()

  const routeLabels: Record<string, string> = {
    '/tai-chinh/danh-muc': 'Danh mục Tài chính',
    '/tai-chinh/tai-khoan': 'Tài khoản',
    '/tai-chinh/thu-chi': 'Thu chi',
    '/doi-tac/nhom-doi-tac': 'Nhóm đối tác',
    '/doi-tac/danh-sach-doi-tac': 'Danh sách đối tác',
    '/thiet-lap/nguoi-dung': 'Người dùng',
    '/thiet-lap/vai-tro': 'Vai trò',
    '/thiet-lap/phan-quyen': 'Phân quyền',
    '/thiet-lap/cai-dat': 'Cài đặt',
  }

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname
    const items: BreadcrumbItem[] = [
      { label: 'Trang chủ', path: '/' },
    ]

    const currentLabel = routeLabels[path]
    if (currentLabel) {
      items.push({ label: currentLabel })
    }

    return items
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <nav className="flex items-center gap-2 text-sm">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          {item.path && index < breadcrumbs.length - 1 ? (
            <Link
              to={item.path}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {index === 0 ? <Home className="h-4 w-4" /> : item.label}
            </Link>
          ) : (
            <span className={cn(index === 0 ? 'text-muted-foreground' : 'text-foreground font-medium')}>
              {index === 0 ? <Home className="h-4 w-4" /> : item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
