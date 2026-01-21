import { NhanVien } from './types';

/**
 * Dữ liệu giả lập khớp với cấu trúc bảng zz_capi_nguoi_dung
 */
export const MOCK_NHAN_VIEN: NhanVien[] = [
  {
    id: 1,
    ho_va_ten: 'Nguyễn Văn A',
    email: 'vana@capierp.com',
    vai_tro_id: 1,
    trang_thai: 'dang_hoat_dong',
    // Bổ sung avatar để fix lỗi thiếu property
    avatar: null,
    tg_tao: '2024-01-01T08:00:00Z',
    tg_cap_nhat: null,
  },
  {
    id: 2,
    ho_va_ten: 'Trần Thị B',
    email: 'thib@capierp.com',
    vai_tro_id: 2,
    trang_thai: 'dang_hoat_dong',
    // Bổ sung avatar để fix lỗi thiếu property
    avatar: null,
    tg_tao: '2024-03-15T09:30:00Z',
    tg_cap_nhat: null,
  },
  {
    id: 3,
    ho_va_ten: 'Lê Văn C',
    email: 'vanc@capierp.com',
    vai_tro_id: 3,
    trang_thai: 'da_khoa',
    // Bổ sung avatar để fix lỗi thiếu property
    avatar: null,
    tg_tao: '2024-06-01T10:00:00Z',
    tg_cap_nhat: null,
  }
];