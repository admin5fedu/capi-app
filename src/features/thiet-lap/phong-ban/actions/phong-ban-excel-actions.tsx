import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import type { PhongBan } from '@/types/phong-ban'

/**
 * Xuất Excel cho module Phòng ban
 */
export function handleXuatExcel(data: PhongBan[]) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        'Mã phòng ban': item.ma_phong_ban || '',
        'Tên phòng ban': item.ten_phong_ban || '',
        'Mô tả': item.mo_ta || '',
        'Ngày tạo': item.tg_tao || item.created_at ? new Date(item.tg_tao || item.created_at || '').toLocaleDateString('vi-VN') : '',
        'Ngày cập nhật': item.tg_cap_nhat || item.updated_at ? new Date(item.tg_cap_nhat || item.updated_at || '').toLocaleDateString('vi-VN') : '',
      }))
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Phòng ban')
    XLSX.writeFile(workbook, `phong-ban-${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Xuất Excel thành công')
  } catch (error) {
    toast.error('Lỗi khi xuất Excel')
    console.error(error)
  }
}

/**
 * Nhập Excel cho module Phòng ban
 */
export function handleNhapExcel(_file: File) {
  toast.info('Tính năng nhập Excel đang được phát triển')
  // TODO: Implement import Excel functionality
}

