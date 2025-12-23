import type { CotHienThi } from '@/shared/components/generic/types'
import type { NhomDoiTac } from '@/types/nhom-doi-tac'
import React from 'react'

/**
 * Cấu hình module Nhóm đối tác
 */

// Các cột hiển thị trong bảng
export const COT_HIEN_THI: CotHienThi<NhomDoiTac>[] = [
  {
    key: 'ten',
    label: 'Tên nhóm',
    accessorKey: 'ten',
    sortable: true,
    width: 250,
    align: 'left',
    defaultVisible: true,
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
      const label = value === 'nha_cung_cap' ? 'Nhà cung cấp' : 'Khách hàng'
      const className = value === 'nha_cung_cap' ? 'text-blue-600' : 'text-green-600'
      return React.createElement('span', { className }, label)
    },
  },
  {
    key: 'mo_ta',
    label: 'Mô tả',
    accessorKey: 'mo_ta',
    sortable: false,
    width: 400,
    align: 'left',
    defaultVisible: true,
    cell: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'trang_thai',
    label: 'Trạng thái',
    accessorKey: 'trang_thai',
    sortable: true,
    width: 120,
    align: 'center',
    defaultVisible: true,
    cell: (value) => {
      if (value) {
        return React.createElement('span', { className: 'text-green-600' }, 'Hoạt động')
      }
      return React.createElement('span', { className: 'text-red-600' }, 'Vô hiệu hóa')
    },
  },
  {
    key: 'nguoi_tao_id',
    label: 'Người tạo',
    accessorKey: 'nguoi_tao_id',
    sortable: true,
    width: 180,
    align: 'left',
    defaultVisible: true,
    cell: (value, _row) => {
      // Sẽ hiển thị tên người tạo sau khi join với bảng nguoi-dung
      // Tạm thời hiển thị ID
      return React.createElement('span', {}, value || '—')
    },
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
  xem: 'xem_nhom_doi_tac',
  them: 'them_nhom_doi_tac',
  sua: 'sua_nhom_doi_tac',
  xoa: 'xoa_nhom_doi_tac',
}

// Tiêu đề module
export const TIEU_DE_MODULE = 'Quản lý nhóm đối tác'

// Tên lưu trữ cấu hình cột
export const TEN_LUU_TRU_COT = 'nhom-doi-tac-columns'

// Các loại đối tác
export const LOAI_DOI_TAC = [
  { value: 'nha_cung_cap', label: 'Nhà cung cấp' },
  { value: 'khach_hang', label: 'Khách hàng' },
] as const

// Tab options
export type TabType = 'nha_cung_cap' | 'khach_hang'

export const TABS = [
  { value: 'nha_cung_cap' as TabType, label: 'Nhà cung cấp' },
  { value: 'khach_hang' as TabType, label: 'Khách hàng' },
] as const

