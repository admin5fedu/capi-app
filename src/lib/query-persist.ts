/**
 * Query Persistence Configuration
 * Lưu cache của TanStack Query vào localStorage để tránh refetch khi quay lại tab
 */

import { PersistQueryClientOptions } from '@tanstack/query-persist-client-core'

/**
 * Cấu hình persist cho QueryClient
 * Chỉ persist các query keys quan trọng để tránh localStorage quá lớn
 */
export const persistConfig: Omit<PersistQueryClientOptions, 'queryClient'> = {
  persister: undefined, // Sẽ được set trong main.tsx sau khi import createSyncStoragePersister
  maxAge: 24 * 60 * 60 * 1000, // 24 giờ
  buster: '', // Version buster - thay đổi để invalidate cache khi cần
  dehydrateOptions: {
    // Chỉ persist các query có meta.persist = true
    shouldDehydrateQuery: (query) => {
      // Persist tất cả queries trừ những query có meta.skipPersist = true
      return query.meta?.skipPersist !== true
    },
  },
  serializeOptions: {
    // Sử dụng JSON.stringify/parse mặc định
  },
}

/**
 * Query keys nên được persist
 * Các query này sẽ được lưu vào localStorage
 */
export const PERSIST_QUERY_KEYS = [
  'nguoi-dung',
  'vai-tro',
  'phong-ban',
  'tai-khoan',
  'danh-muc',
  'doi-tac',
  'nhom-doi-tac',
  'ty-gia',
] as const

/**
 * Query keys KHÔNG nên được persist (quá lớn hoặc thay đổi liên tục)
 */
export const SKIP_PERSIST_QUERY_KEYS = [
  'giao-dich', // Có thể có nhiều dữ liệu
  'bao-cao', // Dữ liệu thay đổi theo thời gian
] as const

