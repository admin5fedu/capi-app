import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/shared/components/auth'
import { SettingsProvider } from '@/shared/components/settings/settings-provider'
import { router } from './routes'
import { registerServiceWorker } from './utils/register-sw'
import './index.css'

// Register Service Worker for PWA
registerServiceWorker()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  </StrictMode>,
)

