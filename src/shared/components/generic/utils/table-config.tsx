/**
 * Helper functions để config table columns từ cotHienThi
 */
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CotHienThi, HanhDongItem } from '../types'

/**
 * Tạo checkbox column cho row selection
 */
export function createSelectColumn<TData>() {
  return {
    id: 'select',
    header: ({ table }: { table: any }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(checked) => table.toggleAllRowsSelected(!!checked)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }: { row: any }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(!!checked)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    size: 50,
  } as ColumnDef<TData>
}

/**
 * Tạo columns từ cotHienThi configuration
 */
export function createDataColumns<TData extends Record<string, any>>(
  cotHienThi: CotHienThi<TData>[],
  columnVisibility: Record<string, boolean>
): ColumnDef<TData>[] {
  return cotHienThi
    .filter((cot) => columnVisibility[cot.key] !== false)
    .map((cot) => {
      // TanStack Table: accessorKey cho string, accessorFn cho function
      const columnDef: any = {
        id: cot.key,
      }
      
      // Nếu accessorKey là function, dùng accessorFn
      if (typeof cot.accessorKey === 'function') {
        columnDef.accessorFn = cot.accessorKey
      } else if (cot.accessorKey) {
        columnDef.accessorKey = cot.accessorKey as string
      }
      
      return {
        ...columnDef,
        header: ({ column }: { column: any }) => {
        const isSortable = cot.sortable
        const sortDirection = column.getIsSorted()

        return (
          <button
            onClick={() => {
              if (isSortable) {
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            }}
            className={cn(
              'flex items-center gap-2 hover:text-foreground transition-colors w-full px-4 py-3 text-left text-sm font-medium whitespace-nowrap',
              cot.align === 'center' && 'justify-center',
              cot.align === 'right' && 'justify-end',
              cot.align === 'left' && 'justify-start',
              isSortable && 'cursor-pointer hover:opacity-80',
              !isSortable && 'cursor-default'
            )}
          >
            <span>{cot.label}</span>
            {isSortable && (
              <span className="inline-flex items-center">
                {sortDirection === 'asc' ? (
                  <ArrowUp className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
                ) : sortDirection === 'desc' ? (
                  <ArrowDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground opacity-50" />
                )}
              </span>
            )}
          </button>
        )
      },
      cell: ({ row }: { row: any }) => {
        const value = cot.accessorKey
          ? typeof cot.accessorKey === 'function'
            ? cot.accessorKey(row.original)
            : row.original[cot.accessorKey as keyof TData]
          : null
        return cot.cell ? cot.cell(value, row.original) : <span>{String(value ?? '')}</span>
      },
      size: typeof cot.width === 'number' ? cot.width : undefined,
      minSize: 50,
      maxSize: 500,
      }
    }) as ColumnDef<TData>[]
}

/**
 * Tạo actions column
 */
export function createActionsColumn<TData extends Record<string, any>>(
  hanhDongItems: HanhDongItem<TData>[],
  onDeleteClick: (item: TData, action: HanhDongItem<TData>) => void
): ColumnDef<TData> | null {
  if (hanhDongItems.length === 0) return null

  // Lọc các actions (View/Eye, Edit, Delete, và các actions khác)
  const viewAction = hanhDongItems.find(
    (item) => item.label.toLowerCase().includes('xem') || item.label.toLowerCase().includes('view') || item.label.toLowerCase().includes('chi tiết')
  )
  const editAction = hanhDongItems.find(
    (item) => item.label.toLowerCase().includes('sửa') || item.label.toLowerCase().includes('edit')
  )
  const deleteAction = hanhDongItems.find(
    (item) => item.label.toLowerCase().includes('xóa') || item.label.toLowerCase().includes('delete')
  )
  // Các actions khác (không phải View, Edit và Delete)
  const otherActions = hanhDongItems.filter(
    (item) =>
      !item.label.toLowerCase().includes('xem') &&
      !item.label.toLowerCase().includes('view') &&
      !item.label.toLowerCase().includes('chi tiết') &&
      !item.label.toLowerCase().includes('sửa') &&
      !item.label.toLowerCase().includes('edit') &&
      !item.label.toLowerCase().includes('xóa') &&
      !item.label.toLowerCase().includes('delete')
  )

  if (!viewAction && !editAction && !deleteAction && otherActions.length === 0) return null

  return {
    id: 'actions',
    header: 'Thao tác',
    cell: ({ row }: { row: any }) => (
      <div className="flex items-center justify-center gap-2">
        {/* View/Eye action - hiển thị đầu tiên */}
        {viewAction && !(viewAction.hidden && viewAction.hidden(row.original)) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              viewAction.onClick(row.original)
            }}
            title={viewAction.label}
          >
            {viewAction.icon ? (
              <viewAction.icon className="h-4 w-4" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>
        )}
        {/* Other actions (trước Edit) */}
        {otherActions.map((action, index) => {
          if (action.hidden && action.hidden(row.original)) return null
          return (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8',
                action.variant === 'destructive' && 'text-destructive hover:text-destructive hover:bg-destructive/10'
              )}
              onClick={(e) => {
                e.stopPropagation()
                action.onClick(row.original)
              }}
              title={action.label}
            >
              {action.icon ? (
                <action.icon className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </Button>
          )
        })}
        {/* Edit action */}
        {editAction && !(editAction.hidden && editAction.hidden(row.original)) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              editAction.onClick(row.original)
            }}
            title={editAction.label}
          >
            {editAction.icon ? (
              <editAction.icon className="h-4 w-4" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
          </Button>
        )}
        {/* Delete action */}
        {deleteAction && !(deleteAction.hidden && deleteAction.hidden(row.original)) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation()
              onDeleteClick(row.original, deleteAction)
            }}
            title={deleteAction.label}
          >
            {deleteAction.icon ? (
              <deleteAction.icon className="h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    ),
    enableSorting: false,
    size: 100,
  } as ColumnDef<TData>
}

