/**
 * Type definitions cho bảng zz_capi_nguoi_dung (Người dùng)
 */

export interface NguoiDung {
  id: number // bigint (int8) từ DB
  ho_va_ten: string | null
  trang_thai: string | null
  avatar_url: string | null
  phong_ban_id: number | null
  ten_phong_ban: string | null
  vai_tro_id: number | null
  ten_vai_tro: string | null
  email: string | null
  tg_tao: string | null
  tg_cap_nhat: string | null
  // Computed fields for backward compatibility
  ho_ten?: string | null
  is_active?: boolean
  created_at?: string | null
  updated_at?: string | null
}

export interface NguoiDungInsert {
  email: string
  ho_va_ten: string
  vai_tro_id?: number | null
  avatar_url?: string | null
  trang_thai?: string | null
  phong_ban_id?: number | null
  ten_phong_ban?: string | null
  ten_vai_tro?: string | null
}

export interface NguoiDungUpdate {
  email?: string
  ho_va_ten?: string
  vai_tro_id?: number | null
  avatar_url?: string | null
  trang_thai?: string | null
  phong_ban_id?: number | null
  ten_phong_ban?: string | null
  ten_vai_tro?: string | null
}

export interface NguoiDungWithVaiTro extends NguoiDung {
  vai_tro?: {
    id: number // bigint (int8) từ DB
    ten_vai_tro?: string
  }
}

