
import { supabase } from '../../../lib/supabase';
import { NhomDoiTac, NhomDoiTacInput, DoiTac, DoiTacInput } from '../core/types';

const TABLE_NHOM = 'zz_capi_nhom_doi_tac';
const TABLE_DOI_TAC = 'zz_capi_doi_tac';

export const khachHangService = {
  // NHÓM ĐỐI TÁC
  getNhomAll: async (hangMuc: string = 'khach_hang'): Promise<NhomDoiTac[]> => {
    const { data, error } = await supabase
      .from(TABLE_NHOM)
      .select('*')
      .eq('hang_muc', hangMuc)
      .order('id', { ascending: false });
    
    if (error) throw error;
    return data as NhomDoiTac[];
  },

  createNhom: async (data: NhomDoiTacInput): Promise<NhomDoiTac> => {
    const { data: result, error } = await supabase
      .from(TABLE_NHOM)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  updateNhom: async (id: number, data: Partial<NhomDoiTacInput>): Promise<void> => {
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

  // DANH SÁCH ĐỐI TÁC (KHÁCH HÀNG/NHÀ CUNG CẤP)
  getDoiTacAll: async (hangMuc: string = 'khach_hang'): Promise<DoiTac[]> => {
    const { data, error } = await supabase
      .from(TABLE_DOI_TAC)
      .select('*')
      .eq('hang_muc', hangMuc)
      .order('id', { ascending: false });

    if (error) throw error;
    return data as DoiTac[];
  },

  createDoiTac: async (data: DoiTacInput): Promise<DoiTac> => {
    const { data: result, error } = await supabase
      .from(TABLE_DOI_TAC)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  updateDoiTac: async (id: number, data: Partial<DoiTacInput>): Promise<void> => {
    const { error } = await supabase
      .from(TABLE_DOI_TAC)
      .update(data)
      .eq('id', id);

    if (error) throw error;
  },

  deleteDoiTac: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from(TABLE_DOI_TAC)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
