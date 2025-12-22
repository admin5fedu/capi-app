import { NhomDoiTacListView } from './components'
import { NhomDoiTacFormView } from './components'
import { NhomDoiTacDetailView } from './components'
import { KiemTraQuyen } from '@/shared/components/auth'
import { useModuleNavigation } from '@/shared/hooks/use-module-navigation'
import { useLocation } from 'react-router-dom'
import type { TabType } from './config'
// Import để đăng ký module vào registry (cho tương lai)
import './config.module'

/**
 * Module Nhóm đối tác - File điều phối chính
 * Có 2 tab: Nhà cung cấp và Khách hàng
 * URL structure: /doi-tac/nha-cung-cap, /doi-tac/khach-hang
 */
export function NhomDoiTacModule() {
  const location = useLocation()
  
  // Detect tabType từ URL path (nha-cung-cap hoặc khach-hang)
  // Lấy từ pathname vì có thể không có trong params
  const pathParts = location.pathname.split('/').filter(Boolean)
  const tabTypeFromPath = pathParts[1] // doi-tac -> [0], nha-cung-cap/khach-hang -> [1]
  
  // Validate và set default
  const validTabType = tabTypeFromPath === 'khach-hang' ? 'khach-hang' : 'nha-cung-cap'
  const currentTab: TabType = validTabType === 'khach-hang' ? 'khach_hang' : 'nha_cung_cap'
  
  // Base path dựa trên tab type
  const basePath = `/doi-tac/${validTabType}`
  
  const {
    isNew,
    isEdit,
    isDetail,
    handleAddNew,
    handleEdit,
    handleView,
    handleComplete,
    handleCancel,
    navigateToList,
    currentId,
  } = useModuleNavigation({
    basePath,
  })

  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0">
        {isNew || isEdit ? (
          <div className="flex-1 flex flex-col min-h-0">
            <NhomDoiTacFormView
              editId={isEdit ? currentId || null : null}
              onComplete={handleComplete}
              onCancel={handleCancel}
              mode="page"
              defaultLoai={isNew ? currentTab : undefined}
            />
          </div>
        ) : isDetail && currentId ? (
          <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
            <NhomDoiTacDetailView
              id={currentId}
              onEdit={() => handleEdit(currentId, 'detail')}
              onDelete={navigateToList} // Quay lại list sau khi xóa
              onBack={navigateToList}
            />
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
            <NhomDoiTacListView
              onEdit={(id) => handleEdit(id, 'list')}
              onAddNew={() => handleAddNew('list')}
              onView={handleView}
              defaultTab={currentTab}
            />
          </div>
        )}
      </div>
    </KiemTraQuyen>
  )
}

export default NhomDoiTacModule

// Re-export hooks, components, actions, config, and types for convenience
export * from './hooks'
export * from './config'
export * from './components'
export * from './actions'
export * from './types'

