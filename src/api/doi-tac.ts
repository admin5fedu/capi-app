import { supabase } from '@/lib/supabase'
import type { DoiTac, DoiTacInsert, DoiTacUpdate } from '@/types/doi-tac'

/**
 * API layer cho module Danh sách đối tác
 * Sử dụng Supabase để kết nối với database
 */

const TABLE_NAME = 'zz_capi_doi_tac'

/**
 * Lấy danh sách đối tác
 * Filter trực tiếp theo hang_muc nếu có
 */
export async function getDoiTacList(loai?: 'nha_cung_cap' | 'khach_hang'): Promise<DoiTac[]> {
  let query = supabase
    .from(TABLE_NAME)
    .select('*')
    .order('tg_tao', { ascending: false })

  // Filter trực tiếp theo hang_muc nếu có
  if (loai) {
    query = query.eq('hang_muc', loai)
  }

  const { data, error } = await query

  if (error) throw error
  
  // Lấy danh sách nhóm đối tác để map ten_nhom_doi_tac
  const nhomIds = (data || [])
    .map((item: any) => item.nhom_doi_tac_id)
    .filter((id: any): id is number => id !== null && id !== undefined)
  
  let nhomDoiTacMap = new Map<number, string>()
  if (nhomIds.length > 0) {
    const { data: nhomData } = await supabase
      .from('zz_capi_nhom_doi_tac')
      .select('id, ten_nhom')
      .in('id', nhomIds)
    
    if (nhomData) {
      nhomDoiTacMap = new Map(
        nhomData.map((nhom: any) => [nhom.id, nhom.ten_nhom || ''])
      )
    }
  }
  
  // Map dữ liệu để thêm ten_nhom_doi_tac
  return (data || []).map((item: any) => ({
    ...item,
    ten_nhom_doi_tac: item.nhom_doi_tac_id ? nhomDoiTacMap.get(item.nhom_doi_tac_id) || null : null,
  })) as DoiTac[]
}

/**
 * Lấy thông tin một đối tác theo ID
 */
export async function getDoiTacById(id: number): Promise<DoiTac> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  if (!data) {
    throw new Error('Không tìm thấy đối tác')
  }
  
  // Lấy tên nhóm đối tác nếu có nhom_doi_tac_id
  let tenNhomDoiTac = null
  if (data.nhom_doi_tac_id) {
    const { data: nhomData } = await supabase
      .from('zz_capi_nhom_doi_tac')
      .select('ten_nhom')
      .eq('id', data.nhom_doi_tac_id)
      .single()
    
    if (nhomData) {
      tenNhomDoiTac = nhomData.ten_nhom || null
    }
  }
  
  return {
    ...data,
    ten_nhom_doi_tac: tenNhomDoiTac,
  } as DoiTac
}

/**
 * Tạo mới đối tác
 */
export async function createDoiTac(data: DoiTacInsert): Promise<DoiTac> {
  const { data: result, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      ...data,
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
  id: number,
  data: DoiTacUpdate
): Promise<DoiTac> {
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
  return result as DoiTac
}

/**
 * Xóa đối tác
 */
export async function deleteDoiTac(id: number): Promise<{ success: boolean }> {
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
      `ten_doi_tac.ilike.%${keyword}%,cong_ty.ilike.%${keyword}%,email.ilike.%${keyword}%,so_dien_thoai.ilike.%${keyword}%,thong_tin_khac.ilike.%${keyword}%`
    )
    .order('tg_tao', { ascending: false })

  if (error) throw error
  
  // Lấy danh sách nhóm đối tác để map ten_nhom_doi_tac
  const nhomIds = (data || [])
    .map((item: any) => item.nhom_doi_tac_id)
    .filter((id: any): id is number => id !== null && id !== undefined)
  
  let nhomDoiTacMap = new Map<number, string>()
  if (nhomIds.length > 0) {
    const { data: nhomData } = await supabase
      .from('zz_capi_nhom_doi_tac')
      .select('id, ten_nhom')
      .in('id', nhomIds)
    
    if (nhomData) {
      nhomDoiTacMap = new Map(
        nhomData.map((nhom: any) => [nhom.id, nhom.ten_nhom || ''])
      )
    }
  }
  
  // Map dữ liệu để thêm ten_nhom_doi_tac
  return (data || []).map((item: any) => ({
    ...item,
    ten_nhom_doi_tac: item.nhom_doi_tac_id ? nhomDoiTacMap.get(item.nhom_doi_tac_id) || null : null,
  })) as DoiTac[]
}

