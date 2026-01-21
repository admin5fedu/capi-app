
import { VaiTro } from '../../vai-tro/core/types';

/**
 * Các loại trạng thái làm việc của nhân viên được định nghĩa trong constants
 */
export type TrangThaiNhanVien = 'dang_lam_viec' | 'da_nghi_viec' | 'tam_nghi';

/**
 * Các loại giới tính được định nghĩa trong constants
 */
export type GioiTinh = 'nam' | 'nu' | 'khac';

/**
 * Interface đại diện cho cấu trúc bảng zz_capi_nguoi_dung
 */
export interface NhanVien {
  id: number;
  ho_va_ten: string | null;
  trang_thai: string | null;
  vai_tro_id: number | null;
  email: string | null;
  avatar: string | null;
  tg_tao: string | null;
  tg_cap_nhat: string | null;
  // Join data
  zz_capi_vai_tro?: VaiTro | null;
}

export type NhanVienInput = {
  ho_va_ten: string | null;
  trang_thai: string | null;
  vai_tro_id: number | null;
  email: string | null;
  avatar?: string | null;
  avatarFile?: FileList | null;
};
