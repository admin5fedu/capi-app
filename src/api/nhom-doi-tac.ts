import { supabase } from '@/lib/supabase'
import type { NhomDoiTac, NhomDoiTacInsert, NhomDoiTacUpdate } from '@/types/nhom-doi-tac'

const TABLE_NAME = 'zz_cst_nhom_doi_tac'

/**
 * Lấy danh sách nhóm đối tác
 */
export async function getNhomDoiTacList(loai?: 'nha_cung_cap' | 'khach_hang') {
  let query = supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false })

  // Filter theo loại nếu có
  if (loai) {
    query = query.eq('loai', loai)
  }

  const { data, error } = await query

  if (error) throw error
  return data as NhomDoiTac[]
}

/**
 * Lấy thông tin một nhóm đối tác theo ID
 */
export async function getNhomDoiTacById(id: string): Promise<NhomDoiTac> {
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
      trang_thai: data.trang_thai ?? true,
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
  id: string,
  data: NhomDoiTacUpdate
): Promise<NhomDoiTac> {
  const { data: result, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...data,
      updated_at: new Date().toISOString(),
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
export async function deleteNhomDoiTac(id: string): Promise<{ success: boolean }> {
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
    .or(`ten.ilike.%${keyword}%,mo_ta.ilike.%${keyword}%`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as NhomDoiTac[]
}
