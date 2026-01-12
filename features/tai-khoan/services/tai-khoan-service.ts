import { supabase } from '../../../lib/supabase';
import { TaiKhoan, TaiKhoanInput } from '../core/types';

const TABLE_NAME = 'zz_capi_tai_khoan';

export const taiKhoanService = {
  getAll: async (): Promise<TaiKhoan[]> => {
    // Logic tính toán đã được chuyển về database trigger để tối ưu hiệu năng.
    // Frontend giờ chỉ cần lấy dữ liệu đã được tính toán sẵn.
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    return data as TaiKhoan[];
  },

  create: async (data: TaiKhoanInput): Promise<TaiKhoan> => {
    const { data: result, error } = await supabase
      .from(TABLE_NAME)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  update: async (id: number, data: Partial<TaiKhoanInput>): Promise<void> => {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update(data)
      .eq('id', id);

    if (error) throw error;
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};