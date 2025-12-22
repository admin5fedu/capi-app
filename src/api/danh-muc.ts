import { supabase } from '@/lib/supabase'
import type { DanhMuc, DanhMucInsert, DanhMucUpdate, DanhMucWithParent } from '@/types/danh-muc'

const TABLE_NAME = 'zz_cst_danh_muc'

/**
 * Lấy danh sách danh mục
 */
export async function getDanhMucList() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*, parent:parent_id(ten)')
    .order('thu_tu', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  
  // Map data để có parent_ten
  return (data || []).map((item: any) => ({
    ...item,
    parent_ten: item.parent?.ten || null,
    parent: undefined, // Remove nested parent object
  })) as DanhMucWithParent[]
}

/**
 * Lấy danh sách danh mục theo loại
 */
export async function getDanhMucByLoai(loai: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*, parent:parent_id(ten)')
    .eq('loai', loai)
    .eq('is_active', true)
    .order('thu_tu', { ascending: true, nullsFirst: false })
    .order('ten', { ascending: true })

  if (error) throw error
  
  return (data || []).map((item: any) => ({
    ...item,
    parent_ten: item.parent?.ten || null,
    parent: undefined,
  })) as DanhMucWithParent[]
}

/**
 * Lấy danh sách danh mục con của một danh mục
 */
export async function getDanhMucChildren(parentId: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('parent_id', parentId)
    .order('thu_tu', { ascending: true, nullsFirst: false })
    .order('ten', { ascending: true })

  if (error) throw error
  return data as DanhMuc[]
}

/**
 * Lấy thông tin một danh mục theo ID
 */
export async function getDanhMucById(id: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*, parent:parent_id(ten)')
    .eq('id', id)
    .single()

  if (error) throw error
  
  return {
    ...data,
    parent_ten: (data as any).parent?.ten || null,
    parent: undefined,
  } as DanhMucWithParent
}

/**
 * Tạo mới danh mục
 */
export async function createDanhMuc(danhMuc: DanhMucInsert) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(danhMuc)
    .select()
    .single()

  if (error) throw error
  return data as DanhMuc
}

/**
 * Cập nhật thông tin danh mục
 */
export async function updateDanhMuc(id: string, danhMuc: DanhMucUpdate) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...danhMuc,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as DanhMuc
}

/**
 * Xóa danh mục
 */
export async function deleteDanhMuc(id: string) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * Tìm kiếm danh mục theo từ khóa
 */
export async function searchDanhMuc(keyword: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*, parent:parent_id(ten)')
    .or(`ten.ilike.%${keyword}%,mo_ta.ilike.%${keyword}%`)
    .order('thu_tu', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  
  return (data || []).map((item: any) => ({
    ...item,
    parent_ten: item.parent?.ten || null,
    parent: undefined,
  })) as DanhMucWithParent[]
}

/**
 * Kiểm tra danh mục có danh mục con không
 */
export async function checkDanhMucHasChildren(id: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id')
    .eq('parent_id', id)
    .limit(1)

  if (error) throw error
  return (data?.length ?? 0) > 0
}

