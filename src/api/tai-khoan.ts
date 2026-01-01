import { supabase } from '@/lib/supabase'
import type { TaiKhoan, TaiKhoanInsert, TaiKhoanUpdate } from '@/types/tai-khoan'

const TABLE_NAME = 'zz_capi_tai_khoan'

/**
 * Helper: Convert trang_thai (text) to is_active (boolean)
 */
function convertTrangThaiToIsActive(trangThai: string | null): boolean | null {
  if (!trangThai) return null
  return trangThai.toLowerCase() === 'hoat_dong' || trangThai.toLowerCase() === 'active' || trangThai === 'true'
}

/**
 * Helper: Map data từ DB sang format với aliases
 */
function mapTaiKhoanData(data: any): TaiKhoan {
  return {
    ...data,
    ten: data.ten_tai_khoan,
    loai: data.loai_tai_khoan,
    loai_tien: data.don_vi,
    so_du_ban_dau: data.so_du_dau,
    mo_ta: data.ghi_chu,
    is_active: convertTrangThaiToIsActive(data.trang_thai),
    created_by: data.nguoi_tao_id ? String(data.nguoi_tao_id) : null,
    created_at: data.tg_tao,
    updated_at: data.tg_cap_nhat,
  } as TaiKhoan
}

/**
 * Lấy danh sách tài khoản
 */
export async function getTaiKhoanList() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('tg_tao', { ascending: false })

  if (error) {
    console.error('Error fetching tai khoan list:', error)
    throw error
  }

  return (data || []).map(mapTaiKhoanData) as TaiKhoan[]
}

/**
 * Lấy thông tin một tài khoản theo ID
 */
export async function getTaiKhoanById(id: number) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching tai khoan by id:', error)
    throw error
  }

  return mapTaiKhoanData(data) as TaiKhoan
}

/**
 * Tạo mới tài khoản
 */
export async function createTaiKhoan(taiKhoan: TaiKhoanInsert) {
  // Validate required fields
  if (!taiKhoan.loai_tai_khoan || !taiKhoan.ten_tai_khoan) {
    throw new Error('Loại tài khoản và tên tài khoản là bắt buộc')
  }

  const insertData: any = {
    loai_tai_khoan: taiKhoan.loai_tai_khoan,
    ten_tai_khoan: taiKhoan.ten_tai_khoan,
    don_vi: taiKhoan.don_vi || null,
    ngan_hang: taiKhoan.ngan_hang || null,
    so_tai_khoan: taiKhoan.so_tai_khoan || null,
    chu_tai_khoan: taiKhoan.chu_tai_khoan || null,
    ghi_chu: taiKhoan.ghi_chu || null,
    so_du_dau: taiKhoan.so_du_dau || null,
    trang_thai: taiKhoan.trang_thai || 'hoat_dong',
  }

  // Chỉ thêm nguoi_tao_id nếu có giá trị hợp lệ
  if (taiKhoan.nguoi_tao_id) {
    insertData.nguoi_tao_id = Number(taiKhoan.nguoi_tao_id)
  }

  console.log('Inserting tai khoan with data:', insertData)

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(insertData)
    .select('*')
    .single()

  if (error) {
    console.error('Error creating tai khoan:', error)
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw error
  }

  return mapTaiKhoanData(data) as TaiKhoan
}

/**
 * Cập nhật thông tin tài khoản
 */
export async function updateTaiKhoan(id: number, taiKhoan: TaiKhoanUpdate) {
  const updateData: any = {}
  
  if (taiKhoan.loai_tai_khoan !== undefined) updateData.loai_tai_khoan = taiKhoan.loai_tai_khoan
  if (taiKhoan.ten_tai_khoan !== undefined) updateData.ten_tai_khoan = taiKhoan.ten_tai_khoan
  if (taiKhoan.don_vi !== undefined) updateData.don_vi = taiKhoan.don_vi
  if (taiKhoan.ngan_hang !== undefined) updateData.ngan_hang = taiKhoan.ngan_hang
  if (taiKhoan.so_tai_khoan !== undefined) updateData.so_tai_khoan = taiKhoan.so_tai_khoan
  if (taiKhoan.chu_tai_khoan !== undefined) updateData.chu_tai_khoan = taiKhoan.chu_tai_khoan
  if (taiKhoan.ghi_chu !== undefined) updateData.ghi_chu = taiKhoan.ghi_chu
  if (taiKhoan.so_du_dau !== undefined) updateData.so_du_dau = taiKhoan.so_du_dau
  if (taiKhoan.trang_thai !== undefined) updateData.trang_thai = taiKhoan.trang_thai

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...updateData,
      tg_cap_nhat: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    console.error('Error updating tai khoan:', error)
    throw error
  }

  return mapTaiKhoanData(data) as TaiKhoan
}

/**
 * Xóa tài khoản
 */
export async function deleteTaiKhoan(id: number) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting tai khoan:', error)
    throw error
  }
  return { success: true }
}

/**
 * Tìm kiếm tài khoản theo từ khóa
 */
export async function searchTaiKhoan(keyword: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .or(`ten_tai_khoan.ilike.%${keyword}%,so_tai_khoan.ilike.%${keyword}%,ngan_hang.ilike.%${keyword}%,chu_tai_khoan.ilike.%${keyword}%`)
    .order('tg_tao', { ascending: false })

  if (error) {
    console.error('Error searching tai khoan:', error)
    throw error
  }

  return (data || []).map(mapTaiKhoanData) as TaiKhoan[]
}

