/**
 * Cấu hình module Phân quyền
 */

// Định nghĩa nhóm module
export interface ModuleGroup {
  key: string
  label: string
  modules: Module[]
}

export interface Module {
  key: string
  label: string
}

// Định nghĩa các nhóm module trong hệ thống
export const MODULE_GROUPS: ModuleGroup[] = [
  {
    key: 'thiet_lap',
    label: 'Thiết lập',
    modules: [
      { key: 'vai_tro', label: 'Vai trò' },
      { key: 'nguoi_dung', label: 'Người dùng' },
      { key: 'phan_quyen', label: 'Phân quyền' },
      { key: 'cai_dat', label: 'Cài đặt' },
    ],
  },
  {
    key: 'tai_chinh',
    label: 'Tài chính',
    modules: [
      { key: 'tai_chinh_danh_muc', label: 'Danh mục' },
      { key: 'tai_chinh_tai_khoan', label: 'Tài khoản' },
      { key: 'tai_chinh_thu_chi', label: 'Giao dịch' },
    ],
  },
  {
    key: 'doi_tac',
    label: 'Đối tác',
    modules: [
      { key: 'doi_tac_nhom_doi_tac', label: 'Nhóm đối tác' },
      { key: 'doi_tac_danh_sach_doi_tac', label: 'Danh sách đối tác' },
    ],
  },
  {
    key: 'hanh_chinh',
    label: 'Hành chính',
    modules: [
      { key: 'hanh_chinh_phieu_yeu_cau', label: 'Phiếu yêu cầu' },
    ],
  },
] as const

// Flatten tất cả modules để dùng trong matrix
export const MODULES: Module[] = MODULE_GROUPS.flatMap((group) => group.modules)

// Định nghĩa các action trong hệ thống
export const ACTIONS = [
  { key: 'xem', label: 'Xem' },
  { key: 'them', label: 'Thêm' },
  { key: 'sua', label: 'Sửa' },
  { key: 'xoa', label: 'Xóa' },
  { key: 'quan_tri', label: 'Quản trị' },
] as const

// Tiêu đề module
export const TIEU_DE_MODULE = 'Phân quyền'

