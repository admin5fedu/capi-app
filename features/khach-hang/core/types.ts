
export type HangMucDoiTac = 'khach_hang' | 'nha_cung_cap';

export interface NhomDoiTac {
  id: number;
  hang_muc: HangMucDoiTac | string | null;
  ten_nhom: string | null;
  mo_ta: string | null;
  nguoi_tao_id: number | null;
  tg_tao: string | null;
  tg_cap_nhat: string | null;
}

export type NhomDoiTacInput = {
  hang_muc: HangMucDoiTac;
  ten_nhom: string;
  mo_ta: string | null;
  nguoi_tao_id?: number | null;
};

export interface DoiTac {
  id: number;
  nhom_doi_tac_id: number | null;
  ten_doi_tac: string | null;
  cong_ty: string | null;
  so_dien_thoai: string | null;
  dia_chi: string | null;
  email: string | null;
  thong_tin_khac: string | null;
  nguoi_tao_id: number | null;
  tg_tao: string | null;
  tg_cap_nhat: string | null;
  hang_muc: HangMucDoiTac | string | null;
  // Join data
  zz_capi_nhom_doi_tac?: NhomDoiTac | null;
}

export type DoiTacInput = {
  nhom_doi_tac_id: number | null;
  ten_doi_tac: string;
  cong_ty: string | null;
  so_dien_thoai: string | null;
  dia_chi: string | null;
  email: string | null;
  thong_tin_khac: string | null;
  hang_muc: HangMucDoiTac;
  nguoi_tao_id?: number | null;
};
