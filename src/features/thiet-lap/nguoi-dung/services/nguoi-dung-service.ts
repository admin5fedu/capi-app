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
  updateNguoiDungAvatar,
  deleteNguoiDung,
  searchNguoiDung,
  getActiveNguoiDungList,
  getNguoiDungByVaiTroId,
  getNguoiDungByPhongBanId,
} from '@/api/nguoi-dung'

