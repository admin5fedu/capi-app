
export type HangMucGiaoDich = 'thu' | 'chi' | 'chuyen_tien';

export interface GiaoDich {
  id: number;
  ngay: string | null;
  hang_muc: HangMucGiaoDich | string | null;
  danh_muc_id: number | null;
  ten_danh_muc: string | null;
  danh_muc_cha_id: number | null;
  ten_danh_muc_cha: string | null;
  doi_tac_id: number | null;
  ten_doi_tac: string | null;
  mo_ta: string | null;
  tai_khoan_di_id: number | null;
  ten_tai_khoan_di: string | null;
  tai_khoan_den_id: number | null;
  ten_tai_khoan_den: string | null;
  so_tien: number | null;
  don_vi: string | null;
  ty_gia_id: number | null;
  so_ty_gia: number | null;
  so_tien_quy_doi_di: number | null;
  so_tien_quy_doi_den: number | null;
  chung_tu: string | null;
  hinh_anh: any | null; // jsonb
  ghi_chu: string | null;
  nguoi_tao_id: number | null;
  tg_tao: string | null;
  tg_cap_nhat: string | null;
}

export type GiaoDichInput = {
  ngay: string;
  hang_muc: HangMucGiaoDich;
  danh_muc_id: number | null;
  doi_tac_id: number | null;
  mo_ta: string;
  tai_khoan_di_id: number | null;
  tai_khoan_den_id: number | null;
  so_tien: number;
  so_ty_gia: number | null;
  chung_tu?: string | null;
  ghi_chu?: string | null;
  nguoi_tao_id?: number | null;
  // Denormalized fields, handled in service
  ten_doi_tac?: string | null;
  ten_danh_muc?: string;
  ten_danh_muc_cha?: string;
  danh_muc_cha_id?: number;
  ten_tai_khoan_di?: string;
  ten_tai_khoan_den?: string;
  ty_gia_id?: number | null;
  so_tien_quy_doi_di?: number;
  so_tien_quy_doi_den?: number;
};