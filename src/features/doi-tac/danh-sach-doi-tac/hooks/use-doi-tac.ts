import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDoiTacListService,
  getDoiTacByIdService,
  createDoiTacService,
  updateDoiTacService,
  deleteDoiTacService,
  searchDoiTacService,
} from '../services/doi-tac-service'
import type { DoiTacInsert, DoiTacUpdate } from '@/types/doi-tac'
import { toast } from 'sonner'

// Query keys
export const doiTacKeys = {
  all: ['doi-tac'] as const,
  lists: () => [...doiTacKeys.all, 'list'] as const,
  list: (loai?: 'nha_cung_cap' | 'khach_hang') =>
    [...doiTacKeys.lists(), loai] as const,
  details: () => [...doiTacKeys.all, 'detail'] as const,
  detail: (id: string) => [...doiTacKeys.details(), id] as const,
  search: (keyword: string) => [...doiTacKeys.all, 'search', keyword] as const,
}

/**
 * Hook: Lấy danh sách đối tác
 */
export function useDoiTacList(loai?: 'nha_cung_cap' | 'khach_hang') {
  return useQuery({
    queryKey: doiTacKeys.list(loai),
    queryFn: () => getDoiTacListService(loai),
  })
}

/**
 * Hook: Lấy thông tin một đối tác theo ID
 */
export function useDoiTacById(id: string | null) {
  return useQuery({
    queryKey: doiTacKeys.detail(id!),
    queryFn: () => getDoiTacByIdService(id!),
    enabled: !!id,
  })
}

/**
 * Hook: Tìm kiếm đối tác
 */
export function useSearchDoiTac(keyword: string) {
  return useQuery({
    queryKey: doiTacKeys.search(keyword),
    queryFn: () => searchDoiTacService(keyword),
    enabled: keyword.length > 0,
  })
}

/**
 * Hook: Tạo mới đối tác
 */
export function useCreateDoiTac() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DoiTacInsert) => createDoiTacService(data),
    onSuccess: () => {
      // Invalidate tất cả queries
      queryClient.invalidateQueries({ queryKey: doiTacKeys.all })
      toast.success('Tạo đối tác thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Cập nhật đối tác
 */
export function useUpdateDoiTac() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DoiTacUpdate }) =>
      updateDoiTacService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: doiTacKeys.all })
      queryClient.invalidateQueries({ queryKey: doiTacKeys.detail(variables.id) })
      toast.success('Cập nhật đối tác thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Xóa đối tác
 */
export function useDeleteDoiTac() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDoiTacService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doiTacKeys.all })
      toast.success('Xóa đối tác thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

