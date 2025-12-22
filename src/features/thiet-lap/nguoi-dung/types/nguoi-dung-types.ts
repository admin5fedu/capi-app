/**
 * Types cho module Người dùng
 * Re-export từ types chung và định nghĩa thêm types cụ thể cho module
 */
export type { NguoiDung, NguoiDungInsert, NguoiDungUpdate, NguoiDungWithVaiTro } from '@/types/nguoi-dung'

/**
 * Loại sắp xếp
 */
export type SapXep = 'created_at' | 'ho_ten' | 'email' | 'updated_at'
export type HuongSapXep = 'asc' | 'desc'

/**
 * Bộ lọc cho danh sách người dùng
 */
export interface BoLocNguoiDung {
  tim_kiem?: string
  vai_tro_id?: string
  is_active?: boolean
  sap_xep?: SapXep
  huong_sap_xep?: HuongSapXep
}

/**
 * Cấu hình cột hiển thị
 */
export interface CauHinhCot {
  key: string
  label: string
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

