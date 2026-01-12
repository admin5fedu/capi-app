
import { supabase } from '../../../lib/supabase';
import { TyGia, TyGiaInput } from '../core/types';

const TABLE_NAME = 'zz_capi_ty_gia';

export const tyGiaService = {
  getAll: async (): Promise<TyGia[]> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('tg_tao', { ascending: false });
    
    if (error) throw error;
    return data as TyGia[];
  },

  create: async (data: TyGiaInput): Promise<TyGia> => {
    const { data: result, error } = await supabase
      .from(TABLE_NAME)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  update: async (id: number, data: Partial<TyGiaInput>): Promise<void> => {
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({ ...data, tg_cap_nhat: new Date().toISOString() })
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
