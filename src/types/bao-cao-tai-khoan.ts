/**
 * Type definitions cho module Báo cáo tài khoản
 */

import type { LoaiGiaoDich } from './giao-dich'

/**
 * Filters cho báo cáo tài khoản
 */
export interface BaoCaoTaiKhoanFilters {
  tuNgay?: string | null
  denNgay?: string | null
  taiKhoanIds?: string[]
  loaiTaiKhoan?: string[]
  loaiTien?: ('VND' | 'USD')[]
  loaiGiaoDich?: LoaiGiaoDich[]
  danhMucIds?: string[]
  doiTacIds?: string[]
  nguoiTaoIds?: string[]
  keyword?: string
}

/**
 * Tổng hợp số liệu
 */
export interface BaoCaoTaiKhoanSummary {
  tongThu: number
  tongChi: number
  soDuDauKy: number
  tonCuoi: number // Số dư đầu kỳ + Thu - Chi
  soLuongGiaoDich: number
}

/**
 * Dữ liệu nhóm theo tài khoản
 */
export interface BaoCaoTaiKhoanGroupedByTaiKhoan {
  taiKhoanId: string
  taiKhoanTen: string
  loaiTaiKhoan: string
  loaiTien: string
  soDuDauKy: number
  tongThu: number
  tongChi: number
  tonCuoi: number
  soLuongGiaoDich: number
}

/**
 * Dữ liệu nhóm theo thời gian
 */
export interface BaoCaoTaiKhoanGroupedByTime {
  period: string // Ngày/Tuần/Tháng/Quý/Năm
  soDuDauKy: number
  tongThu: number
  tongChi: number
  tonCuoi: number
  soLuongGiaoDich: number
}

/**
 * Dữ liệu nhóm theo loại tài khoản
 */
export interface BaoCaoTaiKhoanGroupedByLoaiTaiKhoan {
  loaiTaiKhoan: string
  soDuDauKy: number
  tongThu: number
  tongChi: number
  tonCuoi: number
  soLuongGiaoDich: number
}

/**
 * Dữ liệu nhóm theo loại tiền
 */
export interface BaoCaoTaiKhoanGroupedByLoaiTien {
  loaiTien: string
  soDuDauKy: number
  tongThu: number
  tongChi: number
  tonCuoi: number
  soLuongGiaoDich: number
}

/**
 * Dữ liệu chi tiết giao dịch
 */
export interface BaoCaoTaiKhoanGiaoDich {
  id: string
  ngay: string
  ma_phieu: string
  loai: LoaiGiaoDich
  so_tien: number
  so_tien_vnd?: number
  mo_ta?: string
  danh_muc?: { id: string; ten: string }
  doi_tac?: { id: string; ten: string }
  nguoi_tao?: { id: string; ho_va_ten?: string | null; ho_ten?: string | null }
  tai_khoan?: { id: string; ten: string }
  tai_khoan_den?: { id: string; ten: string }
}

/**
 * Dữ liệu báo cáo đầy đủ
 */
export interface BaoCaoTaiKhoanData {
  summary: BaoCaoTaiKhoanSummary
  groupedByTaiKhoan: BaoCaoTaiKhoanGroupedByTaiKhoan[]
  groupedByTime: BaoCaoTaiKhoanGroupedByTime[]
  groupedByLoaiTaiKhoan: BaoCaoTaiKhoanGroupedByLoaiTaiKhoan[]
  groupedByLoaiTien: BaoCaoTaiKhoanGroupedByLoaiTien[]
  giaoDich: BaoCaoTaiKhoanGiaoDich[]
}

