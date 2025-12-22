import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMobile } from '../hooks/use-mobile'

interface FormHeaderProps {
  title: string
  onBack?: () => void
}

export function FormHeader({ title, onBack }: FormHeaderProps) {
  const isMobile = useMobile()

  return (
    <div className="flex-shrink-0 border-b bg-card px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 shadow-sm">
      {/* Mobile: 2 hàng riêng biệt */}
      {isMobile ? (
        <div className="space-y-2">
          {/* Hàng 1: Back button + Title */}
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="flex-shrink-0 h-11 w-11"
                title="Quay lại"
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h1 className="text-xl font-bold truncate flex-1 min-w-0">{title}</h1>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="flex-shrink-0"
                title="Quay lại"
                type="button"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h1 className="text-2xl font-bold truncate">{title}</h1>
          </div>
        </div>
      )}
    </div>
  )
}

