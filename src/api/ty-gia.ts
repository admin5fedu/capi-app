import { supabase } from '@/lib/supabase'
import type { TyGia, TyGiaInsert, TyGiaUpdate } from '@/types/ty-gia'

const TABLE_NAME = 'zz_capi_ty_gia'

/**
 * Helper: Map data từ DB sang format với aliases
 */
function mapTyGiaData(data: any): TyGia {
  return {
    ...data,
    created_at: data.tg_tao,
    updated_at: data.tg_cap_nhat,
    ngay_ap_dung: data.tg_tao, // Alias cho backward compatibility
  } as TyGia
}

/**
 * Lấy danh sách tỷ giá
 */
export async function getTyGiaList() {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('tg_tao', { ascending: false })

    if (error) {
      // Nếu bảng không tồn tại, trả về mảng rỗng thay vì throw error
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        console.warn(`Table ${TABLE_NAME} does not exist yet. Returning empty array.`)
        return [] as TyGia[]
      }
      console.error('Error fetching ty gia list:', error)
      throw error
    }

    return (data || []).map(mapTyGiaData) as TyGia[]
  } catch (error: any) {
    // Nếu bảng không tồn tại, trả về mảng rỗng
    if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
      console.warn(`Table ${TABLE_NAME} does not exist yet. Returning empty array.`)
      return [] as TyGia[]
    }
    throw error
  }
}

/**
 * Lấy thông tin một tỷ giá theo ID
 */
export async function getTyGiaById(id: number) {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      // Nếu bảng không tồn tại, throw error với message rõ ràng
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        throw new Error(`Bảng ${TABLE_NAME} chưa được tạo trên Supabase. Vui lòng tạo bảng trước.`)
      }
      console.error('Error fetching ty gia by id:', error)
      throw error
    }

    return mapTyGiaData(data) as TyGia
  } catch (error: any) {
    if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
      throw new Error(`Bảng ${TABLE_NAME} chưa được tạo trên Supabase. Vui lòng tạo bảng trước.`)
    }
    throw error
  }
}

/**
 * Lấy tỷ giá mới nhất
 */
export async function getTyGiaMoiNhat() {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('tg_tao', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      // Nếu bảng không tồn tại hoặc không có dữ liệu, trả về null
      if (error.code === 'PGRST205' || error.code === 'PGRST116' || error.message?.includes('Could not find the table')) {
        return null
      }
      console.error('Error fetching latest ty gia:', error)
      throw error
    }
    
    return data ? mapTyGiaData(data) : null
  } catch (error: any) {
    if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
      return null
    }
    throw error
  }
}

/**
 * Lấy tỷ giá theo ngày áp dụng (backward compatibility - sử dụng tg_tao)
 * @deprecated Sử dụng getTyGiaMoiNhat() thay thế
 */
export async function getTyGiaByNgayApDung(ngayApDung: string) {
  try {
    // Tìm tỷ giá có tg_tao gần nhất với ngày áp dụng
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .lte('tg_tao', `${ngayApDung}T23:59:59`)
      .order('tg_tao', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      // Nếu bảng không tồn tại hoặc không có dữ liệu, trả về null
      if (error.code === 'PGRST205' || error.code === 'PGRST116' || error.message?.includes('Could not find the table')) {
        return null
      }
      console.error('Error fetching ty gia by ngay ap dung:', error)
      throw error
    }
    
    return data ? mapTyGiaData(data) : null
  } catch (error: any) {
    if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
      return null
    }
    throw error
  }
}

/**
 * Tạo mới tỷ giá
 */
export async function createTyGia(tyGia: TyGiaInsert) {
  // Validate required fields
  if (!tyGia.ty_gia || tyGia.ty_gia <= 0) {
    throw new Error('Tỷ giá phải lớn hơn 0')
  }

  const insertData: any = {
    ty_gia: tyGia.ty_gia,
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(insertData)
      .select('*')
      .single()

    if (error) {
      // Nếu bảng không tồn tại, throw error với message rõ ràng
      if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
        throw new Error(`Bảng ${TABLE_NAME} chưa được tạo trên Supabase. Vui lòng tạo bảng trước.`)
      }
      console.error('Error creating ty gia:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      throw error
    }

    return mapTyGiaData(data) as TyGia
  } catch (error: any) {
    if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
      throw new Error(`Bảng ${TABLE_NAME} chưa được tạo trên Supabase. Vui lòng tạo bảng trước.`)
    }
    throw error
  }
}

/**
 * Cập nhật thông tin tỷ giá
 */
export async function updateTyGia(id: number, tyGia: TyGiaUpdate) {
  const updateData: any = {}
  
  if (tyGia.ty_gia !== undefined) {
    if (tyGia.ty_gia <= 0) {
      throw new Error('Tỷ giá phải lớn hơn 0')
    }
    updateData.ty_gia = tyGia.ty_gia
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

  if (error) {
    console.error('Error updating ty gia:', error)
    throw error
  }

  return mapTyGiaData(data) as TyGia
}

/**
 * Xóa tỷ giá
 */
export async function deleteTyGia(id: number) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting ty gia:', error)
    throw error
  }
  return { success: true }
}

/**
 * Tìm kiếm tỷ giá theo từ khóa (tìm theo ty_gia)
 */
export async function searchTyGia(keyword: string) {
  // Tìm kiếm theo số tỷ giá
  const numericKeyword = parseFloat(keyword)
  let query = supabase.from(TABLE_NAME).select('*')

  if (!isNaN(numericKeyword)) {
    query = query.eq('ty_gia', numericKeyword)
  } else {
    // Nếu không phải số, không tìm thấy gì
    return []
  }

  const { data, error } = await query.order('tg_tao', { ascending: false })

  if (error) {
    console.error('Error searching ty gia:', error)
    throw error
  }

  return (data || []).map(mapTyGiaData) as TyGia[]
}

