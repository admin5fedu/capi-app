import type { BulkActionItem } from '@/shared/components/generic/types'
import type { TaiKhoan } from '@/types/tai-khoan'
import { Trash2 } from 'lucide-react'

interface GetBulkActionsParams {
  onBulkDelete: (selectedRows: TaiKhoan[]) => void
}

export function getBulkActions({ onBulkDelete }: GetBulkActionsParams): BulkActionItem<TaiKhoan>[] {
  return [
    {
      label: 'Xóa nhiều',
      icon: Trash2,
      variant: 'destructive',
      onClick: onBulkDelete,
    },
  ]
}

