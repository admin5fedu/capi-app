import { supabase } from '@/lib/supabase'
import type { ThongTinCongTy, ThongTinCongTyUpdate } from '@/types/thong-tin-cong-ty'

const TABLE_NAME = 'zz_capi_thong_tin_cong_ty'

/**
 * Lấy thông tin công ty (chỉ có 1 record)
 */
export async function getThongTinCongTy() {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .limit(1)
    .single()

  if (error) {
    // Nếu không có record nào, trả về null thay vì throw error
    if (error.code === 'PGRST116') {
      return null
    }
    throw error
  }
  return data as ThongTinCongTy | null
}

/**
 * Cập nhật thông tin công ty
 * Nếu chưa có record, sẽ tạo mới
 */
export async function updateThongTinCongTy(thongTin: ThongTinCongTyUpdate) {
  // Kiểm tra xem đã có record chưa
  const existing = await getThongTinCongTy()

  if (existing) {
    // Cập nhật record hiện có
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        ...thongTin,
        tg_cap_nhat: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data as ThongTinCongTy
  } else {
    // Tạo mới record
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        ...thongTin,
        tg_cap_nhat: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data as ThongTinCongTy
  }
}

