import { supabase } from '@/lib/supabase'
import type { GiaoDich, GiaoDichInsert, GiaoDichUpdate, GiaoDichWithRelations } from '@/types/giao-dich'

const TABLE_NAME = 'zz_capi_giao_dich'

/**
 * Map dữ liệu từ DB sang format có aliases
 */
function mapGiaoDichData(data: any): GiaoDich {
  return {
    ...data,
    // Aliases for backward compatibility
    loai: data.hang_muc,
    so_chung_tu: data.chung_tu,
    so_tien_vnd: data.so_tien_quy_doi,
    created_by: data.nguoi_tao_id?.toString() || null,
    created_at: data.tg_tao,
    updated_at: data.tg_cap_nhat,
  }
}

/**
 * Lấy danh sách giao dịch
 */
export async function getGiaoDichList(): Promise<GiaoDich[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('ngay', { ascending: false })
    .order('tg_tao', { ascending: false })
  
  if (error) throw error
  return (data || []).map(mapGiaoDichData) as GiaoDich[]
}

/**
 * Lấy thông tin một giao dịch theo ID
 */
export async function getGiaoDichById(id: number): Promise<GiaoDichWithRelations> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(`
      *,
      danh_muc:zz_capi_danh_muc_tai_chinh!danh_muc_id(id, ten_danh_muc, hang_muc),
      ty_gia:zz_capi_ty_gia!ty_gia_id(id, ty_gia),
      tai_khoan_di:zz_capi_tai_khoan!tai_khoan_di_id(id, ten_tai_khoan, don_vi),
      tai_khoan_den:zz_capi_tai_khoan!tai_khoan_den_id(id, ten_tai_khoan, don_vi),
      nguoi_tao:zz_capi_nguoi_dung!nguoi_tao_id(id, ho_va_ten)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  
  // Map data để match với type GiaoDichWithRelations
  const result = data as any
  const mapped = mapGiaoDichData(result)
  
  return {
    ...mapped,
    danh_muc: result.danh_muc ? {
      id: result.danh_muc.id,
      ten_danh_muc: result.danh_muc.ten_danh_muc,
      hang_muc: result.danh_muc.hang_muc,
    } : null,
    ty_gia: result.ty_gia || null,
    tai_khoan_di: result.tai_khoan_di ? {
      id: result.tai_khoan_di.id,
      ten_tai_khoan: result.tai_khoan_di.ten_tai_khoan,
      don_vi: result.tai_khoan_di.don_vi,
    } : null,
    tai_khoan_den: result.tai_khoan_den ? {
      id: result.tai_khoan_den.id,
      ten_tai_khoan: result.tai_khoan_den.ten_tai_khoan,
      don_vi: result.tai_khoan_den.don_vi,
    } : null,
    nguoi_tao: result.nguoi_tao || null,
    // Aliases for backward compatibility
    loai: result.hang_muc,
    danh_muc_ten: result.danh_muc?.ten_danh_muc || null,
    tai_khoan: result.tai_khoan_di ? {
      id: result.tai_khoan_di.id,
      ten: result.tai_khoan_di.ten_tai_khoan,
      loai_tien: result.tai_khoan_di.don_vi,
    } : null,
    so_tien_vnd: result.so_tien_quy_doi,
  } as GiaoDichWithRelations
}

/**
 * Tạo mới giao dịch
 */
export async function createGiaoDich(data: GiaoDichInsert): Promise<GiaoDich> {
  const { data: result, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      ...data,
      hinh_anh: data.hinh_anh || null,
    })
    .select()
    .single()
  
  if (error) throw error
  return mapGiaoDichData(result) as GiaoDich
}

/**
 * Cập nhật thông tin giao dịch
 */
export async function updateGiaoDich(id: number, data: GiaoDichUpdate): Promise<GiaoDich> {
  const { data: result, error } = await supabase
    .from(TABLE_NAME)
    .update(data)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return mapGiaoDichData(result) as GiaoDich
}

/**
 * Xóa giao dịch
 */
export async function deleteGiaoDich(id: number): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)
  
  if (error) throw error
  return { success: true }
}

/**
 * Tìm kiếm giao dịch theo từ khóa
 */
export async function searchGiaoDich(keyword: string): Promise<GiaoDich[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .or(`hang_muc.ilike.%${keyword}%,mo_ta.ilike.%${keyword}%,chung_tu.ilike.%${keyword}%,ghi_chu.ilike.%${keyword}%,ten_danh_muc.ilike.%${keyword}%,ten_tai_khoan_di.ilike.%${keyword}%,ten_tai_khoan_den.ilike.%${keyword}%`)
    .order('ngay', { ascending: false })
    .order('tg_tao', { ascending: false })
  
  if (error) throw error
  return (data || []).map(mapGiaoDichData) as GiaoDich[]
}
