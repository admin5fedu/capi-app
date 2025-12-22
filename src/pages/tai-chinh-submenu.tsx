import { Link } from 'react-router-dom'
import {
  DollarSign,
  FileText,
  CreditCard,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'

interface ModuleCard {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

const taiChinhModules: ModuleCard[] = [
  {
    id: 'danh-muc',
    title: 'Danh mục',
    description: 'Quản lý danh mục tài chính, khách hàng, nhà cung cấp',
    icon: FileText,
    path: '/tai-chinh/danh-muc',
  },
  {
    id: 'tai-khoan',
    title: 'Tài khoản',
    description: 'Quản lý tài khoản ngân hàng và tài chính',
    icon: CreditCard,
    path: '/tai-chinh/tai-khoan',
  },
  {
    id: 'thu-chi',
    title: 'Thu chi',
    description: 'Quản lý các khoản thu chi, dòng tiền',
    icon: DollarSign,
    path: '/tai-chinh/thu-chi',
  },
  {
    id: 'ty-gia',
    title: 'Tỷ giá',
    description: 'Quản lý tỷ giá hối đoái và chuyển đổi tiền tệ',
    icon: TrendingUp,
    path: '/tai-chinh/ty-gia',
  },
]

export function TaiChinhSubmenuPage() {
  return (
    <div className="h-full overflow-y-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Tài chính
          </h1>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {taiChinhModules.map((module) => {
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

