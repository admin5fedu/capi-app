import { supabase } from '@/lib/supabase'
import type { NhomDoiTac, NhomDoiTacInsert, NhomDoiTacUpdate } from '@/types/nhom-doi-tac'

const TABLE_NAME = 'zz_capi_nhom_doi_tac'

/**
 * Lấy danh sách nhóm đối tác
 */
export async function getNhomDoiTacList(loai?: 'nha_cung_cap' | 'khach_hang') {
  let query = supabase
    .from(TABLE_NAME)
    .select('*')
    .order('tg_tao', { ascending: false })

  // Filter theo loại nếu có (dùng hang_muc thay vì loai)
  if (loai) {
    query = query.eq('hang_muc', loai)
  }

  const { data, error } = await query

  if (error) throw error
  return data as NhomDoiTac[]
}

/**
 * Lấy thông tin một nhóm đối tác theo ID
 */
export async function getNhomDoiTacById(id: number): Promise<NhomDoiTac> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as NhomDoiTac
}

/**
 * Tạo mới nhóm đối tác
 */
export async function createNhomDoiTac(data: NhomDoiTacInsert): Promise<NhomDoiTac> {
  const { data: result, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      ...data,
    })
    .select()
    .single()

  if (error) throw error
  return result as NhomDoiTac
}

/**
 * Cập nhật thông tin nhóm đối tác
 */
export async function updateNhomDoiTac(
  id: number,
  data: NhomDoiTacUpdate
): Promise<NhomDoiTac> {
  const { data: result, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...data,
      tg_cap_nhat: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return result as NhomDoiTac
}

/**
 * Xóa nhóm đối tác
 */
export async function deleteNhomDoiTac(id: number): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * Tìm kiếm nhóm đối tác theo từ khóa
 */
export async function searchNhomDoiTac(keyword: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .or(`ten_nhom.ilike.%${keyword}%,mo_ta.ilike.%${keyword}%`)
    .order('tg_tao', { ascending: false })

  if (error) throw error
  return data as NhomDoiTac[]
}
