import {
  getNhomDoiTacList,
  getNhomDoiTacById,
  createNhomDoiTac,
  updateNhomDoiTac,
  deleteNhomDoiTac,
  searchNhomDoiTac,
} from '@/api/nhom-doi-tac'
import type { NhomDoiTac, NhomDoiTacInsert, NhomDoiTacUpdate } from '@/types/nhom-doi-tac'

/**
 * Service layer cho module Nhóm đối tác
 * Wrapper functions để có thể thêm business logic sau này
 */

export async function getNhomDoiTacListService(
  loai?: 'nha_cung_cap' | 'khach_hang'
): Promise<NhomDoiTac[]> {
  return getNhomDoiTacList(loai)
}

export async function getNhomDoiTacByIdService(id: string): Promise<NhomDoiTac> {
  return getNhomDoiTacById(id)
}

export async function createNhomDoiTacService(data: NhomDoiTacInsert): Promise<NhomDoiTac> {
  return createNhomDoiTac(data)
}

export async function updateNhomDoiTacService(
  id: string,
  data: NhomDoiTacUpdate
): Promise<NhomDoiTac> {
  return updateNhomDoiTac(id, data)
}

export async function deleteNhomDoiTacService(id: string): Promise<{ success: boolean }> {
  return deleteNhomDoiTac(id)
}

export async function searchNhomDoiTacService(keyword: string): Promise<NhomDoiTac[]> {
  return searchNhomDoiTac(keyword)
}

