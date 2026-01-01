/**
 * Types cho module Thông tin công ty
 */

export interface ThongTinCongTy {
  id: number
  ten_app: string | null
  ten_cong_ty: string | null
  logo: string | null
  dia_chi: string | null
  so_dien_thoai: string | null
  email: string | null
  ma_so_thue: string | null
  thong_tin_khac: string | null
  tg_cap_nhat: string | null
}

export interface ThongTinCongTyUpdate {
  ten_app?: string | null
  ten_cong_ty?: string | null
  logo?: string | null
  dia_chi?: string | null
  so_dien_thoai?: string | null
  email?: string | null
  ma_so_thue?: string | null
  thong_tin_khac?: string | null
}

