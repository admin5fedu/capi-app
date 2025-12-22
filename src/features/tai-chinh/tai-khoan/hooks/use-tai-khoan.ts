import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTaiKhoanListService,
  getTaiKhoanByIdService,
  createTaiKhoanService,
  updateTaiKhoanService,
  deleteTaiKhoanService,
  searchTaiKhoanService,
} from '../services/tai-khoan-service'
import type { TaiKhoanInsert, TaiKhoanUpdate } from '@/types/tai-khoan'
import { toast } from 'sonner'

// Query keys
export const taiKhoanKeys = {
  all: ['tai-khoan'] as const,
  lists: () => [...taiKhoanKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...taiKhoanKeys.lists(), filters] as const,
  details: () => [...taiKhoanKeys.all, 'detail'] as const,
  detail: (id: string) => [...taiKhoanKeys.details(), id] as const,
  search: (keyword: string) => [...taiKhoanKeys.all, 'search', keyword] as const,
}

/**
 * Hook: Lấy danh sách tài khoản
 */
export function useTaiKhoanList() {
  return useQuery({
    queryKey: taiKhoanKeys.list(),
    queryFn: getTaiKhoanListService,
  })
}

/**
 * Hook: Lấy thông tin một tài khoản theo ID
 */
export function useTaiKhoanById(id: string | null) {
  return useQuery({
    queryKey: taiKhoanKeys.detail(id!),
    queryFn: () => getTaiKhoanByIdService(id!),
    enabled: !!id,
  })
}

/**
 * Hook: Tìm kiếm tài khoản
 */
export function useSearchTaiKhoan(keyword: string) {
  return useQuery({
    queryKey: taiKhoanKeys.search(keyword),
    queryFn: () => searchTaiKhoanService(keyword),
    enabled: keyword.length > 0,
  })
}

/**
 * Hook: Tạo mới tài khoản
 */
export function useCreateTaiKhoan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TaiKhoanInsert) => createTaiKhoanService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taiKhoanKeys.all })
      toast.success('Tạo tài khoản thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Cập nhật tài khoản
 */
export function useUpdateTaiKhoan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaiKhoanUpdate }) =>
      updateTaiKhoanService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taiKhoanKeys.all })
      queryClient.invalidateQueries({ queryKey: taiKhoanKeys.detail(variables.id) })
      toast.success('Cập nhật tài khoản thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Xóa tài khoản
 */
export function useDeleteTaiKhoan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTaiKhoanService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taiKhoanKeys.all })
      toast.success('Xóa tài khoản thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

