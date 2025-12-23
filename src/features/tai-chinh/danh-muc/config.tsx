import type { CotHienThi } from '@/shared/components/generic/types'
import type { DanhMucWithParent } from '@/types/danh-muc'
import { Badge } from '@/components/ui/badge'
import { getThuChiBadgeVariant, getStatusBadgeVariant } from '@/shared/utils/color-utils'
import { isLevel1, isLevel2 } from './utils/danh-muc-helpers'
import { cn } from '@/lib/utils'

/**
 * Cấu hình module Danh mục
 */

// Các loại danh mục tài chính
export const LOAI_DANH_MUC = [
  { value: 'thu', label: 'Thu' },
  { value: 'chi', label: 'Chi' },
] as const

// Các cột hiển thị trong bảng
export const COT_HIEN_THI: CotHienThi<DanhMucWithParent>[] = [
  {
    key: 'ten',
    label: 'Tên danh mục',
    accessorKey: 'ten',
    sortable: true,
    width: 300,
    align: 'left',
    defaultVisible: true,
    cell: (value, row) => {
      const danhMuc = row as DanhMucWithParent
      const isLevel1Item = isLevel1(danhMuc)
      const isLevel2Item = isLevel2(danhMuc)

      return (
        <div
          className={cn(
            'flex items-center',
            isLevel1Item && 'font-semibold',
            isLevel2Item && 'pl-6 text-muted-foreground'
          )}
        >
          {isLevel2Item && (
            <span className="mr-2 text-muted-foreground">└─</span>
          )}
          <span>{value || '—'}</span>
        </div>
      )
    },
  },
  {
    key: 'loai',
    label: 'Loại',
    accessorKey: 'loai',
    sortable: true,
    width: 150,
    align: 'left',
    defaultVisible: true,
    cell: (value) => {
      const loai = LOAI_DANH_MUC.find((l) => l.value === value)
      const label = loai ? loai.label : value || '—'
      return (
        <Badge variant={getThuChiBadgeVariant(value)}>
          {label}
        </Badge>
      )
    },
  },
  {
    key: 'parent_ten',
    label: 'Danh mục cha',
    accessorKey: 'parent_ten',
    sortable: false,
    width: 200,
    align: 'left',
    defaultVisible: false, // Ẩn vì đã có indent trong cột tên
    cell: (value) => value || <span className="text-muted-foreground">—</span>,
  },
  {
    key: 'thu_tu',
    label: 'Thứ tự',
    accessorKey: 'thu_tu',
    sortable: true,
    width: 100,
    align: 'center',
    defaultVisible: true,
    cell: (value) => value ?? 0,
  },
  {
    key: 'is_active',
    label: 'Trạng thái',
    accessorKey: 'is_active',
    sortable: true,
    width: 120,
    align: 'center',
    defaultVisible: true,
    cell: (value) => (
      <Badge variant={getStatusBadgeVariant(value)}>
        {value ? 'Hoạt động' : 'Vô hiệu hóa'}
      </Badge>
    ),
  },
  {
    key: 'mo_ta',
    label: 'Mô tả',
    accessorKey: 'mo_ta',
    sortable: false,
    width: 300,
    align: 'left',
    defaultVisible: false,
    cell: (value) => (value ? String(value) : null),
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
    accessorKey: 'created_at',
    sortable: true,
    width: 150,
    align: 'left',
    defaultVisible: true,
    cell: (value) => {
      if (!value) return '—'
      return new Date(value).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    },
  },
  {
    key: 'updated_at',
    label: 'Ngày cập nhật',
    accessorKey: 'updated_at',
    sortable: true,
    width: 150,
    align: 'left',
    defaultVisible: false,
    cell: (value) => {
      if (!value) return '—'
      return new Date(value).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    },
  },
]

// Quyền truy cập module
export const QUYEN_TRUY_CAP = {
  xem: 'xem_danh_muc',
  them: 'them_danh_muc',
  sua: 'sua_danh_muc',
  xoa: 'xoa_danh_muc',
}

// Tiêu đề module
export const TIEU_DE_MODULE = 'Quản lý danh mục'

// Tên lưu trữ cấu hình cột
export const TEN_LUU_TRU_COT = 'danh-muc-columns'

