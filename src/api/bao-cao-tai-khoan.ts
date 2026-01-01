import { supabase } from '@/lib/supabase'
import type {
  BaoCaoTaiKhoanFilters,
  BaoCaoTaiKhoanData,
  BaoCaoTaiKhoanSummary,
  BaoCaoTaiKhoanGroupedByTaiKhoan,
  BaoCaoTaiKhoanGroupedByTime,
  BaoCaoTaiKhoanGroupedByLoaiTaiKhoan,
  BaoCaoTaiKhoanGroupedByLoaiTien,
  BaoCaoTaiKhoanGiaoDich,
} from '@/types/bao-cao-tai-khoan'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'

dayjs.extend(customParseFormat)
dayjs.extend(weekOfYear)
dayjs.extend(quarterOfYear)

const TABLE_NAME = 'zz_capi_giao_dich'
const TAI_KHOAN_TABLE = 'zz_capi_tai_khoan'

/**
 * Tính số dư đầu kỳ của một tài khoản
 */
async function getSoDuDauKy(
  taiKhoanId: string,
  tuNgay: string
): Promise<number> {
  // Lấy số dư ban đầu
  const { data: taiKhoan } = await supabase
    .from(TAI_KHOAN_TABLE)
    .select('so_du_dau')
    .eq('id', taiKhoanId)
    .single()

  const soDuBanDau = taiKhoan?.so_du_dau || 0

  // Tính tổng thu/chi trước ngày bắt đầu
  const { data: giaoDichTruoc } = await supabase
    .from(TABLE_NAME)
    .select('loai, so_tien, so_tien_vnd, tai_khoan_id, tai_khoan_den_id')
    .lt('ngay', tuNgay)
    .or(`tai_khoan_id.eq.${taiKhoanId},tai_khoan_den_id.eq.${taiKhoanId}`)

  if (!giaoDichTruoc) return soDuBanDau

  let soDu = soDuBanDau
  for (const gd of giaoDichTruoc) {
    const soTien = gd.so_tien_vnd || gd.so_tien || 0
    if (gd.tai_khoan_id === taiKhoanId) {
      // Giao dịch từ tài khoản này (chi hoặc luân chuyển đi)
      if (gd.loai === 'chi') {
        soDu -= soTien
      } else if (gd.loai === 'luan_chuyen') {
        soDu -= soTien
      }
    }
    if (gd.tai_khoan_den_id === taiKhoanId) {
      // Giao dịch đến tài khoản này (thu hoặc luân chuyển đến)
      if (gd.loai === 'thu') {
        soDu += soTien
      } else if (gd.loai === 'luan_chuyen') {
        soDu += soTien
      }
    }
  }

  return soDu
}

/**
 * Format period theo groupBy
 */
function formatPeriod(date: string, groupBy: 'ngay' | 'tuan' | 'thang' | 'quy' | 'nam'): string {
  const d = dayjs(date)
  switch (groupBy) {
    case 'ngay':
      return d.format('DD/MM/YYYY')
    case 'tuan':
      return `Tuần ${d.week()} - ${d.format('YYYY')}`
    case 'thang':
      return d.format('MM/YYYY')
    case 'quy':
      return `Q${d.quarter()}/${d.format('YYYY')}`
    case 'nam':
      return d.format('YYYY')
    default:
      return d.format('DD/MM/YYYY')
  }
}

/**
 * Lấy dữ liệu báo cáo tài khoản
 */
export async function getBaoCaoTaiKhoanData(
  filters: BaoCaoTaiKhoanFilters
): Promise<BaoCaoTaiKhoanData> {
  if (!filters.tuNgay || !filters.denNgay) {
    throw new Error('Vui lòng chọn khoảng thời gian')
  }

  // Build query
  let query = supabase
    .from(TABLE_NAME)
    .select(`
      *,
      danh_muc:zz_capi_danh_muc_tai_chinh!danh_muc_id(id, ten_danh_muc),
      tai_khoan:zz_capi_tai_khoan!tai_khoan_id(id, ten_tai_khoan, loai_tai_khoan, don_vi),
      tai_khoan_den:zz_capi_tai_khoan!tai_khoan_den_id(id, ten_tai_khoan, loai_tai_khoan, don_vi),
      doi_tac:zz_capi_danh_sach_doi_tac!doi_tac_id(id, ten),
      nguoi_tao:zz_capi_nguoi_dung!created_by(id, ho_va_ten)
    `)

  // Apply filters
  query = query.gte('ngay', filters.tuNgay).lte('ngay', filters.denNgay)

  if (filters.taiKhoanIds && filters.taiKhoanIds.length > 0) {
    query = query.or(
      `tai_khoan_id.in.(${filters.taiKhoanIds.join(',')}),tai_khoan_den_id.in.(${filters.taiKhoanIds.join(',')})`
    )
  }

  if (filters.loaiGiaoDich && filters.loaiGiaoDich.length > 0) {
    query = query.in('loai', filters.loaiGiaoDich)
  }

  if (filters.danhMucIds && filters.danhMucIds.length > 0) {
    query = query.in('danh_muc_id', filters.danhMucIds)
  }

  if (filters.doiTacIds && filters.doiTacIds.length > 0) {
    query = query.in('doi_tac_id', filters.doiTacIds)
  }

  if (filters.nguoiTaoIds && filters.nguoiTaoIds.length > 0) {
    query = query.in('created_by', filters.nguoiTaoIds)
  }

  if (filters.keyword) {
    query = query.or(
      `ma_phieu.ilike.%${filters.keyword}%,mo_ta.ilike.%${filters.keyword}%,so_chung_tu.ilike.%${filters.keyword}%`
    )
  }

  query = query.order('ngay', { ascending: false })

  const { data, error } = await query
  if (error) throw error

  const giaoDich = (data || []).map((item: any) => ({
    ...item,
    danh_muc: item.danh_muc ? {
      ...item.danh_muc,
      ten: item.danh_muc.ten_danh_muc,
    } : null,
    tai_khoan: item.tai_khoan ? {
      ...item.tai_khoan,
      ten: item.tai_khoan.ten_tai_khoan,
      loai: item.tai_khoan.loai_tai_khoan,
      loai_tien: item.tai_khoan.don_vi,
    } : null,
    tai_khoan_den: item.tai_khoan_den ? {
      ...item.tai_khoan_den,
      ten: item.tai_khoan_den.ten_tai_khoan,
      loai: item.tai_khoan_den.loai_tai_khoan,
      loai_tien: item.tai_khoan_den.don_vi,
    } : null,
    doi_tac: item.doi_tac || null,
    nguoi_tao: item.nguoi_tao || null,
  })) as any[]

  // Filter by loai_tien if needed
  let filteredGiaoDich = giaoDich
  if (filters.loaiTien && filters.loaiTien.length > 0) {
    filteredGiaoDich = giaoDich.filter((gd) => {
      const loaiTien = gd.tai_khoan?.loai_tien || gd.tai_khoan_den?.loai_tien
      return loaiTien && filters.loaiTien?.includes(loaiTien as 'VND' | 'USD')
    })
  }

  // Filter by loai_tai_khoan if needed
  if (filters.loaiTaiKhoan && filters.loaiTaiKhoan.length > 0) {
    filteredGiaoDich = filteredGiaoDich.filter((gd) => {
      const loaiTK = gd.tai_khoan?.loai || gd.tai_khoan_den?.loai
      return loaiTK && filters.loaiTaiKhoan?.includes(loaiTK)
    })
  }

  // Get unique tai khoan IDs
  const taiKhoanIds = new Set<string>()
  filteredGiaoDich.forEach((gd) => {
    if (gd.tai_khoan_id) taiKhoanIds.add(gd.tai_khoan_id)
    if (gd.tai_khoan_den_id) taiKhoanIds.add(gd.tai_khoan_den_id)
  })

  // Calculate so du dau ky for each tai khoan
  const soDuDauKyMap = new Map<string, number>()
  for (const tkId of taiKhoanIds) {
    const soDu = await getSoDuDauKy(tkId, filters.tuNgay!)
    soDuDauKyMap.set(tkId, soDu)
  }

  // Calculate summary
  let tongThu = 0
  let tongChi = 0
  let tongSoDuDauKy = 0

  filteredGiaoDich.forEach((gd) => {
    const soTien = gd.so_tien_vnd || gd.so_tien || 0
    if (gd.loai === 'thu') {
      tongThu += soTien
    } else if (gd.loai === 'chi') {
      tongChi += soTien
    }
  })

  // Calculate total so du dau ky
  soDuDauKyMap.forEach((soDu) => {
    tongSoDuDauKy += soDu
  })

  const summary: BaoCaoTaiKhoanSummary = {
    tongThu,
    tongChi,
    soDuDauKy: tongSoDuDauKy,
    tonCuoi: tongSoDuDauKy + tongThu - tongChi,
    soLuongGiaoDich: filteredGiaoDich.length,
  }

  // Group by tai khoan
  const groupedByTaiKhoanMap = new Map<string, BaoCaoTaiKhoanGroupedByTaiKhoan>()
  
  for (const tkId of taiKhoanIds) {
    const tkGiaoDich = filteredGiaoDich.filter(
      (gd) => gd.tai_khoan_id === tkId || gd.tai_khoan_den_id === tkId
    )
    
    let tkThu = 0
    let tkChi = 0
    
    tkGiaoDich.forEach((gd) => {
      const soTien = gd.so_tien_vnd || gd.so_tien || 0
      if (gd.tai_khoan_id === tkId && gd.loai === 'chi') {
        tkChi += soTien
      } else if (gd.tai_khoan_den_id === tkId && gd.loai === 'thu') {
        tkThu += soTien
      } else if (gd.loai === 'luan_chuyen') {
        if (gd.tai_khoan_id === tkId) {
          tkChi += soTien
        } else if (gd.tai_khoan_den_id === tkId) {
          tkThu += soTien
        }
      }
    })

    const tkInfo = tkGiaoDich.find(
      (gd) => gd.tai_khoan_id === tkId || gd.tai_khoan_den_id === tkId
    )
    const taiKhoan = tkInfo?.tai_khoan_id === tkId ? tkInfo.tai_khoan : tkInfo?.tai_khoan_den

    if (taiKhoan) {
      groupedByTaiKhoanMap.set(tkId, {
        taiKhoanId: tkId,
        taiKhoanTen: taiKhoan.ten,
        loaiTaiKhoan: taiKhoan.loai,
        loaiTien: taiKhoan.loai_tien,
        soDuDauKy: soDuDauKyMap.get(tkId) || 0,
        tongThu: tkThu,
        tongChi: tkChi,
        tonCuoi: (soDuDauKyMap.get(tkId) || 0) + tkThu - tkChi,
        soLuongGiaoDich: tkGiaoDich.length,
      })
    }
  }

  // Group by time (default: thang)
  const groupedByTimeMap = new Map<string, BaoCaoTaiKhoanGroupedByTime>()
  
  filteredGiaoDich.forEach((gd) => {
    const period = formatPeriod(gd.ngay, 'thang')
    const existing = groupedByTimeMap.get(period) || {
      period,
      soDuDauKy: 0,
      tongThu: 0,
      tongChi: 0,
      tonCuoi: 0,
      soLuongGiaoDich: 0,
    }

    const soTien = gd.so_tien_vnd || gd.so_tien || 0
    if (gd.loai === 'thu') {
      existing.tongThu += soTien
    } else if (gd.loai === 'chi') {
      existing.tongChi += soTien
    }
    existing.soLuongGiaoDich += 1
    groupedByTimeMap.set(period, existing)
  })

  // Calculate so du dau ky and ton cuoi for each period
  const periods = Array.from(groupedByTimeMap.keys()).sort()
  let runningSoDu = tongSoDuDauKy
  
  periods.forEach((period) => {
    const item = groupedByTimeMap.get(period)!
    item.soDuDauKy = runningSoDu
    item.tonCuoi = runningSoDu + item.tongThu - item.tongChi
    runningSoDu = item.tonCuoi
  })

  // Group by loai tai khoan
  const groupedByLoaiTaiKhoanMap = new Map<string, BaoCaoTaiKhoanGroupedByLoaiTaiKhoan>()
  
  filteredGiaoDich.forEach((gd) => {
    const loaiTK = gd.tai_khoan?.loai || gd.tai_khoan_den?.loai
    if (!loaiTK) return

    const existing = groupedByLoaiTaiKhoanMap.get(loaiTK) || {
      loaiTaiKhoan: loaiTK,
      soDuDauKy: 0,
      tongThu: 0,
      tongChi: 0,
      tonCuoi: 0,
      soLuongGiaoDich: 0,
    }

    const soTien = gd.so_tien_vnd || gd.so_tien || 0
    if (gd.loai === 'thu') {
      existing.tongThu += soTien
    } else if (gd.loai === 'chi') {
      existing.tongChi += soTien
    }
    existing.soLuongGiaoDich += 1
    groupedByLoaiTaiKhoanMap.set(loaiTK, existing)
  })

  // Calculate so du dau ky for each loai tai khoan
  groupedByLoaiTaiKhoanMap.forEach((item, loaiTK) => {
    let soDu = 0
    soDuDauKyMap.forEach((soDuTK, tkId) => {
      const tkInfo = Array.from(groupedByTaiKhoanMap.values()).find(
        (tk) => tk.taiKhoanId === tkId && tk.loaiTaiKhoan === loaiTK
      )
      if (tkInfo) {
        soDu += soDuTK
      }
    })
    item.soDuDauKy = soDu
    item.tonCuoi = soDu + item.tongThu - item.tongChi
  })

  // Group by loai tien
  const groupedByLoaiTienMap = new Map<string, BaoCaoTaiKhoanGroupedByLoaiTien>()
  
  filteredGiaoDich.forEach((gd) => {
    const loaiTien = gd.tai_khoan?.loai_tien || gd.tai_khoan_den?.loai_tien
    if (!loaiTien) return

    const existing = groupedByLoaiTienMap.get(loaiTien) || {
      loaiTien,
      soDuDauKy: 0,
      tongThu: 0,
      tongChi: 0,
      tonCuoi: 0,
      soLuongGiaoDich: 0,
    }

    const soTien = gd.so_tien_vnd || gd.so_tien || 0
    if (gd.loai === 'thu') {
      existing.tongThu += soTien
    } else if (gd.loai === 'chi') {
      existing.tongChi += soTien
    }
    existing.soLuongGiaoDich += 1
    groupedByLoaiTienMap.set(loaiTien, existing)
  })

  // Calculate so du dau ky for each loai tien
  groupedByLoaiTienMap.forEach((item, loaiTien) => {
    let soDu = 0
    soDuDauKyMap.forEach((soDuTK, tkId) => {
      const tkInfo = Array.from(groupedByTaiKhoanMap.values()).find(
        (tk) => tk.taiKhoanId === tkId && tk.loaiTien === loaiTien
      )
      if (tkInfo) {
        soDu += soDuTK
      }
    })
    item.soDuDauKy = soDu
    item.tonCuoi = soDu + item.tongThu - item.tongChi
  })

  // Map giao dich to BaoCaoTaiKhoanGiaoDich
  const mappedGiaoDich: BaoCaoTaiKhoanGiaoDich[] = filteredGiaoDich.map((gd) => ({
    id: gd.id.toString(),
    ngay: gd.ngay,
    ma_phieu: gd.ma_phieu,
    loai: gd.loai,
    so_tien: gd.so_tien,
    so_tien_vnd: gd.so_tien_vnd,
    mo_ta: gd.mo_ta,
    danh_muc: gd.danh_muc ? { id: gd.danh_muc.id, ten: gd.danh_muc.ten } : undefined,
    doi_tac: gd.doi_tac ? { id: gd.doi_tac.id, ten: gd.doi_tac.ten } : undefined,
    nguoi_tao: gd.nguoi_tao ? { id: gd.nguoi_tao.id, ho_ten: gd.nguoi_tao.ho_va_ten || gd.nguoi_tao.ho_ten } : undefined,
    tai_khoan: gd.tai_khoan ? { id: gd.tai_khoan.id, ten: gd.tai_khoan.ten } : undefined,
    tai_khoan_den: gd.tai_khoan_den ? { id: gd.tai_khoan_den.id, ten: gd.tai_khoan_den.ten } : undefined,
  }))

  return {
    summary,
    groupedByTaiKhoan: Array.from(groupedByTaiKhoanMap.values()),
    groupedByTime: Array.from(groupedByTimeMap.values()).sort((a, b) => a.period.localeCompare(b.period)),
    groupedByLoaiTaiKhoan: Array.from(groupedByLoaiTaiKhoanMap.values()),
    groupedByLoaiTien: Array.from(groupedByLoaiTienMap.values()),
    giaoDich: mappedGiaoDich,
  }
}

