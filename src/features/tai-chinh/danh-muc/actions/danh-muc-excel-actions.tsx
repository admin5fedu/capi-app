import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import type { DanhMucWithParent } from '@/types/danh-muc'

/**
 * Xuất danh sách danh mục ra Excel
 */
export function handleXuatExcel(data: DanhMucWithParent[]) {
  try {
    // Chuẩn bị dữ liệu để xuất
    const excelData = data.map((item) => ({
      'Tên danh mục': item.ten,
      'Loại': item.loai,
      'Danh mục cha': item.parent_ten || '',
      'Cấp độ': item.cap ? `Cấp ${item.cap}` : '',
      'Mô tả': item.mo_ta || '',
      'Ngày tạo': item.tg_tao || item.created_at
        ? new Date(item.tg_tao || item.created_at || '').toLocaleDateString('vi-VN')
        : '',
    }))

    // Tạo workbook và worksheet
    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Danh mục')

    // Xuất file
    const fileName = `Danh_sach_danh_muc_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)

    toast.success(`Đã xuất ${data.length} danh mục ra file Excel`)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    toast.error('Lỗi khi xuất file Excel')
  }
}

/**
 * Nhập danh sách danh mục từ Excel
 */
export function handleNhapExcel(file: File) {
  // TODO: Implement Excel import functionality
  toast.info('Tính năng nhập Excel đang được phát triển')
  console.log('Import Excel file:', file)
}

