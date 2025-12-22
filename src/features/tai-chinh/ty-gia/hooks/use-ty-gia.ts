import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTyGiaListService,
  getTyGiaByIdService,
  getTyGiaByNgayApDungService,
  createTyGiaService,
  updateTyGiaService,
  deleteTyGiaService,
  searchTyGiaService,
} from '../services/ty-gia-service'
import type { TyGiaInsert, TyGiaUpdate } from '@/types/ty-gia'
import { toast } from 'sonner'

// Query keys
export const tyGiaKeys = {
  all: ['ty-gia'] as const,
  lists: () => [...tyGiaKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...tyGiaKeys.lists(), filters] as const,
  details: () => [...tyGiaKeys.all, 'detail'] as const,
  detail: (id: number) => [...tyGiaKeys.details(), id] as const,
  byNgayApDung: (ngayApDung: string) => [...tyGiaKeys.all, 'by-ngay-ap-dung', ngayApDung] as const,
  search: (keyword: string) => [...tyGiaKeys.all, 'search', keyword] as const,
}

/**
 * Hook: Lấy danh sách tỷ giá
 */
export function useTyGiaList() {
  return useQuery({
    queryKey: tyGiaKeys.list(),
    queryFn: getTyGiaListService,
  })
}

/**
 * Hook: Lấy thông tin một tỷ giá theo ID
 */
export function useTyGiaById(id: number | null) {
  return useQuery({
    queryKey: tyGiaKeys.detail(id!),
    queryFn: () => getTyGiaByIdService(id!),
    enabled: !!id,
  })
}

/**
 * Hook: Lấy tỷ giá theo ngày áp dụng
 */
export function useTyGiaByNgayApDung(ngayApDung: string | null) {
  return useQuery({
    queryKey: tyGiaKeys.byNgayApDung(ngayApDung!),
    queryFn: () => getTyGiaByNgayApDungService(ngayApDung!),
    enabled: !!ngayApDung,
  })
}

/**
 * Hook: Tìm kiếm tỷ giá
 */
export function useSearchTyGia(keyword: string) {
  return useQuery({
    queryKey: tyGiaKeys.search(keyword),
    queryFn: () => searchTyGiaService(keyword),
    enabled: keyword.length > 0,
  })
}

/**
 * Hook: Tạo mới tỷ giá
 */
export function useCreateTyGia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TyGiaInsert) => createTyGiaService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tyGiaKeys.all })
      toast.success('Tạo tỷ giá thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Cập nhật tỷ giá
 */
export function useUpdateTyGia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TyGiaUpdate }) =>
      updateTyGiaService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: tyGiaKeys.all })
      queryClient.invalidateQueries({ queryKey: tyGiaKeys.detail(variables.id) })
      toast.success('Cập nhật tỷ giá thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Xóa tỷ giá
 */
export function useDeleteTyGia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteTyGiaService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tyGiaKeys.all })
      toast.success('Xóa tỷ giá thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

