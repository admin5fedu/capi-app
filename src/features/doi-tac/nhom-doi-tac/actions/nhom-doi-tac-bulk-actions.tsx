import type { BulkActionItem } from '@/shared/components/generic/types'
import type { NhomDoiTac } from '@/types/nhom-doi-tac'
import { Trash2 } from 'lucide-react'

interface BulkActionsProps {
  onBulkDelete: (selectedRows: NhomDoiTac[]) => void
}

/**
 * Các hành động hàng loạt cho module Nhóm đối tác
 */
export function getBulkActions({ onBulkDelete }: BulkActionsProps): BulkActionItem<NhomDoiTac>[] {
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

