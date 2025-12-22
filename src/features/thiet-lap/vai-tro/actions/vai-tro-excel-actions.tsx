import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import type { VaiTro } from '@/types/vai-tro'

/**
 * Xuất Excel cho module Vai trò
 */
export function handleXuatExcel(data: VaiTro[]) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        'Tên vai trò': item.ten,
        'Mô tả': item.mo_ta || '',
        'Ngày tạo': item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : '',
        'Ngày cập nhật': item.updated_at ? new Date(item.updated_at).toLocaleDateString('vi-VN') : '',
      }))
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vai trò')
    XLSX.writeFile(workbook, `vai-tro-${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Xuất Excel thành công')
  } catch (error) {
    toast.error('Lỗi khi xuất Excel')
    console.error(error)
  }
}

/**
 * Nhập Excel cho module Vai trò
 */
export function handleNhapExcel(_file: File) {
  toast.info('Tính năng nhập Excel đang được phát triển')
  // TODO: Implement import Excel functionality
}

