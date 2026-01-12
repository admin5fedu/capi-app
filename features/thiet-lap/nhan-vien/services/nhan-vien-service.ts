
import { supabase } from '../../../../lib/supabase';
import { NhanVien, NhanVienInput } from '../core/types';

const TABLE_NAME = 'zz_capi_nguoi_dung';

export const nhanVienService = {
  getAll: async (): Promise<NhanVien[]> => {
    // Chỉ select * vì không có FK trong database
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('id', { ascending: false });
    
    if (error) {
      console.error('Fetch error:', error);
      throw error;
    }
    return data as NhanVien[];
  },
  
  getById: async (id: string | number): Promise<NhanVien | null> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  create: async (data: NhanVienInput): Promise<NhanVien> => {
    const { data: result, error } = await supabase
      .from(TABLE_NAME)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  update: async (id: string | number, data: Partial<NhanVienInput>): Promise<void> => {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update(data)
      .eq('id', id);

    if (error) throw error;
  },

  delete: async (id: string | number): Promise<void> => {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
