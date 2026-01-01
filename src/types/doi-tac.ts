/**
 * Type definitions cho bảng zz_capi_doi_tac (Đối tác)
 */

export type LoaiDoiTac = 'nha_cung_cap' | 'khach_hang'

export interface DoiTac {
  id: number // bigint (int8) từ DB
  nhom_doi_tac_id: number | null // bigint từ DB
  hang_muc: LoaiDoiTac | null // Loại đối tác: 'nha_cung_cap' hoặc 'khach_hang'
  ten_nhom_doi_tac: string | null // Tên nhóm đối tác (có thể lấy từ join)
  ten_doi_tac: string | null
  cong_ty: string | null
  so_dien_thoai: string | null
  dia_chi: string | null
  email: string | null
  thong_tin_khac: string | null
  nguoi_tao_id: number | null // bigint từ DB
  tg_tao: string | null // timestamp with time zone
  tg_cap_nhat: string | null // timestamp without time zone
  // Computed fields for backward compatibility
  created_at?: string | null
  updated_at?: string | null
}

export interface DoiTacInsert {
  nhom_doi_tac_id?: number | null
  hang_muc: LoaiDoiTac // Loại đối tác: 'nha_cung_cap' hoặc 'khach_hang'
  ten_doi_tac: string
  cong_ty?: string | null
  so_dien_thoai?: string | null
  dia_chi?: string | null
  email?: string | null
  thong_tin_khac?: string | null
  nguoi_tao_id?: number | null
}

export interface DoiTacUpdate {
  nhom_doi_tac_id?: number | null
  hang_muc?: LoaiDoiTac
  ten_doi_tac?: string
  cong_ty?: string | null
  so_dien_thoai?: string | null
  dia_chi?: string | null
  email?: string | null
  thong_tin_khac?: string | null
  nguoi_tao_id?: number | null
}

