/**
 * Type definitions cho bảng zz_capi_vai_tro (Vai trò)
 */

export interface VaiTro {
  id: number // bigint (int8) từ DB
  ten_vai_tro: string | null
  mo_ta: string | null
  tg_tao: string | null
  tg_cap_nhat: string | null
  // Computed fields for backward compatibility
  ten?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface VaiTroInsert {
  ten_vai_tro: string
  mo_ta?: string | null
}

export interface VaiTroUpdate {
  ten_vai_tro?: string
  mo_ta?: string | null
}

