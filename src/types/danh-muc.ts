/**
 * Type definitions cho bảng zz_capi_danh_muc (Danh mục)
 */

export interface DanhMuc {
  id: number // bigint (int8) từ DB
  ten: string
  loai: string
  parent_id: string | null
  mo_ta: string | null
  thu_tu: number | null
  is_active: boolean | null
  created_by: string | null
  tg_tao: string | null
  tg_cap_nhat: string | null
  // Computed fields for backward compatibility
  created_at?: string | null
  updated_at?: string | null
}

export interface DanhMucInsert {
  ten: string
  loai: string
  parent_id?: string | null
  mo_ta?: string | null
  thu_tu?: number | null
  is_active?: boolean | null
  created_by?: string | null
}

export interface DanhMucUpdate {
  ten?: string
  loai?: string
  parent_id?: string | null
  mo_ta?: string | null
  thu_tu?: number | null
  is_active?: boolean | null
}

// Danh mục với thông tin parent (cho hiển thị)
export interface DanhMucWithParent extends DanhMuc {
  parent_ten?: string | null
}

// Danh mục với children (cho tree view)
export interface DanhMucWithChildren extends DanhMucWithParent {
  children?: DanhMucWithChildren[]
}

