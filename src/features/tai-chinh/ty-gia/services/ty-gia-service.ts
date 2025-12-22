import {
  getTyGiaList,
  getTyGiaById,
  getTyGiaByNgayApDung,
  createTyGia,
  updateTyGia,
  deleteTyGia,
  searchTyGia,
} from '@/api/ty-gia'
import type { TyGia, TyGiaInsert, TyGiaUpdate } from '@/types/ty-gia'

/**
 * Service layer cho module Tỷ giá
 * Wrapper functions để có thể thêm business logic sau này
 */

export async function getTyGiaListService(): Promise<TyGia[]> {
  return getTyGiaList()
}

export async function getTyGiaByIdService(id: number): Promise<TyGia> {
  return getTyGiaById(id)
}

export async function getTyGiaByNgayApDungService(ngayApDung: string): Promise<TyGia | null> {
  return getTyGiaByNgayApDung(ngayApDung)
}

export async function createTyGiaService(data: TyGiaInsert): Promise<TyGia> {
  return createTyGia(data)
}

export async function updateTyGiaService(
  id: number,
  data: TyGiaUpdate
): Promise<TyGia> {
  return updateTyGia(id, data)
}

export async function deleteTyGiaService(id: number): Promise<{ success: boolean }> {
  return deleteTyGia(id)
}

export async function searchTyGiaService(keyword: string): Promise<TyGia[]> {
  return searchTyGia(keyword)
}

