import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getVaiTroList,
  getVaiTroById,
  createVaiTro,
  updateVaiTro,
  deleteVaiTro,
  searchVaiTro,
  checkVaiTroInUse,
} from '../services/vai-tro-service'
import type { VaiTroInsert, VaiTroUpdate } from '@/types/vai-tro'
import { toast } from 'sonner'

// Query keys
export const vaiTroKeys = {
  all: ['vai-tro'] as const,
  lists: () => [...vaiTroKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...vaiTroKeys.lists(), filters] as const,
  details: () => [...vaiTroKeys.all, 'detail'] as const,
  detail: (id: string) => [...vaiTroKeys.details(), id] as const,
  search: (keyword: string) => [...vaiTroKeys.all, 'search', keyword] as const,
  inUse: (id: string) => [...vaiTroKeys.all, 'in-use', id] as const,
}

/**
 * Hook: Lấy danh sách vai trò
 */
export function useVaiTroList() {
  return useQuery({
    queryKey: vaiTroKeys.list(),
    queryFn: getVaiTroList,
  })
}

/**
 * Hook: Lấy thông tin một vai trò theo ID
 */
export function useVaiTroById(id: string | null) {
  return useQuery({
    queryKey: vaiTroKeys.detail(id!),
    queryFn: () => getVaiTroById(id!),
    enabled: !!id,
  })
}

/**
 * Hook: Tìm kiếm vai trò
 */
export function useSearchVaiTro(keyword: string) {
  return useQuery({
    queryKey: vaiTroKeys.search(keyword),
    queryFn: () => searchVaiTro(keyword),
    enabled: keyword.length > 0,
  })
}

/**
 * Hook: Kiểm tra vai trò có đang được sử dụng
 */
export function useCheckVaiTroInUse(id: string | null) {
  return useQuery({
    queryKey: vaiTroKeys.inUse(id!),
    queryFn: () => checkVaiTroInUse(id!),
    enabled: !!id,
  })
}

/**
 * Hook: Tạo mới vai trò
 */
export function useCreateVaiTro() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: VaiTroInsert) => createVaiTro(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vaiTroKeys.all })
      toast.success('Tạo vai trò thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Cập nhật vai trò
 */
export function useUpdateVaiTro() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VaiTroUpdate }) =>
      updateVaiTro(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vaiTroKeys.all })
      queryClient.invalidateQueries({ queryKey: vaiTroKeys.detail(variables.id) })
      toast.success('Cập nhật vai trò thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Xóa vai trò
 */
export function useDeleteVaiTro() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteVaiTro(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vaiTroKeys.all })
      // Invalidate cả query người dùng vì có thể có thay đổi
      queryClient.invalidateQueries({ queryKey: ['nguoi-dung'] })
      toast.success('Xóa vai trò thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

