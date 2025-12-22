import { Trash2 } from 'lucide-react'
import type { BulkActionItem } from '@/shared/components/generic/types'
import type { VaiTro } from '@/types/vai-tro'

interface BulkActionsProps {
  onBulkDelete: (selectedRows: VaiTro[]) => void
}

/**
 * Bulk actions cho module Vai trò
 */
export function getBulkActions({ onBulkDelete }: BulkActionsProps): BulkActionItem<VaiTro>[] {
  return [
    {
      label: 'Xóa đã chọn',
      icon: Trash2,
      onClick: onBulkDelete,
      variant: 'destructive',
    },
  ]
}

