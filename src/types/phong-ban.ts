/**
 * Type definitions cho bảng zz_capi_phong_ban (Phòng ban)
 */

export interface PhongBan {
  id: number // bigint (int8) từ DB
  ma_phong_ban: string | null
  ten_phong_ban: string | null
  mo_ta: string | null
  tg_tao: string | null
  tg_cap_nhat: string | null
  // Computed fields for backward compatibility
  created_at?: string | null
  updated_at?: string | null
}

export interface PhongBanInsert {
  ma_phong_ban?: string | null
  ten_phong_ban: string
  mo_ta?: string | null
}

export interface PhongBanUpdate {
  ma_phong_ban?: string | null
  ten_phong_ban?: string
  mo_ta?: string | null
}

