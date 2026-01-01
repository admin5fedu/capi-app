/**
 * Services cho module Phòng ban
 * Re-export và wrap các hàm API từ src/api/phong-ban
 */
export {
  getPhongBanList,
  getPhongBanById,
  createPhongBan,
  updatePhongBan,
  deletePhongBan,
  searchPhongBan,
  checkPhongBanInUse,
} from '@/api/phong-ban'

