/**
 * Type definitions cho bảng zz_capi_nhom_doi_tac (Nhóm đối tác)
 */

export type LoaiDoiTac = 'nha_cung_cap' | 'khach_hang'

export interface NhomDoiTac {
  id: number // bigint (int8) từ DB
  ten_nhom: string | null
  hang_muc: string | null // Lưu loại đối tác: 'nha_cung_cap' hoặc 'khach_hang'
  mo_ta: string | null
  nguoi_tao_id: number | null // bigint từ DB
  tg_tao: string | null // timestamp with time zone
  tg_cap_nhat: string | null // timestamp without time zone
  // Computed fields for backward compatibility
  created_at?: string | null
  updated_at?: string | null
}

export interface NhomDoiTacInsert {
  ten_nhom: string
  hang_muc: LoaiDoiTac // Lưu loại đối tác
  mo_ta?: string | null
  nguoi_tao_id?: number | null
}

export interface NhomDoiTacUpdate {
  ten_nhom?: string
  hang_muc?: LoaiDoiTac
  mo_ta?: string | null
  nguoi_tao_id?: number | null
}

