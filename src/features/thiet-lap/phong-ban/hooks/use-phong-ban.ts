import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getPhongBanList,
  getPhongBanById,
  createPhongBan,
  updatePhongBan,
  deletePhongBan,
  searchPhongBan,
  checkPhongBanInUse,
} from '../services/phong-ban-service'
import type { PhongBanInsert, PhongBanUpdate } from '@/types/phong-ban'
import { toast } from 'sonner'

// Query keys
export const phongBanKeys = {
  all: ['phong-ban'] as const,
  lists: () => [...phongBanKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...phongBanKeys.lists(), filters] as const,
  details: () => [...phongBanKeys.all, 'detail'] as const,
  detail: (id: string) => [...phongBanKeys.details(), id] as const,
  search: (keyword: string) => [...phongBanKeys.all, 'search', keyword] as const,
  inUse: (id: string) => [...phongBanKeys.all, 'in-use', id] as const,
}

/**
 * Hook: Lấy danh sách phòng ban
 */
export function usePhongBanList() {
  return useQuery({
    queryKey: phongBanKeys.list(),
    queryFn: getPhongBanList,
  })
}

/**
 * Hook: Lấy thông tin một phòng ban theo ID
 */
export function usePhongBanById(id: string | null) {
  return useQuery({
    queryKey: phongBanKeys.detail(id!),
    queryFn: () => getPhongBanById(id!),
    enabled: !!id,
  })
}

/**
 * Hook: Tìm kiếm phòng ban
 */
export function useSearchPhongBan(keyword: string) {
  return useQuery({
    queryKey: phongBanKeys.search(keyword),
    queryFn: () => searchPhongBan(keyword),
    enabled: keyword.length > 0,
  })
}

/**
 * Hook: Kiểm tra phòng ban có đang được sử dụng
 */
export function useCheckPhongBanInUse(id: string | null) {
  return useQuery({
    queryKey: phongBanKeys.inUse(id!),
    queryFn: () => checkPhongBanInUse(id!),
    enabled: !!id,
  })
}

/**
 * Hook: Tạo mới phòng ban
 */
export function useCreatePhongBan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PhongBanInsert) => createPhongBan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: phongBanKeys.all })
      toast.success('Tạo phòng ban thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Cập nhật phòng ban
 */
export function useUpdatePhongBan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PhongBanUpdate }) =>
      updatePhongBan(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: phongBanKeys.all })
      queryClient.invalidateQueries({ queryKey: phongBanKeys.detail(variables.id) })
      toast.success('Cập nhật phòng ban thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Xóa phòng ban
 */
export function useDeletePhongBan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deletePhongBan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: phongBanKeys.all })
      // Invalidate cả query người dùng vì có thể có thay đổi
      queryClient.invalidateQueries({ queryKey: ['nguoi-dung'] })
      toast.success('Xóa phòng ban thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

