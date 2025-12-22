import { TyGiaListView } from './components'
import { TyGiaFormView } from './components'
import { TyGiaDetailView } from './components'
import { KiemTraQuyen } from '@/shared/components/auth'
import { useModuleNavigation } from '@/shared/hooks/use-module-navigation'

/**
 * Module Tỷ giá - File điều phối chính
 * Sử dụng React Router với nested routes để URL thay đổi
 */
export function TyGiaModule() {
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
    basePath: '/tai-chinh/ty-gia',
  })

  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0">
        {isNew || isEdit ? (
          <div className="flex-1 flex flex-col min-h-0">
            <TyGiaFormView
              editId={isEdit ? (currentId ? Number(currentId) : null) : null}
              onComplete={handleComplete}
              onCancel={handleCancel}
              mode="page"
            />
          </div>
        ) : isDetail && currentId ? (
          <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
            <TyGiaDetailView
              id={Number(currentId)}
              onEdit={() => handleEdit(currentId, 'detail')}
              onDelete={navigateToList}
              onBack={navigateToList}
            />
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
            <TyGiaListView
              onEdit={(id) => handleEdit(String(id), 'list')}
              onAddNew={() => handleAddNew('list')}
              onView={(id) => handleView(String(id))}
            />
          </div>
        )}
      </div>
    </KiemTraQuyen>
  )
}

export default TyGiaModule

// Re-export hooks, components, actions, and config for convenience
export * from './hooks'
export * from './components'
export * from './config'
export * from './actions'
export * from './services'

