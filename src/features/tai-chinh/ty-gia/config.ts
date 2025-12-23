import type { CotHienThi } from '@/shared/components/generic/types'
import type { TyGia } from '@/types/ty-gia'
// import React from 'react' // Unused

/**
 * Cấu hình module Tỷ giá
 */

// Các cột hiển thị trong bảng
export const COT_HIEN_THI: CotHienThi<TyGia>[] = [
  {
    key: 'ty_gia',
    label: 'Tỷ giá',
    accessorKey: 'ty_gia',
    sortable: true,
    width: 150,
    align: 'right',
    defaultVisible: true,
    cell: (value) => {
      if (value === null || value === undefined) return '—'
      return new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(Number(value))
    },
  },
  {
    key: 'ngay_ap_dung',
    label: 'Ngày áp dụng',
    accessorKey: 'ngay_ap_dung',
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
    key: 'ghi_chu',
    label: 'Ghi chú',
    accessorKey: 'ghi_chu',
    sortable: false,
    width: 300,
    align: 'left',
    defaultVisible: true,
    cell: (value) => (value ? String(value) : '—'),
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
  xem: 'xem_ty_gia',
  them: 'them_ty_gia',
  sua: 'sua_ty_gia',
  xoa: 'xoa_ty_gia',
}

// Tiêu đề module
export const TIEU_DE_MODULE = 'Quản lý tỷ giá'

// Tên lưu trữ cấu hình cột
export const TEN_LUU_TRU_COT = 'ty-gia-columns'

