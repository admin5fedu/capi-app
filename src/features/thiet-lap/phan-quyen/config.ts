/**
 * Cấu hình module Phân quyền
 */

// Định nghĩa các module trong hệ thống
export const MODULES = [
  { key: 'vai_tro', label: 'Vai trò' },
  { key: 'nguoi_dung', label: 'Người dùng' },
  { key: 'phan_quyen', label: 'Phân quyền' },
  { key: 'cai_dat', label: 'Cài đặt' },
  { key: 'tai_chinh', label: 'Tài chính' },
  { key: 'doi_tac', label: 'Đối tác' },
  { key: 'hanh_chinh', label: 'Hành chính' },
] as const

// Định nghĩa các action trong hệ thống
export const ACTIONS = [
  { key: 'xem', label: 'Xem' },
  { key: 'them', label: 'Thêm' },
  { key: 'sua', label: 'Sửa' },
  { key: 'xoa', label: 'Xóa' },
] as const

// Tiêu đề module
export const TIEU_DE_MODULE = 'Phân quyền'

