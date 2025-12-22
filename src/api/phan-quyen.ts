import { supabase } from '@/lib/supabase'
import type { PhanQuyen, PhanQuyenInsert, PhanQuyenUpdate } from '@/types/phan-quyen'

const TABLE_NAME = 'zz_cst_phan_quyen'

/**
 * Lấy danh sách phân quyền theo vai trò
 */
export async function getPhanQuyenByVaiTro(vaiTroId: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('vai_tro_id', vaiTroId)
    .order('module', { ascending: true })
    .order('action', { ascending: true })

  if (error) throw error
  return data as PhanQuyen[]
}

/**
 * Lấy tất cả phân quyền
 */
export async function getAllPhanQuyen() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('vai_tro_id', { ascending: true })
    .order('module', { ascending: true })
    .order('action', { ascending: true })

  if (error) throw error
  return data as PhanQuyen[]
}

/**
 * Tạo mới phân quyền
 */
export async function createPhanQuyen(phanQuyen: PhanQuyenInsert) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(phanQuyen)
    .select()
    .single()

  if (error) throw error
  return data as PhanQuyen
}

/**
 * Cập nhật phân quyền
 */
export async function updatePhanQuyen(id: string, phanQuyen: PhanQuyenUpdate) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...phanQuyen,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as PhanQuyen
}

/**
 * Xóa phân quyền
 */
export async function deletePhanQuyen(id: string) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * Upsert phân quyền (tạo mới hoặc cập nhật nếu đã tồn tại)
 */
export async function upsertPhanQuyen(phanQuyen: PhanQuyenInsert) {
  // Kiểm tra xem đã tồn tại chưa
  const { data: existing } = await supabase
    .from(TABLE_NAME)
    .select('id')
    .eq('vai_tro_id', phanQuyen.vai_tro_id)
    .eq('module', phanQuyen.module)
    .eq('action', phanQuyen.action)
    .single()

  if (existing) {
    // Cập nhật nếu đã tồn tại
    return updatePhanQuyen(existing.id, { allowed: phanQuyen.allowed })
  } else {
    // Tạo mới nếu chưa tồn tại
    return createPhanQuyen(phanQuyen)
  }
}

/**
 * Cập nhật nhiều phân quyền cùng lúc
 */
export async function bulkUpdatePhanQuyen(
  vaiTroId: string,
  updates: Array<{ module: string; action: string; allowed: boolean }>
) {
  // Lấy tất cả phân quyền hiện tại của vai trò
  const currentPermissions = await getPhanQuyenByVaiTro(vaiTroId)

  // Tạo map để tra cứu nhanh
  const permissionMap = new Map<string, PhanQuyen>()
  currentPermissions.forEach((p) => {
    const key = `${p.module}:${p.action}`
    permissionMap.set(key, p)
  })

  // Xử lý từng update
  const promises = updates.map(async (update) => {
    const key = `${update.module}:${update.action}`
    const existing = permissionMap.get(key)

    if (existing) {
      // Cập nhật nếu đã tồn tại
      return updatePhanQuyen(existing.id, { allowed: update.allowed })
    } else {
      // Tạo mới nếu chưa tồn tại
      return createPhanQuyen({
        vai_tro_id: vaiTroId,
        module: update.module,
        action: update.action,
        allowed: update.allowed,
      })
    }
  })

  const results = await Promise.all(promises)
  return results
}

