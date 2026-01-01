import { supabase } from '@/lib/supabase'
import type { TyGia, TyGiaInsert, TyGiaUpdate } from '@/types/ty-gia'

const TABLE_NAME = 'zz_capi_ty_gia'

/**
 * Lấy danh sách tỷ giá
 */
export async function getTyGiaList() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('ngay_ap_dung', { ascending: false })

  if (error) throw error
  return data as TyGia[]
}

/**
 * Lấy thông tin một tỷ giá theo ID
 */
export async function getTyGiaById(id: number) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as TyGia
}

/**
 * Lấy tỷ giá theo ngày áp dụng
 */
export async function getTyGiaByNgayApDung(ngayApDung: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('ngay_ap_dung', ngayApDung)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
  return data as TyGia | null
}

/**
 * Tạo mới tỷ giá
 */
export async function createTyGia(tyGia: TyGiaInsert) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(tyGia)
    .select()
    .single()

  if (error) throw error
  return data as TyGia
}

/**
 * Cập nhật thông tin tỷ giá
 */
export async function updateTyGia(id: number, tyGia: TyGiaUpdate) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...tyGia,
      tg_cap_nhat: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as TyGia
}

/**
 * Xóa tỷ giá
 */
export async function deleteTyGia(id: number) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * Tìm kiếm tỷ giá theo từ khóa
 */
export async function searchTyGia(keyword: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .or(`ghi_chu.ilike.%${keyword}%`)
    .order('ngay_ap_dung', { ascending: false })

  if (error) throw error
  return data as TyGia[]
}

