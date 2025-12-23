import { BaoCaoView } from './components/bao-cao-view'
import { KiemTraQuyen } from '@/shared/components/auth'

/**
 * Module Báo cáo tài chính - File điều phối chính
 */
export function BaoCaoTaiChinhModule() {
  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0">
        <BaoCaoView />
      </div>
    </KiemTraQuyen>
  )
}

export default BaoCaoTaiChinhModule

// Re-export hooks and components for convenience
export * from './hooks'
export * from './components'

