
import { TrangThaiNhanVien, GioiTinh } from './types';

export const TRANG_THAI_LABELS: Record<TrangThaiNhanVien, { label: string; variant: 'success' | 'destructive' | 'warning' }> = {
  dang_lam_viec: { label: 'Đang làm việc', variant: 'success' },
  da_nghi_viec: { label: 'Đã nghỉ việc', variant: 'destructive' },
  tam_nghi: { label: 'Tạm nghỉ', variant: 'warning' },
};

export const GIOI_TINH_OPTIONS = [
  { value: 'nam', label: 'Nam' },
  { value: 'nu', label: 'Nữ' },
  { value: 'khac', label: 'Khác' },
];

export const PHONG_BAN_OPTIONS = [
  'Ban Giám đốc',
  'Phòng Hành chính - Nhân sự',
  'Phòng Kỹ thuật',
  'Phòng Kinh doanh',
  'Phòng Kế toán',
  'Phòng Marketing',
];
