import {
  getGiaoDichList,
  getGiaoDichById,
  createGiaoDich,
  updateGiaoDich,
  deleteGiaoDich,
  searchGiaoDich,
} from '@/api/giao-dich'
import type { GiaoDich, GiaoDichInsert, GiaoDichUpdate, GiaoDichWithRelations } from '@/types/giao-dich'

/**
 * Service layer cho module Giao dịch
 * Wrapper functions để có thể thêm business logic sau này
 */

export async function getGiaoDichListService(): Promise<GiaoDich[]> {
  return getGiaoDichList()
}

export async function getGiaoDichByIdService(id: number): Promise<GiaoDichWithRelations> {
  return getGiaoDichById(id)
}

export async function createGiaoDichService(data: GiaoDichInsert): Promise<GiaoDich> {
  return createGiaoDich(data)
}

export async function updateGiaoDichService(
  id: number,
  data: GiaoDichUpdate
): Promise<GiaoDich> {
  return updateGiaoDich(id, data)
}

export async function deleteGiaoDichService(id: number): Promise<{ success: boolean }> {
  return deleteGiaoDich(id)
}

export async function searchGiaoDichService(keyword: string): Promise<GiaoDich[]> {
  return searchGiaoDich(keyword)
}

// Các hàm này không còn cần thiết vì schema mới không có ma_phieu
// Đã xóa để tránh lỗi import

