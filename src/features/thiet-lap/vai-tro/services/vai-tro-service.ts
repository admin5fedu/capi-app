/**
 * Services cho module Vai trò
 * Re-export và wrap các hàm API từ src/api/vai-tro
 */
export {
  getVaiTroList,
  getVaiTroById,
  createVaiTro,
  updateVaiTro,
  deleteVaiTro,
  searchVaiTro,
  checkVaiTroInUse,
} from '@/api/vai-tro'

