
import { supabase } from '../../../lib/supabase';
import { GiaoDich, GiaoDichInput } from '../core/types';
import { TaiKhoan } from '../../tai-khoan/core/types';
import { DanhMucTaiChinh } from '../../danh-muc-tai-chinh/core/types';
import { DoiTac } from '../../khach-hang/core/types';
import { tyGiaService } from '../../ty-gia/services/ty-gia-service';

const TABLE_NAME = 'zz_capi_giao_dich';
const DMTC_TABLE = 'zz_capi_danh_muc_tai_chinh';
const TAI_KHOAN_TABLE = 'zz_capi_tai_khoan';
const TY_GIA_TABLE = 'zz_capi_ty_gia';
const DOI_TAC_TABLE = 'zz_capi_doi_tac';

// Helper to get all necessary related data in one go
const getRelatedData = async (input: Partial<GiaoDichInput>) => {
  // 1. Fetch details of related entities
  const [tkDiResponse, tkDenResponse, dmResponse, doiTacResponse, latestTyGiaResponse] = await Promise.all([
    input.tai_khoan_di_id ? supabase.from(TAI_KHOAN_TABLE).select('*').eq('id', input.tai_khoan_di_id).single() : Promise.resolve({ data: null }),
    input.tai_khoan_den_id ? supabase.from(TAI_KHOAN_TABLE).select('*').eq('id', input.tai_khoan_den_id).single() : Promise.resolve({ data: null }),
    input.danh_muc_id ? supabase.from(DMTC_TABLE).select('*').eq('id', input.danh_muc_id).single() : Promise.resolve({ data: null }),
    input.doi_tac_id ? supabase.from(DOI_TAC_TABLE).select('ten_doi_tac').eq('id', input.doi_tac_id).single() : Promise.resolve({ data: null }),
    supabase.from(TY_GIA_TABLE).select('id, ty_gia').order('tg_tao', { ascending: false }).limit(1).single()
  ]);

  const tkDi: TaiKhoan | null = tkDiResponse.data;
  const tkDen: TaiKhoan | null = tkDenResponse.data;
  const danhMuc: DanhMucTaiChinh | null = dmResponse.data;
  const doiTac: Pick<DoiTac, 'ten_doi_tac'> | null = doiTacResponse.data;
  const latestTyGia = latestTyGiaResponse.data;

  // 2. SMART EXCHANGE RATE HANDLING
  let ty_gia_id: number | null = latestTyGia?.id || null;
  let so_ty_gia: number = latestTyGia?.ty_gia || 1; 

  const isNgoaiTe = tkDi?.don_vi === 'USD' || tkDen?.don_vi === 'USD';
  const userProvidedRate = input.so_ty_gia;

  if (isNgoaiTe && userProvidedRate && userProvidedRate > 0) {
    if (userProvidedRate !== latestTyGia?.ty_gia) {
      const newRate = await tyGiaService.create({ ty_gia: userProvidedRate });
      ty_gia_id = newRate.id;
      so_ty_gia = newRate.ty_gia!;
    } else {
      ty_gia_id = latestTyGia.id;
      so_ty_gia = latestTyGia.ty_gia;
    }
  } else if (isNgoaiTe) {
    // User didn't provide a rate, so we use the latest system one by default.
  } else {
    ty_gia_id = null;
    so_ty_gia = 1;
  }

  // 3. Calculate converted amounts (quy đổi ra VND)
  const final_ty_gia = so_ty_gia;
  const so_tien = input.so_tien || 0;
  
  let so_tien_quy_doi_di: number | null = null;
  if (tkDi) {
    so_tien_quy_doi_di = tkDi.don_vi === 'USD' ? so_tien * final_ty_gia : so_tien;
  }

  let so_tien_quy_doi_den: number | null = null;
  if (tkDen) {
    so_tien_quy_doi_den = tkDen.don_vi === 'USD' ? so_tien * final_ty_gia : so_tien;
  }
  
  // 4. Return all denormalized and calculated fields
  return {
    ten_danh_muc: danhMuc?.ten_danh_muc || null,
    ten_danh_muc_cha: danhMuc?.ten_danh_muc_cha || null,
    danh_muc_cha_id: danhMuc?.danh_muc_cha_id || null,
    ten_tai_khoan_di: tkDi?.ten_tai_khoan || null,
    ten_tai_khoan_den: tkDen?.ten_tai_khoan || null,
    ten_doi_tac: doiTac?.ten_doi_tac || null,
    ty_gia_id,
    so_ty_gia: final_ty_gia,
    so_tien_quy_doi_di,
    so_tien_quy_doi_den,
  };
};

export const giaoDichService = {
  getAll: async (): Promise<GiaoDich[]> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('ngay', { ascending: false })
      .order('id', { ascending: false });
    
    if (error) throw error;
    return data as GiaoDich[];
  },

  create: async (input: GiaoDichInput): Promise<GiaoDich> => {
    const relatedData = await getRelatedData(input);
    const payload = { ...input, ...relatedData };

    const { data: result, error } = await supabase
      .from(TABLE_NAME)
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  update: async (id: number, input: Partial<GiaoDichInput>): Promise<void> => {
    const relatedData = await getRelatedData(input);
    const payload = { ...input, ...relatedData, tg_cap_nhat: new Date().toISOString() };
    
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