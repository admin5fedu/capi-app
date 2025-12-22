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
import './index.css'

// Register Service Worker for PWA
registerServiceWorker()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data fresh trong 3 phút - không refetch khi quay lại tab nếu < 3 phút
      staleTime: QUERY_STALE_TIME.NORMAL,

      // Giữ cache 10 phút sau khi không còn component nào dùng
      gcTime: QUERY_GC_TIME.DEFAULT,

      // Không refetch khi focus window (đã có staleTime rồi)
      refetchOnWindowFocus: false,

      // Refetch khi component mount lại
      // Với staleTime: 3 phút, chỉ refetch nếu data đã stale (> 3 phút)
      // Nếu data còn fresh, sẽ dùng cache và không refetch
      refetchOnMount: true,

      // Refetch khi mất mạng rồi kết nối lại
      refetchOnReconnect: true,

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)

