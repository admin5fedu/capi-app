import { Link } from 'react-router-dom'
import {
  DollarSign,
  Users,
  Settings,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth-store'

interface FunctionCard {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  gradientFrom: string
  gradientTo: string
  iconBg: string
  moduleCount: number
}

const functionCards: FunctionCard[] = [
  {
    id: 'tai-chinh',
    title: 'Tài chính',
    description: 'Quản lý danh mục, tài khoản và các khoản thu chi',
    icon: DollarSign,
    path: '/tai-chinh',
    gradientFrom: 'from-emerald-50',
    gradientTo: 'to-teal-50',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    moduleCount: 3,
  },
  {
    id: 'doi-tac',
    title: 'Đối tác',
    description: 'Quản lý nhóm đối tác và danh sách đối tác',
    icon: Users,
    path: '/doi-tac',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-indigo-50',
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    moduleCount: 2,
  },
  {
    id: 'thiet-lap',
    title: 'Thiết lập',
    description: 'Quản lý người dùng, vai trò, phân quyền và cài đặt hệ thống',
    icon: Settings,
    path: '/thiet-lap',
    gradientFrom: 'from-purple-50',
    gradientTo: 'to-pink-50',
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
    moduleCount: 4,
  },
]

export function HomePage() {
  const { nguoiDung } = useAuthStore()

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Chào mừng trở lại, {nguoiDung?.ho_ten || 'Người dùng'}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Chọn chức năng để bắt đầu làm việc
        </p>
      </div>

      {/* Function Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {functionCards.map((card) => {
          const CardIcon = card.icon
          return (
            <Link key={card.id} to={card.path} className="block h-full">
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer group border-2 hover:border-primary/20 overflow-hidden relative">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex flex-col space-y-6">
                    {/* Icon Section */}
                    <div className="flex items-center justify-center relative">
                      <div className={`p-4 rounded-2xl ${card.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <CardIcon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="space-y-3 flex-1 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {card.title}
                        </CardTitle>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {card.moduleCount} module
                        </span>
                      </div>
                      <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                        {card.description}
                      </CardDescription>
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
