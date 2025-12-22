import { toast } from 'sonner'

/**
 * Xử lý lỗi query một cách thống nhất
 */
export function handleQueryError(error: unknown, defaultMessage = 'Đã xảy ra lỗi') {
  if (error instanceof Error) {
    // Lỗi từ Supabase
    if ('code' in error) {
      switch (error.code) {
        case 'PGRST116':
          toast.error('Không tìm thấy dữ liệu')
          break
        case '23505':
          toast.error('Dữ liệu đã tồn tại')
          break
        default:
          toast.error(error.message || defaultMessage)
      }
    } else {
      toast.error(error.message || defaultMessage)
    }
  } else {
    toast.error(defaultMessage)
  }
}

