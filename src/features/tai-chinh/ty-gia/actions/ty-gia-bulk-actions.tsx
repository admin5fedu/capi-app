import type { BulkActionItem } from '@/shared/components/generic/types'
import type { TyGia } from '@/types/ty-gia'
import { Trash2 } from 'lucide-react'

interface GetBulkActionsParams {
  onBulkDelete: (selectedRows: TyGia[]) => void
}

export function getBulkActions({ onBulkDelete }: GetBulkActionsParams): BulkActionItem<TyGia>[] {
  return [
    {
      label: 'Xóa nhiều',
      icon: Trash2,
      variant: 'destructive',
      onClick: onBulkDelete,
    },
  ]
}

