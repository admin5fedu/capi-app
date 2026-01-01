import { useLocation, useNavigate } from 'react-router-dom'
import { NhomDoiTacListView } from '../nhom-doi-tac/components'
import { NhomDoiTacFormView } from '../nhom-doi-tac/components'
import { NhomDoiTacDetailView } from '../nhom-doi-tac/components'
import { DoiTacListView } from '../danh-sach-doi-tac/components'
import { DoiTacFormView } from '../danh-sach-doi-tac/components'
import { DoiTacDetailView } from '../danh-sach-doi-tac/components'
import { KiemTraQuyen } from '@/shared/components/auth'
import { useModuleNavigation } from '@/shared/hooks/use-module-navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

/**
 * Module Khách hàng - Gồm 2 tab:
 * - Nhóm khách hàng: Quản lý nhóm khách hàng
 * - Khách hàng: Quản lý danh sách khách hàng
 * 
 * Module này chỉ là wrapper với tab ở trên, các component bên trong là GenericListView
 */
export function KhachHangModule() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Detect tab từ URL
  const pathParts = location.pathname.split('/').filter(Boolean)
  const modulePath = pathParts[1] || ''
  const activeTab = modulePath === 'danh-sach-khach-hang' ? 'danh-sach' : 'nhom'

  const basePathNhom = '/doi-tac/nhom-khach-hang'
  const basePathDanhSach = '/doi-tac/danh-sach-khach-hang'
  
  const navNhom = useModuleNavigation({ basePath: basePathNhom })
  const navDanhSach = useModuleNavigation({ basePath: basePathDanhSach })

  const handleTabChange = (newTab: string) => {
    navigate(newTab === 'nhom' ? basePathNhom : basePathDanhSach)
  }

  // Chỉ hiển thị tab group khi cả hai sub-module đều ở list view
  const isNhomListView = !navNhom.isNew && !navNhom.isEdit && !navNhom.isDetail
  const isDanhSachListView = !navDanhSach.isNew && !navDanhSach.isEdit && !navDanhSach.isDetail
  const showTabGroup = isNhomListView && isDanhSachListView

  // Render content cho từng sub-module
  const renderNhomContent = () => {
    if (navNhom.isNew || navNhom.isEdit) {
      return (
        <div className="flex-1 flex flex-col min-h-0">
          <NhomDoiTacFormView
            editId={navNhom.isEdit ? navNhom.currentId || null : null}
            onComplete={navNhom.handleComplete}
            onCancel={navNhom.handleCancel}
            mode="page"
            defaultLoai="khach_hang"
          />
        </div>
      )
    }
    if (navNhom.isDetail && navNhom.currentId) {
      return (
        <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
          <NhomDoiTacDetailView
            id={navNhom.currentId}
            onEdit={() => navNhom.handleEdit(navNhom.currentId!, 'detail')}
            onDelete={navNhom.navigateToList}
            onBack={navNhom.navigateToList}
          />
        </div>
      )
    }
    return (
      <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
        <NhomDoiTacListView
          onEdit={(id) => navNhom.handleEdit(String(id), 'list')}
          onAddNew={() => navNhom.handleAddNew('list')}
          onView={(id) => navNhom.handleView(String(id))}
          defaultTab="khach_hang"
          hideTabs={true}
        />
      </div>
    )
  }

  const renderDanhSachContent = () => {
    if (navDanhSach.isNew || navDanhSach.isEdit) {
      return (
        <div className="flex-1 flex flex-col min-h-0">
          <DoiTacFormView
            editId={navDanhSach.isEdit ? navDanhSach.currentId || null : null}
            onComplete={navDanhSach.handleComplete}
            onCancel={navDanhSach.handleCancel}
            mode="page"
            defaultLoai="khach_hang"
          />
        </div>
      )
    }
    if (navDanhSach.isDetail && navDanhSach.currentId) {
      return (
        <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
          <DoiTacDetailView
            id={navDanhSach.currentId}
            onEdit={() => navDanhSach.handleEdit(navDanhSach.currentId!, 'detail')}
            onDelete={navDanhSach.navigateToList}
            onBack={navDanhSach.navigateToList}
          />
        </div>
      )
    }
    return (
      <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
        <DoiTacListView
          onEdit={(id) => navDanhSach.handleEdit(String(id), 'list')}
          onAddNew={() => navDanhSach.handleAddNew('list')}
          onView={(id) => navDanhSach.handleView(String(id))}
          defaultTab="khach_hang"
          hideTabs={true}
        />
      </div>
    )
  }

  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0">
        {showTabGroup ? (
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4 flex-shrink-0">
              <TabsTrigger value="nhom">Nhóm khách hàng</TabsTrigger>
              <TabsTrigger value="danh-sach">Khách hàng</TabsTrigger>
            </TabsList>

            <TabsContent value="nhom" className="mt-0 flex-1 min-h-0 overflow-hidden">
              {renderNhomContent()}
            </TabsContent>

            <TabsContent value="danh-sach" className="mt-0 flex-1 min-h-0 overflow-hidden">
              {renderDanhSachContent()}
            </TabsContent>
          </Tabs>
        ) : (
          // Không có tab group, render trực tiếp content dựa trên activeTab
          activeTab === 'nhom' ? renderNhomContent() : renderDanhSachContent()
        )}
      </div>
    </KiemTraQuyen>
  )
}

export default KhachHangModule

