/**
 * Helper function để dịch các thông báo lỗi mặc định từ Zod sang tiếng Việt
 */
export function translateZodError(message: string | undefined): string {
  if (!message) return 'Có lỗi xảy ra'

  // Nếu message đã là tiếng Việt (không chứa các từ khóa tiếng Anh), trả về nguyên bản
  const englishKeywords = ['Required', 'Invalid', 'Expected', 'Received', 'String', 'Number', 'must', 'should']
  const hasEnglishKeywords = englishKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  )

  if (!hasEnglishKeywords) {
    return message
  }

  // Map các thông báo lỗi mặc định từ Zod sang tiếng Việt
  const errorMap: Record<string, string> = {
    'Required': 'Trường này là bắt buộc',
    'Invalid type': 'Kiểu dữ liệu không hợp lệ',
    'Expected': 'Yêu cầu',
    'Received': 'Nhận được',
    'String must contain at least': 'Phải có ít nhất',
    'String must contain at most': 'Tối đa',
    'Invalid email': 'Email không hợp lệ',
    'Invalid url': 'URL không hợp lệ',
    'Invalid date': 'Ngày không hợp lệ',
    'Number must be greater than': 'Phải lớn hơn',
    'Number must be less than': 'Phải nhỏ hơn',
    'Number must be greater than or equal to': 'Phải lớn hơn hoặc bằng',
    'Number must be less than or equal to': 'Phải nhỏ hơn hoặc bằng',
  }

  // Kiểm tra xem message có chứa key nào trong errorMap không
  for (const [key, translation] of Object.entries(errorMap)) {
    if (message.includes(key)) {
      // Thay thế key bằng translation
      return message.replace(key, translation)
    }
  }

  // Nếu không tìm thấy, trả về message gốc
  return message
}

