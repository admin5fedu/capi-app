/**
 * Type definitions cho bảng zz_capi_tai_khoan (Tài khoản)
 */

export interface TaiKhoan {
  id: number // bigint (int8) từ DB
  ten: string
  loai: string
  loai_tien: string
  so_du_ban_dau: number | null
  mo_ta: string | null
  is_active: boolean | null
  created_by: string | null
  tg_tao: string | null
  tg_cap_nhat: string | null
  so_tai_khoan: string | null
  ngan_hang: string | null
  chu_tai_khoan: string | null
  ma_qr: string | null
  // Computed fields for backward compatibility
  created_at?: string | null
  updated_at?: string | null
}

export interface TaiKhoanInsert {
  ten: string
  loai: string
  loai_tien: string
  so_du_ban_dau?: number | null
  mo_ta?: string | null
  is_active?: boolean | null
  created_by?: string | null
  so_tai_khoan?: string | null
  ngan_hang?: string | null
  chu_tai_khoan?: string | null
  ma_qr?: string | null
}

export interface TaiKhoanUpdate {
  ten?: string
  loai?: string
  loai_tien?: string
  so_du_ban_dau?: number | null
  mo_ta?: string | null
  is_active?: boolean | null
  so_tai_khoan?: string | null
  ngan_hang?: string | null
  chu_tai_khoan?: string | null
  ma_qr?: string | null
}

