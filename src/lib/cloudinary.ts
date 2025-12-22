/**
 * Cloudinary configuration và utilities
 * Chuẩn bị cho việc upload và quản lý ảnh sau này
 */

const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const cloudinaryConfig = {
  cloudName: cloudinaryCloudName || '',
  uploadPreset: cloudinaryUploadPreset || '',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || '',
}

/**
 * Kiểm tra xem Cloudinary đã được cấu hình chưa
 */
export function isCloudinaryConfigured(): boolean {
  return !!(
    cloudinaryConfig.cloudName &&
    cloudinaryConfig.uploadPreset
  )
}

/**
 * Tạo URL upload cho Cloudinary
 * @param folder - Thư mục lưu trữ trên Cloudinary (optional)
 * @returns URL endpoint để upload ảnh
 */
export function getCloudinaryUploadUrl(folder?: string): string {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary chưa được cấu hình. Vui lòng kiểm tra biến môi trường.')
  }

  const baseUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`
  const params = new URLSearchParams({
    upload_preset: cloudinaryConfig.uploadPreset,
  })

  if (folder) {
    params.append('folder', folder)
  }

  return `${baseUrl}?${params.toString()}`
}

/**
 * Tạo URL ảnh đã được optimize từ Cloudinary
 * @param publicId - Public ID của ảnh trên Cloudinary
 * @param options - Các tùy chọn transform (width, height, crop, etc.)
 * @returns URL ảnh đã được optimize
 */
export function getCloudinaryImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: 'fill' | 'fit' | 'scale' | 'thumb' | 'crop'
    quality?: 'auto' | number
    format?: 'auto' | 'jpg' | 'png' | 'webp'
  } = {}
): string {
  if (!cloudinaryConfig.cloudName) {
    throw new Error('Cloudinary chưa được cấu hình. Vui lòng kiểm tra biến môi trường.')
  }

  const transformations = []
  
  if (options.width) transformations.push(`w_${options.width}`)
  if (options.height) transformations.push(`h_${options.height}`)
  if (options.crop) transformations.push(`c_${options.crop}`)
  if (options.quality) {
    transformations.push(`q_${options.quality}`)
  } else {
    transformations.push('q_auto')
  }
  if (options.format) transformations.push(`f_${options.format}`)
  else transformations.push('f_auto')

  const transformString = transformations.join(',')
  
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformString}/${publicId}`
}

