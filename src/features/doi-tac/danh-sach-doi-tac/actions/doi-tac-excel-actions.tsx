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
      'Tên đối tác': item.ten_doi_tac || '',
      'Nhóm đối tác': item.ten_nhom_doi_tac || '',
      'Công ty': item.cong_ty || '',
      'Email': item.email || '',
      'Số điện thoại': item.so_dien_thoai || '',
      'Địa chỉ': item.dia_chi || '',
      'Thông tin khác': item.thong_tin_khac || '',
      'Ngày tạo': item.tg_tao || item.created_at
        ? new Date(item.tg_tao || item.created_at || '').toLocaleDateString('vi-VN')
        : '',
      'Ngày cập nhật': item.tg_cap_nhat || item.updated_at
        ? new Date(item.tg_cap_nhat || item.updated_at || '').toLocaleDateString('vi-VN')
        : '',
    }))

    // Tạo workbook và worksheet
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đối tác')

    // Đặt độ rộng cột
    const colWidths = [
      { wch: 30 }, // Tên đối tác
      { wch: 20 }, // Nhóm đối tác
      { wch: 25 }, // Công ty
      { wch: 25 }, // Email
      { wch: 15 }, // Số điện thoại
      { wch: 40 }, // Địa chỉ
      { wch: 30 }, // Thông tin khác
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
      reject(new Error('Lỗi đọc file'))
    }

    reader.readAsArrayBuffer(file)
  })
}

