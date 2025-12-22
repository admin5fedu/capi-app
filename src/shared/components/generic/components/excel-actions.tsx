import { Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'

interface ExcelActionsProps<TData extends Record<string, any>> {
  onXuatExcel?: (data: TData[]) => void
  onNhapExcel?: (file: File) => void
  selectedRows: TData[]
  filteredData: TData[]
}

export function ExcelActions<TData extends Record<string, any>>({
  onXuatExcel,
  onNhapExcel,
  selectedRows,
  filteredData,
}: ExcelActionsProps<TData>) {
  // Xử lý xuất Excel
  const handleXuatExcel = () => {
    const dataToExport = selectedRows.length > 0 ? selectedRows : filteredData
    if (onXuatExcel) {
      onXuatExcel(dataToExport)
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
  }

  return (
    <>
      {/* Excel import */}
      {onNhapExcel && (
        <div className="relative">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleNhapExcel}
            className="hidden"
            id="excel-upload"
          />
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => document.getElementById('excel-upload')?.click()}
            title="Nhập Excel"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Excel export */}
      {onXuatExcel && (
        <Button
          variant="outline"
          size="icon"
          onClick={handleXuatExcel}
          title="Xuất Excel"
        >
          <Download className="h-4 w-4" />
        </Button>
      )}
    </>
  )
}

