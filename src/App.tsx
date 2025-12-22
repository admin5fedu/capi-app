import { cn } from '@/lib/utils'

function App() {
  return (
    <div className={cn('min-h-screen bg-background')}>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-foreground">
          CAPI App - ERP System
        </h1>
        <p className="mt-4 text-muted-foreground">
          React + Vite + TypeScript với Path Alias @/ đã được cấu hình ✅
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Path alias đang hoạt động: import từ @/lib/utils
        </p>
      </div>
    </div>
  )
}

export default App

