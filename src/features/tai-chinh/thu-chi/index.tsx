import { GiaoDichListView } from './components'
import { GiaoDichFormView } from './components'
import { GiaoDichDetailView } from './components'
import { KiemTraQuyen } from '@/shared/components/auth'
import { useModuleNavigation } from '@/shared/hooks/use-module-navigation'

/**
 * Module Giao dịch - File điều phối chính
 * Sử dụng React Router với nested routes để URL thay đổi
 */
export function GiaoDichModule() {
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
    basePath: '/tai-chinh/thu-chi',
  })

  // Helper functions để convert giữa number và string (vì URL params là string nhưng GiaoDich ID là number)
  const convertIdToString = (id: number): string => String(id)
  const convertIdToNumber = (id: string | undefined): number | null => {
    if (!id) return null
    const num = parseInt(id, 10)
    return isNaN(num) ? null : num
  }

  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0">
        {isNew || isEdit ? (
          <div className="flex-1 flex flex-col min-h-0">
            <GiaoDichFormView
              editId={isEdit ? convertIdToNumber(currentId) : null}
              onComplete={handleComplete}
              onCancel={handleCancel}
              mode="page"
            />
          </div>
        ) : isDetail && currentId ? (
          <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
            <GiaoDichDetailView
              id={convertIdToNumber(currentId)!}
              onEdit={() => handleEdit(currentId, 'detail')}
              onDelete={navigateToList}
              onBack={navigateToList}
            />
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
            <GiaoDichListView
              onEdit={(id) => handleEdit(convertIdToString(id), 'list')}
              onAddNew={() => handleAddNew('list')}
              onView={(id) => handleView(convertIdToString(id))}
            />
          </div>
        )}
      </div>
    </KiemTraQuyen>
  )
}

export default GiaoDichModule

// Re-export hooks, components, actions, and config for convenience
export * from './hooks'
export * from './components'
export * from './config'
export * from './services'

