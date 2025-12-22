import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getPhanQuyenMatrix, 
  updatePhanQuyenItem, 
  updatePhanQuyenMatrix,
  getPhanQuyenVaiTroMatrix,
  updatePhanQuyenVaiTroMatrix,
} from '../services'
import { getVaiTroList } from '@/api/vai-tro'
import { toast } from 'sonner'
import type { PhanQuyenMatrix, PhanQuyenVaiTroMatrix } from '@/types/phan-quyen'

/**
 * Hook để lấy danh sách vai trò
 */
export function useVaiTroList() {
  return useQuery({
    queryKey: ['vai-tro-list'],
    queryFn: getVaiTroList,
  })
}

/**
 * Hook để lấy matrix phân quyền cho một vai trò
 */
export function usePhanQuyenMatrix(vaiTroId: string | null) {
  return useQuery({
    queryKey: ['phan-quyen-matrix', vaiTroId],
    queryFn: () => getPhanQuyenMatrix(vaiTroId!),
    enabled: !!vaiTroId,
  })
}

/**
 * Hook để cập nhật một phân quyền
 */
export function useUpdatePhanQuyen() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      vaiTroId,
      module,
      action,
      allowed,
    }: {
      vaiTroId: string
      module: string
      action: string
      allowed: boolean
    }) => updatePhanQuyenItem(vaiTroId, module, action, allowed),
    onSuccess: (_, variables) => {
      // Invalidate và refetch matrix
      queryClient.invalidateQueries({ queryKey: ['phan-quyen-matrix', variables.vaiTroId] })
      toast.success('Cập nhật phân quyền thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message || 'Không thể cập nhật phân quyền'}`)
    },
  })
}

/**
 * Hook để cập nhật toàn bộ matrix phân quyền
 */
export function useUpdatePhanQuyenMatrix() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ vaiTroId, matrix }: { vaiTroId: string; matrix: PhanQuyenMatrix[] }) =>
      updatePhanQuyenMatrix(vaiTroId, matrix),
    onSuccess: (_, variables) => {
      // Invalidate và refetch matrix
      queryClient.invalidateQueries({ queryKey: ['phan-quyen-matrix', variables.vaiTroId] })
      toast.success('Cập nhật phân quyền thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message || 'Không thể cập nhật phân quyền'}`)
    },
  })
}

/**
 * Hook để lấy ma trận phân quyền theo module (vai trò x quyền)
 */
export function usePhanQuyenVaiTroMatrix(module: string | null) {
  return useQuery({
    queryKey: ['phan-quyen-vai-tro-matrix', module],
    queryFn: () => getPhanQuyenVaiTroMatrix(module!),
    enabled: !!module,
  })
}

/**
 * Hook để cập nhật ma trận phân quyền theo module
 */
export function useUpdatePhanQuyenVaiTroMatrix() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ module, matrix }: { module: string; matrix: PhanQuyenVaiTroMatrix[] }) =>
      updatePhanQuyenVaiTroMatrix(module, matrix),
    onSuccess: (_, variables) => {
      // Invalidate và refetch matrix
      queryClient.invalidateQueries({ queryKey: ['phan-quyen-vai-tro-matrix', variables.module] })
      queryClient.invalidateQueries({ queryKey: ['phan-quyen-matrix'] })
      toast.success('Cập nhật phân quyền thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message || 'Không thể cập nhật phân quyền'}`)
    },
  })
}

