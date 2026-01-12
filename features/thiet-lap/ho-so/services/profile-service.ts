
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
    // Thay đổi: Sử dụng lại thư mục private 'avatars'
    const fileName = `avatars/${userId}_${Date.now()}.${fileExt}`;

    // 1. Upload to Storage
    const { error: uploadError, data } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    // 2. Get Public URL (Lưu ý: URL này vẫn cần quyền để truy cập)
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicUrl;
  }
};
