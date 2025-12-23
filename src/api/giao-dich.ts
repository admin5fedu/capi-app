// import { supabase } from '@/lib/supabase' // TODO: Uncomment when using real API
import type { GiaoDich, GiaoDichInsert, GiaoDichUpdate, GiaoDichWithRelations } from '@/types/giao-dich'

// const TABLE_NAME = 'zz_cst_giao_dich' // TODO: Uncomment when using real API

/**
 * Mock data cho module Giao dịch
 * TODO: Thay thế bằng API thật khi kết nối database
 */
let mockData: GiaoDich[] = [
  {
    id: 1,
    ngay: '2024-01-15',
    loai: 'thu',
    ma_phieu: 'PT-1',
    danh_muc_id: 'dm-1',
    mo_ta: 'Thu tiền bán hàng tháng 1',
    so_tien: 5000000,
    ty_gia_id: null,
    tai_khoan_id: null,
    tai_khoan_den_id: 'tk-1',
    doi_tac_id: 'dt-1',
    so_chung_tu: 'HD-001',
    hinh_anh: ['https://example.com/image1.jpg'],
    ghi_chu: 'Ghi chú phiếu thu',
    so_tien_vnd: 5000000,
    created_by: 'user-1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    ngay: '2024-01-16',
    loai: 'chi',
    ma_phieu: 'PC-1',
    danh_muc_id: 'dm-2',
    mo_ta: 'Chi tiền mua hàng',
    so_tien: 3000000,
    ty_gia_id: null,
    tai_khoan_id: 'tk-2',
    tai_khoan_den_id: null,
    doi_tac_id: 'dt-2',
    so_chung_tu: 'PN-001',
    hinh_anh: null,
    ghi_chu: 'Ghi chú phiếu chi',
    so_tien_vnd: 3000000,
    created_by: 'user-1',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z',
  },
  {
    id: 3,
    ngay: '2024-01-17',
    loai: 'luan_chuyen',
    ma_phieu: 'LC-1',
    danh_muc_id: null,
    mo_ta: 'Chuyển tiền giữa các tài khoản',
    so_tien: 2000000,
    ty_gia_id: null,
    tai_khoan_id: 'tk-1',
    tai_khoan_den_id: 'tk-2',
    doi_tac_id: null,
    so_chung_tu: null,
    hinh_anh: null,
    ghi_chu: 'Ghi chú luân chuyển',
    so_tien_vnd: 2000000,
    created_by: 'user-1',
    created_at: '2024-01-17T10:00:00Z',
    updated_at: '2024-01-17T10:00:00Z',
  },
]

let nextId = 4
const maPhieuCounters: Record<string, number> = {
  thu: 1,
  chi: 1,
  luan_chuyen: 1,
}

/**
 * Lấy số tiếp theo cho mã phiếu theo loại
 */
function getNextMaPhieu(loai: 'thu' | 'chi' | 'luan_chuyen'): string {
  const prefix = loai === 'thu' ? 'PT' : loai === 'chi' ? 'PC' : 'LC'
  const currentCount = maPhieuCounters[loai] || 1
  maPhieuCounters[loai] = currentCount + 1
  return `${prefix}-${currentCount}`
}

/**
 * Lấy danh sách giao dịch
 */
export async function getGiaoDichList(): Promise<GiaoDich[]> {
  // Mock: return mock data
  // TODO: Thay thế bằng API thật
  // const { data, error } = await supabase
  //   .from(TABLE_NAME)
  //   .select('*')
  //   .order('ngay', { ascending: false })
  //   .order('created_at', { ascending: false })
  // if (error) throw error
  // return data as GiaoDich[]

  return Promise.resolve([...mockData])
}

/**
 * Lấy thông tin một giao dịch theo ID
 */
export async function getGiaoDichById(id: number): Promise<GiaoDichWithRelations> {
  // Mock: return mock data
  // TODO: Thay thế bằng API thật
  // const { data, error } = await supabase
  //   .from(TABLE_NAME)
  //   .select(`
  //     *,
  //     danh_muc:danh_muc_id(id, ten, loai),
  //     ty_gia:ty_gia_id(id, ty_gia, ngay_ap_dung),
  //     tai_khoan:tai_khoan_id(id, ten, loai_tien),
  //     tai_khoan_den:tai_khoan_den_id(id, ten, loai_tien),
  //     doi_tac:doi_tac_id(id, ten, loai),
  //     nguoi_tao:created_by(id, ho_ten)
  //   `)
  //   .eq('id', id)
  //   .single()
  // if (error) throw error
  // return data as GiaoDichWithRelations

  const giaoDich = mockData.find((gd) => gd.id === id)
  if (!giaoDich) {
    throw new Error('Không tìm thấy giao dịch')
  }

  // Mock relations (trong thực tế sẽ join từ database)
  return Promise.resolve({
    ...giaoDich,
    danh_muc: giaoDich.danh_muc_id
      ? { id: giaoDich.danh_muc_id, ten: 'Danh mục mẫu', loai: 'thu' }
      : null,
    ty_gia: giaoDich.ty_gia_id
      ? { id: giaoDich.ty_gia_id, ty_gia: 24500, ngay_ap_dung: '2024-01-01' }
      : null,
    tai_khoan: giaoDich.tai_khoan_id
      ? { id: giaoDich.tai_khoan_id, ten: 'Tài khoản mẫu', loai_tien: 'VND' }
      : null,
    tai_khoan_den: giaoDich.tai_khoan_den_id
      ? { id: giaoDich.tai_khoan_den_id, ten: 'Tài khoản đến mẫu', loai_tien: 'VND' }
      : null,
    doi_tac: giaoDich.doi_tac_id
      ? { id: giaoDich.doi_tac_id, ten: 'Đối tác mẫu', loai: 'khach_hang' }
      : null,
    nguoi_tao: giaoDich.created_by
      ? { id: giaoDich.created_by, ho_ten: 'Người dùng mẫu' }
      : null,
  } as GiaoDichWithRelations)
}

/**
 * Tạo mới giao dịch
 */
export async function createGiaoDich(data: GiaoDichInsert): Promise<GiaoDich> {
  // Mock: add to mock data
  // TODO: Thay thế bằng API thật
  // const { data: result, error } = await supabase
  //   .from(TABLE_NAME)
  //   .insert({
  //     ...data,
  //     ma_phieu: data.ma_phieu || getNextMaPhieu(data.loai),
  //   })
  //   .select()
  //   .single()
  // if (error) throw error
  // return result as GiaoDich

  const newGiaoDich: GiaoDich = {
    id: nextId++,
    ngay: data.ngay,
    loai: data.loai,
    ma_phieu: data.ma_phieu || getNextMaPhieu(data.loai),
    danh_muc_id: data.danh_muc_id || null,
    mo_ta: data.mo_ta || null,
    so_tien: data.so_tien,
    ty_gia_id: data.ty_gia_id || null,
    tai_khoan_id: data.tai_khoan_id || null,
    tai_khoan_den_id: data.tai_khoan_den_id || null,
    doi_tac_id: data.doi_tac_id || null,
    so_chung_tu: data.so_chung_tu || null,
    hinh_anh: data.hinh_anh || null,
    ghi_chu: data.ghi_chu || null,
    so_tien_vnd: data.so_tien_vnd || null,
    created_by: data.created_by || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  mockData.unshift(newGiaoDich)
  return Promise.resolve(newGiaoDich)
}

/**
 * Cập nhật thông tin giao dịch
 */
export async function updateGiaoDich(id: number, data: GiaoDichUpdate): Promise<GiaoDich> {
  // Mock: update mock data
  // TODO: Thay thế bằng API thật
  // const { data: result, error } = await supabase
  //   .from(TABLE_NAME)
  //   .update({
  //     ...data,
  //     updated_at: new Date().toISOString(),
  //   })
  //   .eq('id', id)
  //   .select()
  //   .single()
  // if (error) throw error
  // return result as GiaoDich

  const index = mockData.findIndex((gd) => gd.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy giao dịch')
  }

  mockData[index] = {
    ...mockData[index],
    ...data,
    updated_at: new Date().toISOString(),
  }

  return Promise.resolve(mockData[index])
}

/**
 * Xóa giao dịch
 */
export async function deleteGiaoDich(id: number): Promise<{ success: boolean }> {
  // Mock: remove from mock data
  // TODO: Thay thế bằng API thật
  // const { error } = await supabase
  //   .from(TABLE_NAME)
  //   .delete()
  //   .eq('id', id)
  // if (error) throw error
  // return { success: true }

  const index = mockData.findIndex((gd) => gd.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy giao dịch')
  }

  mockData.splice(index, 1)
  return Promise.resolve({ success: true })
}

/**
 * Tìm kiếm giao dịch theo từ khóa
 */
export async function searchGiaoDich(keyword: string): Promise<GiaoDich[]> {
  // Mock: filter mock data
  // TODO: Thay thế bằng API thật
  // const { data, error } = await supabase
  //   .from(TABLE_NAME)
  //   .select('*')
  //   .or(`ma_phieu.ilike.%${keyword}%,mo_ta.ilike.%${keyword}%,so_chung_tu.ilike.%${keyword}%,ghi_chu.ilike.%${keyword}%`)
  //   .order('ngay', { ascending: false })
  // if (error) throw error
  // return data as GiaoDich[]

  const lowerKeyword = keyword.toLowerCase()
  return Promise.resolve(
    mockData.filter(
      (gd) =>
        gd.ma_phieu.toLowerCase().includes(lowerKeyword) ||
        (gd.mo_ta && gd.mo_ta.toLowerCase().includes(lowerKeyword)) ||
        (gd.so_chung_tu && gd.so_chung_tu.toLowerCase().includes(lowerKeyword)) ||
        (gd.ghi_chu && gd.ghi_chu.toLowerCase().includes(lowerKeyword))
    )
  )
}

/**
 * Lấy mã phiếu tiếp theo theo loại (dùng khi tạo mới)
 */
export function getNextMaPhieuByLoai(loai: 'thu' | 'chi' | 'luan_chuyen'): string {
  // Đếm số lượng giao dịch hiện có theo loại để tạo mã mới
  const count = mockData.filter((gd) => gd.loai === loai).length
  const prefix = loai === 'thu' ? 'PT' : loai === 'chi' ? 'PC' : 'LC'
  return `${prefix}-${count + 1}`
}

/**
 * Kiểm tra mã phiếu đã tồn tại chưa
 */
export async function checkMaPhieuExists(maPhieu: string, excludeId?: number): Promise<boolean> {
  // Mock: check in mock data
  // TODO: Thay thế bằng API thật
  const exists = mockData.some((gd) => gd.ma_phieu === maPhieu && gd.id !== excludeId)
  return Promise.resolve(exists)
}

