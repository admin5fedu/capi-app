/**
 * Type definitions cho bảng zz_cst_nguoi_dung (Người dùng)
 */

export interface NguoiDung {
  id: string
  email: string
  ho_ten: string
  vai_tro_id: string
  avatar_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface NguoiDungInsert {
  email: string
  ho_ten: string
  vai_tro_id: string
  avatar_url?: string | null
  is_active?: boolean
}

export interface NguoiDungUpdate {
  email?: string
  ho_ten?: string
  vai_tro_id?: string
  avatar_url?: string | null
  is_active?: boolean
}

export interface NguoiDungWithVaiTro extends NguoiDung {
  vai_tro?: {
    id: string
    ten_vai_tro?: string
  }
}

