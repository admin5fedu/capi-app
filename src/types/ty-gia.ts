/**
 * Type definitions cho bảng zz_capi_ty_gia (Tỷ giá)
 */

export interface TyGia {
  id: number
  ty_gia: number
  ngay_ap_dung: string // ISO date string
  ghi_chu: string | null
  created_by: string | null
  tg_tao: string | null
  tg_cap_nhat: string | null
  // Computed fields for backward compatibility
  created_at?: string | null
  updated_at?: string | null
}

export interface TyGiaInsert {
  ty_gia: number
  ngay_ap_dung: string // ISO date string
  ghi_chu?: string | null
  created_by?: string | null
}

export interface TyGiaUpdate {
  ty_gia?: number
  ngay_ap_dung?: string
  ghi_chu?: string | null
}

