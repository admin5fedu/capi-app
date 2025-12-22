/**
 * Type definitions cho bảng zz_cst_vai_tro (Vai trò)
 */

export interface VaiTro {
  id: string
  ten: string
  mo_ta: string | null
  created_at: string
  updated_at: string
}

export interface VaiTroInsert {
  ten: string
  mo_ta?: string | null
}

export interface VaiTroUpdate {
  ten?: string
  mo_ta?: string | null
}

