
/**
 * Định dạng tiền tệ VND chuyên nghiệp.
 */
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
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
