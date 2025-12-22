/**
 * Types cho Generic Components
 */

export interface CotHienThi<TData = any> {
  key: string
  label: string
  accessorKey?: keyof TData | ((row: TData) => any)
  cell?: (value: any, row: TData) => React.ReactNode
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  defaultVisible?: boolean
}

export interface HanhDongItem<TData = any> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (row: TData) => void
  variant?: 'default' | 'destructive'
  hidden?: (row: TData) => boolean
  // Nếu là delete action, có thể dùng confirm dialog
  requiresConfirm?: boolean
  confirmTitle?: string
  confirmDescription?: string | ((row: TData) => string)
}

export interface BulkActionItem<TData = any> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (selectedRows: TData[]) => void
  variant?: 'default' | 'destructive'
  hidden?: (selectedRows: TData[]) => boolean
}

export interface QuickFilter {
  key: string
  label: string
  type: 'select' | 'text' | 'date' | 'boolean'
  options?: Array<{ value: string | number | boolean; label: string }>
  placeholder?: string
  multiSelect?: boolean // Cho phép chọn nhiều giá trị (chỉ áp dụng cho type 'select' và 'boolean')
}

export interface GenericListViewProps<TData = any> {
  data: TData[]
  cotHienThi: CotHienThi<TData>[]
  hanhDongItems?: HanhDongItem<TData>[]
  bulkActions?: BulkActionItem<TData>[]
  quickFilters?: QuickFilter[]
  isLoading?: boolean
  error?: Error | null
  onRefresh?: () => void
  onAddNew?: () => void
  onBack?: () => void
  onRowClick?: (row: TData) => void // Click vào row để xem detail
  tenLuuTru?: string // Tên để lưu cấu hình cột vào localStorage
  onXuatExcel?: (data: TData[]) => void
  onNhapExcel?: (file: File) => void
  timKiemPlaceholder?: string
  onTimKiem?: (keyword: string) => void
  enableRowSelection?: boolean
  pageSize?: number
  onQuickFilterChange?: (filters: Record<string, any>) => void
  imageField?: string // Field key chứa URL ảnh cho mobile card view (ví dụ: 'avatar_url', 'image_url')
}

export interface GenericFormViewWrapperProps {
  mode: 'modal' | 'page'
  title: string
  children: React.ReactNode
  isOpen?: boolean
  onClose?: () => void
  onSubmit?: () => void
  onCancel?: () => void
  isLoading?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}
