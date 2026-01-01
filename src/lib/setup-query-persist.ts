/**
 * Setup Query Persistence
 * Tách riêng để tránh lỗi Vite khi packages chưa được cài đặt
 */

import type { QueryClient } from '@tanstack/react-query'

/**
 * Setup query persistence với localStorage
 * Chỉ chạy nếu packages đã được cài đặt
 */
export async function setupQueryPersistence(queryClient: QueryClient): Promise<void> {
  try {
    // Dynamic import với @vite-ignore để Vite không phân tích ngay
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Packages có thể chưa được cài đặt
    const { persistQueryClient } = await import(
      // @ts-expect-error - Dynamic import, packages có thể chưa cài
      '@tanstack/query-persist-client-core'
    )
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Packages có thể chưa được cài đặt
    const { createSyncStoragePersister } = await import(
      // @ts-expect-error - Dynamic import, packages có thể chưa cài
      '@tanstack/query-sync-storage-persister'
    )

    const localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
      key: 'REACT_QUERY_OFFLINE_CACHE',
      serialize: JSON.stringify,
      deserialize: JSON.parse,
    })

    persistQueryClient({
      queryClient,
      persister: localStoragePersister,
      maxAge: 24 * 60 * 60 * 1000, // 24 giờ
      buster: 'v1', // Version buster - thay đổi để invalidate cache khi cần
      dehydrateOptions: {
        shouldDehydrateQuery: (query) => {
          // Bỏ qua các query có quá nhiều dữ liệu hoặc thay đổi liên tục
          if (query.meta?.skipPersist === true) {
            return false
          }
          
          // Không persist các query đang pending hoặc đã reject
          // Vì khi restore sẽ gây lỗi
          if (query.state.status === 'pending' || query.state.status === 'error') {
            return false
          }
          
          // Không persist các query động liên quan đến auth
          const queryKey = query.queryKey[0] as string
          if (typeof queryKey === 'string' && (
            queryKey.includes('current-auth-user') ||
            queryKey.includes('current-nguoi-dung')
          )) {
            return false
          }
          
          // Persist tất cả queries khác
          return true
        },
      },
    })
  } catch (error: any) {
    // Nếu packages chưa được cài đặt hoặc có lỗi, vẫn chạy bình thường
    // Silent fail - không log để tránh noise trong console
  }
}

