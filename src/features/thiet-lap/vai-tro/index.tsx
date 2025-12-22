import { VaiTroListView } from './components'
import { VaiTroFormView } from './components'
import { VaiTroDetailView } from './components'
import { KiemTraQuyen } from '@/shared/components/auth'
import { useModuleNavigation } from '@/shared/hooks/use-module-navigation'

/**
 * Module Vai trò - File điều phối chính
 * Sử dụng React Router với nested routes để URL thay đổi
 */
export function VaiTroModule() {
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
    basePath: '/thiet-lap/vai-tro',
  })

  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0">
        {isNew || isEdit ? (
          <div className="flex-1 flex flex-col min-h-0">
            <VaiTroFormView
              editId={isEdit ? currentId || null : null}
              onComplete={handleComplete}
              onCancel={handleCancel}
              mode="page"
            />
          </div>
        ) : isDetail && currentId ? (
          <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
            <VaiTroDetailView
              id={currentId}
              onEdit={() => handleEdit(currentId, 'detail')}
              onDelete={navigateToList} // Quay lại list sau khi xóa
              onBack={navigateToList}
            />
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
            <VaiTroListView
              onEdit={(id) => handleEdit(id, 'list')}
              onAddNew={() => handleAddNew('list')}
              onView={handleView}
            />
          </div>
        )}
      </div>
    </KiemTraQuyen>
  )
}

export default VaiTroModule

// Re-export hooks, components, actions, and config for convenience
export * from './hooks'
export * from './config'
export * from './components'
export * from './actions'

