import type { CotHienThi } from '@/shared/components/generic/types'
import type { DoiTac } from '@/types/doi-tac'
import React from 'react'

/**
 * Cấu hình module Danh sách đối tác
 */

// Các cột hiển thị trong bảng
export const COT_HIEN_THI: CotHienThi<DoiTac>[] = [
  {
    key: 'ten_doi_tac',
    label: 'Tên đối tác',
    accessorKey: 'ten_doi_tac',
    sortable: true,
    width: 250,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'ten_nhom_doi_tac',
    label: 'Nhóm đối tác',
    accessorKey: 'ten_nhom_doi_tac',
    sortable: true,
    width: 200,
    align: 'left',
    defaultVisible: true,
    cell: (value) => (value ? String(value) : '—'),
  },
  {
    key: 'cong_ty',
    label: 'Công ty',
    accessorKey: 'cong_ty',
    sortable: true,
    width: 200,
    align: 'left',
    defaultVisible: true,
    cell: (value) => (value ? String(value) : '—'),
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
    key: 'so_dien_thoai',
    label: 'Số điện thoại',
    accessorKey: 'so_dien_thoai',
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
    key: 'thong_tin_khac',
    label: 'Thông tin khác',
    accessorKey: 'thong_tin_khac',
    sortable: false,
    width: 300,
    align: 'left',
    defaultVisible: false,
    cell: (value) => (value ? String(value) : '—'),
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

