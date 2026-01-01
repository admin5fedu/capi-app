/**
 * Services cho module Người dùng
 * Re-export và wrap các hàm API từ src/api/nguoi-dung
 */
import {
  getNguoiDungList as getNguoiDungListAPI,
  getNguoiDungListWithVaiTro,
  getNguoiDungById as getNguoiDungByIdAPI,
  getNguoiDungByEmail,
  createNguoiDung,
  updateNguoiDung as updateNguoiDungAPI,
  updateNguoiDungAvatar as updateNguoiDungAvatarAPI,
  deleteNguoiDung as deleteNguoiDungAPI,
  searchNguoiDung,
  getActiveNguoiDungList,
  getNguoiDungByVaiTroId,
  getNguoiDungByPhongBanId,
} from '@/api/nguoi-dung'
import type { NguoiDung, NguoiDungUpdate } from '@/types/nguoi-dung'

export {
  getNguoiDungListWithVaiTro,
  getNguoiDungByEmail,
  createNguoiDung,
  searchNguoiDung,
  getActiveNguoiDungList,
  getNguoiDungByVaiTroId,
  getNguoiDungByPhongBanId,
}

export async function updateNguoiDungAvatar(
  id: string,
  avatarUrl: string
): Promise<NguoiDung> {
  return updateNguoiDungAvatarAPI(parseInt(id, 10), avatarUrl)
}

// Wrapper functions để convert string -> number
export async function getNguoiDungList() {
  return getNguoiDungListAPI()
}

export async function getNguoiDungById(id: string): Promise<NguoiDung> {
  return getNguoiDungByIdAPI(parseInt(id, 10))
}

export async function updateNguoiDung(
  id: string,
  data: NguoiDungUpdate
): Promise<NguoiDung> {
  return updateNguoiDungAPI(parseInt(id, 10), data)
}

export async function deleteNguoiDung(id: string): Promise<{ success: boolean }> {
  return deleteNguoiDungAPI(parseInt(id, 10))
}

