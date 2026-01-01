import { supabase } from '@/lib/supabase'
import type { PhongBan, PhongBanInsert, PhongBanUpdate } from '@/types/phong-ban'

const TABLE_NAME = 'zz_capi_phong_ban'

/**
 * Lấy danh sách phòng ban
 */
export async function getPhongBanList() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('tg_tao', { ascending: false })

  if (error) throw error
  return data as PhongBan[]
}

/**
 * Lấy thông tin một phòng ban theo ID
 */
export async function getPhongBanById(id: number) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as PhongBan
}

/**
 * Tạo mới phòng ban
 */
export async function createPhongBan(phongBan: PhongBanInsert) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(phongBan)
    .select()
    .single()

  if (error) throw error
  return data as PhongBan
}

/**
 * Cập nhật thông tin phòng ban
 */
export async function updatePhongBan(id: number, phongBan: PhongBanUpdate) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...phongBan,
      tg_cap_nhat: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as PhongBan
}

/**
 * Xóa phòng ban
 */
export async function deletePhongBan(id: number) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * Tìm kiếm phòng ban theo từ khóa (mã, tên, mô tả)
 */
export async function searchPhongBan(keyword: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .or(`ma_phong_ban.ilike.%${keyword}%,ten_phong_ban.ilike.%${keyword}%,mo_ta.ilike.%${keyword}%`)
    .order('tg_tao', { ascending: false })

  if (error) throw error
  return data as PhongBan[]
}

/**
 * Kiểm tra xem phòng ban có đang được sử dụng bởi người dùng nào không
 */
export async function checkPhongBanInUse(id: number) {
  const { data, error } = await supabase
    .from('zz_capi_nguoi_dung')
    .select('id')
    .eq('phong_ban_id', id)
    .limit(1)

  if (error) throw error
  return (data?.length ?? 0) > 0
}

