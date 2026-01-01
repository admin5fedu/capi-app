/**
 * Services cho module Phòng ban
 * Re-export và wrap các hàm API từ src/api/phong-ban
 */
import {
  getPhongBanList as getPhongBanListAPI,
  getPhongBanById as getPhongBanByIdAPI,
  createPhongBan,
  updatePhongBan as updatePhongBanAPI,
  deletePhongBan as deletePhongBanAPI,
  searchPhongBan,
  checkPhongBanInUse as checkPhongBanInUseAPI,
} from '@/api/phong-ban'
import type { PhongBan, PhongBanUpdate } from '@/types/phong-ban'

// Re-export các hàm không cần convert
export {
  getPhongBanListAPI as getPhongBanList,
  createPhongBan,
  searchPhongBan,
}

// Wrapper functions để convert string -> number
export async function getPhongBanById(id: string): Promise<PhongBan> {
  return getPhongBanByIdAPI(parseInt(id, 10))
}

export async function updatePhongBan(
  id: string,
  data: PhongBanUpdate
): Promise<PhongBan> {
  return updatePhongBanAPI(parseInt(id, 10), data)
}

export async function deletePhongBan(id: string): Promise<{ success: boolean }> {
  return deletePhongBanAPI(parseInt(id, 10))
}

export async function checkPhongBanInUse(id: string): Promise<boolean> {
  return checkPhongBanInUseAPI(parseInt(id, 10))
}

