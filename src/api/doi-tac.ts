import { mockDoiTacStore } from './mock/doi-tac-mock'
import type { DoiTac, DoiTacInsert, DoiTacUpdate } from '@/types/doi-tac'

/**
 * API layer cho module Danh sách đối tác
 * Tạm thời sử dụng mock data
 */

const TABLE_NAME = 'zz_cst_doi_tac'

/**
 * Lấy danh sách đối tác
 */
export async function getDoiTacList(loai?: 'nha_cung_cap' | 'khach_hang'): Promise<DoiTac[]> {
  // Tạm thời dùng mock data
  const allData = mockDoiTacStore.getAll()
  
  if (loai) {
    return allData.filter((item) => item.loai === loai)
  }
  
  return allData
}

/**
 * Lấy thông tin một đối tác theo ID
 */
export async function getDoiTacById(id: string): Promise<DoiTac> {
  // Tạm thời dùng mock data
  const item = mockDoiTacStore.getById(id)
  if (!item) {
    throw new Error('Không tìm thấy đối tác')
  }
  return item
}

/**
 * Tạo mới đối tác
 */
export async function createDoiTac(data: DoiTacInsert): Promise<DoiTac> {
  // Tạm thời dùng mock data
  const newItem: DoiTac = {
    id: `dt-${Date.now()}`,
    ma: data.ma,
    ten: data.ten,
    loai: data.loai,
    nhom_doi_tac_id: data.nhom_doi_tac_id || null,
    email: data.email || null,
    dien_thoai: data.dien_thoai || null,
    dia_chi: data.dia_chi || null,
    ma_so_thue: data.ma_so_thue || null,
    nguoi_lien_he: data.nguoi_lien_he || null,
    ghi_chu: data.ghi_chu || null,
    trang_thai: data.trang_thai ?? true,
    nguoi_tao_id: data.nguoi_tao_id || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  mockDoiTacStore.add(newItem)
  return newItem
}

/**
 * Cập nhật thông tin đối tác
 */
export async function updateDoiTac(
  id: string,
  data: DoiTacUpdate
): Promise<DoiTac> {
  // Tạm thời dùng mock data
  const existing = mockDoiTacStore.getById(id)
  if (!existing) {
    throw new Error('Không tìm thấy đối tác')
  }
  
  const updated: DoiTac = {
    ...existing,
    ...data,
    updated_at: new Date().toISOString(),
  }
  
  mockDoiTacStore.update(id, updated)
  return updated
}

/**
 * Xóa đối tác
 */
export async function deleteDoiTac(id: string): Promise<{ success: boolean }> {
  // Tạm thời dùng mock data
  const existing = mockDoiTacStore.getById(id)
  if (!existing) {
    throw new Error('Không tìm thấy đối tác')
  }
  
  mockDoiTacStore.delete(id)
  return { success: true }
}

/**
 * Tìm kiếm đối tác theo từ khóa
 */
export async function searchDoiTac(keyword: string): Promise<DoiTac[]> {
  // Tạm thời dùng mock data
  const allData = mockDoiTacStore.getAll()
  const lowerKeyword = keyword.toLowerCase()
  
  return allData.filter(
    (item) =>
      item.ma.toLowerCase().includes(lowerKeyword) ||
      item.ten.toLowerCase().includes(lowerKeyword) ||
      (item.email && item.email.toLowerCase().includes(lowerKeyword)) ||
      (item.dien_thoai && item.dien_thoai.includes(keyword)) ||
      (item.ghi_chu && item.ghi_chu.toLowerCase().includes(lowerKeyword))
  )
}

