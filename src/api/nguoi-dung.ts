import { supabase } from '@/lib/supabase'
import type { NguoiDung, NguoiDungInsert, NguoiDungUpdate } from '@/types/nguoi-dung'

const TABLE_NAME = 'zz_cst_nguoi_dung'

/**
 * Lấy danh sách người dùng
 */
export async function getNguoiDungList() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as NguoiDung[]
}

/**
 * Lấy danh sách người dùng (không join vai trò, chỉ lấy vai_tro_id)
 */
export async function getNguoiDungListWithVaiTro() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as NguoiDung[]
}

/**
 * Lấy thông tin một người dùng theo ID
 */
export async function getNguoiDungById(id: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as NguoiDung
}

/**
 * Lấy thông tin một người dùng theo email
 */
export async function getNguoiDungByEmail(email: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('email', email)
    .single()

  if (error) throw error
  return data as NguoiDung | null
}

/**
 * Tạo mới người dùng
 */
export async function createNguoiDung(nguoiDung: NguoiDungInsert) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      ...nguoiDung,
      is_active: nguoiDung.is_active ?? true,
    })
    .select()
    .single()

  if (error) throw error
  return data as NguoiDung
}

/**
 * Cập nhật thông tin người dùng
 */
export async function updateNguoiDung(
  id: string,
  nguoiDung: NguoiDungUpdate
) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...nguoiDung,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as NguoiDung
}

/**
 * Xóa người dùng
 */
export async function deleteNguoiDung(id: string) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * Tìm kiếm người dùng theo từ khóa (email, họ tên)
 */
export async function searchNguoiDung(keyword: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .or(`email.ilike.%${keyword}%,ho_ten.ilike.%${keyword}%`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as NguoiDung[]
}

/**
 * Lấy danh sách người dùng đang hoạt động
 */
export async function getActiveNguoiDungList() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as NguoiDung[]
}

/**
 * Lấy danh sách người dùng theo vai trò ID
 */
export async function getNguoiDungByVaiTroId(vaiTroId: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('vai_tro_id', vaiTroId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as NguoiDung[]
}

