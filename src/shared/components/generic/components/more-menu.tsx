import { MoreVertical, RefreshCw, Download, Upload, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { CotHienThi } from '../types'
import { VisibilityState } from '@tanstack/react-table'
import React from 'react'

interface MoreMenuProps<TData extends Record<string, any>> {
  // Column visibility
  cotHienThi?: CotHienThi<TData>[]
  columnVisibility?: VisibilityState
  setColumnVisibility?: (visibility: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void
  showColumnMenu?: boolean
  setShowColumnMenu?: (show: boolean) => void
  
  // Excel actions
  onXuatExcel?: (data: TData[]) => void
  onNhapExcel?: (file: File) => void
  selectedRows?: TData[]
  filteredData?: TData[]
  
  // Refresh
  onRefresh?: () => void
  isLoading?: boolean
}

export function MoreMenu<TData extends Record<string, any>>({
  cotHienThi,
  columnVisibility,
  setColumnVisibility,
  showColumnMenu,
  setShowColumnMenu,
  onXuatExcel,
  onNhapExcel,
  selectedRows = [],
  filteredData = [],
  onRefresh,
  isLoading,
}: MoreMenuProps<TData>) {
  const [isOpen, setIsOpen] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Xử lý xuất Excel
  const handleXuatExcel = () => {
    const dataToExport = selectedRows.length > 0 ? selectedRows : filteredData
    if (onXuatExcel) {
      onXuatExcel(dataToExport)
      setIsOpen(false)
    }
  }

  // Xử lý nhập Excel
  const handleNhapExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (onNhapExcel) {
      onNhapExcel(file)
    }
    // Reset input
    event.target.value = ''
    setIsOpen(false)
  }

  // Toggle column visibility menu
  const handleToggleColumnMenu = () => {
    if (setShowColumnMenu) {
      setShowColumnMenu(!showColumnMenu)
    }
    setIsOpen(false)
  }

  // Kiểm tra có actions nào không
  const hasActions = 
    (cotHienThi && cotHienThi.length > 0) ||
    onXuatExcel ||
    onNhapExcel ||
    onRefresh

  if (!hasActions) return null

  return (
    <div className="relative">
      {/* Hidden file input cho Excel import */}
      {onNhapExcel && (
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleNhapExcel}
          className="hidden"
        />
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10"
            title="Thêm tùy chọn"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-1" align="end">
          <div className="space-y-0.5">
            {/* Column Visibility */}
            {cotHienThi && cotHienThi.length > 0 && setColumnVisibility && setShowColumnMenu && (
              <button
                onClick={handleToggleColumnMenu}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Settings2 className="h-4 w-4" />
                <span>Chọn cột hiển thị</span>
              </button>
            )}

            {/* Excel Export */}
            {onXuatExcel && (
              <button
                onClick={handleXuatExcel}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Xuất Excel</span>
              </button>
            )}

            {/* Excel Import */}
            {onNhapExcel && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Nhập Excel</span>
              </button>
            )}

            {/* Refresh */}
            {onRefresh && (
              <button
                onClick={() => {
                  onRefresh()
                  setIsOpen(false)
                }}
                disabled={isLoading}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                <span>Làm mới</span>
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Column Visibility Menu - Hiển thị riêng khi được mở từ MoreMenu */}
      {showColumnMenu && cotHienThi && setColumnVisibility && setShowColumnMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowColumnMenu(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-card border rounded-md shadow-lg z-20 p-2 max-h-96 overflow-y-auto">
            {cotHienThi.map((cot) => (
              <label
                key={cot.key}
                className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={columnVisibility[cot.key] !== false}
                  onChange={(e) => {
                    setColumnVisibility((prev) => ({
                      ...prev,
                      [cot.key]: e.target.checked,
                    }))
                  }}
                />
                <span className="text-sm">{cot.label}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

