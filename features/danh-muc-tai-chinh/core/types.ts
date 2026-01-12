
export type HangMucTaiChinh = 'thu' | 'chi';

export interface DanhMucTaiChinh {
  id: number;
  hang_muc: HangMucTaiChinh | string | null;
  ten_danh_muc: string | null;
  mo_ta: string | null;
  danh_muc_cha_id: number | null;
  ten_danh_muc_cha: string | null;
  cap: number | null;
  nguoi_tao_id: number | null;
  tg_tao: string | null;
  tg_cap_nhat: string | null;
  // For tree structure
  children?: DanhMucTaiChinh[];
}

export type DanhMucTaiChinhInput = {
  hang_muc: HangMucTaiChinh;
  ten_danh_muc: string;
  mo_ta: string | null;
  danh_muc_cha_id: number | null;
  nguoi_tao_id?: number | null;
};
