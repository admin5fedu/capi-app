import { DoiTacListView } from './components'
import { DoiTacFormView } from './components'
import { DoiTacDetailView } from './components'
import { KiemTraQuyen } from '@/shared/components/auth'
import { useModuleNavigation } from '@/shared/hooks/use-module-navigation'
import { useLocation } from 'react-router-dom'
import type { TabType } from './config'

/**
 * Module Danh sách đối tác - File điều phối chính
 * Có 2 tab: Nhà cung cấp và Khách hàng
 * URL structure: /doi-tac/danh-sach-nha-cung-cap, /doi-tac/danh-sach-khach-hang
 * 
 * QUY ĐỊNH URL PATTERN CHO MODULE MULTI-TAB:
 * - Pattern: /{parent-path}/{module-prefix}-{tab-name}
 * - Ví dụ: /doi-tac/danh-sach-nha-cung-cap (danh-sach là prefix, nha-cung-cap là tab)
 * - Tab name luôn ở vị trí cuối cùng trong path
 */
export function DanhSachDoiTacModule() {
  const location = useLocation()
  
  // Detect tabType từ URL path
  // Pattern: /doi-tac/danh-sach-{tab-name}
  // pathParts: ['doi-tac', 'danh-sach-nha-cung-cap'] hoặc ['doi-tac', 'danh-sach-khach-hang']
  const pathParts = location.pathname.split('/').filter(Boolean)
  const modulePath = pathParts[1] || '' // 'danh-sach-nha-cung-cap' hoặc 'danh-sach-khach-hang'
  
  // Extract tab name từ module path (bỏ prefix "danh-sach-")
  const tabName = modulePath.replace('danh-sach-', '')
  
  // Validate và set default
  const validTabType = tabName === 'khach-hang' ? 'khach-hang' : 'nha-cung-cap'
  const currentTab: TabType = validTabType === 'khach-hang' ? 'khach_hang' : 'nha_cung_cap'
  
  // Base path dựa trên tab type
  const basePath = `/doi-tac/danh-sach-${validTabType}`
  
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
            <DoiTacFormView
              editId={isEdit ? currentId || null : null}
              onComplete={handleComplete}
              onCancel={handleCancel}
              mode="page"
              defaultLoai={isNew ? currentTab : undefined}
            />
          </div>
        ) : isDetail && currentId ? (
          <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
            <DoiTacDetailView
              id={currentId}
              onEdit={() => handleEdit(currentId, 'detail')}
              onDelete={navigateToList} // Quay lại list sau khi xóa
              onBack={navigateToList}
            />
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
            <DoiTacListView
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

export default DanhSachDoiTacModule

// Re-export hooks, components, actions, config, and types for convenience
export * from './hooks'
export * from './config'
export * from './components'
export * from './actions'
export * from './types'

