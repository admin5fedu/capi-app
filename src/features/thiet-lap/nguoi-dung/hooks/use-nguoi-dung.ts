import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNguoiDungListWithVaiTro,
  getNguoiDungById,
  createNguoiDung,
  updateNguoiDung,
  updateNguoiDungAvatar,
  deleteNguoiDung,
  searchNguoiDung,
  getNguoiDungByVaiTroId,
  getNguoiDungByPhongBanId,
} from '../services/nguoi-dung-service'
import { getVaiTroList } from '@/api/vai-tro'
import type { NguoiDungInsert, NguoiDungUpdate, BoLocNguoiDung } from '../types'
import { toast } from 'sonner'

// Query keys
export const nguoiDungKeys = {
  all: ['nguoi-dung'] as const,
  lists: () => [...nguoiDungKeys.all, 'list'] as const,
  list: (filters?: BoLocNguoiDung) => [...nguoiDungKeys.lists(), filters] as const,
  details: () => [...nguoiDungKeys.all, 'detail'] as const,
  detail: (id: string) => [...nguoiDungKeys.details(), id] as const,
  search: (keyword: string) => [...nguoiDungKeys.all, 'search', keyword] as const,
  byVaiTro: (vaiTroId: string) => [...nguoiDungKeys.all, 'by-vai-tro', vaiTroId] as const,
  byPhongBan: (phongBanId: string) => [...nguoiDungKeys.all, 'by-phong-ban', phongBanId] as const,
}

/**
 * Hook: Lấy danh sách người dùng với filters
 */
export function useNguoiDungList(filters?: BoLocNguoiDung) {
  return useQuery({
    queryKey: nguoiDungKeys.list(filters),
    queryFn: async () => {
      // Lấy danh sách người dùng và vai trò
      const [nguoiDungData, vaiTroData] = await Promise.all([
        getNguoiDungListWithVaiTro(),
        getVaiTroList(),
      ])

      // Tạo map vai trò để tra cứu nhanh
      const vaiTroMap = new Map(vaiTroData.map((vt) => [vt.id, vt.ten_vai_tro || vt.ten]))

      // Map tên vai trò vào từng người dùng
      let data = nguoiDungData.map((item: any) => ({
        ...item,
        vai_tro: {
          id: item.vai_tro_id,
          ten: vaiTroMap.get(item.vai_tro_id) || null,
        },
      }))

      // Áp dụng filters
      if (filters) {
        // Lọc theo từ khóa tìm kiếm
        if (filters.tim_kiem) {
          const keyword = filters.tim_kiem.toLowerCase()
          data = data.filter(
            (item: any) =>
              item.ho_va_ten?.toLowerCase().includes(keyword) ||
              item.ho_ten?.toLowerCase().includes(keyword) ||
              item.email?.toLowerCase().includes(keyword) ||
              item.ten_vai_tro?.toLowerCase().includes(keyword) ||
              item.vai_tro?.ten_vai_tro?.toLowerCase().includes(keyword) ||
              item.vai_tro?.ten?.toLowerCase().includes(keyword)
          )
        }

        // Lọc theo vai trò
        if (filters.vai_tro_id) {
          data = data.filter((item: any) => item.vai_tro_id === filters.vai_tro_id)
        }

        // Lọc theo trạng thái
        if (filters.is_active !== undefined) {
          // Convert boolean filter to text comparison
          const trangThaiFilter = filters.is_active ? 'hoạt động' : 'vô hiệu hóa'
          data = data.filter((item: any) => {
            const trangThai = item.trang_thai?.toLowerCase()
            if (filters.is_active) {
              return trangThai === 'hoạt động' || trangThai === 'active' || item.is_active === true
            } else {
              return trangThai === 'vô hiệu hóa' || trangThai === 'inactive' || item.is_active === false
            }
          })
        }

        // Sắp xếp
        if (filters.sap_xep) {
          data.sort((a: any, b: any) => {
            // Map old field names to new ones
            const fieldMap: Record<string, string> = {
              'ho_ten': 'ho_va_ten',
              'created_at': 'tg_tao',
              'updated_at': 'tg_cap_nhat',
            }
            const fieldName = fieldMap[filters.sap_xep!] || filters.sap_xep!
            const aVal = a[fieldName] || a[filters.sap_xep!]
            const bVal = b[fieldName] || b[filters.sap_xep!]
            const direction = filters.huong_sap_xep === 'asc' ? 1 : -1

            if (aVal < bVal) return -1 * direction
            if (aVal > bVal) return 1 * direction
            return 0
          })
        }
      }

      return data
    },
  })
}

// Alias for backward compatibility
export const useDanhSachNguoiDung = useNguoiDungList

/**
 * Hook: Lấy thông tin một người dùng theo ID
 */
export function useNguoiDungById(id: string | null) {
  return useQuery({
    queryKey: nguoiDungKeys.detail(id!),
    queryFn: () => getNguoiDungById(id!),
    enabled: !!id,
  })
}

// Alias for backward compatibility
export const useChiTietNguoiDung = useNguoiDungById

/**
 * Hook: Tìm kiếm người dùng
 */
export function useTimKiemNguoiDung(keyword: string) {
  return useQuery({
    queryKey: nguoiDungKeys.search(keyword),
    queryFn: () => searchNguoiDung(keyword),
    enabled: keyword.length > 0,
  })
}

/**
 * Hook: Tạo mới người dùng
 */
export function useCreateNguoiDung() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: NguoiDungInsert) => createNguoiDung(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nguoiDungKeys.all })
      toast.success('Tạo người dùng thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

// Alias for backward compatibility
export const useTaoMoiNguoiDung = useCreateNguoiDung

/**
 * Hook: Cập nhật người dùng
 */
export function useUpdateNguoiDung() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NguoiDungUpdate }) =>
      updateNguoiDung(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: nguoiDungKeys.all })
      queryClient.invalidateQueries({ queryKey: nguoiDungKeys.detail(variables.id) })
      toast.success('Cập nhật người dùng thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

// Alias for backward compatibility
export const useCapNhatNguoiDung = useUpdateNguoiDung

/**
 * Hook: Xóa người dùng
 */
export function useDeleteNguoiDung() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteNguoiDung(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nguoiDungKeys.all })
      toast.success('Xóa người dùng thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}

// Alias for backward compatibility
export const useXoaNguoiDung = useDeleteNguoiDung

/**
 * Hook: Lấy danh sách người dùng theo vai trò ID
 */
export function useNguoiDungByVaiTroId(vaiTroId: string | null) {
  return useQuery({
    queryKey: nguoiDungKeys.byVaiTro(vaiTroId!),
    queryFn: () => getNguoiDungByVaiTroId(vaiTroId!),
    enabled: !!vaiTroId,
  })
}

/**
 * Hook: Lấy danh sách người dùng theo phòng ban ID
 */
export function useNguoiDungByPhongBanId(phongBanId: string | null) {
  return useQuery({
    queryKey: nguoiDungKeys.byPhongBan(phongBanId!),
    queryFn: () => getNguoiDungByPhongBanId(phongBanId!),
    enabled: !!phongBanId,
  })
}

/**
 * Hook: Cập nhật avatar cho người dùng
 */
export function useUpdateNguoiDungAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, avatarUrl }: { id: string; avatarUrl: string }) =>
      updateNguoiDungAvatar(id, avatarUrl),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: nguoiDungKeys.all })
      queryClient.invalidateQueries({ queryKey: nguoiDungKeys.detail(variables.id) })
      toast.success('Cập nhật avatar thành công')
    },
    onError: (error: Error) => {
      toast.error(`Lỗi: ${error.message}`)
    },
  })
}
