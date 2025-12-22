import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import type { DoiTac } from '@/types/doi-tac'

/**
 * Xử lý xuất Excel cho module Danh sách đối tác
 */
export function handleXuatExcel(data: DoiTac[]) {
  try {
    // Chuẩn bị dữ liệu để export
    const exportData = data.map((item) => ({
      'Mã đối tác': item.ma,
      'Tên đối tác': item.ten,
      'Loại': item.loai === 'nha_cung_cap' ? 'Nhà cung cấp' : 'Khách hàng',
      'Email': item.email || '',
      'Điện thoại': item.dien_thoai || '',
      'Địa chỉ': item.dia_chi || '',
      'Mã số thuế': item.ma_so_thue || '',
      'Người liên hệ': item.nguoi_lien_he || '',
      'Trạng thái': item.trang_thai ? 'Hoạt động' : 'Vô hiệu hóa',
      'Ngày tạo': item.created_at
        ? new Date(item.created_at).toLocaleDateString('vi-VN')
        : '',
      'Ngày cập nhật': item.updated_at
        ? new Date(item.updated_at).toLocaleDateString('vi-VN')
        : '',
    }))

    // Tạo workbook và worksheet
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đối tác')

    // Đặt độ rộng cột
    const colWidths = [
      { wch: 15 }, // Mã đối tác
      { wch: 30 }, // Tên đối tác
      { wch: 15 }, // Loại
      { wch: 25 }, // Email
      { wch: 15 }, // Điện thoại
      { wch: 40 }, // Địa chỉ
      { wch: 15 }, // Mã số thuế
      { wch: 20 }, // Người liên hệ
      { wch: 15 }, // Trạng thái
      { wch: 15 }, // Ngày tạo
      { wch: 15 }, // Ngày cập nhật
    ]
    ws['!cols'] = colWidths

    // Xuất file
    const fileName = `Danh_Sach_Doi_Tac_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)

    toast.success(`Đã xuất ${data.length} đối tác ra file Excel`)
  } catch (error) {
    console.error('Lỗi khi xuất Excel:', error)
    toast.error('Có lỗi xảy ra khi xuất file Excel')
  }
}

/**
 * Xử lý nhập Excel cho module Danh sách đối tác
 */
export function handleNhapExcel(file: File) {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

        // TODO: Implement import logic khi cần
        // Hiện tại chỉ log ra console
        console.log('Dữ liệu nhập từ Excel:', jsonData)

        toast.success(`Đã đọc ${jsonData.length} dòng từ file Excel`)
        toast.info('Chức năng nhập Excel đang được phát triển')

        resolve()
      } catch (error) {
        console.error('Lỗi khi đọc file Excel:', error)
        toast.error('Có lỗi xảy ra khi đọc file Excel')
        reject(error)
      }
    }

    reader.onerror = () => {
      toast.error('Có lỗi xảy ra khi đọc file')
      reject(new Error('File read error'))
    }

    reader.readAsArrayBuffer(file)
  })
}

