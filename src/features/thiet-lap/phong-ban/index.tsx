import { PhongBanListView } from './components'
import { PhongBanFormView } from './components'
import { PhongBanDetailView } from './components'
import { KiemTraQuyen } from '@/shared/components/auth'
import { useModuleNavigation } from '@/shared/hooks/use-module-navigation'

/**
 * Module Phòng ban - File điều phối chính
 * Sử dụng React Router với nested routes để URL thay đổi
 */
export function PhongBanModule() {
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
    basePath: '/thiet-lap/phong-ban',
  })

  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0">
        {isNew || isEdit ? (
          <div className="flex-1 flex flex-col min-h-0">
            <PhongBanFormView
              editId={isEdit ? currentId || null : null}
              onComplete={handleComplete}
              onCancel={handleCancel}
              mode="page"
            />
          </div>
        ) : isDetail && currentId ? (
          <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
            <PhongBanDetailView
              id={currentId}
              onEdit={() => handleEdit(currentId, 'detail')}
              onDelete={navigateToList} // Quay lại list sau khi xóa
              onBack={navigateToList}
            />
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
            <PhongBanListView
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

export default PhongBanModule

