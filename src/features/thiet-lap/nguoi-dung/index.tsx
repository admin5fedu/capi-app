import { NguoiDungListView } from './components'
import { NguoiDungFormView } from './components'
import { NguoiDungDetailView } from './components'
import { KiemTraQuyen } from '@/shared/components/auth'
import { useModuleNavigation } from '@/shared/hooks/use-module-navigation'

/**
 * Module Người dùng - File điều phối chính
 * Sử dụng React Router với nested routes để URL thay đổi
 */
export function NguoiDungModule() {
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
    basePath: '/thiet-lap/nguoi-dung',
  })

  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0">
        {isNew || isEdit ? (
          <div className="flex-1 flex flex-col min-h-0">
            <NguoiDungFormView
              editId={isEdit ? currentId || null : null}
              onComplete={handleComplete}
              onCancel={handleCancel}
              mode="page"
            />
          </div>
        ) : isDetail && currentId ? (
          <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
            <NguoiDungDetailView
              id={currentId}
              onEdit={() => handleEdit(currentId, 'detail')}
              onDelete={navigateToList} // Quay lại list sau khi xóa
              onBack={navigateToList}
            />
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
            <NguoiDungListView
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

export default NguoiDungModule

// Re-export hooks, components, actions, config, and types for convenience
export * from './hooks'
export * from './config'
export * from './components'
export * from './actions'
export * from './types'
