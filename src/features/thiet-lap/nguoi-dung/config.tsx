import type { CotHienThi } from '@/shared/components/generic/types'
import type { NguoiDung } from '@/types/nguoi-dung'
import { Badge } from '@/components/ui/badge'
import { getStatusBadgeVariant } from '@/shared/utils/color-utils'

/**
 * Cấu hình module Người dùng
 */

// Các cột hiển thị trong bảng
export const COT_HIEN_THI: CotHienThi<NguoiDung>[] = [
  {
    key: 'ho_ten',
    label: 'Họ tên',
    accessorKey: 'ho_ten',
    sortable: true,
    width: 200,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'email',
    label: 'Email',
    accessorKey: 'email',
    sortable: true,
    width: 250,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'vai_tro',
    label: 'Vai trò',
    accessorKey: (row: any) => row.vai_tro?.ten || '', // Function để lấy tên vai trò
    sortable: false,
    width: 150,
    align: 'left',
    defaultVisible: true,
    cell: (value, row: any) => {
      // value đã là tên vai trò từ accessorKey function
      // Nếu có tên, hiển thị tên, nếu không hiển thị "Chưa có vai trò"
      return value || row.vai_tro?.ten || 'Chưa có vai trò'
    },
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
        hour: '2-digit',
        minute: '2-digit',
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
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
]

// Quyền truy cập module
export const QUYEN_TRUY_CAP = {
  xem: 'xem_nguoi_dung',
  them: 'them_nguoi_dung',
  sua: 'sua_nguoi_dung',
  xoa: 'xoa_nguoi_dung',
}

// Tiêu đề module
export const TIEU_DE_MODULE = 'Quản lý người dùng'

// Tên lưu trữ cấu hình cột
export const TEN_LUU_TRU_COT = 'nguoi-dung-columns'
