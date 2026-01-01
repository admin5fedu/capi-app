import { supabase } from '@/lib/supabase'
import type { PhanQuyen, PhanQuyenInsert, PhanQuyenUpdate, PhanQuyenJsonb } from '@/types/phan-quyen'

const TABLE_NAME = 'zz_capi_phan_quyen'

/**
 * Lấy danh sách phân quyền theo vai trò
 */
export async function getPhanQuyenByVaiTro(vaiTroId: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('vai_tro_id', vaiTroId)
    .order('module', { ascending: true })

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
export async function updatePhanQuyen(id: number, phanQuyen: PhanQuyenUpdate) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      ...phanQuyen,
      tg_cap_nhat: new Date().toISOString(),
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
export async function deletePhanQuyen(id: number) {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/**
 * Upsert phân quyền (tạo mới hoặc cập nhật nếu đã tồn tại)
 * Với cấu trúc JSONB array, replace toàn bộ array
 */
export async function upsertPhanQuyen(phanQuyen: PhanQuyenInsert) {
  // Kiểm tra xem đã tồn tại chưa (theo vai_tro_id + module)
  const { data: existing } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('vai_tro_id', phanQuyen.vai_tro_id)
    .eq('module', phanQuyen.module)
    .maybeSingle()

  if (existing) {
    // Replace toàn bộ array với array mới
    return updatePhanQuyen(existing.id, { phan_quyen: phanQuyen.phan_quyen })
  } else {
    // Tạo mới nếu chưa tồn tại
    return createPhanQuyen(phanQuyen)
  }
}

/**
 * Lấy phân quyền theo module
 */
export async function getPhanQuyenByModule(module: string) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('module', module)
    .order('vai_tro_id', { ascending: true })

  if (error) throw error
  return data as PhanQuyen[]
}

/**
 * Cập nhật nhiều phân quyền cùng lúc cho một vai trò
 * Groups by module và tạo array chỉ với các quyền được phép (allowed: true)
 */
export async function bulkUpdatePhanQuyen(
  vaiTroId: string,
  updates: Array<{ module: string; action: string; allowed: boolean }>
) {
  // Group updates by module, chỉ giữ lại các action có allowed: true
  const moduleMap = new Map<string, Set<string>>()
  updates.forEach((update) => {
    if (update.allowed) {
      if (!moduleMap.has(update.module)) {
        moduleMap.set(update.module, new Set())
      }
      moduleMap.get(update.module)!.add(update.action)
    }
  })

  // Lấy tất cả phân quyền hiện tại của vai trò
  const currentPermissions = await getPhanQuyenByVaiTro(vaiTroId)
  const permissionMap = new Map<string, PhanQuyen>()
  currentPermissions.forEach((p) => {
    if (p.module) {
      permissionMap.set(p.module, p)
    }
  })

  // Xử lý từng module
  const promises = Array.from(moduleMap.entries()).map(async ([module, allowedActions]) => {
    const existing = permissionMap.get(module)
    // Chuyển Set thành array và sort để consistent
    const phanQuyen: PhanQuyenJsonb = Array.from(allowedActions).sort()

    if (existing) {
      return updatePhanQuyen(existing.id, { phan_quyen: phanQuyen })
    } else {
      return createPhanQuyen({
        vai_tro_id: vaiTroId,
        module,
        phan_quyen: phanQuyen,
      })
    }
  })

  const results = await Promise.all(promises)
  return results
}

/**
 * Cập nhật phân quyền cho nhiều vai trò cùng lúc (theo module)
 * Groups by vai_tro_id và tạo array chỉ với các quyền được phép (allowed: true)
 */
export async function bulkUpdatePhanQuyenByModule(
  module: string,
  updates: Array<{ vai_tro_id: string; action: string; allowed: boolean }>
) {
  // Group updates by vai_tro_id, chỉ giữ lại các action có allowed: true
  const vaiTroMap = new Map<string, Set<string>>()
  updates.forEach((update) => {
    if (update.allowed) {
      if (!vaiTroMap.has(update.vai_tro_id)) {
        vaiTroMap.set(update.vai_tro_id, new Set())
      }
      vaiTroMap.get(update.vai_tro_id)!.add(update.action)
    }
  })

  // Lấy tất cả phân quyền hiện tại của module
  const currentPermissions = await getPhanQuyenByModule(module)
  const permissionMap = new Map<string, PhanQuyen>()
  currentPermissions.forEach((p) => {
    if (p.vai_tro_id) {
      permissionMap.set(p.vai_tro_id, p)
    }
  })

  // Xử lý từng vai trò
  const promises = Array.from(vaiTroMap.entries()).map(async ([vaiTroId, allowedActions]) => {
    const existing = permissionMap.get(vaiTroId)
    // Chuyển Set thành array và sort để consistent
    const phanQuyen: PhanQuyenJsonb = Array.from(allowedActions).sort()

    if (existing) {
      return updatePhanQuyen(existing.id, { phan_quyen: phanQuyen })
    } else {
      return createPhanQuyen({
        vai_tro_id: vaiTroId,
        module,
        phan_quyen: phanQuyen,
      })
    }
  })

  const results = await Promise.all(promises)
  return results
}
