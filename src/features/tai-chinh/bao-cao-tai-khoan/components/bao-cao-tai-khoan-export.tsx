import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FileSpreadsheet, FileText, Printer, MoreHorizontal } from 'lucide-react'
import * as XLSX from 'xlsx'
import type { BaoCaoTaiKhoanData, BaoCaoTaiKhoanFilters } from '@/types/bao-cao-tai-khoan'
import { toast } from 'sonner'
import { useState } from 'react'
import { exportBaoCaoTaiKhoanToPDF } from '../utils/pdf-export'

interface BaoCaoTaiKhoanExportProps {
  data: BaoCaoTaiKhoanData
  filters?: BaoCaoTaiKhoanFilters
}

export function BaoCaoTaiKhoanExport({ data, filters }: BaoCaoTaiKhoanExportProps) {
  const [isOpen, setIsOpen] = useState(false)

  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = data.giaoDich.map((gd) => ({
        'Mã phiếu': gd.ma_phieu,
        'Ngày': new Date(gd.ngay).toLocaleDateString('vi-VN'),
        'Loại': gd.loai === 'thu' ? 'Thu' : gd.loai === 'chi' ? 'Chi' : 'Luân chuyển',
        'Danh mục': gd.danh_muc?.ten || '',
        'Mô tả': gd.mo_ta || '',
        'Số tiền': gd.so_tien,
        'Số tiền VND': gd.so_tien_vnd || gd.so_tien,
        'Tài khoản đi': gd.tai_khoan?.ten || '',
        'Tài khoản đến': gd.tai_khoan_den?.ten || '',
        'Đối tác': gd.doi_tac?.ten || '',
        'Người tạo': gd.nguoi_tao?.ho_va_ten || gd.nguoi_tao?.ho_ten || '',
      }))

      // Create workbook
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(exportData)

      // Set column widths
      const colWidths = [
        { wch: 15 }, // Mã phiếu
        { wch: 12 }, // Ngày
        { wch: 10 }, // Loại
        { wch: 20 }, // Danh mục
        { wch: 30 }, // Mô tả
        { wch: 15 }, // Số tiền
        { wch: 15 }, // Số tiền VND
        { wch: 20 }, // Tài khoản đi
        { wch: 20 }, // Tài khoản đến
        { wch: 20 }, // Đối tác
        { wch: 15 }, // Người tạo
      ]
      ws['!cols'] = colWidths

      // Add summary sheet
      const summaryData = [
        ['BÁO CÁO TÀI KHOẢN'],
        [],
        ['Số dư đầu kỳ', data.summary.soDuDauKy],
        ['Tổng thu', data.summary.tongThu],
        ['Tổng chi', data.summary.tongChi],
        ['Tồn cuối', data.summary.tonCuoi],
        ['Số lượng giao dịch', data.summary.soLuongGiaoDich],
      ]
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData)
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng hợp')
      XLSX.utils.book_append_sheet(wb, ws, 'Chi tiết')

      // Generate filename
      const dateStr = new Date().toISOString().split('T')[0]
      const filename = `Bao-cao-tai-khoan-${dateStr}.xlsx`

      // Save file
      XLSX.writeFile(wb, filename)
      toast.success('Xuất Excel thành công')
      setIsOpen(false)
    } catch (error: any) {
      toast.error(`Lỗi xuất Excel: ${error.message}`)
    }
  }

  const exportToPDF = () => {
    try {
      exportBaoCaoTaiKhoanToPDF(data, filters)
      toast.success('Xuất PDF thành công')
      setIsOpen(false)
    } catch (error: any) {
      toast.error(`Lỗi xuất PDF: ${error.message}`)
    }
  }

  const handlePrint = () => {
    window.print()
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="default" size="sm" className="h-9">
          <MoreHorizontal className="h-4 w-4 mr-2" />
          Hành động
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        <div className="space-y-0.5">
          <button
            onClick={exportToExcel}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Xuất Excel</span>
          </button>
          <button
            onClick={exportToPDF}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Xuất PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>In báo cáo</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

