import { NavLink, useLocation } from 'react-router-dom'
import {
  DollarSign,
  Users,
  Settings,
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string // Path đến submenu (ví dụ: /tai-chinh)
}

const menuItems: MenuItem[] = [
  {
    id: 'tai-chinh',
    label: 'Tài chính',
    icon: DollarSign,
    path: '/tai-chinh',
  },
  {
    id: 'doi-tac',
    label: 'Đối tác',
    icon: Users,
    path: '/doi-tac',
  },
  {
    id: 'thiet-lap',
    label: 'Thiết lập',
    icon: Settings,
    path: '/thiet-lap',
  },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const location = useLocation()

  const isPathActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  const isHomeActive = location.pathname === '/'

  return (
    <div
      className={cn(
        'bg-card border-r transition-all duration-300 flex flex-col h-screen relative',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="h-16 border-b flex items-center justify-center px-4 flex-shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">CAPI ERP</h1>
              <p className="text-xs text-muted-foreground leading-tight">Hệ thống quản lý</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">C</span>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1">
        {/* Trang chủ */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-2',
              'hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              (isActive || isHomeActive)
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-foreground',
              isCollapsed && 'justify-center'
            )
          }
          title={isCollapsed ? 'Trang chủ' : undefined}
        >
          <Home className={cn('h-5 w-5 flex-shrink-0', isHomeActive ? 'text-primary-foreground' : 'text-primary')} />
          {!isCollapsed && <span className="font-medium text-sm">Trang chủ</span>}
        </NavLink>

        {menuItems.map((item) => {
          const isActive = isPathActive(item.path)
          const ItemIcon = item.icon

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive: navIsActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  (isActive || navIsActive)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground',
                  isCollapsed && 'justify-center'
                )
              }
              title={isCollapsed ? item.label : undefined}
            >
              <ItemIcon className="h-5 w-5 flex-shrink-0 text-primary" />
              {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
