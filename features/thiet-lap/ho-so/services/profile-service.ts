
import { supabase } from '../../../../lib/supabase';

const TABLE_NAME = 'zz_capi_nguoi_dung';
const BUCKET_NAME = 'capi_consulting';

export const profileService = {
  getCurrentUserProfile: async (email: string) => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('email', email)
      .single();

    if (error) throw error;
    return data;
  },

  updateProfile: async (id: number, updates: any) => {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ ...updates, tg_cap_nhat: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  uploadAvatar: async (userId: string | number, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `avatars/${userId}_${Date.now()}.${fileExt}`;

    // 1. Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    // 2. Trả về file path thay vì public URL (vì bucket là private)
    return fileName;
  },

  /**
   * Lấy signed URL cho avatar (bucket private)
   * @param filePath - Đường dẫn file trong bucket (ví dụ: avatars/123_1234567890.jpg)
   * @param expiresIn - Thời gian hết hạn tính bằng giây (mặc định 1 giờ)
   */
  getAvatarUrl: async (filePath: string, expiresIn: number = 3600) => {
    if (!filePath) return null;

    // Nếu là URL đầy đủ (legacy data), trả về luôn
    if (filePath.startsWith('http')) return filePath;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  }
};
