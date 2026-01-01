import type { CotHienThi } from '@/shared/components/generic/types'
import type { GiaoDichWithRelations } from '@/types/giao-dich'
import { Badge } from '@/components/ui/badge'

/**
 * Cấu hình module Giao dịch
 */

// Các loại giao dịch (dùng cho UI, lưu vào hang_muc)
export const LOAI_GIAO_DICH = [
  { value: 'thu', label: 'Thu' },
  { value: 'chi', label: 'Chi' },
  { value: 'luan_chuyen', label: 'Luân chuyển' },
] as const

// Map hang_muc sang badge variant
export function getHangMucBadgeVariant(hangMuc: string | null | undefined) {
  if (!hangMuc) return 'outline'
  const map: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    thu: 'default',
    chi: 'destructive',
    luan_chuyen: 'secondary',
  }
  return map[hangMuc.toLowerCase()] || 'outline'
}

// Các cột hiển thị trong bảng
export const COT_HIEN_THI: CotHienThi<GiaoDichWithRelations>[] = [
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
    key: 'hang_muc',
    label: 'Hạng mục',
    accessorKey: 'hang_muc',
    sortable: true,
    width: 120,
    align: 'center',
    defaultVisible: true,
    cell: (value) => {
      if (!value) return '—'
      return (
        <Badge variant={getHangMucBadgeVariant(value)}>
          {value}
        </Badge>
      )
    },
  },
  {
    key: 'ten_danh_muc',
    label: 'Danh mục',
    accessorKey: 'ten_danh_muc',
    sortable: false,
    width: 150,
    align: 'left',
    defaultVisible: true,
    cell: (value) => {
      if (!value) return <span className="text-muted-foreground">—</span>
      return value
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
      return <span title={String(value)} className="line-clamp-2">{truncated}</span>
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
      const donVi = giaoDich.tai_khoan_den?.don_vi || giaoDich.tai_khoan_di?.don_vi || 'VND'
      const formatted = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: donVi === 'USD' ? 'USD' : 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(value || 0))
      return <span className="font-medium">{formatted}</span>
    },
  },
  {
    key: 'ten_tai_khoan_di',
    label: 'Tài khoản đi',
    accessorKey: 'ten_tai_khoan_di',
    sortable: false,
    width: 150,
    align: 'left',
    defaultVisible: true,
    cell: (value) => {
      if (!value) return <span className="text-muted-foreground">—</span>
      return value
    },
  },
  {
    key: 'ten_tai_khoan_den',
    label: 'Tài khoản đến',
    accessorKey: 'ten_tai_khoan_den',
    sortable: false,
    width: 150,
    align: 'left',
    defaultVisible: true,
    cell: (value) => {
      if (!value) return <span className="text-muted-foreground">—</span>
      return value
    },
  },
  {
    key: 'so_ty_gia',
    label: 'Tỷ giá',
    accessorKey: 'so_ty_gia',
    sortable: false,
    width: 120,
    align: 'right',
    defaultVisible: true,
    cell: (value) => {
      if (value === null || value === undefined) return <span className="text-muted-foreground">—</span>
      return new Intl.NumberFormat('vi-VN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(Number(value))
    },
  },
  {
    key: 'so_tien_quy_doi',
    label: 'Số tiền quy đổi',
    accessorKey: 'so_tien_quy_doi',
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
    key: 'chung_tu',
    label: 'Chứng từ',
    accessorKey: 'chung_tu',
    sortable: false,
    width: 120,
    align: 'left',
    defaultVisible: false,
    cell: (value) => value || <span className="text-muted-foreground">—</span>,
  },
  {
    key: 'nguoi_tao',
    label: 'Người tạo',
    accessorKey: (row: GiaoDichWithRelations) => row.nguoi_tao?.ho_va_ten || row.nguoi_tao?.ho_ten || null,
    sortable: false,
    width: 120,
    align: 'left',
    defaultVisible: false,
    cell: (_value, row) => {
      const nguoiTao = (row as GiaoDichWithRelations).nguoi_tao
      return nguoiTao?.ho_va_ten || nguoiTao?.ho_ten || <span className="text-muted-foreground">—</span>
    },
  },
  {
    key: 'tg_tao',
    label: 'Ngày tạo',
    accessorKey: (row: any) => row.tg_tao || row.created_at || null,
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
