/**
 * Type definitions cho bảng zz_cst_nhom_doi_tac (Nhóm đối tác)
 */

export type LoaiDoiTac = 'nha_cung_cap' | 'khach_hang'

export interface NhomDoiTac {
  id: string
  ten: string
  loai: LoaiDoiTac
  mo_ta: string | null
  trang_thai: boolean
  nguoi_tao_id: string | null
  created_at: string | null
  updated_at: string | null
}

export interface NhomDoiTacInsert {
  ten: string
  loai: LoaiDoiTac
  mo_ta?: string | null
  trang_thai?: boolean | null
  nguoi_tao_id?: string | null
}

export interface NhomDoiTacUpdate {
  ten?: string
  loai?: LoaiDoiTac
  mo_ta?: string | null
  trang_thai?: boolean | null
  nguoi_tao_id?: string | null
}

