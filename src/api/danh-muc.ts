import { supabase } from '@/lib/supabase'
import type { DanhMuc, DanhMucInsert, DanhMucUpdate, DanhMucWithParent } from '@/types/danh-muc'

const TABLE_NAME = 'zz_capi_danh_muc_tai_chinh'

/**
 * Lấy danh sách danh mục
 */
export async function getDanhMucList() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('cap', { ascending: true, nullsFirst: false })
    .order('tg_tao', { ascending: false })

  if (error) {
    console.error('Error fetching danh muc list:', error)
    throw error
  }
  
  // Tạo map id -> ten_danh_muc để lookup parent name
  const idToNameMap = new Map<number, string>()
  ;(data || []).forEach((item: any) => {
    if (item.id && item.ten_danh_muc) {
      idToNameMap.set(item.id, item.ten_danh_muc)
    }
  })
  
  // Map data để có aliases và parent_ten
  return (data || []).map((item: any) => ({
    ...item,
    ten: item.ten_danh_muc,
    loai: item.hang_muc,
    parent_id: item.danh_muc_cha_id ? String(item.danh_muc_cha_id) : null,
    created_by: item.nguoi_tao_id ? String(item.nguoi_tao_id) : null,
    parent_ten: item.danh_muc_cha_id 
      ? (idToNameMap.get(item.danh_muc_cha_id) || item.ten_danh_muc_cha || null)
      : null,
  })) as DanhMucWithParent[]
}

/**
 * Lấy danh sách danh mục theo loại
 */
export async function getDanhMucByLoai(loai: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('hang_muc', loai)
    .order('cap', { ascending: true, nullsFirst: false })
    .order('ten_danh_muc', { ascending: true })

  if (error) throw error
  
  // Tạo map id -> ten_danh_muc để lookup parent name
  const idToNameMap = new Map<number, string>()
  ;(data || []).forEach((item: any) => {
    if (item.id && item.ten_danh_muc) {
      idToNameMap.set(item.id, item.ten_danh_muc)
    }
  })
  
  return (data || []).map((item: any) => ({
    ...item,
    ten: item.ten_danh_muc,
    loai: item.hang_muc,
    parent_id: item.danh_muc_cha_id ? String(item.danh_muc_cha_id) : null,
    created_by: item.nguoi_tao_id ? String(item.nguoi_tao_id) : null,
    parent_ten: item.danh_muc_cha_id 
      ? (idToNameMap.get(item.danh_muc_cha_id) || item.ten_danh_muc_cha || null)
      : null,
  })) as DanhMucWithParent[]
}

/**
 * Lấy danh sách danh mục con của một danh mục
 */
export async function getDanhMucChildren(parentId: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('danh_muc_cha_id', parentId)
    .order('cap', { ascending: true, nullsFirst: false })
    .order('ten_danh_muc', { ascending: true })

  if (error) throw error
  
  // Lấy thông tin parent để có parent_ten
  const parentIdNum = Number(parentId)
  const { data: parentData } = await supabase
    .from(TABLE_NAME)
    .select('ten_danh_muc')
    .eq('id', parentIdNum)
    .single()
  
  const parentTen = parentData?.ten_danh_muc || null
  
  return (data || []).map((item: any) => ({
    ...item,
    ten: item.ten_danh_muc,
    loai: item.hang_muc,
    parent_id: item.danh_muc_cha_id ? String(item.danh_muc_cha_id) : null,
    created_by: item.nguoi_tao_id ? String(item.nguoi_tao_id) : null,
    parent_ten: parentTen || item.ten_danh_muc_cha || null,
  })) as DanhMuc[]
}

/**
 * Lấy thông tin một danh mục theo ID
 */
export async function getDanhMucById(id: number) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  
  // Lấy thông tin parent nếu có
  let parentTen = null
  if (data.danh_muc_cha_id) {
    const { data: parentData } = await supabase
      .from(TABLE_NAME)
      .select('ten_danh_muc')
      .eq('id', data.danh_muc_cha_id)
      .single()
    
    parentTen = parentData?.ten_danh_muc || data.ten_danh_muc_cha || null
  }
  
  return {
    ...data,
    ten: data.ten_danh_muc,
    loai: data.hang_muc,
    parent_id: data.danh_muc_cha_id ? String(data.danh_muc_cha_id) : null,
    created_by: data.nguoi_tao_id ? String(data.nguoi_tao_id) : null,
    parent_ten: parentTen,
  } as DanhMucWithParent
}

/**
 * Tạo mới danh mục
 */
export async function createDanhMuc(danhMuc: DanhMucInsert) {
  // Validate required fields
  if (!danhMuc.hang_muc || !danhMuc.ten_danh_muc) {
    throw new Error('Hạng mục và tên danh mục là bắt buộc')
  }

  const insertData: any = {
    hang_muc: danhMuc.hang_muc,
    ten_danh_muc: danhMuc.ten_danh_muc,
    mo_ta: danhMuc.mo_ta || null,
    danh_muc_cha_id: danhMuc.danh_muc_cha_id || null,
    cap: danhMuc.danh_muc_cha_id ? 2 : 1, // Cấp 1 nếu không có cha, cấp 2 nếu có cha
  }

  // Chỉ thêm nguoi_tao_id nếu có giá trị hợp lệ
  if (danhMuc.nguoi_tao_id) {
    insertData.nguoi_tao_id = Number(danhMuc.nguoi_tao_id)
  }

  console.log('Inserting danh muc with data:', insertData)
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(insertData)
    .select('*')
    .single()

  if (error) {
    console.error('Error creating danh muc:', error)
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw error
  }
  
  console.log('Successfully created danh muc:', data)
  
  // Lấy thông tin parent nếu có
  let parentTen = null
  if (data.danh_muc_cha_id) {
    const { data: parentData } = await supabase
      .from(TABLE_NAME)
      .select('ten_danh_muc')
      .eq('id', data.danh_muc_cha_id)
      .single()
    
    parentTen = parentData?.ten_danh_muc || data.ten_danh_muc_cha || null
  }
  
  return {
    ...data,
    ten: data.ten_danh_muc,
    loai: data.hang_muc,
    parent_id: data.danh_muc_cha_id ? String(data.danh_muc_cha_id) : null,
    created_by: data.nguoi_tao_id ? String(data.nguoi_tao_id) : null,
    parent_ten: parentTen,
  } as DanhMuc
}

/**
 * Cập nhật thông tin danh mục
 */
export async function updateDanhMuc(id: number, danhMuc: DanhMucUpdate) {
  const updateData: any = {}
  if (danhMuc.hang_muc !== undefined) updateData.hang_muc = danhMuc.hang_muc
  if (danhMuc.ten_danh_muc !== undefined) updateData.ten_danh_muc = danhMuc.ten_danh_muc
  if (danhMuc.mo_ta !== undefined) updateData.mo_ta = danhMuc.mo_ta
  if (danhMuc.danh_muc_cha_id !== undefined) {
    updateData.danh_muc_cha_id = danhMuc.danh_muc_cha_id
    // Tự động tính cap: cấp 1 nếu không có cha, cấp 2 nếu có cha
    updateData.cap = danhMuc.danh_muc_cha_id ? 2 : 1
  }
  
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...updateData,
      tg_cap_nhat: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) throw error
  
  // Lấy thông tin parent nếu có
  let parentTen = null
  if (data.danh_muc_cha_id) {
    const { data: parentData } = await supabase
      .from(TABLE_NAME)
      .select('ten_danh_muc')
      .eq('id', data.danh_muc_cha_id)
      .single()
    
    parentTen = parentData?.ten_danh_muc || data.ten_danh_muc_cha || null
  }
  
  return {
    ...data,
    ten: data.ten_danh_muc,
    loai: data.hang_muc,
    parent_id: data.danh_muc_cha_id ? String(data.danh_muc_cha_id) : null,
    created_by: data.nguoi_tao_id ? String(data.nguoi_tao_id) : null,
    parent_ten: parentTen,
  } as DanhMuc
}

/**
 * Xóa danh mục
 * Tự động set danh_muc_id = null trong các giao dịch liên quan
 */
export async function deleteDanhMuc(id: number) {
  // Set danh_muc_id = null trong các giao dịch liên quan
  await updateGiaoDichDanhMucToNull([String(id)])

  // Xóa danh mục
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
    .select('*')
    .or(`ten_danh_muc.ilike.%${keyword}%,mo_ta.ilike.%${keyword}%`)
    .order('cap', { ascending: true, nullsFirst: false })
    .order('tg_tao', { ascending: false })

  if (error) throw error
  
  // Tạo map id -> ten_danh_muc để lookup parent name
  const idToNameMap = new Map<number, string>()
  ;(data || []).forEach((item: any) => {
    if (item.id && item.ten_danh_muc) {
      idToNameMap.set(item.id, item.ten_danh_muc)
    }
  })
  
  return (data || []).map((item: any) => ({
    ...item,
    ten: item.ten_danh_muc,
    loai: item.hang_muc,
    parent_id: item.danh_muc_cha_id ? String(item.danh_muc_cha_id) : null,
    created_by: item.nguoi_tao_id ? String(item.nguoi_tao_id) : null,
    parent_ten: item.danh_muc_cha_id 
      ? (idToNameMap.get(item.danh_muc_cha_id) || item.ten_danh_muc_cha || null)
      : null,
  })) as DanhMucWithParent[]
}

/**
 * Kiểm tra danh mục có danh mục con không
 */
export async function checkDanhMucHasChildren(id: number) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id')
    .eq('danh_muc_cha_id', id)
    .limit(1)

  if (error) throw error
  return (data?.length ?? 0) > 0
}

/**
 * Xóa danh mục và tất cả danh mục con (cascade delete)
 */
export async function deleteDanhMucCascade(id: number) {
  // Lấy tất cả danh mục con
  const { data: children, error: childrenError } = await supabase
    .from(TABLE_NAME)
    .select('id')
    .eq('danh_muc_cha_id', id)

  if (childrenError) throw childrenError

  // Xóa tất cả danh mục con trước (và set danh_muc_id = null trong giao dịch)
  if (children && children.length > 0) {
    const childIds = children.map((child) => String(child.id))
    
    // Set danh_muc_id = null trong các giao dịch liên quan
    await updateGiaoDichDanhMucToNull(childIds)
    
    // Xóa danh mục con
    const { error: deleteChildrenError } = await supabase
      .from(TABLE_NAME)
      .delete()
      .in('id', childIds)

    if (deleteChildrenError) throw deleteChildrenError
  }

  // Set danh_muc_id = null trong các giao dịch liên quan đến danh mục cha
  await updateGiaoDichDanhMucToNull([String(id)])

  // Xóa danh mục cha
  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id)

  if (error) throw error
  return { success: true, deletedChildren: children?.length ?? 0 }
}

/**
 * Xóa tất cả danh mục (dùng cho migration)
 */
export async function deleteAllDanhMuc() {
  // Lấy tất cả danh mục
  const { data: allDanhMuc, error: fetchError } = await supabase
    .from(TABLE_NAME)
    .select('id')

  if (fetchError) throw fetchError

  if (!allDanhMuc || allDanhMuc.length === 0) {
    return { success: true, deletedCount: 0 }
  }

  const allIds = allDanhMuc.map((dm) => String(dm.id))

  // Set danh_muc_id = null trong tất cả giao dịch
  await updateGiaoDichDanhMucToNull(allIds)

  // Xóa tất cả danh mục
  const { error } = await supabase.from(TABLE_NAME).delete().in('id', allIds)

  if (error) throw error
  return { success: true, deletedCount: allIds.length }
}

/**
 * Helper: Set danh_muc_id = null trong các giao dịch có danh_muc_id trong danh sách
 */
async function updateGiaoDichDanhMucToNull(danhMucIds: string[]) {
  if (danhMucIds.length === 0) return

  const { error } = await supabase
    .from('zz_capi_giao_dich')
    .update({ danh_muc_id: null })
    .in('danh_muc_id', danhMucIds)

  if (error) throw error
}

