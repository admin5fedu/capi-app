import { Trash2 } from 'lucide-react'
import type { BulkActionItem } from '@/shared/components/generic/types'
import type { PhongBan } from '@/types/phong-ban'

interface BulkActionsProps {
  onBulkDelete: (selectedRows: PhongBan[]) => void
}

/**
 * Bulk actions cho module Phòng ban
 */
export function getBulkActions({ onBulkDelete }: BulkActionsProps): BulkActionItem<PhongBan>[] {
  return [
    {
      label: 'Xóa đã chọn',
      icon: Trash2,
      onClick: onBulkDelete,
      variant: 'destructive',
    },
  ]
}

