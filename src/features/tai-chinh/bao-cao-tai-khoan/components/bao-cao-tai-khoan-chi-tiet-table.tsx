import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  ColumnDef,
  SortingState,
  flexRender,
} from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react'
import type { BaoCaoTaiKhoanGiaoDich } from '@/types/bao-cao-tai-khoan'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface BaoCaoTaiKhoanChiTietTableProps {
  data: BaoCaoTaiKhoanGiaoDich[]
  isLoading?: boolean
  onRowClick?: (row: BaoCaoTaiKhoanGiaoDich) => void
}

import { formatCurrency } from '@/shared/utils/format-utils'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const getLoaiBadgeVariant = (loai: string) => {
  switch (loai) {
    case 'thu':
      return 'default'
    case 'chi':
      return 'destructive'
    case 'luan_chuyen':
      return 'secondary'
    default:
      return 'outline'
  }
}

const getLoaiLabel = (loai: string) => {
  switch (loai) {
    case 'thu':
      return 'Thu'
    case 'chi':
      return 'Chi'
    case 'luan_chuyen':
      return 'Luân chuyển'
    default:
      return loai
  }
}

export function BaoCaoTaiKhoanChiTietTable({
  data,
  isLoading = false,
  onRowClick,
}: BaoCaoTaiKhoanChiTietTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchKeyword, setSearchKeyword] = useState('')

  // Filter data by search keyword
  const filteredData = useMemo(() => {
    if (!searchKeyword) return data

    const keyword = searchKeyword.toLowerCase()
    return data.filter((gd) => {
      return (
        gd.ma_phieu?.toLowerCase().includes(keyword) ||
        gd.mo_ta?.toLowerCase().includes(keyword) ||
        gd.danh_muc?.ten?.toLowerCase().includes(keyword) ||
        gd.doi_tac?.ten?.toLowerCase().includes(keyword)
      )
    })
  }, [data, searchKeyword])

  const columns = useMemo<ColumnDef<BaoCaoTaiKhoanGiaoDich>[]>(() => [
    {
      id: 'ngay',
      accessorKey: 'ngay',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Ngày
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      ),
      cell: ({ row }) => formatDate(row.original.ngay),
    },
    {
      id: 'ma_phieu',
      accessorKey: 'ma_phieu',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Mã phiếu
          {column.getIsSorted() === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      ),
      cell: ({ row }) => row.original.ma_phieu || '—',
    },
    {
      id: 'loai',
      accessorKey: 'loai',
      header: 'Loại',
      cell: ({ row }) => (
        <Badge variant={getLoaiBadgeVariant(row.original.loai)}>
          {getLoaiLabel(row.original.loai)}
        </Badge>
      ),
    },
    {
      id: 'so_tien',
      accessorKey: 'so_tien_vnd',
      header: ({ column }) => (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2 ml-auto"
          >
            Số tiền
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
            )}
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          {formatCurrency(row.original.so_tien_vnd || row.original.so_tien)}
        </div>
      ),
    },
    {
      id: 'tai_khoan',
      header: 'Tài khoản',
      cell: ({ row }) => {
        const gd = row.original
        if (gd.loai === 'luan_chuyen') {
          return (
            <div className="text-sm">
              <div>{gd.tai_khoan?.ten || '—'}</div>
              <div className="text-muted-foreground text-xs">→ {gd.tai_khoan_den?.ten || '—'}</div>
            </div>
          )
        }
        return <div className="text-sm">{gd.tai_khoan?.ten || '—'}</div>
      },
    },
    {
      id: 'danh_muc',
      header: 'Danh mục',
      cell: ({ row }) => row.original.danh_muc?.ten || '—',
    },
    {
      id: 'doi_tac',
      header: 'Đối tác',
      cell: ({ row }) => row.original.doi_tac?.ten || '—',
    },
    {
      id: 'mo_ta',
      header: 'Mô tả',
      cell: ({ row }) => row.original.mo_ta || '—',
    },
    {
      id: 'nguoi_tao',
      header: 'Người tạo',
      cell: ({ row }) => row.original.nguoi_tao?.ho_va_ten || row.original.nguoi_tao?.ho_ten || '—',
    },
  ], [])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã phiếu, mô tả..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(onRowClick && 'cursor-pointer')}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

