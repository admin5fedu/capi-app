import { Link } from 'react-router-dom'
import {
  Settings,
  Users,
  UserCog,
  Shield,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'

interface ModuleCard {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

const thietLapModules: ModuleCard[] = [
  {
    id: 'nguoi-dung',
    title: 'Người dùng',
    description: 'Quản lý tài khoản người dùng hệ thống',
    icon: Users,
    path: '/thiet-lap/nguoi-dung',
  },
  {
    id: 'vai-tro',
    title: 'Vai trò',
    description: 'Quản lý vai trò và chức năng người dùng',
    icon: UserCog,
    path: '/thiet-lap/vai-tro',
  },
  {
    id: 'phan-quyen',
    title: 'Phân quyền',
    description: 'Cấu hình phân quyền truy cập hệ thống',
    icon: Shield,
    path: '/thiet-lap/phan-quyen',
  },
  {
    id: 'cai-dat',
    title: 'Cài đặt',
    description: 'Cấu hình hệ thống và thông số chung',
    icon: Settings,
    path: '/thiet-lap/cai-dat',
  },
]

export function ThietLapSubmenuPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Thiết lập
          </h1>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {thietLapModules.map((module) => {
          const ModuleIcon = module.icon
          return (
            <Link key={module.id} to={module.path}>
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer group">
                <CardContent className="p-4">
                  <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
                    {/* Icon bên trái */}
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <ModuleIcon className="h-6 w-6 text-primary" />
                    </div>
                    
                    {/* Nội dung bên phải */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <CardTitle className="text-base leading-tight">{module.title}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">{module.description}</CardDescription>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

