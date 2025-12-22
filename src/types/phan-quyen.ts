/**
 * Type definitions cho bảng zz_cst_phan_quyen (Phân quyền)
 */

export interface PhanQuyen {
  id: string
  vai_tro_id: string
  module: string
  action: string
  allowed: boolean
  created_at: string | null
  updated_at: string | null
}

export interface PhanQuyenInsert {
  vai_tro_id: string
  module: string
  action: string
  allowed: boolean
}

export interface PhanQuyenUpdate {
  allowed?: boolean
}

export interface PhanQuyenMatrix {
  module: string
  actions: {
    action: string
    allowed: boolean
    id?: string // ID của record trong DB (nếu có)
  }[]
}

