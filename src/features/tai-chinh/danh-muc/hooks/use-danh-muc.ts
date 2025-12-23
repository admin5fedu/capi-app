import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDanhMucListService,
  getDanhMucByLoaiService,
  getDanhMucChildrenService,
  getDanhMucByIdService,
  createDanhMucService,
  updateDanhMucService,
  deleteDanhMucService,
  deleteDanhMucCascadeService,
  deleteAllDanhMucService,
  searchDanhMucService,
  checkDanhMucHasChildrenService,
} from '../services/danh-muc-service'
import type { DanhMucInsert, DanhMucUpdate } from '@/types/danh-muc'
import { toast } from 'sonner'

// Query keys
export const danhMucKeys = {
  all: ['danh-muc'] as const,
  lists: () => [...danhMucKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...danhMucKeys.lists(), filters] as const,
  byLoai: (loai: string) => [...danhMucKeys.all, 'by-loai', loai] as const,
  children: (parentId: string) => [...danhMucKeys.all, 'children', parentId] as const,
  details: () => [...danhMucKeys.all, 'detail'] as const,
  detail: (id: string) => [...danhMucKeys.details(), id] as const,
  search: (keyword: string) => [...danhMucKeys.all, 'search', keyword] as const,
  hasChildren: (id: string) => [...danhMucKeys.all, 'has-children', id] as const,
}

/**
 * Hook: Lấy danh sách danh mục
 */
export function useDanhMucList() {
  return useQuery({
    queryKey: danhMucKeys.list(),
    queryFn: getDanhMucListService,
  })
}

/**
 * Hook: Lấy danh sách danh mục theo loại
 */
export function useDanhMucByLoai(loai: string) {
  return useQuery({
    queryKey: danhMucKeys.byLoai(loai),
    queryFn: () => getDanhMucByLoaiService(loai),
    enabled: !!loai,
  })
}

/**
 * Hook: Lấy danh sách danh mục con
 */
export function useDanhMucChildren(parentId: string | null) {
  return useQuery({
    queryKey: danhMucKeys.children(parentId!),
    queryFn: () => getDanhMucChildrenService(parentId!),
    enabled: !!parentId,
  })
}

/**
 * Hook: Lấy thông tin một danh mục theo ID
 */
export function useDanhMucById(id: string | null) {
  return useQuery({
    queryKey: danhMucKeys.detail(id!),
    queryFn: () => getDanhMucByIdService(id!),
    enabled: !!id,
  })
}

/**
 * Hook: Kiểm tra danh mục có danh mục con không
 */
export function useCheckDanhMucHasChildren(id: string | null) {
  return useQuery({
    queryKey: danhMucKeys.hasChildren(id!),
    queryFn: () => checkDanhMucHasChildrenService(id!),
    enabled: !!id,
  })
}

/**
 * Hook: Tìm kiếm danh mục
 */
export function useSearchDanhMuc(keyword: string) {
  return useQuery({
    queryKey: danhMucKeys.search(keyword),
    queryFn: () => searchDanhMucService(keyword),
    enabled: keyword.length > 0,
  })
}

/**
 * Hook: Tạo mới danh mục
 */
export function useCreateDanhMuc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DanhMucInsert) => createDanhMucService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: danhMucKeys.all })
      toast.success('Tạo danh mục thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Cập nhật danh mục
 */
export function useUpdateDanhMuc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DanhMucUpdate }) =>
      updateDanhMucService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: danhMucKeys.all })
      queryClient.invalidateQueries({ queryKey: danhMucKeys.detail(variables.id) })
      toast.success('Cập nhật danh mục thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Xóa danh mục
 */
export function useDeleteDanhMuc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDanhMucService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: danhMucKeys.all })
      toast.success('Xóa danh mục thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Xóa danh mục và tất cả danh mục con (cascade delete)
 */
export function useDeleteDanhMucCascade() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDanhMucCascadeService(id),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: danhMucKeys.all })
      if (result.deletedChildren > 0) {
        toast.success(`Đã xóa danh mục và ${result.deletedChildren} danh mục con`)
      } else {
        toast.success('Xóa danh mục thành công')
      }
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

/**
 * Hook: Xóa tất cả danh mục (dùng cho migration)
 */
export function useDeleteAllDanhMuc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteAllDanhMucService(),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: danhMucKeys.all })
      toast.success(`Đã xóa ${result.deletedCount} danh mục`)
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

