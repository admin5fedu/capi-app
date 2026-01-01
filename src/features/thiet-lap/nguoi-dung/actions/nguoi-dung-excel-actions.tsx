import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import type { NguoiDung } from '@/types/nguoi-dung'

/**
 * Xuất Excel cho module Người dùng
 */
export function handleXuatExcel(data: NguoiDung[]) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        'Họ tên': item.ho_va_ten || item.ho_ten || '',
        'Email': item.email || '',
        'Vai trò': item.ten_vai_tro || item.vai_tro_id || '',
        'Phòng ban': item.ten_phong_ban || '',
        'Trạng thái': item.trang_thai || (item.is_active ? 'Hoạt động' : 'Vô hiệu hóa'),
        'Avatar URL': item.avatar_url || '',
        'Ngày tạo': item.tg_tao || item.created_at ? new Date(item.tg_tao || item.created_at || '').toLocaleDateString('vi-VN') : '',
        'Ngày cập nhật': item.tg_cap_nhat || item.updated_at ? new Date(item.tg_cap_nhat || item.updated_at || '').toLocaleDateString('vi-VN') : '',
      }))
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Người dùng')
    XLSX.writeFile(workbook, `nguoi-dung-${new Date().toISOString().split('T')[0]}.xlsx`)
    toast.success('Xuất Excel thành công')
  } catch (error) {
    toast.error('Lỗi khi xuất Excel')
    console.error(error)
  }
}

/**
 * Nhập Excel cho module Người dùng
 */
export function handleNhapExcel(_file: File) {
  toast.info('Tính năng nhập Excel đang được phát triển')
  // TODO: Implement import Excel functionality
}

