/**
 * Danh sách ngân hàng Việt Nam
 */
export interface NganHangVN {
  code: string
  name: string
  shortName: string
}

export const DANH_SACH_NGAN_HANG_VN: NganHangVN[] = [
  { code: 'VCB', name: 'Ngân hàng Ngoại Thương Việt Nam', shortName: 'Vietcombank' },
  { code: 'BID', name: 'Ngân hàng Đầu tư và Phát triển Việt Nam', shortName: 'BIDV' },
  { code: 'TCB', name: 'Ngân hàng Kỹ thương Việt Nam', shortName: 'Techcombank' },
  { code: 'CTG', name: 'Ngân hàng Công Thương Việt Nam', shortName: 'VietinBank' },
  { code: 'ACB', name: 'Ngân hàng Á Châu', shortName: 'ACB' },
  { code: 'VIB', name: 'Ngân hàng Quốc tế Việt Nam', shortName: 'VIB' },
  { code: 'TPB', name: 'Ngân hàng Tiên Phong', shortName: 'TPBank' },
  { code: 'MSB', name: 'Ngân hàng Hàng Hải', shortName: 'MSB' },
  { code: 'VPB', name: 'Ngân hàng Việt Nam Thịnh Vượng', shortName: 'VPBank' },
  { code: 'HDB', name: 'Ngân hàng Phát triển Thành phố Hồ Chí Minh', shortName: 'HDBank' },
  { code: 'SHB', name: 'Ngân hàng Sài Gòn - Hà Nội', shortName: 'SHB' },
  { code: 'STB', name: 'Ngân hàng Sài Gòn Thương Tín', shortName: 'Sacombank' },
  { code: 'EIB', name: 'Ngân hàng Xuất Nhập khẩu Việt Nam', shortName: 'Eximbank' },
  { code: 'OCB', name: 'Ngân hàng Phương Đông', shortName: 'OCB' },
  { code: 'MBB', name: 'Ngân hàng Quân đội', shortName: 'MB' },
  { code: 'VCCB', name: 'Ngân hàng Bản Việt', shortName: 'VietCapitalBank' },
  { code: 'NAB', name: 'Ngân hàng Nam Á', shortName: 'NamABank' },
  { code: 'PGB', name: 'Ngân hàng Xăng dầu Petrolimex', shortName: 'PGBank' },
  { code: 'GPB', name: 'Ngân hàng Dầu Khí Toàn Cầu', shortName: 'GPBank' },
  { code: 'BAB', name: 'Ngân hàng Bắc Á', shortName: 'BacABank' },
  { code: 'VAB', name: 'Ngân hàng Việt Á', shortName: 'VietABank' },
  { code: 'SCB', name: 'Ngân hàng Sài Gòn', shortName: 'SCB' },
  { code: 'VPB', name: 'Ngân hàng Việt Nam Thịnh Vượng', shortName: 'VPBank' },
  { code: 'LPB', name: 'Ngân hàng Lào - Việt', shortName: 'LienVietPostBank' },
  { code: 'KLB', name: 'Ngân hàng Kiên Long', shortName: 'KienLongBank' },
  { code: 'NCB', name: 'Ngân hàng Quốc Dân', shortName: 'NCB' },
  { code: 'OJB', name: 'Ngân hàng Đại Dương', shortName: 'OceanBank' },
  { code: 'VBB', name: 'Ngân hàng Việt Nam Thương Tín', shortName: 'VietBank' },
  { code: 'SEA', name: 'Ngân hàng Đông Nam Á', shortName: 'SeABank' },
  { code: 'ABB', name: 'Ngân hàng An Bình', shortName: 'ABBank' },
]

/**
 * Tìm kiếm ngân hàng theo tên hoặc mã
 */
export function searchNganHang(keyword: string): NganHangVN[] {
  if (!keyword) return DANH_SACH_NGAN_HANG_VN
  
  const lowerKeyword = keyword.toLowerCase()
  return DANH_SACH_NGAN_HANG_VN.filter(
    (bank) =>
      bank.name.toLowerCase().includes(lowerKeyword) ||
      bank.shortName.toLowerCase().includes(lowerKeyword) ||
      bank.code.toLowerCase().includes(lowerKeyword)
  )
}

