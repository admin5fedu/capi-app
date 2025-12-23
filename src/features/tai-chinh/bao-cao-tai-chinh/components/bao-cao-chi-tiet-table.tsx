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
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import type { GiaoDichWithRelations } from '@/types/giao-dich'
import { COT_HIEN_THI } from '@/features/tai-chinh/thu-chi/config'
import { cn } from '@/lib/utils'

interface BaoCaoChiTietTableProps {
  data: GiaoDichWithRelations[]
  isLoading?: boolean
  onRowClick?: (row: GiaoDichWithRelations) => void
}

export function BaoCaoChiTietTable({
  data,
  isLoading = false,
  onRowClick,
}: BaoCaoChiTietTableProps) {
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
        gd.so_chung_tu?.toLowerCase().includes(keyword) ||
        gd.ghi_chu?.toLowerCase().includes(keyword) ||
        gd.danh_muc?.ten?.toLowerCase().includes(keyword) ||
        gd.doi_tac?.ten?.toLowerCase().includes(keyword)
      )
    })
  }, [data, searchKeyword])

  // Convert cotHienThi to ColumnDef
  const columns = useMemo<ColumnDef<GiaoDichWithRelations>[]>(() => {
    return COT_HIEN_THI.map((cot) => {
      const column: ColumnDef<GiaoDichWithRelations> = {
        id: cot.key,
        accessorKey: typeof cot.accessorKey === 'function' ? undefined : cot.accessorKey,
        accessorFn: typeof cot.accessorKey === 'function' ? cot.accessorKey : undefined,
        header: ({ column }) => {
          if (!cot.sortable) {
            return <div className={cn('font-medium', cot.align === 'right' && 'text-right')}>{cot.label}</div>
          }

          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className={cn('h-8 px-2', cot.align === 'right' && 'ml-auto')}
            >
              {cot.label}
              {column.getIsSorted() === 'asc' ? (
                <ArrowUp className="ml-2 h-4 w-4" />
              ) : column.getIsSorted() === 'desc' ? (
                <ArrowDown className="ml-2 h-4 w-4" />
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
              )}
            </Button>
          )
        },
        cell: ({ row, getValue }) => {
          const value = getValue()
          if (cot.cell) {
            return cot.cell(value, row.original)
          }
          return value || '—'
        },
      }
      return column
    })
  }, [])

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
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Tìm kiếm theo mã phiếu, mô tả, số chứng từ..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="max-w-sm"
        />
        {searchKeyword && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchKeyword('')}
          >
            Xóa
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    className={cn(
                      COT_HIEN_THI.find((c) => c.key === header.id)?.align === 'right' && 'text-right'
                    )}
                  >
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
                  className={cn(onRowClick && 'cursor-pointer hover:bg-muted/50')}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        COT_HIEN_THI.find((c) => c.key === cell.column.id)?.align === 'right' && 'text-right'
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Hiển thị {filteredData.length} / {data.length} giao dịch
      </div>
    </div>
  )
}

