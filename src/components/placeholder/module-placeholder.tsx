import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Construction, Code, Calendar, Sparkles } from 'lucide-react'

interface ModulePlaceholderProps {
  title: string
  description?: string
  expectedDate?: string
}

/**
 * Component placeholder cho các module chưa được xây dựng
 * Sử dụng Shadcn UI Card component
 */
export function ModulePlaceholder({ title, description, expectedDate }: ModulePlaceholderProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="w-full max-w-lg border-2 border-dashed">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Construction className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold">{title}</CardTitle>
            <CardDescription className="text-base mt-2 max-w-md mx-auto">
              {description || 'Module này đang được phát triển và sẽ sớm có mặt.'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            <Code className="h-4 w-4 animate-pulse" />
            <span>Đang trong quá trình xây dựng</span>
          </div>
          
          {expectedDate && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Calendar className="h-4 w-4" />
              <span>Dự kiến hoàn thành: {expectedDate}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <Sparkles className="h-3 w-3" />
            <span>Tính năng mới đang được phát triển</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

