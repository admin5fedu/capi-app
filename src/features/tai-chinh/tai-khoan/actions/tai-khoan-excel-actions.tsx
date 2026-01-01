import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import type { TaiKhoan } from '@/types/tai-khoan'

/**
 * Xuất danh sách tài khoản ra Excel
 */
export function handleXuatExcel(data: TaiKhoan[]) {
  try {
    // Chuẩn bị dữ liệu để xuất
    const excelData = data.map((item) => ({
      'Tên tài khoản': item.ten,
      'Loại': item.loai,
      'Loại tiền': item.loai_tien,
      'Số tài khoản': item.so_tai_khoan || '',
      'Ngân hàng': item.ngan_hang || '',
      'Chủ tài khoản': item.chu_tai_khoan || '',
      'Số dư ban đầu': item.so_du_ban_dau ?? 0,
      'Trạng thái': item.is_active ? 'Hoạt động' : 'Vô hiệu hóa',
      'Mô tả': item.mo_ta || '',
      'Ngày tạo': item.tg_tao || item.created_at
        ? new Date(item.tg_tao || item.created_at || '').toLocaleDateString('vi-VN')
        : '',
    }))

    // Tạo workbook và worksheet
    const ws = XLSX.utils.json_to_sheet(excelData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Tài khoản')

    // Xuất file
    const fileName = `Danh_sach_tai_khoan_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)

    toast.success(`Đã xuất ${data.length} tài khoản ra file Excel`)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    toast.error('Lỗi khi xuất file Excel')
  }
}

/**
 * Nhập danh sách tài khoản từ Excel
 */
export function handleNhapExcel(file: File) {
  // TODO: Implement Excel import functionality
  toast.info('Tính năng nhập Excel đang được phát triển')
  console.log('Import Excel file:', file)
}

