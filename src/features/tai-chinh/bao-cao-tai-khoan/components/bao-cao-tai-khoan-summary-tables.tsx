import type {
  BaoCaoTaiKhoanGroupedByTaiKhoan,
  BaoCaoTaiKhoanGroupedByTime,
  BaoCaoTaiKhoanGroupedByLoaiTaiKhoan,
  BaoCaoTaiKhoanGroupedByLoaiTien,
} from '@/types/bao-cao-tai-khoan'
import {
  BaoCaoTaiKhoanTableTaiKhoan,
  BaoCaoTaiKhoanTableThoiGian,
  BaoCaoTaiKhoanTableLoaiTaiKhoan,
  BaoCaoTaiKhoanTableLoaiTien,
} from './tables'
import { GenericTablesGrid } from '@/components/tables'

interface BaoCaoTaiKhoanSummaryTablesProps {
  groupedByTaiKhoan?: BaoCaoTaiKhoanGroupedByTaiKhoan[]
  groupedByTime?: BaoCaoTaiKhoanGroupedByTime[]
  groupedByLoaiTaiKhoan?: BaoCaoTaiKhoanGroupedByLoaiTaiKhoan[]
  groupedByLoaiTien?: BaoCaoTaiKhoanGroupedByLoaiTien[]
}

export function BaoCaoTaiKhoanSummaryTables({
  groupedByTaiKhoan,
  groupedByTime,
  groupedByLoaiTaiKhoan,
  groupedByLoaiTien,
}: BaoCaoTaiKhoanSummaryTablesProps) {
  return (
    <GenericTablesGrid maxCols={2}>
      {/* Theo tài khoản */}
      <BaoCaoTaiKhoanTableTaiKhoan data={groupedByTaiKhoan} />

      {/* Theo thời gian */}
      <BaoCaoTaiKhoanTableThoiGian data={groupedByTime} />

      {/* Theo loại tài khoản */}
      <BaoCaoTaiKhoanTableLoaiTaiKhoan data={groupedByLoaiTaiKhoan} />

      {/* Theo loại tiền */}
      <BaoCaoTaiKhoanTableLoaiTien data={groupedByLoaiTien} />
    </GenericTablesGrid>
  )
}

