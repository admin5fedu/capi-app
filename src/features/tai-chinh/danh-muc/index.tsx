import { useNavigate } from 'react-router-dom'
import { DanhMucListView } from './components'
import { DanhMucFormView } from './components'
import { DanhMucDetailView } from './components'
import { KiemTraQuyen } from '@/shared/components/auth'
import { useModuleNavigation } from '@/shared/hooks/use-module-navigation'

/**
 * Module Danh mục tài chính - File điều phối chính
 * Sử dụng React Router với nested routes để URL thay đổi
 */
export function DanhMucModule() {
  const navigate = useNavigate()
  const basePath = '/tai-chinh/danh-muc-tai-chinh'
  
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

  // Handler để thêm danh mục con (truyền parent_id qua location.state)
  const handleAddChild = (parentId: number, parentLoai: string) => {
    navigate(`${basePath}/moi`, {
      state: {
        from: 'list',
        returnPath: basePath,
        initialData: {
          parent_id: parentId,
          loai: parentLoai,
        },
      },
    })
  }

  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0">
        {isNew || isEdit ? (
          <div className="flex-1 flex flex-col min-h-0">
            <DanhMucFormView
              editId={isEdit ? currentId || null : null}
              onComplete={handleComplete}
              onCancel={handleCancel}
              mode="page"
            />
          </div>
        ) : isDetail && currentId ? (
          <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
            <DanhMucDetailView
              id={currentId}
              onEdit={() => handleEdit(currentId, 'detail')}
              onDelete={navigateToList}
              onBack={navigateToList}
            />
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
            <DanhMucListView
              onEdit={(id) => handleEdit(String(id), 'list')}
              onAddNew={() => handleAddNew('list')}
              onAddChild={handleAddChild}
              onView={(id) => handleView(String(id))}
            />
          </div>
        )}
      </div>
    </KiemTraQuyen>
  )
}

export default DanhMucModule

// Re-export hooks, components, actions, and config for convenience
export * from './hooks'
export * from './components'
export * from './config'
export * from './actions'
export * from './services'

