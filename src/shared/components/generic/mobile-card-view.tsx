import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CotHienThi, HanhDongItem } from './types'
import { User } from 'lucide-react'

interface MobileCardViewProps<TData extends Record<string, any>> {
  data: TData[]
  cotHienThi: CotHienThi<TData>[]
  hanhDongItems?: HanhDongItem<TData>[]
  isLoading?: boolean
  onRowClick?: (row: TData) => void
  selectedRows?: TData[]
  onRowSelect?: (row: TData, selected: boolean) => void
  enableRowSelection?: boolean
  imageField?: string // Field key chứa URL ảnh (ví dụ: 'avatar_url', 'image_url')
  currentPage?: number // Trang hiện tại (0-indexed)
  pageSize?: number // Số items mỗi trang
  onDeleteClick?: (item: TData, action: HanhDongItem<TData>) => void // Callback để xử lý delete với confirmation
}

/**
 * Mobile Card View - Hiển thị dữ liệu dạng card trên mobile
 * - Grid 2 cột
 * - Tối đa 3 hàng (6 cards)
 * - Hỗ trợ hiển thị ảnh
 */
export function MobileCardView<TData extends Record<string, any>>({
  data,
  cotHienThi,
  hanhDongItems = [],
  isLoading = false,
  onRowClick,
  selectedRows = [],
  onRowSelect,
  enableRowSelection = false,
  imageField,
  currentPage = 0,
  pageSize = 6, // Mặc định 6 cards (3 hàng x 2 cột)
  onDeleteClick,
}: MobileCardViewProps<TData>) {
  // Lấy các cột chính để hiển thị (bỏ qua actions, ẩn các cột không cần thiết)
  const mainColumns = cotHienThi.filter(
    (cot) => cot.key !== 'actions' && cot.defaultVisible !== false
  )

  // Lấy cột đầu tiên làm title chính
  const titleColumn = mainColumns[0]
  
  // Tách cột trạng thái (is_active, status, etc.) ra riêng để hiển thị bên phải
  const statusColumn = mainColumns.find(
    (cot) => cot.key === 'is_active' || cot.key === 'status' || cot.key?.toLowerCase().includes('trạng thái')
  )
  
  // Tìm cột mã số (ma, code, etc.)
  const codeColumn = mainColumns.find(
    (cot) => cot.key === 'ma' || cot.key?.toLowerCase().includes('code') || cot.key?.toLowerCase().includes('mã')
  )
  
  // Tìm các cột thông tin quan trọng (email, phone, địa chỉ, etc.)
  // Ưu tiên: email > phone/sdt > địa chỉ > tài khoản ngân hàng
  const importantKeys = [
    'email',
    'phone', 'sdt', 'dien_thoai', 'so_dien_thoai',
    'dia_chi', 'address', 'diachi',
    'so_tai_khoan', 'ngan_hang', 'chu_tai_khoan',
    'ten_nhom', 'nhom', 'loai', 'phan_loai'
  ]
  const importantColumn = mainColumns.find(
    (cot) => {
      if (!cot.key) return false
      const keyLower = cot.key.toLowerCase()
      // Ưu tiên email trước
      if (keyLower.includes('email')) return true
      // Sau đó phone
      if (keyLower.includes('phone') || keyLower.includes('sdt') || keyLower.includes('dien_thoai')) return true
      // Sau đó địa chỉ
      if (keyLower.includes('dia_chi') || keyLower.includes('address')) return true
      // Cuối cùng các key khác
      return importantKeys.some(key => keyLower.includes(key.toLowerCase()))
    }
  )
  
  // Các cột phụ (bỏ qua title, trạng thái, mã số, và cột quan trọng)
  // Lấy tối đa 2 cột phụ để hiển thị ở dòng 2 (cột 1 và cột 2)
  const otherColumns = mainColumns.filter(
    (cot) => cot !== titleColumn && cot !== statusColumn && cot !== codeColumn && cot !== importantColumn
  ).slice(0, 2) // Lấy tối đa 2 cột phụ

  // Hàm lấy giá trị từ accessorKey
  const getValue = (cot: CotHienThi<TData>, row: TData): any => {
    if (!cot.accessorKey) return null
    if (typeof cot.accessorKey === 'function') {
      return cot.accessorKey(row)
    }
    return row[cot.accessorKey as keyof TData]
  }

  // Hàm lấy initial từ tên
  const getInitial = (name: string): string => {
    if (!name) return ''
    const words = name.trim().split(/\s+/)
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase()
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
  }

  // Hàm render ảnh (icon nhỏ)
  const renderImage = (row: TData) => {
    if (!imageField) return null

    const imageUrl = row[imageField as keyof TData] as string | undefined
    const titleValue = titleColumn ? getValue(titleColumn, row) : ''
    const titleText = typeof titleValue === 'string' ? titleValue : String(titleValue || '')

    if (imageUrl && imageUrl.trim() !== '') {
      return (
        <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={titleText}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initial nếu ảnh lỗi
              e.currentTarget.style.display = 'none'
              const parent = e.currentTarget.parentElement
              if (parent) {
                const initialDiv = parent.querySelector('.card-initial') as HTMLElement
                if (initialDiv) initialDiv.style.display = 'flex'
              }
            }}
          />
          <div className="card-initial hidden absolute inset-0 bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
            {getInitial(titleText) || <User className="h-5 w-5" />}
          </div>
        </div>
      )
    }

    // Hiển thị initial nếu không có ảnh
    return (
      <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
        {getInitial(titleText) || <User className="h-5 w-5" />}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Không có dữ liệu</div>
      </div>
    )
  }

  // Tính toán dữ liệu hiển thị theo pagination
  const startIndex = currentPage * pageSize
  const endIndex = startIndex + pageSize
  const displayData = data.slice(startIndex, endIndex)

  return (
    <div className="space-y-2 p-2 sm:p-3 w-full">
      {displayData.map((row, displayIndex) => {
        const rowIndex = startIndex + displayIndex
        const isSelected = selectedRows.some((r) => r === row)
        const titleValue = titleColumn ? getValue(titleColumn, row) : ''
        const titleText = typeof titleValue === 'string' ? titleValue : String(titleValue || '')

        // Tìm các actions
        const editAction = hanhDongItems.find(
          (item) => item.label.toLowerCase().includes('sửa') || item.label.toLowerCase().includes('edit')
        )
        const deleteAction = hanhDongItems.find(
          (item) => item.label.toLowerCase().includes('xóa') || item.label.toLowerCase().includes('delete')
        )
        // Actions phụ (không phải sửa/xóa)
        const otherActions = hanhDongItems.filter(
          (item) =>
            item !== editAction &&
            item !== deleteAction &&
            (!item.hidden || !item.hidden(row))
        )

        return (
          <Card
            key={rowIndex}
            className={cn(
              'overflow-hidden transition-all cursor-pointer hover:shadow-md',
              isSelected && 'ring-2 ring-primary'
            )}
            onClick={(e) => {
              // Không trigger nếu click vào checkbox hoặc button
              const target = e.target as HTMLElement
              if (
                target.closest('input[type="checkbox"]') ||
                target.closest('button') ||
                target.closest('label')
              ) {
                return
              }
              if (onRowClick) {
                onRowClick(row)
              }
            }}
          >
            <CardContent className="p-2.5 sm:p-3 space-y-1.5">
              {/* Dòng 1: Ảnh + Label + Trạng thái - Grid 2 cột */}
              <div className="grid grid-cols-2 gap-2">
                {/* Cột 1: Ảnh (nếu có) + Label */}
                <div className="flex items-start gap-2 min-w-0">
                  {/* Ảnh/Icon (nếu có) */}
                  {imageField && (
                    <div className="flex-shrink-0 pt-0.5">
                      {renderImage(row)}
                    </div>
                  )}
                  
                  {/* Title - line-clamp-1 để chỉ 1 dòng */}
                  <h3 className="font-bold text-base leading-tight line-clamp-1 flex-1 min-w-0 text-foreground">
                    {titleText}
                  </h3>
                </div>
                
                {/* Cột 2: Trạng thái (nếu có) */}
                {statusColumn && (
                  <div className="flex items-start justify-end pt-0.5">
                    {(() => {
                      const value = getValue(statusColumn, row)
                      return statusColumn.cell
                        ? statusColumn.cell(value, row)
                        : value != null
                        ? String(value)
                        : '—'
                    })()}
                  </div>
                )}
              </div>

              {/* Dòng 2: Mã số + Thông tin quan trọng - Grid 2 cột (tùy module, còn k thì trống) */}
              {(codeColumn || importantColumn || otherColumns.length > 0) && (
                <div className="grid grid-cols-2 gap-2">
                  {/* Cột 1: Mã số + Thông tin quan trọng */}
                  <div className="space-y-0.5 min-w-0">
                    {/* Mã số */}
                    {codeColumn && (() => {
                      const codeValue = getValue(codeColumn, row)
                      const codeDisplay = codeColumn.cell
                        ? codeColumn.cell(codeValue, row)
                        : codeValue != null
                        ? String(codeValue)
                        : null
                      
                      if (codeDisplay) {
                        return (
                          <div className="text-sm font-semibold text-primary line-clamp-1">
                            {codeDisplay}
                          </div>
                        )
                      }
                      return null
                    })()}
                    
                    {/* Thông tin quan trọng (email, phone, etc.) */}
                    {importantColumn && (() => {
                      const value = getValue(importantColumn, row)
                      const displayValue = importantColumn.cell
                        ? importantColumn.cell(value, row)
                        : value != null
                        ? String(value)
                        : null
                      
                      if (displayValue && displayValue !== '—') {
                        return (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {displayValue}
                          </div>
                        )
                      }
                      return null
                    })()}
                    
                    {/* Cột phụ đầu tiên (nếu không có mã số và thông tin quan trọng) */}
                    {!codeColumn && !importantColumn && otherColumns.length > 0 && (() => {
                      const cot = otherColumns[0]
                      const value = getValue(cot, row)
                      const displayValue = cot.cell
                        ? cot.cell(value, row)
                        : value != null
                        ? String(value)
                        : '—'

                      if (displayValue && displayValue !== '—') {
                        return (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {displayValue}
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
                  
                  {/* Cột 2: Thông tin phụ (hoặc trống) */}
                  {(() => {
                    // Xác định cột phụ nào hiển thị ở cột 2
                    const hasPrimaryInfo = codeColumn || importantColumn
                    const rightColumnIndex = hasPrimaryInfo ? 0 : 1
                    
                    if (otherColumns.length > rightColumnIndex && otherColumns[rightColumnIndex]) {
                      const cot = otherColumns[rightColumnIndex]
                      const value = getValue(cot, row)
                      const displayValue = cot.cell
                        ? cot.cell(value, row)
                        : value != null
                        ? String(value)
                        : '—'

                      if (displayValue && displayValue !== '—') {
                        return (
                          <div className="space-y-0.5 min-w-0">
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {displayValue}
                            </div>
                          </div>
                        )
                      }
                    }
                    return null
                  })()}
                </div>
              )}

              {/* Dòng 3: Actions - nằm dưới cùng */}
              {(enableRowSelection || editAction || deleteAction || otherActions.length > 0) && (
                <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t">
                  {/* Checkbox chọn - ngoài cùng bên trái */}
                  {enableRowSelection && (
                    <div className="flex-shrink-0">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (onRowSelect) {
                            onRowSelect(row, !!checked)
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                  
                  {/* Actions phụ - ở giữa */}
                  {otherActions.length > 0 && (
                    <div className="flex items-center gap-1 flex-1">
                      {otherActions.map((action, idx) => (
                        <Button
                          key={idx}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1.5 text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            action.onClick(row)
                          }}
                          title={action.label}
                        >
                          {action.icon && <action.icon className="h-3 w-3 mr-0.5" />}
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {/* Actions chính (sửa/xóa) - lệch phải */}
                  <div className="flex items-center gap-1 ml-auto">
                    {editAction && !(editAction.hidden && editAction.hidden(row)) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-1.5 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          editAction.onClick(row)
                        }}
                        title={editAction.label}
                      >
                        <Pencil className="h-3 w-3 mr-0.5" />
                        Sửa
                      </Button>
                    )}
                    {deleteAction && !(deleteAction.hidden && deleteAction.hidden(row)) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-1.5 text-xs text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Nếu có requiresConfirm và có onDeleteClick callback, dùng callback
                          // Nếu không, gọi trực tiếp onClick
                          if (deleteAction.requiresConfirm && onDeleteClick) {
                            onDeleteClick(row, deleteAction)
                          } else {
                          deleteAction.onClick(row)
                          }
                        }}
                        title={deleteAction.label}
                      >
                        <Trash2 className="h-3 w-3 mr-0.5" />
                        Xóa
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

