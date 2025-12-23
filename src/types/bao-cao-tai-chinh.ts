/**
 * Type definitions cho module Báo cáo tài chính
 */

import type { GiaoDichWithRelations, LoaiGiaoDich } from './giao-dich'

/**
 * Filters cho báo cáo
 */
export interface BaoCaoFilters {
  tuNgay?: string | null
  denNgay?: string | null
  danhMucIds?: string[]
  doiTacIds?: string[]
  loaiGiaoDich?: LoaiGiaoDich[]
  nguoiTaoIds?: string[]
  taiKhoanIds?: string[]
  loaiTien?: ('VND' | 'USD')[]
  keyword?: string
}

/**
 * Tổng hợp số liệu
 */
export interface BaoCaoSummary {
  tongThu: number
  tongChi: number
  tongLuânChuyen: number
  soDu: number // Thu - Chi
  soLuongGiaoDich: number
  soLuongThu: number
  soLuongChi: number
  soLuongLuânChuyen: number
}

/**
 * Dữ liệu nhóm theo thời gian
 */
export interface BaoCaoGroupedByTime {
  period: string // Ngày/Tuần/Tháng/Quý/Năm
  tongThu: number
  tongChi: number
  soDu: number
  soLuongGiaoDich: number
}

/**
 * Dữ liệu nhóm theo danh mục
 */
export interface BaoCaoGroupedByDanhMuc {
  danhMucId: string
  danhMucTen: string
  tongThu: number
  tongChi: number
  soDu: number
  soLuongGiaoDich: number
}

/**
 * Dữ liệu nhóm theo đối tác
 */
export interface BaoCaoGroupedByDoiTac {
  doiTacId: string
  doiTacTen: string
  tongThu: number
  tongChi: number
  soDu: number
  soLuongGiaoDich: number
}

/**
 * Dữ liệu nhóm theo loại
 */
export interface BaoCaoGroupedByLoai {
  loai: LoaiGiaoDich
  tongTien: number
  soLuongGiaoDich: number
}

/**
 * Dữ liệu nhóm theo người tạo
 */
export interface BaoCaoGroupedByNguoiTao {
  nguoiTaoId: string
  nguoiTaoTen: string
  tongThu: number
  tongChi: number
  soDu: number
  soLuongGiaoDich: number
}

/**
 * Dữ liệu nhóm theo tài khoản
 */
export interface BaoCaoGroupedByTaiKhoan {
  taiKhoanId: string
  taiKhoanTen: string
  loaiTien: string
  tongThu: number
  tongChi: number
  soDu: number
  soLuongGiaoDich: number
}

/**
 * Dữ liệu nhóm theo loại tiền
 */
export interface BaoCaoGroupedByLoaiTien {
  loaiTien: 'VND' | 'USD' | string
  tongThu: number
  tongChi: number
  soDu: number
  soLuongGiaoDich: number
}

/**
 * So sánh kỳ
 */
export interface BaoCaoSoSanhKy {
  kyHienTai: BaoCaoSummary
  kyTruoc: BaoCaoSummary
  thayDoi: {
    tongThu: number // %
    tongChi: number // %
    soDu: number // %
    soLuongGiaoDich: number // %
  }
}

/**
 * Top danh mục/đối tác
 */
export interface TopItem {
  id: string
  ten: string
  tongTien: number
  soLuongGiaoDich: number
}

/**
 * Dữ liệu báo cáo đầy đủ
 */
export interface BaoCaoData {
  summary: BaoCaoSummary
  giaoDich: GiaoDichWithRelations[]
  groupedByTime?: BaoCaoGroupedByTime[]
  groupedByDanhMuc?: BaoCaoGroupedByDanhMuc[]
  groupedByDoiTac?: BaoCaoGroupedByDoiTac[]
  groupedByLoai?: BaoCaoGroupedByLoai[]
  groupedByNguoiTao?: BaoCaoGroupedByNguoiTao[]
  groupedByTaiKhoan?: BaoCaoGroupedByTaiKhoan[]
  groupedByLoaiTien?: BaoCaoGroupedByLoaiTien[]
  groupedByTuan?: BaoCaoGroupedByTime[]
  soSanhKy?: BaoCaoSoSanhKy
  topDanhMuc?: TopItem[]
  topDoiTac?: TopItem[]
  topGiaoDich?: GiaoDichWithRelations[]
}

/**
 * Tùy chọn phân nhóm
 */
export type GroupByOption = 'ngay' | 'tuan' | 'thang' | 'quy' | 'nam' | 'danh_muc' | 'doi_tac' | 'loai' | 'nguoi_tao'

/**
 * Tùy chọn so sánh kỳ
 */
export type ComparePeriodOption = 'thang_truoc' | 'nam_truoc' | 'ky_truoc' | null

