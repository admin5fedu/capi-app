import {
  getPhanQuyenByVaiTro,
  upsertPhanQuyen,
  bulkUpdatePhanQuyen,
} from '@/api/phan-quyen'
import type { PhanQuyen, PhanQuyenMatrix } from '@/types/phan-quyen'
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

