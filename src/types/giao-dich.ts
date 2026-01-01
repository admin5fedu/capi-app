/**
 * Type definitions cho bảng zz_capi_giao_dich (Giao dịch)
 */

export type LoaiGiaoDich = 'thu' | 'chi' | 'luan_chuyen'

export interface GiaoDich {
  id: number
  ngay: string // ISO date string
  loai: LoaiGiaoDich
  ma_phieu: string
  danh_muc_id: string | null
  mo_ta: string | null
  so_tien: number
  ty_gia_id: number | null
  tai_khoan_id: string | null // Tài khoản đi (cho chi và luân chuyển)
  tai_khoan_den_id: string | null // Tài khoản đến (cho thu và luân chuyển)
  doi_tac_id: string | null
  so_chung_tu: string | null
  hinh_anh: string[] | null // JSONB array of URLs
  ghi_chu: string | null
  so_tien_vnd: number | null // Tự động tính khi có tỷ giá USD
  created_by: string | null
  tg_tao: string | null
  tg_cap_nhat: string | null
  // Computed fields for backward compatibility
  created_at?: string | null
  updated_at?: string | null
}

export interface GiaoDichInsert {
  ngay: string
  loai: LoaiGiaoDich
  ma_phieu: string
  danh_muc_id?: string | null
  mo_ta?: string | null
  so_tien: number
  ty_gia_id?: number | null
  tai_khoan_id?: string | null
  tai_khoan_den_id?: string | null
  doi_tac_id?: string | null
  so_chung_tu?: string | null
  hinh_anh?: string[] | null
  ghi_chu?: string | null
  so_tien_vnd?: number | null
  created_by?: string | null
}

export interface GiaoDichUpdate {
  ngay?: string
  loai?: LoaiGiaoDich
  ma_phieu?: string
  danh_muc_id?: string | null
  mo_ta?: string | null
  so_tien?: number
  ty_gia_id?: number | null
  tai_khoan_id?: string | null
  tai_khoan_den_id?: string | null
  doi_tac_id?: string | null
  so_chung_tu?: string | null
  hinh_anh?: string[] | null
  ghi_chu?: string | null
  so_tien_vnd?: number | null
}

// Giao dịch với thông tin liên quan (cho hiển thị)
export interface GiaoDichWithRelations extends GiaoDich {
  danh_muc?: {
    id: string
    ten: string
    loai: string
  } | null
  ty_gia?: {
    id: number
    ty_gia: number
    ngay_ap_dung: string
  } | null
  tai_khoan?: {
    id: string
    ten: string
    loai_tien: string
  } | null
  tai_khoan_den?: {
    id: string
    ten: string
    loai_tien: string
  } | null
  doi_tac?: {
    id: string
    ten: string
    loai: string
  } | null
  nguoi_tao?: {
    id: string
    ho_va_ten?: string | null
    ho_ten?: string | null
  } | null
}

