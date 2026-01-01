/**
 * Type definitions cho bảng zz_capi_phan_quyen (Phân quyền)
 */

// Cấu trúc JSONB cho phan_quyen: array các action được phép (chỉ lưu các quyền được cấp)
// Ví dụ: ["xem", "them", "sua"] - chỉ lưu các quyền được cấp, không lưu false
export type PhanQuyenJsonb = string[]

export interface PhanQuyen {
  id: number // bigint (int8) từ DB
  vai_tro_id: string | null
  module: string | null
  phan_quyen: PhanQuyenJsonb | null // JSONB field chứa tất cả actions và allowed status
  tg_tao: string | null // timestamp with time zone
  tg_cap_nhat: string | null // timestamp without time zone
}

export interface PhanQuyenInsert {
  vai_tro_id: string
  module: string
  phan_quyen: PhanQuyenJsonb
}

export interface PhanQuyenUpdate {
  phan_quyen?: PhanQuyenJsonb
}

export interface PhanQuyenMatrix {
  module: string
  actions: {
    action: string
    allowed: boolean
    id?: number // ID của record trong DB (bigint/int8)
  }[]
}

// Ma trận phân quyền theo vai trò và module
export interface PhanQuyenVaiTroMatrix {
  vai_tro_id: string
  vai_tro_ten: string
  permissions: {
    action: string
    allowed: boolean
    id?: number // ID của record trong DB (bigint/int8)
  }[]
}

