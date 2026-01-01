import { supabase } from '@/lib/supabase'
import type { NguoiDung, NguoiDungInsert, NguoiDungUpdate } from '@/types/nguoi-dung'

const TABLE_NAME = 'zz_capi_nguoi_dung'

/**
 * Lấy danh sách người dùng
 */
export async function getNguoiDungList() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('tg_tao', { ascending: false })

  if (error) throw error
  return data as NguoiDung[]
}

/**
 * Lấy danh sách người dùng (không join vai trò, chỉ lấy vai_tro_id)
 */
export async function getNguoiDungListWithVaiTro() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('tg_tao', { ascending: false })

  if (error) throw error
  return data as NguoiDung[]
}

/**
 * Lấy thông tin một người dùng theo ID
 */
export async function getNguoiDungById(id: number) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as NguoiDung
}

/**
 * Lấy thông tin một người dùng theo email (với vai trò)
 * Query riêng để tránh lỗi 400 với join nếu foreign key chưa được setup
 */
export async function getNguoiDungByEmail(email: string) {
  const normalizedEmail = email.toLowerCase().trim()
  
  // Query nguoi_dung trước
  const { data: nguoiDungData, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('email', normalizedEmail)
    .single()

  if (error) {
    // Nếu không tìm thấy user (PGRST116 = no rows returned)
    if (error.code === 'PGRST116') {
      return null
    }
    throw error
  }

  if (!nguoiDungData) {
    return null
  }

  // Nếu có vai_tro_id, query thêm vai trò
  let vaiTroData = null
  if (nguoiDungData.vai_tro_id) {
    try {
      const { data: vaiTro, error: vaiTroError } = await supabase
        .from('zz_capi_vai_tro')
        .select('*')
        .eq('id', nguoiDungData.vai_tro_id)
        .single()

      if (!vaiTroError && vaiTro) {
        vaiTroData = vaiTro
      }
    } catch (vaiTroErr) {
      // Ignore error khi query vai tro
      console.warn('Could not fetch vai tro:', vaiTroErr)
    }
  }

  // Combine data
  return {
    ...nguoiDungData,
    vai_tro: vaiTroData,
  } as NguoiDung & { vai_tro?: any } | null
}

/**
 * Tạo mới người dùng
 */
export async function createNguoiDung(nguoiDung: NguoiDungInsert) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert({
      ...nguoiDung,
      trang_thai: nguoiDung.trang_thai ?? 'Hoạt động',
    })
    .select()
    .single()

  if (error) throw error
  return data as NguoiDung
}

/**
 * Cập nhật thông tin người dùng
 */
export async function updateNguoiDung(
  id: number,
  nguoiDung: NguoiDungUpdate
) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...nguoiDung,
      tg_cap_nhat: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as NguoiDung
}

/**
 * Cập nhật avatar URL cho người dùng
 */
export async function updateNguoiDungAvatar(
  id: number,
  avatarUrl: string
) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      avatar_url: avatarUrl,
      tg_cap_nhat: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as NguoiDung
}

/**
 * Xóa người dùng
 */
export async function deleteNguoiDung(id: number) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * Tìm kiếm người dùng theo từ khóa (email, họ tên)
 */
export async function searchNguoiDung(keyword: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .or(`email.ilike.%${keyword}%,ho_va_ten.ilike.%${keyword}%`)
    .order('tg_tao', { ascending: false })

  if (error) throw error
  return data as NguoiDung[]
}

/**
 * Lấy danh sách người dùng đang hoạt động
 */
export async function getActiveNguoiDungList() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .ilike('trang_thai', 'hoạt động')
    .order('tg_tao', { ascending: false })

  if (error) throw error
  return data as NguoiDung[]
}

/**
 * Lấy danh sách người dùng theo vai trò ID
 */
export async function getNguoiDungByVaiTroId(vaiTroId: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('vai_tro_id', vaiTroId)
    .order('tg_tao', { ascending: false })

  if (error) throw error
  return data as NguoiDung[]
}

/**
 * Lấy danh sách người dùng theo phòng ban ID
 */
export async function getNguoiDungByPhongBanId(phongBanId: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('phong_ban_id', Number(phongBanId))
    .order('tg_tao', { ascending: false })

  if (error) throw error
  return data as NguoiDung[]
}

