import {
  getDoiTacList,
  getDoiTacById,
  createDoiTac,
  updateDoiTac,
  deleteDoiTac,
  searchDoiTac,
} from '@/api/doi-tac'
import type { DoiTac, DoiTacInsert, DoiTacUpdate } from '@/types/doi-tac'

/**
 * Service layer cho module Danh sách đối tác
 * Wrapper functions để có thể thêm business logic sau này
 */

export async function getDoiTacListService(
  loai?: 'nha_cung_cap' | 'khach_hang'
): Promise<DoiTac[]> {
  return getDoiTacList(loai)
}

export async function getDoiTacByIdService(id: string): Promise<DoiTac> {
  return getDoiTacById(Number(id))
}

export async function createDoiTacService(data: DoiTacInsert): Promise<DoiTac> {
  return createDoiTac(data)
}

export async function updateDoiTacService(
  id: string,
  data: DoiTacUpdate
): Promise<DoiTac> {
  return updateDoiTac(Number(id), data)
}

export async function deleteDoiTacService(id: string): Promise<{ success: boolean }> {
  return deleteDoiTac(Number(id))
}

export async function searchDoiTacService(keyword: string): Promise<DoiTac[]> {
  return searchDoiTac(keyword)
}

