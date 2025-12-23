import { supabase } from '@/lib/supabase'
import type {
  GiaoDichWithRelations,
  LoaiGiaoDich,
} from '@/types/giao-dich'
import type {
  BaoCaoFilters,
  BaoCaoData,
  BaoCaoSummary,
  BaoCaoGroupedByTime,
  BaoCaoGroupedByDanhMuc,
  BaoCaoGroupedByDoiTac,
  BaoCaoGroupedByLoai,
  BaoCaoGroupedByNguoiTao,
  BaoCaoGroupedByTaiKhoan,
  BaoCaoGroupedByLoaiTien,
  BaoCaoSoSanhKy,
  TopItem,
  GroupByOption,
  ComparePeriodOption,
} from '@/types/bao-cao-tai-chinh'
import dayjs from 'dayjs'

const TABLE_NAME = 'zz_cst_giao_dich'

/**
 * Lấy dữ liệu báo cáo với filters
 */
export async function getBaoCaoData(
  filters: BaoCaoFilters,
  groupBy?: GroupByOption,
  comparePeriod?: ComparePeriodOption
): Promise<BaoCaoData> {
  // Build query
  let query = supabase
    .from(TABLE_NAME)
    .select(`
      *,
      danh_muc:zz_cst_danh_muc!danh_muc_id(id, ten, loai),
      ty_gia:zz_cst_ty_gia!ty_gia_id(id, ty_gia, ngay_ap_dung),
      tai_khoan:zz_cst_tai_khoan!tai_khoan_id(id, ten, loai_tien),
      tai_khoan_den:zz_cst_tai_khoan!tai_khoan_den_id(id, ten, loai_tien),
      doi_tac:zz_cst_danh_sach_doi_tac!doi_tac_id(id, ten, loai),
      nguoi_tao:zz_cst_nguoi_dung!created_by(id, ho_ten)
    `)

  // Apply filters
  if (filters.tuNgay) {
    query = query.gte('ngay', filters.tuNgay)
  }
  if (filters.denNgay) {
    query = query.lte('ngay', filters.denNgay)
  }
  if (filters.danhMucIds && filters.danhMucIds.length > 0) {
    query = query.in('danh_muc_id', filters.danhMucIds)
  }
  if (filters.doiTacIds && filters.doiTacIds.length > 0) {
    query = query.in('doi_tac_id', filters.doiTacIds)
  }
  if (filters.loaiGiaoDich && filters.loaiGiaoDich.length > 0) {
    query = query.in('loai', filters.loaiGiaoDich)
  }
  if (filters.nguoiTaoIds && filters.nguoiTaoIds.length > 0) {
    query = query.in('created_by', filters.nguoiTaoIds)
  }
  if (filters.taiKhoanIds && filters.taiKhoanIds.length > 0) {
    query = query.or(
      `tai_khoan_id.in.(${filters.taiKhoanIds.join(',')}),tai_khoan_den_id.in.(${filters.taiKhoanIds.join(',')})`
    )
  }
  if (filters.keyword) {
    query = query.or(
      `ma_phieu.ilike.%${filters.keyword}%,mo_ta.ilike.%${filters.keyword}%,so_chung_tu.ilike.%${filters.keyword}%,ghi_chu.ilike.%${filters.keyword}%`
    )
  }

  // Order by date
  query = query.order('ngay', { ascending: false }).order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) throw error

  const giaoDich = (data || []).map((item: any) => ({
    ...item,
    danh_muc: item.danh_muc || null,
    ty_gia: item.ty_gia || null,
    tai_khoan: item.tai_khoan || null,
    tai_khoan_den: item.tai_khoan_den || null,
    doi_tac: item.doi_tac || null,
    nguoi_tao: item.nguoi_tao || null,
  })) as GiaoDichWithRelations[]

  // Filter by loai_tien if needed
  let filteredGiaoDich = giaoDich
  if (filters.loaiTien && filters.loaiTien.length > 0) {
    filteredGiaoDich = giaoDich.filter((gd) => {
      const loaiTien = gd.tai_khoan?.loai_tien || gd.tai_khoan_den?.loai_tien
      return loaiTien && filters.loaiTien?.includes(loaiTien as 'VND' | 'USD')
    })
  }

  // Calculate summary
  const summary = calculateSummary(filteredGiaoDich)

  // Group data if needed
  let groupedByTime: BaoCaoGroupedByTime[] | undefined
  let groupedByDanhMuc: BaoCaoGroupedByDanhMuc[] | undefined
  let groupedByDoiTac: BaoCaoGroupedByDoiTac[] | undefined
  let groupedByLoai: BaoCaoGroupedByLoai[] | undefined
  let groupedByNguoiTao: BaoCaoGroupedByNguoiTao[] | undefined

  // Always calculate groupedByTime for charts (default to 'thang' if no groupBy specified)
  if (groupBy) {
    switch (groupBy) {
      case 'ngay':
      case 'tuan':
      case 'thang':
      case 'quy':
      case 'nam':
        groupedByTime = groupByTime(filteredGiaoDich, groupBy)
        break
      case 'danh_muc':
        groupedByDanhMuc = groupByDanhMuc(filteredGiaoDich)
        // Also calculate by time for charts
        groupedByTime = groupByTime(filteredGiaoDich, 'thang')
        break
      case 'doi_tac':
        groupedByDoiTac = groupByDoiTac(filteredGiaoDich)
        // Also calculate by time for charts
        groupedByTime = groupByTime(filteredGiaoDich, 'thang')
        break
      case 'loai':
        groupedByLoai = groupByLoai(filteredGiaoDich)
        // Also calculate by time for charts
        groupedByTime = groupByTime(filteredGiaoDich, 'thang')
        break
      case 'nguoi_tao':
        groupedByNguoiTao = groupByNguoiTao(filteredGiaoDich)
        // Also calculate by time for charts
        groupedByTime = groupByTime(filteredGiaoDich, 'thang')
        break
    }
  } else {
    // If no groupBy, default to monthly grouping for charts
    groupedByTime = groupByTime(filteredGiaoDich, 'thang')
  }

  // Calculate comparison if needed
  let soSanhKy: BaoCaoSoSanhKy | undefined
  if (comparePeriod) {
    soSanhKy = await calculateSoSanhKy(filters, comparePeriod)
  }

  // Calculate top items
  const topDanhMuc = calculateTopDanhMuc(filteredGiaoDich)
  const topDoiTac = calculateTopDoiTac(filteredGiaoDich)

  // Always calculate groupedByTaiKhoan for summary tables
  const groupedByTaiKhoan = groupByTaiKhoan(filteredGiaoDich)
  
  // Always calculate groupedByLoaiTien for summary tables
  const groupedByLoaiTien = groupByLoaiTien(filteredGiaoDich)
  
  // Always calculate groupedByTuan for summary tables
  const groupedByTuan = groupByTime(filteredGiaoDich, 'tuan')
  
  // Top 10 giao dịch lớn nhất
  const topGiaoDich = [...filteredGiaoDich]
    .sort((a, b) => {
      const soTienA = a.so_tien_vnd || a.so_tien
      const soTienB = b.so_tien_vnd || b.so_tien
      return soTienB - soTienA
    })
    .slice(0, 10)

  return {
    summary,
    giaoDich: filteredGiaoDich,
    groupedByTime,
    groupedByDanhMuc,
    groupedByDoiTac,
    groupedByLoai,
    groupedByNguoiTao,
    groupedByTaiKhoan,
    groupedByLoaiTien,
    groupedByTuan,
    soSanhKy,
    topDanhMuc,
    topDoiTac,
    topGiaoDich,
  }
}

/**
 * Tính tổng hợp số liệu
 */
function calculateSummary(giaoDich: GiaoDichWithRelations[]): BaoCaoSummary {
  let tongThu = 0
  let tongChi = 0
  let tongLuânChuyen = 0
  let soLuongThu = 0
  let soLuongChi = 0
  let soLuongLuânChuyen = 0

  giaoDich.forEach((gd) => {
    const soTien = gd.so_tien_vnd || gd.so_tien

    if (gd.loai === 'thu') {
      tongThu += soTien
      soLuongThu++
    } else if (gd.loai === 'chi') {
      tongChi += soTien
      soLuongChi++
    } else if (gd.loai === 'luan_chuyen') {
      tongLuânChuyen += soTien
      soLuongLuânChuyen++
    }
  })

  return {
    tongThu,
    tongChi,
    tongLuânChuyen,
    soDu: tongThu - tongChi,
    soLuongGiaoDich: giaoDich.length,
    soLuongThu,
    soLuongChi,
    soLuongLuânChuyen,
  }
}

/**
 * Nhóm theo thời gian
 */
function groupByTime(
  giaoDich: GiaoDichWithRelations[],
  period: 'ngay' | 'tuan' | 'thang' | 'quy' | 'nam'
): BaoCaoGroupedByTime[] {
  const grouped = new Map<string, BaoCaoGroupedByTime>()

  giaoDich.forEach((gd) => {
    let periodKey = ''
    const date = dayjs(gd.ngay)

    switch (period) {
      case 'ngay':
        periodKey = date.format('YYYY-MM-DD')
        break
      case 'tuan':
        // Calculate week number manually
        const startOfYear = date.startOf('year')
        const weekNumber = Math.ceil((date.diff(startOfYear, 'day') + startOfYear.day()) / 7)
        periodKey = `${date.year()}-W${weekNumber}`
        break
      case 'thang':
        periodKey = date.format('YYYY-MM')
        break
      case 'quy':
        const quarter = Math.floor(date.month() / 3) + 1
        periodKey = `${date.year()}-Q${quarter}`
        break
      case 'nam':
        periodKey = date.format('YYYY')
        break
    }

    if (!grouped.has(periodKey)) {
      grouped.set(periodKey, {
        period: periodKey,
        tongThu: 0,
        tongChi: 0,
        soDu: 0,
        soLuongGiaoDich: 0,
      })
    }

    const item = grouped.get(periodKey)!
    const soTien = gd.so_tien_vnd || gd.so_tien

    if (gd.loai === 'thu') {
      item.tongThu += soTien
    } else if (gd.loai === 'chi') {
      item.tongChi += soTien
    }
    item.soDu = item.tongThu - item.tongChi
    item.soLuongGiaoDich++
  })

  return Array.from(grouped.values()).sort((a, b) => a.period.localeCompare(b.period))
}

/**
 * Nhóm theo danh mục
 */
function groupByDanhMuc(
  giaoDich: GiaoDichWithRelations[]
): BaoCaoGroupedByDanhMuc[] {
  const grouped = new Map<string, BaoCaoGroupedByDanhMuc>()

  giaoDich.forEach((gd) => {
    if (!gd.danh_muc) return

    const danhMucId = gd.danh_muc.id
    if (!grouped.has(danhMucId)) {
      grouped.set(danhMucId, {
        danhMucId,
        danhMucTen: gd.danh_muc.ten,
        tongThu: 0,
        tongChi: 0,
        soDu: 0,
        soLuongGiaoDich: 0,
      })
    }

    const item = grouped.get(danhMucId)!
    const soTien = gd.so_tien_vnd || gd.so_tien

    if (gd.loai === 'thu') {
      item.tongThu += soTien
    } else if (gd.loai === 'chi') {
      item.tongChi += soTien
    }
    item.soDu = item.tongThu - item.tongChi
    item.soLuongGiaoDich++
  })

  return Array.from(grouped.values()).sort((a, b) => b.tongThu + b.tongChi - (a.tongThu + a.tongChi))
}

/**
 * Nhóm theo đối tác
 */
function groupByDoiTac(
  giaoDich: GiaoDichWithRelations[]
): BaoCaoGroupedByDoiTac[] {
  const grouped = new Map<string, BaoCaoGroupedByDoiTac>()

  giaoDich.forEach((gd) => {
    if (!gd.doi_tac) return

    const doiTacId = gd.doi_tac.id
    if (!grouped.has(doiTacId)) {
      grouped.set(doiTacId, {
        doiTacId,
        doiTacTen: gd.doi_tac.ten,
        tongThu: 0,
        tongChi: 0,
        soDu: 0,
        soLuongGiaoDich: 0,
      })
    }

    const item = grouped.get(doiTacId)!
    const soTien = gd.so_tien_vnd || gd.so_tien

    if (gd.loai === 'thu') {
      item.tongThu += soTien
    } else if (gd.loai === 'chi') {
      item.tongChi += soTien
    }
    item.soDu = item.tongThu - item.tongChi
    item.soLuongGiaoDich++
  })

  return Array.from(grouped.values()).sort((a, b) => b.tongThu + b.tongChi - (a.tongThu + a.tongChi))
}

/**
 * Nhóm theo loại
 */
function groupByLoai(giaoDich: GiaoDichWithRelations[]): BaoCaoGroupedByLoai[] {
  const grouped = new Map<LoaiGiaoDich, BaoCaoGroupedByLoai>()

  giaoDich.forEach((gd) => {
    if (!grouped.has(gd.loai)) {
      grouped.set(gd.loai, {
        loai: gd.loai,
        tongTien: 0,
        soLuongGiaoDich: 0,
      })
    }

    const item = grouped.get(gd.loai)!
    const soTien = gd.so_tien_vnd || gd.so_tien
    item.tongTien += soTien
    item.soLuongGiaoDich++
  })

  return Array.from(grouped.values())
}

/**
 * Nhóm theo người tạo
 */
function groupByNguoiTao(
  giaoDich: GiaoDichWithRelations[]
): BaoCaoGroupedByNguoiTao[] {
  const grouped = new Map<string, BaoCaoGroupedByNguoiTao>()

  giaoDich.forEach((gd) => {
    if (!gd.nguoi_tao) return

    const nguoiTaoId = gd.nguoi_tao.id
    if (!grouped.has(nguoiTaoId)) {
      grouped.set(nguoiTaoId, {
        nguoiTaoId,
        nguoiTaoTen: gd.nguoi_tao.ho_ten,
        tongThu: 0,
        tongChi: 0,
        soDu: 0,
        soLuongGiaoDich: 0,
      })
    }

    const item = grouped.get(nguoiTaoId)!
    const soTien = gd.so_tien_vnd || gd.so_tien

    if (gd.loai === 'thu') {
      item.tongThu += soTien
    } else if (gd.loai === 'chi') {
      item.tongChi += soTien
    }
    item.soDu = item.tongThu - item.tongChi
    item.soLuongGiaoDich++
  })

  return Array.from(grouped.values()).sort((a, b) => b.tongThu + b.tongChi - (a.tongThu + a.tongChi))
}

/**
 * Tính so sánh kỳ
 */
async function calculateSoSanhKy(
  filters: BaoCaoFilters,
  comparePeriod: ComparePeriodOption
): Promise<BaoCaoSoSanhKy> {
  if (!comparePeriod || !filters.tuNgay || !filters.denNgay) {
    throw new Error('Cần có tuNgay và denNgay để so sánh kỳ')
  }

  const tuNgay = dayjs(filters.tuNgay)
  const denNgay = dayjs(filters.denNgay)

  let previousTuNgay: dayjs.Dayjs
  let previousDenNgay: dayjs.Dayjs

  switch (comparePeriod) {
    case 'thang_truoc':
      previousTuNgay = tuNgay.subtract(1, 'month')
      previousDenNgay = denNgay.subtract(1, 'month')
      break
    case 'nam_truoc':
      previousTuNgay = tuNgay.subtract(1, 'year')
      previousDenNgay = denNgay.subtract(1, 'year')
      break
    case 'ky_truoc':
      const diffDays = denNgay.diff(tuNgay, 'day')
      previousDenNgay = tuNgay.subtract(1, 'day')
      previousTuNgay = previousDenNgay.subtract(diffDays, 'day')
      break
    default:
      throw new Error('Invalid compare period')
  }

  // Get current period data
  const currentData = await getBaoCaoData(filters)
  const currentSummary = currentData.summary

  // Get previous period data
  const previousFilters: BaoCaoFilters = {
    ...filters,
    tuNgay: previousTuNgay.format('YYYY-MM-DD'),
    denNgay: previousDenNgay.format('YYYY-MM-DD'),
  }
  const previousData = await getBaoCaoData(previousFilters)
  const previousSummary = previousData.summary

  // Calculate changes
  const thayDoi = {
    tongThu: previousSummary.tongThu === 0 
      ? (currentSummary.tongThu > 0 ? 100 : 0)
      : ((currentSummary.tongThu - previousSummary.tongThu) / previousSummary.tongThu) * 100,
    tongChi: previousSummary.tongChi === 0
      ? (currentSummary.tongChi > 0 ? 100 : 0)
      : ((currentSummary.tongChi - previousSummary.tongChi) / previousSummary.tongChi) * 100,
    soDu: previousSummary.soDu === 0
      ? (currentSummary.soDu > 0 ? 100 : currentSummary.soDu < 0 ? -100 : 0)
      : ((currentSummary.soDu - previousSummary.soDu) / Math.abs(previousSummary.soDu)) * 100,
    soLuongGiaoDich: previousSummary.soLuongGiaoDich === 0
      ? (currentSummary.soLuongGiaoDich > 0 ? 100 : 0)
      : ((currentSummary.soLuongGiaoDich - previousSummary.soLuongGiaoDich) / previousSummary.soLuongGiaoDich) * 100,
  }

  return {
    kyHienTai: currentSummary,
    kyTruoc: previousSummary,
    thayDoi,
  }
}

/**
 * Tính top danh mục
 */
function calculateTopDanhMuc(
  giaoDich: GiaoDichWithRelations[],
  limit: number = 10
): TopItem[] {
  const grouped = new Map<string, TopItem>()

  giaoDich.forEach((gd) => {
    if (!gd.danh_muc) return

    const danhMucId = gd.danh_muc.id
    if (!grouped.has(danhMucId)) {
      grouped.set(danhMucId, {
        id: danhMucId,
        ten: gd.danh_muc.ten,
        tongTien: 0,
        soLuongGiaoDich: 0,
      })
    }

    const item = grouped.get(danhMucId)!
    const soTien = gd.so_tien_vnd || gd.so_tien
    item.tongTien += soTien
    item.soLuongGiaoDich++
  })

  return Array.from(grouped.values())
    .sort((a, b) => b.tongTien - a.tongTien)
    .slice(0, limit)
}

/**
 * Tính top đối tác
 */
function calculateTopDoiTac(
  giaoDich: GiaoDichWithRelations[],
  limit: number = 10
): TopItem[] {
  const grouped = new Map<string, TopItem>()

  giaoDich.forEach((gd) => {
    if (!gd.doi_tac) return

    const doiTacId = gd.doi_tac.id
    if (!grouped.has(doiTacId)) {
      grouped.set(doiTacId, {
        id: doiTacId,
        ten: gd.doi_tac.ten,
        tongTien: 0,
        soLuongGiaoDich: 0,
      })
    }

    const item = grouped.get(doiTacId)!
    const soTien = gd.so_tien_vnd || gd.so_tien
    item.tongTien += soTien
    item.soLuongGiaoDich++
  })

  return Array.from(grouped.values())
    .sort((a, b) => b.tongTien - a.tongTien)
    .slice(0, limit)
}

/**
 * Nhóm theo tài khoản
 */
function groupByTaiKhoan(
  giaoDich: GiaoDichWithRelations[]
): BaoCaoGroupedByTaiKhoan[] {
  const grouped = new Map<string, BaoCaoGroupedByTaiKhoan>()

  giaoDich.forEach((gd) => {
    // Xử lý tài khoản đi (cho chi và luân chuyển)
    if (gd.tai_khoan) {
      const taiKhoanId = gd.tai_khoan.id
      const key = `tk_${taiKhoanId}`
      
      if (!grouped.has(key)) {
        grouped.set(key, {
          taiKhoanId,
          taiKhoanTen: gd.tai_khoan.ten,
          loaiTien: gd.tai_khoan.loai_tien || 'VND',
          tongThu: 0,
          tongChi: 0,
          soDu: 0,
          soLuongGiaoDich: 0,
        })
      }

      const item = grouped.get(key)!
      const soTien = gd.so_tien_vnd || gd.so_tien

      if (gd.loai === 'chi') {
        item.tongChi += soTien
      } else if (gd.loai === 'luan_chuyen') {
        item.tongChi += soTien // Luân chuyển từ tài khoản này
      }
      item.soDu = item.tongThu - item.tongChi
      item.soLuongGiaoDich++
    }

    // Xử lý tài khoản đến (cho thu và luân chuyển)
    if (gd.tai_khoan_den) {
      const taiKhoanId = gd.tai_khoan_den.id
      const key = `tk_${taiKhoanId}`
      
      if (!grouped.has(key)) {
        grouped.set(key, {
          taiKhoanId,
          taiKhoanTen: gd.tai_khoan_den.ten,
          loaiTien: gd.tai_khoan_den.loai_tien || 'VND',
          tongThu: 0,
          tongChi: 0,
          soDu: 0,
          soLuongGiaoDich: 0,
        })
      }

      const item = grouped.get(key)!
      const soTien = gd.so_tien_vnd || gd.so_tien

      if (gd.loai === 'thu') {
        item.tongThu += soTien
      } else if (gd.loai === 'luan_chuyen') {
        item.tongThu += soTien // Luân chuyển vào tài khoản này
      }
      item.soDu = item.tongThu - item.tongChi
      item.soLuongGiaoDich++
    }
  })

  return Array.from(grouped.values()).sort((a, b) => (b.tongThu + b.tongChi) - (a.tongThu + a.tongChi))
}

/**
 * Nhóm theo loại tiền
 */
function groupByLoaiTien(
  giaoDich: GiaoDichWithRelations[]
): BaoCaoGroupedByLoaiTien[] {
  const grouped = new Map<string, BaoCaoGroupedByLoaiTien>()

  giaoDich.forEach((gd) => {
    // Lấy loại tiền từ tài khoản đi hoặc đến
    let loaiTien = 'VND' // Default
    if (gd.tai_khoan?.loai_tien) {
      loaiTien = gd.tai_khoan.loai_tien
    } else if (gd.tai_khoan_den?.loai_tien) {
      loaiTien = gd.tai_khoan_den.loai_tien
    }

    if (!grouped.has(loaiTien)) {
      grouped.set(loaiTien, {
        loaiTien: loaiTien as 'VND' | 'USD',
        tongThu: 0,
        tongChi: 0,
        soDu: 0,
        soLuongGiaoDich: 0,
      })
    }

    const item = grouped.get(loaiTien)!
    const soTien = gd.so_tien_vnd || gd.so_tien

    if (gd.loai === 'thu') {
      item.tongThu += soTien
    } else if (gd.loai === 'chi') {
      item.tongChi += soTien
    }
    item.soDu = item.tongThu - item.tongChi
    item.soLuongGiaoDich++
  })

  return Array.from(grouped.values()).sort((a, b) => (b.tongThu + b.tongChi) - (a.tongThu + a.tongChi))
}

