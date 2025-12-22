import type { CotHienThi } from '@/shared/components/generic/types'
import type { TaiKhoan } from '@/types/tai-khoan'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { getTaiKhoanLoaiBadgeVariant, getStatusBadgeVariant } from '@/shared/utils/color-utils'

/**
 * Cấu hình module Tài khoản
 */

// Các loại tài khoản
export const LOAI_TAI_KHOAN = [
  { value: 'tien_mat', label: 'Tiền mặt' },
  { value: 'ngan_hang', label: 'Ngân hàng' },
  { value: 'vi_dien_tu', label: 'Ví điện tử' },
  { value: 'khac', label: 'Khác' },
] as const

// Các loại tiền
export const LOAI_TIEN = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
] as const

// Các cột hiển thị trong bảng
export const COT_HIEN_THI: CotHienThi<TaiKhoan>[] = [
  {
    key: 'ten',
    label: 'Tên tài khoản',
    accessorKey: 'ten',
    sortable: true,
    width: 200,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'loai',
    label: 'Loại',
    accessorKey: 'loai',
    sortable: true,
    width: 120,
    align: 'left',
    defaultVisible: true,
    cell: (value, row) => {
      const loai = LOAI_TAI_KHOAN.find((l) => l.value === value)
      const label = loai ? loai.label : value || '—'
      return (
        <Badge variant={getTaiKhoanLoaiBadgeVariant(value)}>
          {label}
        </Badge>
      )
    },
  },
  {
    key: 'loai_tien',
    label: 'Loại tiền',
    accessorKey: 'loai_tien',
    sortable: true,
    width: 120,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'so_tai_khoan',
    label: 'Số tài khoản',
    accessorKey: 'so_tai_khoan',
    sortable: false,
    width: 150,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'ngan_hang',
    label: 'Ngân hàng',
    accessorKey: 'ngan_hang',
    sortable: false,
    width: 150,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'chu_tai_khoan',
    label: 'Chủ tài khoản',
    accessorKey: 'chu_tai_khoan',
    sortable: false,
    width: 150,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'so_du_ban_dau',
    label: 'Số dư ban đầu',
    accessorKey: 'so_du_ban_dau',
    sortable: true,
    width: 150,
    align: 'right',
    defaultVisible: true,
    cell: (value) => {
      if (value === null || value === undefined) return '—'
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(Number(value))
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
  xem: 'xem_tai_khoan',
  them: 'them_tai_khoan',
  sua: 'sua_tai_khoan',
  xoa: 'xoa_tai_khoan',
}

// Tiêu đề module
export const TIEU_DE_MODULE = 'Quản lý tài khoản'

// Tên lưu trữ cấu hình cột
export const TEN_LUU_TRU_COT = 'tai-khoan-columns'

