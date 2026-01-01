import type { CotHienThi } from '@/shared/components/generic/types'
import type { DanhMucWithParent } from '@/types/danh-muc'
import { Badge } from '@/components/ui/badge'
import { getThuChiBadgeVariant } from '@/shared/utils/color-utils'
import { isLevel1, isLevel2 } from './utils/danh-muc-helpers'
// import { cn } from '@/lib/utils' // Unused

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
      const isLevel2Item = isLevel2(danhMuc)

      if (isLevel2Item) {
        return (
          <div className="flex items-center pl-6">
            {/* Line nối - chỉ 1 line */}
            <span className="mr-2 text-muted-foreground">└─</span>
            
            {/* Tên danh mục cấp 2 - in nghiêng */}
            <span className="italic text-foreground">
              {value || '—'}
            </span>
          </div>
        )
      }

      // Cấp 1 - bôi đậm, màu primary
      return (
        <div className="flex items-center">
          <span className="font-semibold text-primary">
            {value || '—'}
          </span>
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
    key: 'cap',
    label: 'Cấp độ',
    accessorKey: 'cap',
    sortable: true,
    width: 100,
    align: 'center',
    defaultVisible: true,
    cell: (value, row) => {
      const danhMuc = row as DanhMucWithParent
      const isLevel1Item = isLevel1(danhMuc)
      const isLevel2Item = isLevel2(danhMuc)
      
      if (!value) return '—'
      
      // Format rules: Cấp 1 - bold primary, Cấp 2 - italic
      if (isLevel1Item) {
        return <span className="font-semibold text-primary">Cấp {value}</span>
      }
      if (isLevel2Item) {
        return <span className="italic text-foreground">Cấp {value}</span>
      }
      
      return `Cấp ${value}`
    },
  },
  {
    key: 'mo_ta',
    label: 'Mô tả',
    accessorKey: 'mo_ta',
    sortable: false,
    width: 300,
    align: 'left',
    defaultVisible: false,
    cell: (value) => {
      if (!value) return <span className="text-muted-foreground">—</span>
      
      const text = String(value)
      
      return (
        <div 
          className="line-clamp-2 text-sm text-foreground max-w-[300px]"
          title={text} // Tooltip hiển thị full text khi hover
        >
          {text}
        </div>
      )
    },
  },
  {
    key: 'tg_tao',
    label: 'Ngày tạo',
    accessorKey: (row: any) => row.tg_tao || row.created_at || null,
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
    key: 'tg_cap_nhat',
    label: 'Ngày cập nhật',
    accessorKey: (row: any) => row.tg_cap_nhat || row.updated_at || null,
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
export const TIEU_DE_MODULE = 'Quản lý danh mục tài chính'

// Tên lưu trữ cấu hình cột
export const TEN_LUU_TRU_COT = 'danh-muc-columns'

