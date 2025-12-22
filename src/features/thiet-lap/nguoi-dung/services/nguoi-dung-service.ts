/**
 * Services cho module Người dùng
 * Re-export và wrap các hàm API từ src/api/nguoi-dung
 */
export {
  getNguoiDungList,
  getNguoiDungListWithVaiTro,
  getNguoiDungById,
  getNguoiDungByEmail,
  createNguoiDung,
  updateNguoiDung,
  deleteNguoiDung,
  searchNguoiDung,
  getActiveNguoiDungList,
  getNguoiDungByVaiTroId,
} from '@/api/nguoi-dung'

