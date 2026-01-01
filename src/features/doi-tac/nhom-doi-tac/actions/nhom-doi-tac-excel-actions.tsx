import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import type { NhomDoiTac } from '@/types/nhom-doi-tac'

/**
 * Xử lý xuất Excel cho module Nhóm đối tác
 */
export function handleXuatExcel(data: NhomDoiTac[]) {
  try {
    // Chuẩn bị dữ liệu để export
    const exportData = data.map((item) => ({
      'Tên nhóm': item.ten_nhom || '',
      'Loại': item.hang_muc === 'nha_cung_cap' ? 'Nhà cung cấp' : 'Khách hàng',
      'Mô tả': item.mo_ta || '',
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
    XLSX.utils.book_append_sheet(wb, ws, 'Nhóm đối tác')

    // Đặt độ rộng cột
    const colWidths = [
      { wch: 30 }, // Tên nhóm
      { wch: 15 }, // Loại
      { wch: 50 }, // Mô tả
      { wch: 15 }, // Ngày tạo
      { wch: 15 }, // Ngày cập nhật
    ]
    ws['!cols'] = colWidths

    // Xuất file
    const fileName = `Nhom_Doi_Tac_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)

    toast.success(`Đã xuất ${data.length} nhóm đối tác ra file Excel`)
  } catch (error) {
    console.error('Lỗi khi xuất Excel:', error)
    toast.error('Có lỗi xảy ra khi xuất file Excel')
  }
}

/**
 * Xử lý nhập Excel cho module Nhóm đối tác
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

