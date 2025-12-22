import { supabase } from '@/lib/supabase'
import type { DoiTac, DoiTacInsert, DoiTacUpdate } from '@/types/doi-tac'

/**
 * API layer cho module Danh sách đối tác
 * Sử dụng Supabase để kết nối với database
 */

const TABLE_NAME = 'zz_cst_danh_sach_doi_tac'

/**
 * Lấy danh sách đối tác
 */
export async function getDoiTacList(loai?: 'nha_cung_cap' | 'khach_hang'): Promise<DoiTac[]> {
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
  return (data || []) as DoiTac[]
}

/**
 * Lấy thông tin một đối tác theo ID
 */
export async function getDoiTacById(id: string): Promise<DoiTac> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  if (!data) {
    throw new Error('Không tìm thấy đối tác')
  }
  return data as DoiTac
}

/**
 * Tạo mới đối tác
 */
export async function createDoiTac(data: DoiTacInsert): Promise<DoiTac> {
  const { data: result, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      ...data,
      trang_thai: data.trang_thai ?? true,
    })
    .select()
    .single()

  if (error) throw error
  return result as DoiTac
}

/**
 * Cập nhật thông tin đối tác
 */
export async function updateDoiTac(
  id: string,
  data: DoiTacUpdate
): Promise<DoiTac> {
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
  return result as DoiTac
}

/**
 * Xóa đối tác
 */
export async function deleteDoiTac(id: string): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * Tìm kiếm đối tác theo từ khóa
 */
export async function searchDoiTac(keyword: string): Promise<DoiTac[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .or(
      `ma.ilike.%${keyword}%,ten.ilike.%${keyword}%,email.ilike.%${keyword}%,dien_thoai.ilike.%${keyword}%,ghi_chu.ilike.%${keyword}%`
    )
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as DoiTac[]
}

