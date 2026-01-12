
import { supabase } from '../../../lib/supabase';
import { NhomDoiTac, NhomNCCInput, DoiTac, NCCInput } from '../core/types';

const TABLE_NHOM = 'zz_capi_nhom_doi_tac';
const TABLE_DOI_TAC = 'zz_capi_doi_tac';
const HANG_MUC = 'nha_cung_cap';

export const nhaCungCapService = {
  // NHÓM NHÀ CUNG CẤP
  getNhomAll: async (): Promise<NhomDoiTac[]> => {
    const { data, error } = await supabase
      .from(TABLE_NHOM)
      .select('*')
      .eq('hang_muc', HANG_MUC)
      .order('id', { ascending: false });
    
    if (error) throw error;
    return data as NhomDoiTac[];
  },

  createNhom: async (data: NhomNCCInput): Promise<NhomDoiTac> => {
    const { data: result, error } = await supabase
      .from(TABLE_NHOM)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  updateNhom: async (id: number, data: Partial<NhomNCCInput>): Promise<void> => {
    const { error } = await supabase
      .from(TABLE_NHOM)
      .update(data)
      .eq('id', id);

    if (error) throw error;
  },

  deleteNhom: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from(TABLE_NHOM)
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // DANH SÁCH NHÀ CUNG CẤP
  getNCCAll: async (): Promise<DoiTac[]> => {
    const { data, error } = await supabase
      .from(TABLE_DOI_TAC)
      .select('*')
      .eq('hang_muc', HANG_MUC)
      .order('id', { ascending: false });

    if (error) throw error;
    return data as DoiTac[];
  },

  createNCC: async (data: NCCInput): Promise<DoiTac> => {
    const { data: result, error } = await supabase
      .from(TABLE_DOI_TAC)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  updateNCC: async (id: number, data: Partial<NCCInput>): Promise<void> => {
    const { error } = await supabase
      .from(TABLE_DOI_TAC)
      .update(data)
      .eq('id', id);

    if (error) throw error;
  },

  deleteNCC: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from(TABLE_DOI_TAC)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
