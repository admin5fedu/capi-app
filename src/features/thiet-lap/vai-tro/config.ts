import type { CotHienThi } from '@/shared/components/generic/types'
import type { VaiTro } from '@/types/vai-tro'

/**
 * Cấu hình module Vai trò
 */

// Các cột hiển thị trong bảng
export const COT_HIEN_THI: CotHienThi<VaiTro>[] = [
  {
    key: 'ten_vai_tro',
    label: 'Tên vai trò',
    accessorKey: (row: VaiTro) => row.ten_vai_tro || row.ten || '',
    sortable: true,
    width: 200,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'mo_ta',
    label: 'Mô tả',
    accessorKey: 'mo_ta',
    sortable: false,
    width: 300,
    align: 'left',
    defaultVisible: true,
    cell: (value) => (value ? String(value) : null),
  },
  {
    key: 'tg_tao',
    label: 'Ngày tạo',
    accessorKey: (row: VaiTro) => row.tg_tao || row.created_at || null,
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
    accessorKey: (row: VaiTro) => row.tg_cap_nhat || row.updated_at || null,
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
  xem: 'xem_vai_tro',
  them: 'them_vai_tro',
  sua: 'sua_vai_tro',
  xoa: 'xoa_vai_tro',
}

// Tiêu đề module
export const TIEU_DE_MODULE = 'Quản lý vai trò'

// Tên lưu trữ cấu hình cột
export const TEN_LUU_TRU_COT = 'vai-tro-columns'

