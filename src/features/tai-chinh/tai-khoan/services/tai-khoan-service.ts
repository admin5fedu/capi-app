import {
  getTaiKhoanList,
  getTaiKhoanById,
  createTaiKhoan,
  updateTaiKhoan,
  deleteTaiKhoan,
  searchTaiKhoan,
} from '@/api/tai-khoan'
import type { TaiKhoan, TaiKhoanInsert, TaiKhoanUpdate } from '@/types/tai-khoan'

/**
 * Service layer cho module Tài khoản
 * Wrapper functions để có thể thêm business logic sau này
 */

export async function getTaiKhoanListService(): Promise<TaiKhoan[]> {
  return getTaiKhoanList()
}

export async function getTaiKhoanByIdService(id: string): Promise<TaiKhoan> {
  return getTaiKhoanById(parseInt(id, 10))
}

export async function createTaiKhoanService(data: TaiKhoanInsert): Promise<TaiKhoan> {
  return createTaiKhoan(data)
}

export async function updateTaiKhoanService(
  id: string,
  data: TaiKhoanUpdate
): Promise<TaiKhoan> {
  return updateTaiKhoan(parseInt(id, 10), data)
}

export async function deleteTaiKhoanService(id: string): Promise<{ success: boolean }> {
  return deleteTaiKhoan(parseInt(id, 10))
}

export async function searchTaiKhoanService(keyword: string): Promise<TaiKhoan[]> {
  return searchTaiKhoan(keyword)
}

