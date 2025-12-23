import type {
  BaoCaoGroupedByDanhMuc,
  BaoCaoGroupedByDoiTac,
  BaoCaoGroupedByLoai,
  BaoCaoGroupedByNguoiTao,
  BaoCaoGroupedByTime,
  BaoCaoGroupedByTaiKhoan,
  BaoCaoGroupedByLoaiTien,
  BaoCaoSoSanhKy,
} from '@/types/bao-cao-tai-chinh'
import type { GiaoDichWithRelations } from '@/types/giao-dich'
import {
  BaoCaoTableDanhMuc,
  BaoCaoTableDoiTac,
  BaoCaoTableLoai,
  BaoCaoTableNguoiTao,
  BaoCaoTableThoiGian,
  BaoCaoTableTaiKhoan,
  BaoCaoTableLoaiTien,
  BaoCaoTableTuan,
  BaoCaoTableTopGiaoDich,
  BaoCaoTableSoSanhKy,
} from './tables'

interface BaoCaoSummaryTablesProps {
  groupedByDanhMuc?: BaoCaoGroupedByDanhMuc[]
  groupedByDoiTac?: BaoCaoGroupedByDoiTac[]
  groupedByLoai?: BaoCaoGroupedByLoai[]
  groupedByNguoiTao?: BaoCaoGroupedByNguoiTao[]
  groupedByTime?: BaoCaoGroupedByTime[]
  groupedByTaiKhoan?: BaoCaoGroupedByTaiKhoan[]
  groupedByLoaiTien?: BaoCaoGroupedByLoaiTien[]
  groupedByTuan?: BaoCaoGroupedByTime[]
  topGiaoDich?: GiaoDichWithRelations[]
  soSanhKy?: BaoCaoSoSanhKy
}

export function BaoCaoSummaryTables({
  groupedByDanhMuc,
  groupedByDoiTac,
  groupedByLoai,
  groupedByNguoiTao,
  groupedByTime,
  groupedByTaiKhoan,
  groupedByLoaiTien,
  groupedByTuan,
  topGiaoDich,
  soSanhKy,
}: BaoCaoSummaryTablesProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groupedByDanhMuc && groupedByDanhMuc.length > 0 && (
        <BaoCaoTableDanhMuc data={groupedByDanhMuc} />
      )}

      {groupedByDoiTac && groupedByDoiTac.length > 0 && (
        <BaoCaoTableDoiTac data={groupedByDoiTac} />
      )}

      {groupedByLoai && groupedByLoai.length > 0 && (
        <BaoCaoTableLoai data={groupedByLoai} />
      )}

      {groupedByNguoiTao && groupedByNguoiTao.length > 0 && (
        <BaoCaoTableNguoiTao data={groupedByNguoiTao} />
      )}

      {groupedByTime && groupedByTime.length > 0 && (
        <BaoCaoTableThoiGian data={groupedByTime} />
      )}

      {groupedByTaiKhoan && groupedByTaiKhoan.length > 0 && (
        <BaoCaoTableTaiKhoan data={groupedByTaiKhoan} />
      )}

      {groupedByLoaiTien && groupedByLoaiTien.length > 0 && (
        <BaoCaoTableLoaiTien data={groupedByLoaiTien} />
      )}

      {groupedByTuan && groupedByTuan.length > 0 && (
        <BaoCaoTableTuan data={groupedByTuan} />
      )}

      {topGiaoDich && topGiaoDich.length > 0 && (
        <BaoCaoTableTopGiaoDich data={topGiaoDich} />
      )}

      {soSanhKy && (
        <BaoCaoTableSoSanhKy data={soSanhKy} />
      )}
    </div>
  )
}
