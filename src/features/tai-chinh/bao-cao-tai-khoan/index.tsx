import { BaoCaoTaiKhoanView } from './components/bao-cao-tai-khoan-view'
import { KiemTraQuyen } from '@/shared/components/auth'

/**
 * Module Báo cáo tài khoản - File điều phối chính
 */
export function BaoCaoTaiKhoanModule() {
  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0">
        <BaoCaoTaiKhoanView />
      </div>
    </KiemTraQuyen>
  )
}

export default BaoCaoTaiKhoanModule

// Re-export hooks and components for convenience
export * from './hooks'
export * from './components'

