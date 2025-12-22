import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useBreadcrumb } from '@/components/layout/breadcrumb-context'

export type SourceView = 'list' | 'detail'

export interface ModuleNavigationConfig {
  basePath: string // Ví dụ: '/thiet-lap/nguoi-dung'
  onDetailLabelChange?: (label: string | null) => void // Callback khi detail label thay đổi
}

/**
 * Hook generic để quản lý navigation flow cho các module
 * - Track source view (list hoặc detail)
 * - Quản lý return path sau khi complete/cancel
 * - Hỗ trợ flow: ListView <-> FormView <-> DetailView
 */
export function useModuleNavigation(config: ModuleNavigationConfig) {
  const { basePath, onDetailLabelChange } = config
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams<{ id?: string }>()
  const { setDetailLabel } = useBreadcrumb()

  // Xác định view mode từ URL
  const isNew = location.pathname.endsWith('/moi')
  const isEdit = location.pathname.endsWith('/sua')
  const isDetail = params.id && !isEdit && !isNew
  const isList = !params.id && !isNew

  // Clear detail label khi không ở detail view
  useEffect(() => {
    if (!isDetail) {
      setDetailLabel(null)
      onDetailLabelChange?.(null)
    }
  }, [isDetail, setDetailLabel, onDetailLabelChange])

  /**
   * Navigate đến form thêm mới
   * @param from - Source view (list hoặc detail)
   */
  const handleAddNew = (from: SourceView = 'list') => {
    const returnPath = from === 'detail' && params.id ? `${basePath}/${params.id}` : basePath
    navigate(`${basePath}/moi`, {
      state: { from, returnPath },
    })
  }

  /**
   * Navigate đến form chỉnh sửa
   * @param id - ID của item cần edit
   * @param from - Source view (list hoặc detail)
   */
  const handleEdit = (id: string, from: SourceView = 'list') => {
    const returnPath = from === 'detail' ? `${basePath}/${id}` : basePath
    navigate(`${basePath}/${id}/sua`, {
      state: { from, returnPath },
    })
  }

  /**
   * Navigate đến detail view
   * @param id - ID của item cần xem
   */
  const handleView = (id: string) => {
    navigate(`${basePath}/${id}`)
  }

  /**
   * Quay về view trước đó sau khi complete (save thành công)
   * Sử dụng returnPath từ location.state hoặc mặc định về list
   */
  const handleComplete = () => {
    const returnPath = location.state?.returnPath || basePath
    navigate(returnPath)
  }

  /**
   * Quay về view trước đó sau khi cancel (hủy)
   * Sử dụng returnPath từ location.state hoặc mặc định về list
   */
  const handleCancel = () => {
    const returnPath = location.state?.returnPath || basePath
    navigate(returnPath)
  }

  /**
   * Navigate về list view (dùng cho delete từ detail view)
   */
  const navigateToList = () => {
    navigate(basePath)
  }

  return {
    // View states
    isNew,
    isEdit,
    isDetail,
    isList,
    // Navigation handlers
    handleAddNew,
    handleEdit,
    handleView,
    handleComplete,
    handleCancel,
    navigateToList,
    // Current params
    currentId: params.id,
  }
}

