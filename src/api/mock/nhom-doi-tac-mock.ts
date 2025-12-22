import type { NhomDoiTac } from '@/types/nhom-doi-tac'

/**
 * Mock data store cho module Nhóm đối tác
 */

// Mock data ban đầu
const initialMockData: NhomDoiTac[] = [
  // Nhà cung cấp
  {
    id: 'ncc-1',
    ten: 'Nhà cung cấp Vật liệu xây dựng',
    loai: 'nha_cung_cap',
    mo_ta: 'Nhà cung cấp các loại vật liệu xây dựng: xi măng, sắt thép, gạch, cát...',
    trang_thai: true,
    nguoi_tao_id: 'user-1',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'ncc-2',
    ten: 'Nhà cung cấp Thiết bị văn phòng',
    loai: 'nha_cung_cap',
    mo_ta: 'Cung cấp máy tính, máy in, bàn ghế, thiết bị văn phòng phẩm',
    trang_thai: true,
    nguoi_tao_id: 'user-1',
    created_at: new Date('2024-01-20').toISOString(),
    updated_at: new Date('2024-01-20').toISOString(),
  },
  {
    id: 'ncc-3',
    ten: 'Nhà cung cấp Dịch vụ Marketing',
    loai: 'nha_cung_cap',
    mo_ta: 'Cung cấp dịch vụ quảng cáo, thiết kế, content marketing',
    trang_thai: true,
    nguoi_tao_id: 'user-2',
    created_at: new Date('2024-02-01').toISOString(),
    updated_at: new Date('2024-02-01').toISOString(),
  },
  {
    id: 'ncc-4',
    ten: 'Nhà cung cấp Vận chuyển',
    loai: 'nha_cung_cap',
    mo_ta: 'Dịch vụ vận chuyển hàng hóa nội địa và quốc tế',
    trang_thai: true,
    nguoi_tao_id: 'user-1',
    created_at: new Date('2024-02-10').toISOString(),
    updated_at: new Date('2024-02-10').toISOString(),
  },
  {
    id: 'ncc-5',
    ten: 'Nhà cung cấp Phần mềm',
    loai: 'nha_cung_cap',
    mo_ta: 'Cung cấp các giải pháp phần mềm quản lý, ERP, CRM',
    trang_thai: false,
    nguoi_tao_id: 'user-2',
    created_at: new Date('2024-02-15').toISOString(),
    updated_at: new Date('2024-03-01').toISOString(),
  },
  // Khách hàng
  {
    id: 'kh-1',
    ten: 'Khách hàng Doanh nghiệp lớn',
    loai: 'khach_hang',
    mo_ta: 'Nhóm khách hàng là các doanh nghiệp lớn, đặt hàng thường xuyên với giá trị cao',
    trang_thai: true,
    nguoi_tao_id: 'user-1',
    created_at: new Date('2024-01-10').toISOString(),
    updated_at: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'kh-2',
    ten: 'Khách hàng Bán lẻ',
    loai: 'khach_hang',
    mo_ta: 'Khách hàng mua lẻ, cá nhân, đơn hàng nhỏ lẻ',
    trang_thai: true,
    nguoi_tao_id: 'user-1',
    created_at: new Date('2024-01-18').toISOString(),
    updated_at: new Date('2024-01-18').toISOString(),
  },
  {
    id: 'kh-3',
    ten: 'Khách hàng Đại lý',
    loai: 'khach_hang',
    mo_ta: 'Hệ thống đại lý phân phối sản phẩm, hợp đồng dài hạn',
    trang_thai: true,
    nguoi_tao_id: 'user-2',
    created_at: new Date('2024-02-05').toISOString(),
    updated_at: new Date('2024-02-05').toISOString(),
  },
  {
    id: 'kh-4',
    ten: 'Khách hàng Chính phủ',
    loai: 'khach_hang',
    mo_ta: 'Các cơ quan nhà nước, dự án công',
    trang_thai: true,
    nguoi_tao_id: 'user-2',
    created_at: new Date('2024-02-12').toISOString(),
    updated_at: new Date('2024-02-12').toISOString(),
  },
  {
    id: 'kh-5',
    ten: 'Khách hàng Tiềm năng',
    loai: 'khach_hang',
    mo_ta: 'Nhóm khách hàng có tiềm năng, đang trong quá trình chốt hợp đồng',
    trang_thai: true,
    nguoi_tao_id: 'user-1',
    created_at: new Date('2024-02-20').toISOString(),
    updated_at: new Date('2024-02-20').toISOString(),
  },
]

/**
 * Mock store để quản lý data trong memory
 */
class MockNhomDoiTacStore {
  private data: NhomDoiTac[] = [...initialMockData]

  getAll(): NhomDoiTac[] {
    return [...this.data]
  }

  getById(id: string): NhomDoiTac | undefined {
    return this.data.find((item) => item.id === id)
  }

  add(item: NhomDoiTac): void {
    this.data.push(item)
  }

  update(id: string, updated: NhomDoiTac): void {
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

export const mockNhomDoiTacStore = new MockNhomDoiTacStore()

// Export initial data để dùng khi cần
export const mockNhomDoiTacData = initialMockData

