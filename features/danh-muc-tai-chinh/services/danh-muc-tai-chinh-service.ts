
import { supabase } from '../../../lib/supabase';
import { DanhMucTaiChinh, DanhMucTaiChinhInput } from '../core/types';

const TABLE_NAME = 'zz_capi_danh_muc_tai_chinh';

export const danhMucTaiChinhService = {
  getAll: async (): Promise<DanhMucTaiChinh[]> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('cap', { ascending: true })
      .order('ten_danh_muc', { ascending: true });
    
    if (error) throw error;
    return data as DanhMucTaiChinh[];
  },

  create: async (input: DanhMucTaiChinhInput): Promise<DanhMucTaiChinh> => {
    let cap = 1;
    let ten_danh_muc_cha = null;

    if (input.danh_muc_cha_id) {
      const { data: parent } = await supabase
        .from(TABLE_NAME)
        .select('cap, ten_danh_muc')
        .eq('id', input.danh_muc_cha_id)
        .single();
      
      if (parent) {
        cap = (parent.cap || 0) + 1;
        ten_danh_muc_cha = parent.ten_danh_muc;
      }
    }

    const payload = { ...input, cap, ten_danh_muc_cha };
    const { data: result, error } = await supabase
      .from(TABLE_NAME)
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  update: async (id: number, input: Partial<DanhMucTaiChinhInput>): Promise<void> => {
    let cap = 1;
    let ten_danh_muc_cha = null;

    if (input.danh_muc_cha_id) {
       const { data: parent } = await supabase
        .from(TABLE_NAME)
        .select('cap, ten_danh_muc')
        .eq('id', input.danh_muc_cha_id)
        .single();
      if (parent) {
        cap = (parent.cap || 0) + 1;
        ten_danh_muc_cha = parent.ten_danh_muc;
      }
    } else {
      // Reset if it becomes a root category
       cap = 1;
       ten_danh_muc_cha = null;
    }

    const payload = { ...input, cap, ten_danh_muc_cha };
    const { error } = await supabase
      .from(TABLE_NAME)
      .update(payload)
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
