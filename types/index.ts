
export type VaiTro = 'admin' | 'nhan_vien' | 'quan_ly';

export interface User {
  id: string;
  email: string;
  ho_ten: string;
  vai_tro: VaiTro;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
