import {
  getPhanQuyenByVaiTro,
  getPhanQuyenByModule,
  upsertPhanQuyen,
  bulkUpdatePhanQuyen,
  bulkUpdatePhanQuyenByModule,
} from '@/api/phan-quyen'
import { getVaiTroList } from '@/api/vai-tro'
import type { PhanQuyen, PhanQuyenMatrix, PhanQuyenVaiTroMatrix } from '@/types/phan-quyen'
import { MODULES, ACTIONS } from '../config'

/**
 * Service layer cho module Phân quyền
 */

/**
 * Lấy dữ liệu phân quyền dưới dạng matrix cho một vai trò
 */
export async function getPhanQuyenMatrix(vaiTroId: string): Promise<PhanQuyenMatrix[]> {
  const permissions = await getPhanQuyenByVaiTro(vaiTroId)

  // Tạo map để tra cứu nhanh
  const permissionMap = new Map<string, PhanQuyen>()
  permissions.forEach((p) => {
    const key = `${p.module}:${p.action}`
    permissionMap.set(key, p)
  })

  // Tạo matrix từ config
  const matrix: PhanQuyenMatrix[] = MODULES.map((module) => {
    const actions = ACTIONS.map((action) => {
      const key = `${module.key}:${action.key}`
      const permission = permissionMap.get(key)

      return {
        action: action.key,
        allowed: permission?.allowed ?? false,
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
 */
export async function updatePhanQuyenItem(
  vaiTroId: string,
  module: string,
  action: string,
  allowed: boolean
): Promise<void> {
  await upsertPhanQuyen({
    vai_tro_id: vaiTroId,
    module,
    action,
    allowed,
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
 */
export async function getPhanQuyenVaiTroMatrix(module: string): Promise<PhanQuyenVaiTroMatrix[]> {
  // Lấy tất cả vai trò
  const vaiTroList = await getVaiTroList()
  
  // Lấy tất cả phân quyền của module
  const permissions = await getPhanQuyenByModule(module)

  // Tạo map để tra cứu nhanh
  const permissionMap = new Map<string, PhanQuyen>()
  permissions.forEach((p) => {
    const key = `${p.vai_tro_id}:${p.action}`
    permissionMap.set(key, p)
  })

  // Tạo matrix cho từng vai trò
  const matrix: PhanQuyenVaiTroMatrix[] = vaiTroList.map((vaiTro) => {
    const permissions = ACTIONS.map((action) => {
      const key = `${vaiTro.id}:${action.key}`
      const permission = permissionMap.get(key)

      return {
        action: action.key,
        allowed: permission?.allowed ?? false,
        id: permission?.id,
      }
    })

    return {
      vai_tro_id: vaiTro.id,
      vai_tro_ten: vaiTro.ten,
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

