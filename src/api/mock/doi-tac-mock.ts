import type { DoiTac } from '@/types/doi-tac'

/**
 * Mock data store cho module Danh sách đối tác
 */

// Mock data ban đầu
const initialMockData: DoiTac[] = [
  // Nhà cung cấp
  {
    id: 'dt-ncc-1',
    ma: 'NCC001',
    ten: 'Công ty TNHH Vật liệu Xây dựng ABC',
    loai: 'nha_cung_cap',
    nhom_doi_tac_id: 'ncc-1',
    email: 'contact@abc-construction.vn',
    dien_thoai: '0912345678',
    dia_chi: '123 Đường ABC, Quận 1, TP.HCM',
    ma_so_thue: '0123456789',
    nguoi_lien_he: 'Nguyễn Văn A',
    ghi_chu: 'Nhà cung cấp chính cho dự án xây dựng',
    trang_thai: true,
    nguoi_tao_id: 'user-1',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'dt-ncc-2',
    ma: 'NCC002',
    ten: 'Công ty Thiết bị Văn phòng XYZ',
    loai: 'nha_cung_cap',
    nhom_doi_tac_id: 'ncc-2',
    email: 'sales@xyz-office.vn',
    dien_thoai: '0987654321',
    dia_chi: '456 Đường XYZ, Quận 3, TP.HCM',
    ma_so_thue: '0987654321',
    nguoi_lien_he: 'Trần Thị B',
    ghi_chu: 'Cung cấp thiết bị văn phòng chất lượng cao',
    trang_thai: true,
    nguoi_tao_id: 'user-1',
    created_at: new Date('2024-01-20').toISOString(),
    updated_at: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'dt-ncc-3',
    ma: 'NCC003',
    ten: 'Công ty Dịch vụ Marketing DEF',
    loai: 'nha_cung_cap',
    nhom_doi_tac_id: 'ncc-3',
    email: 'info@def-marketing.vn',
    dien_thoai: '0901234567',
    dia_chi: '789 Đường DEF, Quận 5, TP.HCM',
    ma_so_thue: '0123456780',
    nguoi_lien_he: 'Lê Văn C',
    ghi_chu: 'Đối tác marketing lâu năm',
    trang_thai: true,
    nguoi_tao_id: 'user-2',
    created_at: new Date('2024-02-01').toISOString(),
    updated_at: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'dt-ncc-4',
    ma: 'NCC004',
    ten: 'Công ty Vận chuyển GHI',
    loai: 'nha_cung_cap',
    nhom_doi_tac_id: 'ncc-4',
    email: 'logistics@ghi-transport.vn',
    dien_thoai: '0911111111',
    dia_chi: '321 Đường GHI, Quận 7, TP.HCM',
    ma_so_thue: '0111111111',
    nguoi_lien_he: 'Phạm Thị D',
    ghi_chu: 'Dịch vụ vận chuyển nhanh chóng, uy tín',
    trang_thai: true,
    nguoi_tao_id: 'user-1',
    created_at: new Date('2024-02-10').toISOString(),
    updated_at: new Date('2024-02-10').toISOString(),
  },
  {
    id: 'dt-ncc-5',
    ma: 'NCC005',
    ten: 'Công ty Phần mềm JKL',
    loai: 'nha_cung_cap',
    nhom_doi_tac_id: 'ncc-5',
    email: 'support@jkl-software.vn',
    dien_thoai: '0922222222',
    dia_chi: '654 Đường JKL, Quận 2, TP.HCM',
    ma_so_thue: '0222222222',
    nguoi_lien_he: 'Hoàng Văn E',
    ghi_chu: 'Nhà cung cấp phần mềm ERP',
    trang_thai: false,
    nguoi_tao_id: 'user-2',
    created_at: new Date('2024-02-15').toISOString(),
    updated_at: new Date('2024-03-01').toISOString(),
  },
  // Khách hàng
  {
    id: 'dt-kh-1',
    ma: 'KH001',
    ten: 'Công ty Cổ phần Đầu tư ABC',
    loai: 'khach_hang',
    nhom_doi_tac_id: 'kh-1',
    email: 'contact@abc-investment.vn',
    dien_thoai: '0933333333',
    dia_chi: '111 Đường ABC, Quận 1, TP.HCM',
    ma_so_thue: '0333333333',
    nguoi_lien_he: 'Võ Thị F',
    ghi_chu: 'Khách hàng VIP, đặt hàng thường xuyên',
    trang_thai: true,
    nguoi_tao_id: 'user-1',
    created_at: new Date('2024-01-10').toISOString(),
    updated_at: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'dt-kh-2',
    ma: 'KH002',
    ten: 'Cửa hàng Bán lẻ MNO',
    loai: 'khach_hang',
    nhom_doi_tac_id: 'kh-2',
    email: 'sales@mno-retail.vn',
    dien_thoai: '0944444444',
    dia_chi: '222 Đường MNO, Quận 10, TP.HCM',
    ma_so_thue: '0444444444',
    nguoi_lien_he: 'Đặng Văn G',
    ghi_chu: 'Khách hàng bán lẻ, đơn hàng nhỏ',
    trang_thai: true,
    nguoi_tao_id: 'user-1',
    created_at: new Date('2024-01-18').toISOString(),
    updated_at: new Date('2024-01-18').toISOString(),
  },
  {
    id: 'dt-kh-3',
    ma: 'KH003',
    ten: 'Hệ thống Đại lý PQR',
    loai: 'khach_hang',
    nhom_doi_tac_id: 'kh-3',
    email: 'info@pqr-distributor.vn',
    dien_thoai: '0955555555',
    dia_chi: '333 Đường PQR, Quận 4, TP.HCM',
    ma_so_thue: '0555555555',
    nguoi_lien_he: 'Bùi Thị H',
    ghi_chu: 'Đại lý phân phối chính thức',
    trang_thai: true,
    nguoi_tao_id: 'user-2',
    created_at: new Date('2024-02-05').toISOString(),
    updated_at: new Date('2024-02-05').toISOString(),
  },
  {
    id: 'dt-kh-4',
    ma: 'KH004',
    ten: 'Cơ quan Nhà nước STU',
    loai: 'khach_hang',
    nhom_doi_tac_id: 'kh-4',
    email: 'contact@stu-gov.vn',
    dien_thoai: '0966666666',
    dia_chi: '444 Đường STU, Quận Ba Đình, Hà Nội',
    ma_so_thue: '0666666666',
    nguoi_lien_he: 'Ngô Văn I',
    ghi_chu: 'Dự án công, hợp đồng dài hạn',
    trang_thai: true,
    nguoi_tao_id: 'user-2',
    created_at: new Date('2024-02-12').toISOString(),
    updated_at: new Date('2024-02-12').toISOString(),
  },
  {
    id: 'dt-kh-5',
    ma: 'KH005',
    ten: 'Công ty Tiềm năng VWX',
    loai: 'khach_hang',
    nhom_doi_tac_id: 'kh-5',
    email: 'info@vwx-potential.vn',
    dien_thoai: '0977777777',
    dia_chi: '555 Đường VWX, Quận 9, TP.HCM',
    ma_so_thue: '0777777777',
    nguoi_lien_he: 'Lý Thị K',
    ghi_chu: 'Khách hàng tiềm năng, đang đàm phán',
    trang_thai: true,
    nguoi_tao_id: 'user-1',
    created_at: new Date('2024-02-20').toISOString(),
    updated_at: new Date('2024-02-20').toISOString(),
  },
]

/**
 * Mock store để quản lý data trong memory
 */
class MockDoiTacStore {
  private data: DoiTac[] = [...initialMockData]

  getAll(): DoiTac[] {
    return [...this.data]
  }

  getById(id: string): DoiTac | undefined {
    return this.data.find((item) => item.id === id)
  }

  add(item: DoiTac): void {
    this.data.push(item)
  }

  update(id: string, updated: DoiTac): void {
    const index = this.data.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.data[index] = updated
    }
  }

  delete(id: string): void {
    this.data = this.data.filter((item) => item.id !== id)
  }

  reset(): void {
    this.data = [...initialMockData]
  }
}

export const mockDoiTacStore = new MockDoiTacStore()

// Export initial data để dùng khi cần
export const mockDoiTacData = initialMockData

