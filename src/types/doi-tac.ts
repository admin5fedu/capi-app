/**
 * Type definitions cho bảng zz_cst_danh_sach_doi_tac (Đối tác)
 */

export type LoaiDoiTac = 'nha_cung_cap' | 'khach_hang'

export interface DoiTac {
  id: string
  ma: string
  ten: string
  loai: LoaiDoiTac
  nhom_doi_tac_id: string | null
  email: string | null
  dien_thoai: string | null
  dia_chi: string | null
  ma_so_thue: string | null
  nguoi_lien_he: string | null
  ghi_chu: string | null
  trang_thai: boolean
  nguoi_tao_id: string | null
  created_at: string | null
  updated_at: string | null
}

export interface DoiTacInsert {
  ma: string
  ten: string
  loai: LoaiDoiTac
  nhom_doi_tac_id?: string | null
  email?: string | null
  dien_thoai?: string | null
  dia_chi?: string | null
  ma_so_thue?: string | null
  nguoi_lien_he?: string | null
  ghi_chu?: string | null
  trang_thai?: boolean | null
  nguoi_tao_id?: string | null
}

export interface DoiTacUpdate {
  ma?: string
  ten?: string
  loai?: LoaiDoiTac
  nhom_doi_tac_id?: string | null
  email?: string | null
  dien_thoai?: string | null
  dia_chi?: string | null
  ma_so_thue?: string | null
  nguoi_lien_he?: string | null
  ghi_chu?: string | null
  trang_thai?: boolean | null
  nguoi_tao_id?: string | null
}

