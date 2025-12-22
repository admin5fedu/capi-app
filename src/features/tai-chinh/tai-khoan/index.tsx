import { TaiKhoanListView } from './components'
import { TaiKhoanFormView } from './components'
import { TaiKhoanDetailView } from './components'
import { KiemTraQuyen } from '@/shared/components/auth'
import { useModuleNavigation } from '@/shared/hooks/use-module-navigation'

/**
 * Module Tài khoản - File điều phối chính
 * Sử dụng React Router với nested routes để URL thay đổi
 */
export function TaiKhoanModule() {
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
    basePath: '/tai-chinh/tai-khoan',
  })

  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0">
        {isNew || isEdit ? (
          <div className="flex-1 flex flex-col min-h-0">
            <TaiKhoanFormView
              editId={isEdit ? currentId || null : null}
              onComplete={handleComplete}
              onCancel={handleCancel}
              mode="page"
            />
          </div>
        ) : isDetail && currentId ? (
          <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
            <TaiKhoanDetailView
              id={currentId}
              onEdit={() => handleEdit(currentId, 'detail')}
              onDelete={navigateToList}
              onBack={navigateToList}
            />
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
            <TaiKhoanListView
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

export default TaiKhoanModule

// Re-export hooks, components, actions, and config for convenience
export * from './hooks'
export * from './components'
export * from './config'
export * from './actions'
export * from './services'

