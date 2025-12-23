import { supabase } from '@/lib/supabase'
import type { GiaoDich, GiaoDichInsert, GiaoDichUpdate, GiaoDichWithRelations } from '@/types/giao-dich'

const TABLE_NAME = 'zz_cst_giao_dich'


/**
 * Lấy danh sách giao dịch
 */
export async function getGiaoDichList(): Promise<GiaoDich[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('ngay', { ascending: false })
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return (data || []) as GiaoDich[]
}

/**
 * Lấy thông tin một giao dịch theo ID
 */
export async function getGiaoDichById(id: number): Promise<GiaoDichWithRelations> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(`
      *,
      danh_muc:zz_cst_danh_muc!danh_muc_id(id, ten, loai),
      ty_gia:zz_cst_ty_gia!ty_gia_id(id, ty_gia, ngay_ap_dung),
      tai_khoan:zz_cst_tai_khoan!tai_khoan_id(id, ten, loai_tien),
      tai_khoan_den:zz_cst_tai_khoan!tai_khoan_den_id(id, ten, loai_tien),
      doi_tac:zz_cst_danh_sach_doi_tac!doi_tac_id(id, ten, loai),
      nguoi_tao:zz_cst_nguoi_dung!created_by(id, ho_ten)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  
  // Map data để match với type GiaoDichWithRelations
  const result = data as any
  return {
    ...result,
    danh_muc: result.danh_muc || null,
    ty_gia: result.ty_gia || null,
    tai_khoan: result.tai_khoan || null,
    tai_khoan_den: result.tai_khoan_den || null,
    doi_tac: result.doi_tac || null,
    nguoi_tao: result.nguoi_tao || null,
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
      hinh_anh: data.hinh_anh || [],
    })
    .select()
    .single()
  
  if (error) throw error
  return result as GiaoDich
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
  return result as GiaoDich
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
    .or(`ma_phieu.ilike.%${keyword}%,mo_ta.ilike.%${keyword}%,so_chung_tu.ilike.%${keyword}%,ghi_chu.ilike.%${keyword}%`)
    .order('ngay', { ascending: false })
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return (data || []) as GiaoDich[]
}

/**
 * Lấy mã phiếu tiếp theo theo loại (dùng khi tạo mới)
 */
export async function getNextMaPhieuByLoai(loai: 'thu' | 'chi' | 'luan_chuyen'): Promise<string> {
  // Đếm số lượng giao dịch hiện có theo loại để tạo mã mới
  const { count, error } = await supabase
    .from(TABLE_NAME)
    .select('*', { count: 'exact', head: true })
    .eq('loai', loai)
  
  if (error) throw error
  
  const prefix = loai === 'thu' ? 'PT' : loai === 'chi' ? 'PC' : 'LC'
  const nextNumber = (count || 0) + 1
  return `${prefix}-${nextNumber}`
}

/**
 * Kiểm tra mã phiếu đã tồn tại chưa
 */
export async function checkMaPhieuExists(maPhieu: string, excludeId?: number): Promise<boolean> {
  let query = supabase
    .from(TABLE_NAME)
    .select('id', { count: 'exact', head: true })
    .eq('ma_phieu', maPhieu)
  
  if (excludeId) {
    query = query.neq('id', excludeId)
  }
  
  const { count, error } = await query
  
  if (error) throw error
  return (count || 0) > 0
}

