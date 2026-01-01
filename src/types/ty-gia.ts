/**
 * Type definitions cho bảng zz_capi_ty_gia (Tỷ giá)
 */

export interface TyGia {
  id: number // bigint (int8) từ DB
  ty_gia: number | null // numeric
  tg_tao: string | null // timestamp with time zone
  tg_cap_nhat: string | null // timestamp without time zone
  // Computed fields for backward compatibility
  created_at?: string | null
  updated_at?: string | null
  ngay_ap_dung?: string | null // Alias cho tg_tao (backward compatibility)
  ghi_chu?: string | null // Không còn trong schema mới
  created_by?: string | null // Không còn trong schema mới
}

export interface TyGiaInsert {
  ty_gia: number
}

export interface TyGiaUpdate {
  ty_gia?: number
}

