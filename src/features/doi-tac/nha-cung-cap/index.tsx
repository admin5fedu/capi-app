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
 * Module Nhà cung cấp - Gồm 2 tab:
 * - Nhóm nhà cung cấp: Quản lý nhóm nhà cung cấp
 * - Nhà cung cấp: Quản lý danh sách nhà cung cấp
 * 
 * URL structure:
 * - /doi-tac/nha-cung-cap/nhom (tab nhóm nhà cung cấp)
 * - /doi-tac/nha-cung-cap/nhom/moi, /doi-tac/nha-cung-cap/nhom/:id, /doi-tac/nha-cung-cap/nhom/:id/sua
 * - /doi-tac/nha-cung-cap/danh-sach (tab nhà cung cấp)
 * - /doi-tac/nha-cung-cap/danh-sach/moi, /doi-tac/nha-cung-cap/danh-sach/:id, /doi-tac/nha-cung-cap/danh-sach/:id/sua
 */
export function NhaCungCapModule() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Detect tab từ URL path
  // Pattern: /doi-tac/nhom-nha-cung-cap hoặc /doi-tac/danh-sach-nha-cung-cap
  const pathParts = location.pathname.split('/').filter(Boolean)
  const modulePath = pathParts[1] || '' // 'nhom-nha-cung-cap' hoặc 'danh-sach-nha-cung-cap'
  
  // Validate tab name
  const activeTab = modulePath === 'danh-sach-nha-cung-cap' ? 'danh-sach' : 'nhom'

  // Base path cho từng tab
  const basePathNhom = '/doi-tac/nhom-nha-cung-cap'
  const basePathDanhSach = '/doi-tac/danh-sach-nha-cung-cap'
  
  // Navigation cho từng tab
  const navNhom = useModuleNavigation({ basePath: basePathNhom })
  const navDanhSach = useModuleNavigation({ basePath: basePathDanhSach })

  const handleTabChange = (newTab: string) => {
    if (newTab === 'nhom') {
      navigate('/doi-tac/nhom-nha-cung-cap')
    } else {
      navigate('/doi-tac/danh-sach-nha-cung-cap')
    }
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
            defaultLoai="nha_cung_cap"
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
          defaultTab="nha_cung_cap"
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
            defaultLoai="nha_cung_cap"
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
          defaultTab="nha_cung_cap"
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
              <TabsTrigger value="nhom">Nhóm nhà cung cấp</TabsTrigger>
              <TabsTrigger value="danh-sach">Nhà cung cấp</TabsTrigger>
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

export default NhaCungCapModule

