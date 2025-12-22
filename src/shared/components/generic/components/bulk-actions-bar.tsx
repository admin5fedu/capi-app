import { Button } from '@/components/ui/button'
import type { BulkActionItem } from '../types'

interface BulkActionsBarProps<TData extends Record<string, any>> {
  selectedRows: TData[]
  bulkActions: BulkActionItem<TData>[]
}

export function BulkActionsBar<TData extends Record<string, any>>({
  selectedRows,
  bulkActions,
}: BulkActionsBarProps<TData>) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Đã chọn: {selectedRows.length}</span>
      <div className="flex gap-1">
        {bulkActions
          .filter((action) => !action.hidden || !action.hidden(selectedRows))
          .map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => action.onClick(selectedRows)}
                className="h-7 text-xs"
              >
                {Icon && <Icon className="h-3 w-3 mr-1" />}
                {action.label}
              </Button>
            )
          })}
      </div>
    </div>
  )
}

