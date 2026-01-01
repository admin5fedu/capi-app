/**
 * Services cho module Vai trò
 * Re-export và wrap các hàm API từ src/api/vai-tro
 */
import {
  getVaiTroList as getVaiTroListAPI,
  getVaiTroById as getVaiTroByIdAPI,
  createVaiTro,
  updateVaiTro as updateVaiTroAPI,
  deleteVaiTro as deleteVaiTroAPI,
  searchVaiTro,
  checkVaiTroInUse as checkVaiTroInUseAPI,
} from '@/api/vai-tro'
import type { VaiTro, VaiTroUpdate } from '@/types/vai-tro'

// Re-export các hàm không cần convert
export {
  getVaiTroListAPI as getVaiTroList,
  createVaiTro,
  searchVaiTro,
}

// Wrapper functions để convert string -> number
export async function getVaiTroById(id: string): Promise<VaiTro> {
  return getVaiTroByIdAPI(parseInt(id, 10))
}

export async function updateVaiTro(
  id: string,
  data: VaiTroUpdate
): Promise<VaiTro> {
  return updateVaiTroAPI(parseInt(id, 10), data)
}

export async function deleteVaiTro(id: string): Promise<{ success: boolean }> {
  return deleteVaiTroAPI(parseInt(id, 10))
}

export async function checkVaiTroInUse(id: string): Promise<boolean> {
  return checkVaiTroInUseAPI(parseInt(id, 10))
}

