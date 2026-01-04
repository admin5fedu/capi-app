/**
 * Helper function để dịch các thông báo lỗi đăng nhập từ Supabase Auth sang tiếng Việt rõ ràng
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!error) {
    return 'Đã xảy ra lỗi không xác định'
  }

  // Kiểm tra nếu là Error object từ Supabase
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase()
    const errorCode = (error as any).code || (error as any).status
    const statusCode = (error as any).status || (error as any).statusCode

    // Xử lý lỗi HTTP status codes
    // 500 Internal Server Error - Lỗi từ phía server Supabase
    if (statusCode === 500 || errorCode === 500 || errorMessage.includes('500')) {
      return 'Lỗi máy chủ từ Supabase. Vui lòng kiểm tra:\n' +
        '1. Supabase project đã được kích hoạt chưa\n' +
        '2. API keys có đúng không (kiểm tra trong Supabase Dashboard > Settings > API)\n' +
        '3. Database đã được setup chưa\n' +
        '4. Thử lại sau vài phút'
    }

    // 400 Bad Request
    if (statusCode === 400 || errorCode === 400) {
      return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin đăng nhập.'
    }

    // 401 Unauthorized
    if (statusCode === 401 || errorCode === 401) {
      return 'Không có quyền truy cập. Vui lòng kiểm tra lại API key hoặc thông tin đăng nhập.'
    }

    // 403 Forbidden
    if (statusCode === 403 || errorCode === 403) {
      return 'Truy cập bị từ chối. Vui lòng liên hệ quản trị viên.'
    }

    // 404 Not Found
    if (statusCode === 404 || errorCode === 404) {
      return 'Không tìm thấy tài nguyên. Vui lòng kiểm tra lại URL Supabase.'
    }

    // 429 Too Many Requests
    if (statusCode === 429 || errorCode === 429) {
      return 'Quá nhiều yêu cầu. Vui lòng đợi vài phút rồi thử lại.'
    }

    // Xử lý các lỗi phổ biến từ Supabase Auth
    // Invalid login credentials
    if (
      errorMessage.includes('invalid login credentials') ||
      errorMessage.includes('invalid credentials') ||
      errorMessage.includes('email not confirmed') ||
      errorCode === 'invalid_credentials'
    ) {
      return 'Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại thông tin đăng nhập.'
    }

    // Email not confirmed
    if (
      errorMessage.includes('email not confirmed') ||
      errorMessage.includes('email_not_confirmed') ||
      errorCode === 'email_not_confirmed'
    ) {
      return 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư và xác nhận email trước khi đăng nhập.'
    }

    // Too many requests
    if (
      errorMessage.includes('too many requests') ||
      errorMessage.includes('rate limit') ||
      errorCode === 'too_many_requests'
    ) {
      return 'Quá nhiều yêu cầu đăng nhập. Vui lòng đợi vài phút rồi thử lại.'
    }

    // User not found
    if (
      errorMessage.includes('user not found') ||
      errorMessage.includes('user_not_found') ||
      errorCode === 'user_not_found'
    ) {
      return 'Không tìm thấy tài khoản với email này. Vui lòng kiểm tra lại email.'
    }

    // Invalid email format
    if (
      errorMessage.includes('invalid email') ||
      errorMessage.includes('email format') ||
      errorCode === 'invalid_email'
    ) {
      return 'Định dạng email không hợp lệ. Vui lòng nhập đúng địa chỉ email.'
    }

    // Password too weak
    if (
      errorMessage.includes('password') &&
      (errorMessage.includes('weak') || errorMessage.includes('short'))
    ) {
      return 'Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn.'
    }

    // Network errors
    if (
      errorMessage.includes('network') ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('timeout')
    ) {
      return 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet và thử lại.'
    }

    // OAuth errors
    if (
      errorMessage.includes('oauth') ||
      errorMessage.includes('provider') ||
      errorCode === 'oauth_error'
    ) {
      return 'Lỗi đăng nhập với Google. Vui lòng thử lại sau.'
    }

    // Session errors
    if (
      errorMessage.includes('session') ||
      errorMessage.includes('token') ||
      errorMessage.includes('expired')
    ) {
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
    }

    // Generic Supabase errors
    if (errorMessage.includes('supabase') || errorCode) {
      // Nếu có message chi tiết, trả về message đó
      if (error.message && error.message.length > 0) {
        return `Lỗi đăng nhập: ${error.message}`
      }
      return 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.'
    }

    // Trả về message gốc nếu không match với bất kỳ pattern nào
    return error.message || 'Đã xảy ra lỗi khi đăng nhập'
  }

  // Nếu là string
  if (typeof error === 'string') {
    return error
  }

  // Fallback
  return 'Đã xảy ra lỗi không xác định khi đăng nhập'
}

