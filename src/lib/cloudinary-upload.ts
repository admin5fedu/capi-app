/**
 * Cloudinary Upload Utilities
 * Hàm upload ảnh lên Cloudinary sử dụng Upload Preset
 */

import { cloudinaryConfig, getCloudinaryUploadUrl } from './cloudinary'

export interface CloudinaryUploadResponse {
  public_id: string
  secure_url: string
  url: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
}

/**
 * Upload ảnh lên Cloudinary
 * @param file - File ảnh cần upload
 * @param folder - Thư mục lưu trữ (optional, mặc định: 'avatars')
 * @returns Promise với thông tin ảnh đã upload
 */
export async function uploadImageToCloudinary(
  file: File,
  folder: string = 'avatars'
): Promise<CloudinaryUploadResponse> {
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
    throw new Error('Cloudinary chưa được cấu hình. Vui lòng kiểm tra biến môi trường.')
  }

  // Tạo FormData
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', cloudinaryConfig.uploadPreset)
  formData.append('folder', folder)
  
  // Tối ưu ảnh: crop thành hình vuông, resize
  formData.append('transformation', 'w_400,h_400,c_fill,g_face,q_auto,f_auto')

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error?.message || `Upload failed: ${response.statusText}`
      )
    }

    const data = await response.json()
    return data as CloudinaryUploadResponse
  } catch (error: any) {
    throw new Error(`Lỗi upload ảnh: ${error.message || 'Unknown error'}`)
  }
}

/**
 * Xóa ảnh khỏi Cloudinary (nếu cần)
 * @param publicId - Public ID của ảnh trên Cloudinary
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey || !cloudinaryConfig.apiSecret) {
    throw new Error('Cloudinary API credentials chưa được cấu hình.')
  }

  // Tạo signature (cần implement nếu muốn xóa từ client)
  // Hoặc tốt hơn là xóa từ server-side
  // Tạm thời bỏ qua vì cần server-side để bảo mật API Secret
  console.warn('Delete image from Cloudinary should be done server-side for security.')
}

