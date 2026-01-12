export type LoaiTaiKhoan = 'tien_mat' | 'tai_khoan';
export type DonViTienTe = 'VND' | 'USD';
export type TrangThaiTaiKhoan = 'hoat_dong' | 'ngung_hoat_dong';

export interface TaiKhoan {
  id: number;
  loai_tai_khoan: LoaiTaiKhoan | string | null;
  ten_tai_khoan: string | null;
  don_vi: DonViTienTe | string | null;
  ngan_hang: string | null;
  so_tai_khoan: string | null;
  chu_tai_khoan: string | null;
  ghi_chu: string | null;
  nguoi_tao_id: number | null;
  tg_tao: string | null;
  tg_cap_nhat: string | null;
  so_du_dau_ky: number | null;
  trang_thai: TrangThaiTaiKhoan | string | null;

  // Các trường được tính toán và lưu trữ trong DB bởi triggers
  tong_thu: number | null;
  tong_chi: number | null;
  so_du_cuoi: number | null;
}

export type TaiKhoanInput = {
  loai_tai_khoan: LoaiTaiKhoan;
  ten_tai_khoan: string;
  don_vi: DonViTienTe;
  ngan_hang: string | null;
  so_tai_khoan: string | null;
  chu_tai_khoan: string | null;
  so_du_dau_ky: number | null;
  trang_thai: TrangThaiTaiKhoan;
  ghi_chu: string | null;
  nguoi_tao_id?: number | null;
};