import type { CotHienThi } from '@/shared/components/generic/types'
import type { PhongBan } from '@/types/phong-ban'

/**
 * Cấu hình module Phòng ban
 */

// Các cột hiển thị trong bảng
export const COT_HIEN_THI: CotHienThi<PhongBan>[] = [
  {
    key: 'ma_phong_ban',
    label: 'Mã phòng ban',
    accessorKey: 'ma_phong_ban',
    sortable: true,
    width: 150,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'ten_phong_ban',
    label: 'Tên phòng ban',
    accessorKey: 'ten_phong_ban',
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
    accessorKey: (row: PhongBan) => row.tg_tao || row.created_at || null,
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
    accessorKey: (row: PhongBan) => row.tg_cap_nhat || row.updated_at || null,
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
  xem: 'xem_phong_ban',
  them: 'them_phong_ban',
  sua: 'sua_phong_ban',
  xoa: 'xoa_phong_ban',
}

// Tiêu đề module
export const TIEU_DE_MODULE = 'Quản lý phòng ban'

// Tên lưu trữ cấu hình cột
export const TEN_LUU_TRU_COT = 'phong-ban-columns'

