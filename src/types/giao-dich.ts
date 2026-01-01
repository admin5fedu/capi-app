/**
 * Type definitions cho bảng zz_capi_giao_dich (Giao dịch)
 */

export type LoaiGiaoDich = 'thu' | 'chi' | 'luan_chuyen'

export interface GiaoDich {
  id: number
  ngay: string | null // date
  hang_muc: string | null // text - thay vì loai
  danh_muc_id: number | null // bigint
  ten_danh_muc: string | null // text
  danh_muc_cha_id: number | null // bigint
  ten_danh_muc_cha: string | null // text
  mo_ta: string | null // text
  tai_khoan_di_id: number | null // bigint
  ten_tai_khoan_di: string | null // text
  tai_khoan_den_id: number | null // bigint
  ten_tai_khoan_den: string | null // text
  so_tien: number | null // numeric
  ty_gia_id: number | null // bigint
  so_ty_gia: number | null // numeric
  so_tien_quy_doi: number | null // numeric - thay vì so_tien_vnd
  chung_tu: string | null // text - thay vì so_chung_tu
  hinh_anh: any | null // jsonb
  ghi_chu: string | null // text
  nguoi_tao_id: number | null // bigint - thay vì created_by
  tg_tao: string | null // timestamp with time zone
  tg_cap_nhat: string | null // timestamp without time zone
  // Aliases for backward compatibility
  loai?: string | null // alias for hang_muc
  ma_phieu?: string | null // không còn trong schema mới
  so_chung_tu?: string | null // alias for chung_tu
  so_tien_vnd?: number | null // alias for so_tien_quy_doi
  created_by?: string | null // alias for nguoi_tao_id
  created_at?: string | null // alias for tg_tao
  updated_at?: string | null // alias for tg_cap_nhat
}

export interface GiaoDichInsert {
  ngay: string
  hang_muc: string
  danh_muc_id?: number | null
  ten_danh_muc?: string | null
  danh_muc_cha_id?: number | null
  ten_danh_muc_cha?: string | null
  mo_ta?: string | null
  tai_khoan_di_id?: number | null
  ten_tai_khoan_di?: string | null
  tai_khoan_den_id?: number | null
  ten_tai_khoan_den?: string | null
  so_tien: number
  ty_gia_id?: number | null
  so_ty_gia?: number | null
  so_tien_quy_doi?: number | null
  chung_tu?: string | null
  hinh_anh?: any | null
  ghi_chu?: string | null
  nguoi_tao_id?: number | null
}

export interface GiaoDichUpdate {
  ngay?: string
  hang_muc?: string
  danh_muc_id?: number | null
  ten_danh_muc?: string | null
  danh_muc_cha_id?: number | null
  ten_danh_muc_cha?: string | null
  mo_ta?: string | null
  tai_khoan_di_id?: number | null
  ten_tai_khoan_di?: string | null
  tai_khoan_den_id?: number | null
  ten_tai_khoan_den?: string | null
  so_tien?: number
  ty_gia_id?: number | null
  so_ty_gia?: number | null
  so_tien_quy_doi?: number | null
  chung_tu?: string | null
  hinh_anh?: any | null
  ghi_chu?: string | null
}

// Giao dịch với thông tin liên quan (cho hiển thị)
export interface GiaoDichWithRelations extends GiaoDich {
  danh_muc?: {
    id: number
    ten_danh_muc: string
    hang_muc: string
    ten?: string // alias for ten_danh_muc
  } | null
  ty_gia?: {
    id: number
    ty_gia: number
  } | null
  tai_khoan_di?: {
    id: number
    ten_tai_khoan: string
    don_vi: string
    ten?: string // alias for ten_tai_khoan
    loai_tien?: string | null
  } | null
  tai_khoan_den?: {
    id: number
    ten_tai_khoan: string
    don_vi: string
    ten?: string // alias for ten_tai_khoan
    loai_tien?: string | null
  } | null
  nguoi_tao?: {
    id: number
    ho_va_ten?: string | null
    ho_ten?: string | null
  } | null
  doi_tac?: {
    id: number
    ten_doi_tac: string
    ten?: string // alias for ten_doi_tac
  } | null
  // Aliases for backward compatibility
  loai?: string | null
  danh_muc_ten?: string | null
  tai_khoan?: {
    id: number
    ten: string
    loai_tien: string
  } | null
  so_tien_vnd?: number | null
}
