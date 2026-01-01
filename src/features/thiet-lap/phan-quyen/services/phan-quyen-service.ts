import {
  getPhanQuyenByVaiTro,
  getPhanQuyenByModule,
  upsertPhanQuyen,
  bulkUpdatePhanQuyen,
  bulkUpdatePhanQuyenByModule,
} from '@/api/phan-quyen'
import { getVaiTroList } from '@/api/vai-tro'
import type { PhanQuyen, PhanQuyenMatrix, PhanQuyenVaiTroMatrix, PhanQuyenJsonb } from '@/types/phan-quyen'
import { MODULES, ACTIONS } from '../config'

/**
 * Service layer cho module Phân quyền
 */

/**
 * Helper function để normalize phan_quyen từ object (format cũ) hoặc array (format mới) thành array
 * Hỗ trợ backward compatibility với dữ liệu cũ
 */
function normalizePhanQuyen(phanQuyen: any): PhanQuyenJsonb {
  if (!phanQuyen) return []
  
  // Nếu là array, trả về trực tiếp
  if (Array.isArray(phanQuyen)) {
    return phanQuyen
  }
  
  // Nếu là object (format cũ), convert sang array
  if (typeof phanQuyen === 'object') {
    return Object.keys(phanQuyen).filter(key => phanQuyen[key] === true)
  }
  
  return []
}

/**
 * Lấy dữ liệu phân quyền dưới dạng matrix cho một vai trò
 * Transform từ JSONB structure (array string) sang matrix format
 */
export async function getPhanQuyenMatrix(vaiTroId: string): Promise<PhanQuyenMatrix[]> {
  const permissions = await getPhanQuyenByVaiTro(vaiTroId)

  // Tạo map để tra cứu nhanh theo module
  const permissionMap = new Map<string, PhanQuyen>()
  permissions.forEach((p) => {
    if (p.module) {
      permissionMap.set(p.module, p)
    }
  })

  // Tạo matrix từ config
  const matrix: PhanQuyenMatrix[] = MODULES.map((module) => {
    const permission = permissionMap.get(module.key)
    // Cast as any để hỗ trợ cả dữ liệu cũ (object) và mới (array)
    const phanQuyenArray = normalizePhanQuyen(permission?.phan_quyen as any)

    const actions = ACTIONS.map((action) => {
      return {
        action: action.key,
        allowed: phanQuyenArray.includes(action.key),
        id: permission?.id,
      }
    })

    return {
      module: module.key,
      actions,
    }
  })

  return matrix
}

/**
 * Cập nhật một phân quyền cụ thể
 * Transform từ single action update sang JSONB array update
 */
export async function updatePhanQuyenItem(
  vaiTroId: string,
  module: string,
  action: string,
  allowed: boolean
): Promise<void> {
  // Lấy phân quyền hiện tại của module (nếu có)
  const permissions = await getPhanQuyenByVaiTro(vaiTroId)
  const existing = permissions.find((p) => p.module === module)

  // Cast as any để hỗ trợ cả dữ liệu cũ (object) và mới (array)
  const currentArray = normalizePhanQuyen(existing?.phan_quyen as any)
  let phanQuyen: PhanQuyenJsonb

  if (allowed) {
    // Thêm action vào array nếu chưa có
    phanQuyen = currentArray.includes(action)
      ? currentArray
      : [...currentArray, action]
  } else {
    // Xóa action khỏi array
    phanQuyen = currentArray.filter((a) => a !== action)
  }

  await upsertPhanQuyen({
    vai_tro_id: vaiTroId,
    module,
    phan_quyen: phanQuyen,
  })
}

/**
 * Cập nhật toàn bộ phân quyền cho một vai trò
 */
export async function updatePhanQuyenMatrix(
  vaiTroId: string,
  matrix: PhanQuyenMatrix[]
): Promise<void> {
  const updates = matrix.flatMap((item) =>
    item.actions.map((action) => ({
      module: item.module,
      action: action.action,
      allowed: action.allowed,
    }))
  )

  await bulkUpdatePhanQuyen(vaiTroId, updates)
}

/**
 * Lấy ma trận phân quyền theo module (vai trò x quyền)
 * Transform từ JSONB array sang matrix format
 */
export async function getPhanQuyenVaiTroMatrix(module: string): Promise<PhanQuyenVaiTroMatrix[]> {
  // Lấy tất cả vai trò
  const vaiTroList = await getVaiTroList()
  
  // Lấy tất cả phân quyền của module
  const permissions = await getPhanQuyenByModule(module)

  // Tạo map để tra cứu nhanh theo vai_tro_id
  // Convert cả hai về string để match (vai_tro_id có thể là string trong DB, vaiTro.id là number)
  const permissionMap = new Map<string, PhanQuyen>()
  permissions.forEach((p) => {
    if (p.vai_tro_id) {
      permissionMap.set(String(p.vai_tro_id), p)
    }
  })

  // Tạo matrix cho từng vai trò
  const matrix: PhanQuyenVaiTroMatrix[] = vaiTroList.map((vaiTro) => {
    const permission = permissionMap.get(String(vaiTro.id))
    // Cast as any để hỗ trợ cả dữ liệu cũ (object) và mới (array)
    const phanQuyenArray = normalizePhanQuyen(permission?.phan_quyen as any)

    const permissions = ACTIONS.map((action) => {
      return {
        action: action.key,
        allowed: phanQuyenArray.includes(action.key),
        id: permission?.id,
      }
    })

    return {
      vai_tro_id: String(vaiTro.id),
      vai_tro_ten: vaiTro.ten_vai_tro || vaiTro.ten || '',
      permissions,
    }
  })

  return matrix
}

/**
 * Cập nhật phân quyền cho một module (nhiều vai trò)
 */
export async function updatePhanQuyenVaiTroMatrix(
  module: string,
  matrix: PhanQuyenVaiTroMatrix[]
): Promise<void> {
  const updates = matrix.flatMap((item) =>
    item.permissions.map((permission) => ({
      vai_tro_id: item.vai_tro_id,
      action: permission.action,
      allowed: permission.allowed,
    }))
  )

  await bulkUpdatePhanQuyenByModule(module, updates)
}
