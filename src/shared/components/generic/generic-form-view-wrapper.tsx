import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { GenericFormViewWrapperProps } from './types'

export function GenericFormViewWrapper({
  mode,
  title,
  children,
  isOpen = true,
  onClose,
  onSubmit,
  onCancel,
  isLoading = false,
  size = 'md',
}: GenericFormViewWrapperProps) {
  if (mode === 'modal') {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
        <DialogContent
          className={cn(
            'max-h-[90vh] overflow-y-auto',
            size === 'sm' && 'max-w-sm',
            size === 'md' && 'max-w-md',
            size === 'lg' && 'max-w-lg',
            size === 'xl' && 'max-w-xl',
            size === 'full' && 'max-w-[95vw]'
          )}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">{children}</div>
          {(onSubmit || onCancel) && (
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 border rounded-md hover:bg-muted"
                  disabled={isLoading}
                >
                  Hủy
                </button>
              )}
              {onSubmit && (
                <button
                  onClick={onSubmit}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang xử lý...' : 'Lưu'}
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  // Page mode
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-muted"
            disabled={isLoading}
          >
            Hủy
          </button>
        )}
      </div>
      <div className="bg-card border rounded-lg p-6">{children}</div>
      {onSubmit && (
        <div className="flex justify-end gap-2">
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Lưu'}
          </button>
        </div>
      )}
    </div>
  )
}

