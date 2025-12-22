import type { CotHienThi } from '@/shared/components/generic/types'
import type { DoiTac } from '@/types/doi-tac'
import React from 'react'

/**
 * Cấu hình module Danh sách đối tác
 */

// Các cột hiển thị trong bảng
export const COT_HIEN_THI: CotHienThi<DoiTac>[] = [
  {
    key: 'ma',
    label: 'Mã đối tác',
    accessorKey: 'ma',
    sortable: true,
    width: 120,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'ten',
    label: 'Tên đối tác',
    accessorKey: 'ten',
    sortable: true,
    width: 250,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'nhom_doi_tac_id',
    label: 'Nhóm đối tác',
    accessorKey: 'nhom_doi_tac_id',
    sortable: true,
    width: 200,
    align: 'left',
    defaultVisible: true,
    cell: (value) => {
      // Sẽ hiển thị tên nhóm đối tác sau khi join với bảng nhom-doi-tac
      // Tạm thời hiển thị ID
      return React.createElement('span', {}, value || '—')
    },
  },
  {
    key: 'email',
    label: 'Email',
    accessorKey: 'email',
    sortable: true,
    width: 200,
    align: 'left',
    defaultVisible: true,
    cell: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'dien_thoai',
    label: 'Điện thoại',
    accessorKey: 'dien_thoai',
    sortable: true,
    width: 150,
    align: 'left',
    defaultVisible: true,
    cell: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'dia_chi',
    label: 'Địa chỉ',
    accessorKey: 'dia_chi',
    sortable: false,
    width: 300,
    align: 'left',
    defaultVisible: true,
    cell: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'ma_so_thue',
    label: 'Mã số thuế',
    accessorKey: 'ma_so_thue',
    sortable: true,
    width: 150,
    align: 'left',
    defaultVisible: true,
    cell: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'nguoi_lien_he',
    label: 'Người liên hệ',
    accessorKey: 'nguoi_lien_he',
    sortable: true,
    width: 180,
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
    cell: (value) => {
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
  xem: 'xem_danh_sach_doi_tac',
  them: 'them_danh_sach_doi_tac',
  sua: 'sua_danh_sach_doi_tac',
  xoa: 'xoa_danh_sach_doi_tac',
}

// Tiêu đề module
export const TIEU_DE_MODULE = 'Quản lý danh sách đối tác'

// Tên lưu trữ cấu hình cột
export const TEN_LUU_TRU_COT = 'danh-sach-doi-tac-columns'

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

