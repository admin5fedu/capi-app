import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import type { TyGia } from '@/types/ty-gia'

/**
 * Xuất danh sách tỷ giá ra Excel
 */
export function handleXuatExcel(data: TyGia[]) {
  try {
    // Chuẩn bị dữ liệu để xuất
    const excelData = data.map((item) => ({
      'Tỷ giá': item.ty_gia,
      'Ngày áp dụng': item.ngay_ap_dung
        ? new Date(item.ngay_ap_dung).toLocaleDateString('vi-VN')
        : '',
      'Ghi chú': item.ghi_chu || '',
      'Ngày tạo': item.tg_tao || item.created_at
        ? new Date(item.tg_tao || item.created_at || '').toLocaleDateString('vi-VN')
        : '',
      'Ngày cập nhật': item.tg_cap_nhat || item.updated_at
        ? new Date(item.tg_cap_nhat || item.updated_at || '').toLocaleDateString('vi-VN')
        : '',
    }))

    // Tạo workbook và worksheet
    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Tỷ giá')

    // Xuất file
    const fileName = `Danh_sach_ty_gia_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)

    toast.success(`Đã xuất ${data.length} tỷ giá ra file Excel`)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    toast.error('Lỗi khi xuất file Excel')
  }
}

/**
 * Nhập danh sách tỷ giá từ Excel
 */
export function handleNhapExcel(file: File) {
  // TODO: Implement Excel import functionality
  toast.info('Tính năng nhập Excel đang được phát triển')
  console.log('Import Excel file:', file)
}

