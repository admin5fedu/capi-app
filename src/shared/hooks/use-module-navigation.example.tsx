/**
 * Example: Cách sử dụng useModuleNavigation hook
 * 
 * Hook này cung cấp navigation flow chuẩn cho các module:
 * - ListView <-> FormView (Add/Edit) <-> DetailView
 * - Tự động track source view và quay về đúng view sau khi complete/cancel
 */

import { useModuleNavigation } from './use-module-navigation'
import { KiemTraQuyen } from '@/shared/components/auth'
// import { YourListView } from './components'
// import { YourFormView } from './components'
// import { YourDetailView } from './components'

/**
 * Example Module sử dụng useModuleNavigation
 */
export function ExampleModule() {
  const {
    isNew,
    isEdit,
    isDetail,
    handleAddNew: _handleAddNew,
    handleEdit: _handleEdit,
    handleView: _handleView,
    handleComplete: _handleComplete,
    handleCancel: _handleCancel,
    navigateToList: _navigateToList,
    currentId,
  } = useModuleNavigation({
    basePath: '/your-module-path', // Ví dụ: '/tai-chinh/danh-muc'
  })

  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0">
        {isNew || isEdit ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Form View - Add hoặc Edit */}
            {/* <YourFormView
              editId={isEdit ? currentId || null : null}
              onComplete={_handleComplete}
              onCancel={_handleCancel}
              mode="page"
            /> */}
          </div>
        ) : isDetail && currentId ? (
          <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
            {/* Detail View */}
            {/* <YourDetailView
              id={currentId}
              onEdit={() => _handleEdit(currentId, 'detail')}
              onDelete={_navigateToList} // Quay lại list sau khi xóa
              onBack={_navigateToList}
            /> */}
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
            {/* List View */}
            {/* <YourListView
              onEdit={(id) => _handleEdit(id, 'list')}
              onAddNew={() => _handleAddNew('list')}
              onView={_handleView}
            /> */}
          </div>
        )}
      </div>
    </KiemTraQuyen>
  )
}

/**
 * Flow Navigation:
 * 
 * 1. Từ ListView:
 *    - Edit → Save/Hủy → quay về ListView
 *    - Thêm mới → Save/Hủy → quay về ListView
 * 
 * 2. Từ DetailView:
 *    - Edit → Save/Hủy → quay về DetailView
 *    - Delete → quay về ListView
 * 
 * 3. Back button trong Form:
 *    - Nếu Edit từ ListView → Back → quay về ListView
 *    - Nếu Edit từ DetailView → Back → quay về DetailView
 */

