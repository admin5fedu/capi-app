import { supabase } from '@/lib/supabase'
import type { TaiKhoan, TaiKhoanInsert, TaiKhoanUpdate } from '@/types/tai-khoan'

const TABLE_NAME = 'zz_cst_tai_khoan'

/**
 * Lấy danh sách tài khoản
 */
export async function getTaiKhoanList() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as TaiKhoan[]
}

/**
 * Lấy thông tin một tài khoản theo ID
 */
export async function getTaiKhoanById(id: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as TaiKhoan
}

/**
 * Tạo mới tài khoản
 */
export async function createTaiKhoan(taiKhoan: TaiKhoanInsert) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(taiKhoan)
    .select()
    .single()

  if (error) throw error
  return data as TaiKhoan
}

/**
 * Cập nhật thông tin tài khoản
 */
export async function updateTaiKhoan(id: string, taiKhoan: TaiKhoanUpdate) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...taiKhoan,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as TaiKhoan
}

/**
 * Xóa tài khoản
 */
export async function deleteTaiKhoan(id: string) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * Tìm kiếm tài khoản theo từ khóa
 */
export async function searchTaiKhoan(keyword: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .or(`ten.ilike.%${keyword}%,so_tai_khoan.ilike.%${keyword}%,ngan_hang.ilike.%${keyword}%,chu_tai_khoan.ilike.%${keyword}%`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as TaiKhoan[]
}

