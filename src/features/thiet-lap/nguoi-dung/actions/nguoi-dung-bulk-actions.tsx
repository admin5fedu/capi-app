import { Trash2 } from 'lucide-react'
import type { BulkActionItem } from '@/shared/components/generic/types'
import type { NguoiDung } from '@/types/nguoi-dung'

interface BulkActionsProps {
  onBulkDelete: (selectedRows: NguoiDung[]) => void
}

/**
 * Bulk actions cho module Người dùng
 */
export function getBulkActions({ onBulkDelete }: BulkActionsProps): BulkActionItem<NguoiDung>[] {
  return [
    {
      label: 'Xóa đã chọn',
      icon: Trash2,
      onClick: onBulkDelete,
      variant: 'destructive',
    },
  ]
}

