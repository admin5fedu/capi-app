import { supabase } from '@/lib/supabase'
import type { VaiTro, VaiTroInsert, VaiTroUpdate } from '@/types/vai-tro'

const TABLE_NAME = 'zz_capi_vai_tro'

/**
 * Lấy danh sách vai trò
 */
export async function getVaiTroList() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('tg_tao', { ascending: false })

  if (error) throw error
  return data as VaiTro[]
}

/**
 * Lấy thông tin một vai trò theo ID
 */
export async function getVaiTroById(id: number) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as VaiTro
}

/**
 * Tạo mới vai trò
 */
export async function createVaiTro(vaiTro: VaiTroInsert) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(vaiTro)
    .select()
    .single()

  if (error) throw error
  return data as VaiTro
}

/**
 * Cập nhật thông tin vai trò
 */
export async function updateVaiTro(id: number, vaiTro: VaiTroUpdate) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...vaiTro,
      tg_cap_nhat: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as VaiTro
}

/**
 * Xóa vai trò
 */
export async function deleteVaiTro(id: number) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * Tìm kiếm vai trò theo từ khóa (tên, mô tả)
 */
export async function searchVaiTro(keyword: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .or(`ten_vai_tro.ilike.%${keyword}%,mo_ta.ilike.%${keyword}%`)
    .order('tg_tao', { ascending: false })

  if (error) throw error
  return data as VaiTro[]
}

/**
 * Kiểm tra xem vai trò có đang được sử dụng bởi người dùng nào không
 */
export async function checkVaiTroInUse(id: number) {
  const { data, error } = await supabase
    .from('zz_capi_nguoi_dung')
    .select('id')
    .eq('vai_tro_id', id)
    .limit(1)

  if (error) throw error
  return (data?.length ?? 0) > 0
}

