import { useQuery } from '@tanstack/react-query'
import { getBaoCaoTaiKhoanData } from '@/api/bao-cao-tai-khoan'
import type { BaoCaoTaiKhoanFilters, BaoCaoTaiKhoanData } from '@/types/bao-cao-tai-khoan'

export const baoCaoTaiKhoanKeys = {
  all: ['bao-cao-tai-khoan'] as const,
  lists: () => [...baoCaoTaiKhoanKeys.all, 'list'] as const,
  list: (filters?: BaoCaoTaiKhoanFilters) =>
    [...baoCaoTaiKhoanKeys.lists(), filters] as const,
}

/**
 * Hook: Lấy dữ liệu báo cáo tài khoản
 */
export function useBaoCaoTaiKhoan(filters: BaoCaoTaiKhoanFilters) {
  return useQuery<BaoCaoTaiKhoanData>({
    queryKey: baoCaoTaiKhoanKeys.list(filters),
    queryFn: () => getBaoCaoTaiKhoanData(filters),
    enabled: Boolean(filters.tuNgay && filters.denNgay),
    staleTime: 30000, // 30 seconds
  })
}

