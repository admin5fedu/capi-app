import type { BulkActionItem } from '@/shared/components/generic/types'
import type { DanhMucWithParent } from '@/types/danh-muc'
import { Trash2 } from 'lucide-react'

interface GetBulkActionsParams {
  onBulkDelete: (selectedRows: DanhMucWithParent[]) => void
}

export function getBulkActions({ onBulkDelete }: GetBulkActionsParams): BulkActionItem<DanhMucWithParent>[] {
  return [
    {
      label: 'Xóa nhiều',
      icon: Trash2,
      variant: 'destructive',
      onClick: onBulkDelete,
    },
  ]
}

