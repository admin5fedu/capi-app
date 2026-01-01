import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getThongTinCongTy, updateThongTinCongTy } from '@/api/thong-tin-cong-ty'
import type { ThongTinCongTyUpdate } from '@/types/thong-tin-cong-ty'
import { toast } from 'sonner'

// Query keys
export const thongTinCongTyKeys = {
  all: ['thong-tin-cong-ty'] as const,
  detail: () => [...thongTinCongTyKeys.all, 'detail'] as const,
}

/**
 * Hook: Lấy thông tin công ty
 */
export function useThongTinCongTy() {
  return useQuery({
    queryKey: thongTinCongTyKeys.detail(),
    queryFn: getThongTinCongTy,
  })
}

/**
 * Hook: Cập nhật thông tin công ty
 */
export function useUpdateThongTinCongTy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ThongTinCongTyUpdate) => updateThongTinCongTy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: thongTinCongTyKeys.all })
      toast.success('Cập nhật thông tin công ty thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

