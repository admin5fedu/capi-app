/**
 * Type definitions cho bảng zz_capi_danh_muc_tai_chinh (Danh mục tài chính)
 */

export interface DanhMuc {
  id: number // bigint (int8) từ DB
  hang_muc: string | null // Loại danh mục (thu/chi)
  ten_danh_muc: string | null
  mo_ta: string | null
  danh_muc_cha_id: number | null
  ten_danh_muc_cha: string | null
  cap: number | null
  nguoi_tao_id: number | null
  tg_tao: string | null
  tg_cap_nhat: string | null
  // Computed fields for backward compatibility
  ten?: string | null // Alias cho ten_danh_muc
  loai?: string | null // Alias cho hang_muc
  parent_id?: string | null // Alias cho danh_muc_cha_id
  created_by?: string | null // Alias cho nguoi_tao_id
  created_at?: string | null
  updated_at?: string | null
  parent_ten?: string | null // Alias cho ten_danh_muc_cha
}

export interface DanhMucInsert {
  hang_muc: string
  ten_danh_muc: string
  mo_ta?: string | null
  danh_muc_cha_id?: number | null
  cap?: number | null
  nguoi_tao_id?: number | null
}

export interface DanhMucUpdate {
  hang_muc?: string
  ten_danh_muc?: string
  mo_ta?: string | null
  danh_muc_cha_id?: number | null
  cap?: number | null
}

// Danh mục với thông tin parent (cho hiển thị)
export interface DanhMucWithParent extends DanhMuc {
  parent_ten?: string | null
}

// Danh mục với children (cho tree view)
export interface DanhMucWithChildren extends DanhMucWithParent {
  children?: DanhMucWithChildren[]
}

