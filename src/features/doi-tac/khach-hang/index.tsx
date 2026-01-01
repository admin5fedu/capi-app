import { useLocation, Navigate, useNavigate } from 'react-router-dom'
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
 * URL structure:
 * - /doi-tac/khach-hang/nhom (tab nhóm khách hàng)
 * - /doi-tac/khach-hang/nhom/moi, /doi-tac/khach-hang/nhom/:id, /doi-tac/khach-hang/nhom/:id/sua
 * - /doi-tac/khach-hang/danh-sach (tab khách hàng)
 * - /doi-tac/khach-hang/danh-sach/moi, /doi-tac/khach-hang/danh-sach/:id, /doi-tac/khach-hang/danh-sach/:id/sua
 */
export function KhachHangModule() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Detect tab từ URL path
  // Pattern: /doi-tac/nhom-khach-hang hoặc /doi-tac/danh-sach-khach-hang
  const pathParts = location.pathname.split('/').filter(Boolean)
  const modulePath = pathParts[1] || '' // 'nhom-khach-hang' hoặc 'danh-sach-khach-hang'
  
  // Validate tab name
  const activeTab = modulePath === 'danh-sach-khach-hang' ? 'danh-sach' : 'nhom'

  // Base path cho từng tab
  const basePathNhom = '/doi-tac/nhom-khach-hang'
  const basePathDanhSach = '/doi-tac/danh-sach-khach-hang'
  
  // Navigation cho từng tab
  const navNhom = useModuleNavigation({ basePath: basePathNhom })
  const navDanhSach = useModuleNavigation({ basePath: basePathDanhSach })

  const handleTabChange = (newTab: string) => {
    if (newTab === 'nhom') {
      navigate('/doi-tac/nhom-khach-hang')
    } else {
      navigate('/doi-tac/danh-sach-khach-hang')
    }
  }

  // Xác định navigation nào đang active dựa trên tab
  const currentNav = activeTab === 'nhom' ? navNhom : navDanhSach

  return (
    <KiemTraQuyen>
      <div className="flex flex-col h-full overflow-hidden">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col h-full overflow-hidden">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-4 flex-shrink-0">
            <TabsTrigger value="nhom">Nhóm khách hàng</TabsTrigger>
            <TabsTrigger value="danh-sach">Khách hàng</TabsTrigger>
          </TabsList>

          <TabsContent value="nhom" className="mt-0 flex-1 min-h-0 overflow-hidden">
            {navNhom.isNew || navNhom.isEdit ? (
              <div className="flex-1 flex flex-col min-h-0">
                <NhomDoiTacFormView
                  editId={navNhom.isEdit ? navNhom.currentId || null : null}
                  onComplete={navNhom.handleComplete}
                  onCancel={navNhom.handleCancel}
                  mode="page"
                  defaultLoai="khach_hang"
                />
              </div>
            ) : navNhom.isDetail && navNhom.currentId ? (
              <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
                <NhomDoiTacDetailView
                  id={navNhom.currentId}
                  onEdit={() => navNhom.handleEdit(navNhom.currentId!, 'detail')}
                  onDelete={navNhom.navigateToList}
                  onBack={navNhom.navigateToList}
                />
              </div>
            ) : (
              <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
                <NhomDoiTacListView
                  onEdit={(id) => navNhom.handleEdit(id, 'list')}
                  onAddNew={() => navNhom.handleAddNew('list')}
                  onView={navNhom.handleView}
                  defaultTab="khach_hang"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="danh-sach" className="mt-0 flex-1 min-h-0 overflow-hidden">
            {navDanhSach.isNew || navDanhSach.isEdit ? (
              <div className="flex-1 flex flex-col min-h-0">
                <DoiTacFormView
                  editId={navDanhSach.isEdit ? navDanhSach.currentId || null : null}
                  onComplete={navDanhSach.handleComplete}
                  onCancel={navDanhSach.handleCancel}
                  mode="page"
                  defaultLoai="khach_hang"
                />
              </div>
            ) : navDanhSach.isDetail && navDanhSach.currentId ? (
              <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
                <DoiTacDetailView
                  id={navDanhSach.currentId}
                  onEdit={() => navDanhSach.handleEdit(navDanhSach.currentId!, 'detail')}
                  onDelete={navDanhSach.navigateToList}
                  onBack={navDanhSach.navigateToList}
                />
              </div>
            ) : (
              <div className="bg-card border rounded-lg p-6 flex-1 flex flex-col min-h-0">
                <DoiTacListView
                  onEdit={(id) => navDanhSach.handleEdit(id, 'list')}
                  onAddNew={() => navDanhSach.handleAddNew('list')}
                  onView={navDanhSach.handleView}
                  defaultTab="khach_hang"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </KiemTraQuyen>
  )
}

export default KhachHangModule

