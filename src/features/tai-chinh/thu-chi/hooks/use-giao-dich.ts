import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getGiaoDichListService,
  getGiaoDichByIdService,
  createGiaoDichService,
  updateGiaoDichService,
  deleteGiaoDichService,
  searchGiaoDichService,
} from '../services/giao-dich-service'
import type { GiaoDichInsert, GiaoDichUpdate } from '@/types/giao-dich'
import { toast } from 'sonner'

// Query keys
export const giaoDichKeys = {
  all: ['giao-dich'] as const,
  lists: () => [...giaoDichKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...giaoDichKeys.lists(), filters] as const,
  details: () => [...giaoDichKeys.all, 'detail'] as const,
  detail: (id: number) => [...giaoDichKeys.details(), id] as const,
  search: (keyword: string) => [...giaoDichKeys.all, 'search', keyword] as const,
}

/**
 * Hook: Lấy danh sách giao dịch
 */
export function useGiaoDichList() {
  return useQuery({
    queryKey: giaoDichKeys.list(),
    queryFn: getGiaoDichListService,
  })
}

/**
 * Hook: Lấy thông tin một giao dịch theo ID
 */
export function useGiaoDichById(id: number | null) {
  return useQuery({
    queryKey: giaoDichKeys.detail(id!),
    queryFn: () => getGiaoDichByIdService(id!),
    enabled: !!id,
  })
}

/**
 * Hook: Tìm kiếm giao dịch
 */
export function useSearchGiaoDich(keyword: string) {
  return useQuery({
    queryKey: giaoDichKeys.search(keyword),
    queryFn: () => searchGiaoDichService(keyword),
    enabled: keyword.length > 0,
  })
}

/**
 * Hook: Tạo mới giao dịch
 */
export function useCreateGiaoDich() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GiaoDichInsert) => createGiaoDichService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: giaoDichKeys.all })
      toast.success('Tạo giao dịch thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Cập nhật giao dịch
 */
export function useUpdateGiaoDich() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GiaoDichUpdate }) =>
      updateGiaoDichService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: giaoDichKeys.all })
      queryClient.invalidateQueries({ queryKey: giaoDichKeys.detail(variables.id) })
      toast.success('Cập nhật giao dịch thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Xóa giao dịch
 */
export function useDeleteGiaoDich() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteGiaoDichService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: giaoDichKeys.all })
      toast.success('Xóa giao dịch thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

