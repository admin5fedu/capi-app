import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNhomDoiTacListService,
  getNhomDoiTacByIdService,
  createNhomDoiTacService,
  updateNhomDoiTacService,
  deleteNhomDoiTacService,
  searchNhomDoiTacService,
} from '../services/nhom-doi-tac-service'
import type { NhomDoiTacInsert, NhomDoiTacUpdate } from '@/types/nhom-doi-tac'
import { toast } from 'sonner'

// Query keys
export const nhomDoiTacKeys = {
  all: ['nhom-doi-tac'] as const,
  lists: () => [...nhomDoiTacKeys.all, 'list'] as const,
  list: (loai?: 'nha_cung_cap' | 'khach_hang') =>
    [...nhomDoiTacKeys.lists(), loai] as const,
  details: () => [...nhomDoiTacKeys.all, 'detail'] as const,
  detail: (id: string) => [...nhomDoiTacKeys.details(), id] as const,
  search: (keyword: string) => [...nhomDoiTacKeys.all, 'search', keyword] as const,
}

/**
 * Hook: Lấy danh sách nhóm đối tác
 */
export function useNhomDoiTacList(loai?: 'nha_cung_cap' | 'khach_hang') {
  return useQuery({
    queryKey: nhomDoiTacKeys.list(loai),
    queryFn: () => getNhomDoiTacListService(loai),
  })
}

/**
 * Hook: Lấy thông tin một nhóm đối tác theo ID
 */
export function useNhomDoiTacById(id: string | null) {
  return useQuery({
    queryKey: nhomDoiTacKeys.detail(id!),
    queryFn: () => getNhomDoiTacByIdService(id!),
    enabled: !!id,
  })
}

/**
 * Hook: Tìm kiếm nhóm đối tác
 */
export function useSearchNhomDoiTac(keyword: string) {
  return useQuery({
    queryKey: nhomDoiTacKeys.search(keyword),
    queryFn: () => searchNhomDoiTacService(keyword),
    enabled: keyword.length > 0,
  })
}

/**
 * Hook: Tạo mới nhóm đối tác
 */
export function useCreateNhomDoiTac() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: NhomDoiTacInsert) => createNhomDoiTacService(data),
    onSuccess: (_, variables) => {
      // Invalidate cả hai tab
      queryClient.invalidateQueries({ queryKey: nhomDoiTacKeys.lists() })
      queryClient.invalidateQueries({ queryKey: nhomDoiTacKeys.list(variables.hang_muc) })
      toast.success('Tạo nhóm đối tác thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Cập nhật nhóm đối tác
 */
export function useUpdateNhomDoiTac() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NhomDoiTacUpdate }) =>
      updateNhomDoiTacService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: nhomDoiTacKeys.all })
      queryClient.invalidateQueries({ queryKey: nhomDoiTacKeys.detail(variables.id) })
      toast.success('Cập nhật nhóm đối tác thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Xóa nhóm đối tác
 */
export function useDeleteNhomDoiTac() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteNhomDoiTacService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nhomDoiTacKeys.all })
      toast.success('Xóa nhóm đối tác thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

