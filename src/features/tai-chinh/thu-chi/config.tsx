import type { CotHienThi } from '@/shared/components/generic/types'
import type { GiaoDichWithRelations } from '@/types/giao-dich'
import { Badge } from '@/components/ui/badge'

/**
 * Cấu hình module Giao dịch
 */

// Các loại giao dịch
export const LOAI_GIAO_DICH = [
  { value: 'thu', label: 'Thu' },
  { value: 'chi', label: 'Chi' },
  { value: 'luan_chuyen', label: 'Luân chuyển' },
] as const

// Map loại giao dịch sang badge variant
export function getLoaiGiaoDichBadgeVariant(loai: string) {
  const map: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    thu: 'default',
    chi: 'destructive',
    luan_chuyen: 'secondary',
  }
  return map[loai] || 'outline'
}

// Các cột hiển thị trong bảng
export const COT_HIEN_THI: CotHienThi<GiaoDichWithRelations>[] = [
  {
    key: 'ma_phieu',
    label: 'Mã phiếu',
    accessorKey: 'ma_phieu',
    sortable: true,
    width: 120,
    align: 'left',
    defaultVisible: true,
  },
  {
    key: 'ngay',
    label: 'Ngày',
    accessorKey: 'ngay',
    sortable: true,
    width: 120,
    align: 'left',
    defaultVisible: true,
    cell: (value) => {
      if (!value) return '—'
      return new Date(value).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    },
  },
  {
    key: 'loai',
    label: 'Loại',
    accessorKey: 'loai',
    sortable: true,
    width: 100,
    align: 'center',
    defaultVisible: true,
    cell: (value) => {
      const loai = LOAI_GIAO_DICH.find((l) => l.value === value)
      const label = loai ? loai.label : value || '—'
      return (
        <Badge variant={getLoaiGiaoDichBadgeVariant(value)}>
          {label}
        </Badge>
      )
    },
  },
  {
    key: 'danh_muc',
    label: 'Danh mục',
    accessorKey: (row: GiaoDichWithRelations) => row.danh_muc?.ten || null,
    sortable: false,
    width: 150,
    align: 'left',
    defaultVisible: true,
    cell: (_value, row) => {
      const danhMuc = (row as GiaoDichWithRelations).danh_muc
      return danhMuc?.ten || <span className="text-muted-foreground">—</span>
    },
  },
  {
    key: 'mo_ta',
    label: 'Mô tả',
    accessorKey: 'mo_ta',
    sortable: false,
    width: 200,
    align: 'left',
    defaultVisible: true,
    cell: (value) => {
      if (!value) return <span className="text-muted-foreground">—</span>
      const truncated = String(value).length > 50 ? String(value).substring(0, 50) + '...' : String(value)
      return <span title={String(value)}>{truncated}</span>
    },
  },
  {
    key: 'so_tien',
    label: 'Số tiền',
    accessorKey: 'so_tien',
    sortable: true,
    width: 150,
    align: 'right',
    defaultVisible: true,
    cell: (value, row) => {
      const giaoDich = row as GiaoDichWithRelations
      const loaiTien = giaoDich.tai_khoan_den?.loai_tien || giaoDich.tai_khoan?.loai_tien || 'VND'
      const formatted = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: loaiTien === 'USD' ? 'USD' : 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(value))
      return <span className="font-medium">{formatted}</span>
    },
  },
  {
    key: 'tai_khoan',
    label: 'Tài khoản đi',
    accessorKey: (row: GiaoDichWithRelations) => row.tai_khoan?.ten || null,
    sortable: false,
    width: 150,
    align: 'left',
    defaultVisible: true,
    cell: (_value, row) => {
      const taiKhoan = (row as GiaoDichWithRelations).tai_khoan
      if (!taiKhoan) return <span className="text-muted-foreground">—</span>
      return taiKhoan.ten
    },
  },
  {
    key: 'tai_khoan_den',
    label: 'Tài khoản đến',
    accessorKey: (row: GiaoDichWithRelations) => row.tai_khoan_den?.ten || null,
    sortable: false,
    width: 150,
    align: 'left',
    defaultVisible: true,
    cell: (_value, row) => {
      const taiKhoanDen = (row as GiaoDichWithRelations).tai_khoan_den
      if (!taiKhoanDen) return <span className="text-muted-foreground">—</span>
      return taiKhoanDen.ten
    },
  },
  {
    key: 'doi_tac',
    label: 'Đối tác',
    accessorKey: (row: GiaoDichWithRelations) => row.doi_tac?.ten || null,
    sortable: false,
    width: 150,
    align: 'left',
    defaultVisible: true,
    cell: (_value, row) => {
      const doiTac = (row as GiaoDichWithRelations).doi_tac
      if (!doiTac) return <span className="text-muted-foreground">—</span>
      return doiTac.ten
    },
  },
  {
    key: 'ty_gia',
    label: 'Tỷ giá',
    accessorKey: (row: GiaoDichWithRelations) => row.ty_gia?.ty_gia || null,
    sortable: false,
    width: 120,
    align: 'right',
    defaultVisible: true,
    cell: (_value, row) => {
      const tyGia = (row as GiaoDichWithRelations).ty_gia
      if (!tyGia) return <span className="text-muted-foreground">—</span>
      return new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(Number(tyGia.ty_gia))
    },
  },
  {
    key: 'so_tien_vnd',
    label: 'Số tiền VND',
    accessorKey: 'so_tien_vnd',
    sortable: true,
    width: 150,
    align: 'right',
    defaultVisible: false,
    cell: (value) => {
      if (value === null || value === undefined) return <span className="text-muted-foreground">—</span>
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(value))
    },
  },
  {
    key: 'so_chung_tu',
    label: 'Số chứng từ',
    accessorKey: 'so_chung_tu',
    sortable: false,
    width: 120,
    align: 'left',
    defaultVisible: false,
    cell: (value) => value || <span className="text-muted-foreground">—</span>,
  },
  {
    key: 'nguoi_tao',
    label: 'Người tạo',
    accessorKey: (row: GiaoDichWithRelations) => row.nguoi_tao?.ho_ten || null,
    sortable: false,
    width: 120,
    align: 'left',
    defaultVisible: false,
    cell: (_value, row) => {
      const nguoiTao = (row as GiaoDichWithRelations).nguoi_tao
      return nguoiTao?.ho_ten || <span className="text-muted-foreground">—</span>
    },
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
    accessorKey: 'created_at',
    sortable: true,
    width: 150,
    align: 'left',
    defaultVisible: false,
    cell: (value) => {
      if (!value) return '—'
      return new Date(value).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    },
  },
]

// Quyền truy cập module
export const QUYEN_TRUY_CAP = {
  xem: 'xem_giao_dich',
  them: 'them_giao_dich',
  sua: 'sua_giao_dich',
  xoa: 'xoa_giao_dich',
}

// Tiêu đề module
export const TIEU_DE_MODULE = 'Quản lý giao dịch'

// Tên lưu trữ cấu hình cột
export const TEN_LUU_TRU_COT = 'giao-dich-columns'

