import type { CotHienThi } from '@/shared/components/generic/types'
import type { TaiKhoan } from '@/types/tai-khoan'
import React from 'react'
import { Badge } from '@/components/ui/badge'
import { getTaiKhoanLoaiBadgeVariant, getStatusBadgeVariant } from '@/shared/utils/color-utils'

/**
 * Cấu hình module Tài khoản
 */

// Các loại tài khoản (chỉ 2 loại: Tiền mặt và Tài khoản)
export const LOAI_TAI_KHOAN = [
  { value: 'tien_mat', label: 'Tiền mặt' },
  { value: 'tai_khoan', label: 'Tài khoản' },
] as const

// Các loại tiền (đơn vị)
export const LOAI_TIEN = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
] as const

// Các trạng thái
export const TRANG_THAI = [
  { value: 'hoat_dong', label: 'Hoạt động' },
  { value: 'vo_hieu_hoa', label: 'Vô hiệu hóa' },
] as const

// Các cột hiển thị trong bảng
export const COT_HIEN_THI: CotHienThi<TaiKhoan>[] = [
  {
    key: 'ten',
    label: 'Tên tài khoản',
    accessorKey: (row: any) => row.ten_tai_khoan || row.ten || null,
    sortable: true,
    width: 200,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'loai',
    label: 'Loại',
    accessorKey: (row: any) => row.loai_tai_khoan || row.loai || null,
    sortable: true,
    width: 120,
    align: 'left',
    defaultVisible: true,
    cell: (value, row) => {
      const loaiValue = row.loai_tai_khoan || row.loai || value
      const loai = LOAI_TAI_KHOAN.find((l) => l.value === loaiValue)
      const label = loai ? loai.label : loaiValue || '—'
      return (
        <Badge variant={getTaiKhoanLoaiBadgeVariant(loaiValue)}>
          {label}
        </Badge>
      )
    },
  },
  {
    key: 'loai_tien',
    label: 'Đơn vị',
    accessorKey: (row: any) => row.don_vi || row.loai_tien || null,
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
    label: 'Số dư đầu',
    accessorKey: (row: any) => row.so_du_dau ?? row.so_du_ban_dau ?? null,
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
    accessorKey: (row: any) => {
      // Convert trang_thai (text) to is_active (boolean) for display
      const trangThai = row.trang_thai
      if (!trangThai) return row.is_active ?? null
      return trangThai.toLowerCase() === 'hoat_dong' || trangThai === 'active' || trangThai === 'true'
    },
    sortable: true,
    width: 120,
    align: 'center',
    defaultVisible: true,
    cell: (value, row) => {
      const trangThai = row.trang_thai
      const isActive = trangThai 
        ? (trangThai.toLowerCase() === 'hoat_dong' || trangThai === 'active' || trangThai === 'true')
        : (value ?? true)
      return (
        <Badge variant={getStatusBadgeVariant(isActive)}>
          {isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
        </Badge>
      )
    },
  },
  {
    key: 'mo_ta',
    label: 'Ghi chú',
    accessorKey: (row: any) => row.ghi_chu || row.mo_ta || null,
    sortable: false,
    width: 300,
    align: 'left',
    defaultVisible: false,
    cell: (value) => {
      const text = String(value || '')
      return (
        <div className="max-w-[300px] line-clamp-2" title={text}>
          {text || '—'}
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
  xem: 'xem_tai_khoan',
  them: 'them_tai_khoan',
  sua: 'sua_tai_khoan',
  xoa: 'xoa_tai_khoan',
}

// Tiêu đề module
export const TIEU_DE_MODULE = 'Quản lý tài khoản'

// Tên lưu trữ cấu hình cột
export const TEN_LUU_TRU_COT = 'tai-khoan-columns'

