
import { supabase } from '../../../../lib/supabase';
import { VaiTro, VaiTroInput } from '../core/types';

const TABLE_NAME = 'zz_capi_vai_tro';

export const vaiTroService = {
  getAll: async (): Promise<VaiTro[]> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('id', { ascending: false });
    
    if (error) throw error;
    return data as VaiTro[];
  },
  
  create: async (data: VaiTroInput): Promise<VaiTro> => {
    const { data: result, error } = await supabase
      .from(TABLE_NAME)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  update: async (id: number, data: Partial<VaiTroInput>): Promise<void> => {
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
