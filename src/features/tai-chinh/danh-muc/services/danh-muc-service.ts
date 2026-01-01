import {
  getDanhMucList,
  getDanhMucByLoai,
  getDanhMucChildren,
  getDanhMucById,
  createDanhMuc,
  updateDanhMuc,
  deleteDanhMuc,
  deleteDanhMucCascade,
  deleteAllDanhMuc,
  searchDanhMuc,
  checkDanhMucHasChildren,
} from '@/api/danh-muc'
import type { DanhMuc, DanhMucInsert, DanhMucUpdate, DanhMucWithParent } from '@/types/danh-muc'

/**
 * Service layer cho module Danh mục
 * Wrapper functions để có thể thêm business logic sau này
 */

export async function getDanhMucListService(): Promise<DanhMucWithParent[]> {
  return getDanhMucList()
}

export async function getDanhMucByLoaiService(loai: string): Promise<DanhMucWithParent[]> {
  return getDanhMucByLoai(loai)
}

export async function getDanhMucChildrenService(parentId: string): Promise<DanhMuc[]> {
  return getDanhMucChildren(parentId) // API expect string, keep as is
}

export async function getDanhMucByIdService(id: string): Promise<DanhMucWithParent> {
  return getDanhMucById(parseInt(id, 10))
}

export async function createDanhMucService(data: DanhMucInsert): Promise<DanhMuc> {
  return createDanhMuc(data)
}

export async function updateDanhMucService(
  id: string,
  data: DanhMucUpdate
): Promise<DanhMuc> {
  return updateDanhMuc(parseInt(id, 10), data)
}

export async function deleteDanhMucService(id: string): Promise<{ success: boolean }> {
  return deleteDanhMuc(parseInt(id, 10))
}

export async function deleteDanhMucCascadeService(
  id: string
): Promise<{ success: boolean; deletedChildren: number }> {
  return deleteDanhMucCascade(parseInt(id, 10))
}

export async function deleteAllDanhMucService(): Promise<{ success: boolean; deletedCount: number }> {
  return deleteAllDanhMuc()
}

export async function searchDanhMucService(keyword: string): Promise<DanhMucWithParent[]> {
  return searchDanhMuc(keyword)
}

export async function checkDanhMucHasChildrenService(id: string): Promise<boolean> {
  return checkDanhMucHasChildren(parseInt(id, 10))
}

