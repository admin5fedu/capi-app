import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/shared/components/auth'
import { SettingsProvider } from '@/shared/components/settings/settings-provider'
import { router } from './routes'
import { registerServiceWorker } from './utils/register-sw'
import { QUERY_STALE_TIME, QUERY_GC_TIME } from '@/lib/query-config'
import { setupQueryPersistence } from '@/lib/setup-query-persist'
import './index.css'

// Register Service Worker for PWA
registerServiceWorker()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data fresh trong 5 phút - không refetch khi quay lại tab nếu < 5 phút
      staleTime: QUERY_STALE_TIME.NORMAL,

      // Giữ cache 30 phút sau khi không còn component nào dùng
      // Tăng lên để tận dụng persist cache
      gcTime: QUERY_GC_TIME.DEFAULT,

      // Tắt refetch khi focus window để tránh load lại khi quay lại tab
      refetchOnWindowFocus: false,

      // Chỉ refetch khi mount nếu data đã stale
      // Với staleTime: 5 phút, chỉ refetch nếu data đã stale (> 5 phút)
      // Nếu data còn fresh, sẽ dùng cache và không refetch
      refetchOnMount: 'always', // 'always' nhưng với staleTime sẽ chỉ refetch nếu stale

      // Refetch khi mất mạng rồi kết nối lại (chỉ nếu data đã stale)
      refetchOnReconnect: 'always',

      // Giữ data cũ trong khi refetch để tránh loading state
      placeholderData: (previousData: any) => previousData,

      // Retry logic thông minh
      retry: (failureCount, error: any) => {
        // Không retry cho lỗi 4xx (client error)
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        // Retry tối đa 2 lần cho lỗi network/server
        return failureCount < 2
      },

      // Exponential backoff cho retry
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Network mode: chỉ fetch khi online
      networkMode: 'online',
    },
    mutations: {
      // Retry mutations 1 lần cho network errors
      retry: 1,
      networkMode: 'online',
    },
  },
})

// Cấu hình persist query client vào localStorage
// Giúp app không phải load lại dữ liệu ngay cả khi trình duyệt tạm thời giải phóng bộ nhớ của tab
// Lưu ý: Cần cài đặt packages trước: npm install @tanstack/query-persist-client-core @tanstack/query-sync-storage-persister
setupQueryPersistence(queryClient).catch(() => {
  // Silent fail - app vẫn chạy bình thường nếu packages chưa được cài
})

// Component wrapper để render DevTools
function App() {
  const [DevTools, setDevTools] = useState<React.ComponentType<{ initialIsOpen?: boolean }> | null>(null)

  useEffect(() => {
    if (import.meta.env.DEV) {
      // DevTools là optional dependency, có thể chưa được cài
      // Cài bằng: npm install @tanstack/react-query-devtools --save-dev
      import('@tanstack/react-query-devtools')
        .then((module: any) => {
          setDevTools(() => module.ReactQueryDevtools)
        })
        .catch(() => {
          // DevTools chưa được cài đặt, bỏ qua
        })
    }
  }, [])

  return (
    <>
      <SettingsProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </SettingsProvider>
      {/* DevTools chỉ hiện trong development */}
      {DevTools && <DevTools initialIsOpen={false} />}
    </>
  )
}

// Get root element
const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

// Create root only once - reuse if already exists (for HMR in development)
let root = (window as any).__react_root__
if (!root) {
  root = createRoot(rootElement)
  ;(window as any).__react_root__ = root
}

// Render the app
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)

