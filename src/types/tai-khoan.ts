/**
 * Type definitions cho bảng zz_capi_tai_khoan (Tài khoản)
 */

export interface TaiKhoan {
  id: number // bigint (int8) từ DB
  loai_tai_khoan: string | null
  ten_tai_khoan: string | null
  don_vi: string | null
  ngan_hang: string | null
  so_tai_khoan: string | null
  chu_tai_khoan: string | null
  ghi_chu: string | null
  nguoi_tao_id: number | null
  tg_tao: string | null
  tg_cap_nhat: string | null
  so_du_dau: number | null // numeric
  trang_thai: string | null
  // Computed fields for backward compatibility
  ten?: string | null // Alias cho ten_tai_khoan
  loai?: string | null // Alias cho loai_tai_khoan
  loai_tien?: string | null // Alias cho don_vi
  so_du_ban_dau?: number | null // Alias cho so_du_dau
  mo_ta?: string | null // Alias cho ghi_chu
  is_active?: boolean | null // Alias cho trang_thai (convert text -> boolean)
  created_by?: string | null // Alias cho nguoi_tao_id
  created_at?: string | null
  updated_at?: string | null
  ma_qr?: string | null // Không có trong schema mới, giữ để backward compatibility
}

export interface TaiKhoanInsert {
  loai_tai_khoan: string
  ten_tai_khoan: string
  don_vi?: string | null
  ngan_hang?: string | null
  so_tai_khoan?: string | null
  chu_tai_khoan?: string | null
  ghi_chu?: string | null
  nguoi_tao_id?: number | null
  so_du_dau?: number | null
  trang_thai?: string | null
}

export interface TaiKhoanUpdate {
  loai_tai_khoan?: string
  ten_tai_khoan?: string
  don_vi?: string | null
  ngan_hang?: string | null
  so_tai_khoan?: string | null
  chu_tai_khoan?: string | null
  ghi_chu?: string | null
  so_du_dau?: number | null
  trang_thai?: string | null
}

