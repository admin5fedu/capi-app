/**
 * Định dạng tiền tệ chuyên nghiệp.
 */
export const formatCurrency = (value: number, unit: string | null = 'VND') => {
  if (unit === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
  return new Intl.NumberFormat('vi-VN').format(value) + ' VND';
};

/**
 * Định dạng số nguyên (không có ký hiệu tiền tệ).
 */
export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
  }).format(value);
};

/**
 * Định dạng ngày tháng năm kiểu Việt Nam.
 */
export const formatDate = (date: string | Date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

/**
 * Định dạng hiển thị cả 2 loại tiền (gốc và quy đổi) để dễ so sánh.
 * Trả về object với primary (tiền gốc) và secondary (tiền quy đổi).
 */
export const formatDualCurrency = (
  soTien: number,
  donVi: string | null,
  soTienQuyDoi: number | null
) => {
  const primary = formatCurrency(soTien, donVi);

  // Nếu tài khoản là USD, hiển thị VND bên dưới
  if (donVi === 'USD' && soTienQuyDoi) {
    const secondary = formatCurrency(soTienQuyDoi, 'VND');
    return { primary, secondary };
  }

  // Nếu tài khoản là VND, không cần hiển thị thêm
  return { primary, secondary: null };
};
