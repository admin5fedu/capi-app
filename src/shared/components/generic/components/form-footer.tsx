import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useMobile } from '../hooks/use-mobile'

interface FormFooterProps {
  onCancel?: () => void
  isLoading?: boolean
  submitLabel?: string
  cancelLabel?: string
}

export function FormFooter({
  onCancel,
  isLoading = false,
  submitLabel = 'Lưu',
  cancelLabel = 'Hủy',
}: FormFooterProps) {
  const isMobile = useMobile()

  return (
    <div className={cn(
      "flex-shrink-0 border-t bg-card px-4 sm:px-6 py-3 sm:py-4",
      "flex items-center justify-end gap-2 sm:gap-3",
      isMobile && "sticky bottom-0 z-10 shadow-lg backdrop-blur-sm bg-card/95"
    )}>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          size={isMobile ? "sm" : "default"}
          className={cn(
            isMobile && "h-11 min-w-[100px]",
            isMobile && "flex-1"
          )}
        >
          {cancelLabel}
        </Button>
      )}
      <Button 
        type="submit" 
        disabled={isLoading} 
        className={cn(
          "gap-2",
          isMobile && "h-11 min-w-[100px]",
          isMobile && "flex-1"
        )}
        size={isMobile ? "sm" : "default"}
      >
        <Save className="h-4 w-4" />
        {isLoading ? 'Đang lưu...' : submitLabel}
      </Button>
    </div>
  )
}

