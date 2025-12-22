import { PhanQuyenMatrixView } from './components'
import { KiemTraQuyen } from '@/shared/components/auth'

/**
 * Module Phân quyền - File điều phối chính
 * Hiển thị giao diện matrix để quản lý phân quyền theo vai trò
 */
export function PhanQuyenModule() {
  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0 p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Phân quyền</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cấu hình phân quyền truy cập hệ thống theo vai trò
          </p>
        </div>
        <div className="flex-1 flex flex-col min-h-0 bg-card border rounded-lg p-6">
          <PhanQuyenMatrixView />
        </div>
      </div>
    </KiemTraQuyen>
  )
}

export default PhanQuyenModule

// Re-export hooks, components, and config for convenience
export * from './hooks'
export * from './components'
export * from './config'
export * from './services'

