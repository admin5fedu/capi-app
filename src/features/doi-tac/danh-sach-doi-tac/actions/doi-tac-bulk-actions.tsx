import type { BulkActionItem } from '@/shared/components/generic/types'
import type { DoiTac } from '@/types/doi-tac'
import { Trash2 } from 'lucide-react'

interface BulkActionsProps {
  onBulkDelete: (selectedRows: DoiTac[]) => void
}

/**
 * Các hành động hàng loạt cho module Danh sách đối tác
 */
export function getBulkActions({ onBulkDelete }: BulkActionsProps): BulkActionItem<DoiTac>[] {
  return [
    {
      label: 'Xóa nhiều',
      icon: Trash2,
      variant: 'destructive',
      onClick: onBulkDelete,
      requiresConfirm: true,
    },
  ]
}

