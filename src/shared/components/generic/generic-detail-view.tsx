import { useState } from 'react'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useMobile } from './hooks/use-mobile'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export interface DetailField<TData = any> {
  key: string
  label: string
  accessor?: keyof TData | ((data: TData) => any)
  render?: (value: any, data: TData) => React.ReactNode
  span?: 1 | 2 | 3 // Số cột chiếm (mặc định 1, tối đa 3)
}

export interface DetailFieldGroup<TData = any> {
  title: string
  fields: DetailField<TData>[]
}

export interface GenericDetailViewProps<TData = any> {
  data: TData | null
  isLoading?: boolean
  error?: Error | null
  title: string | ((data: TData) => string)
  titleKey?: keyof TData // Key để lấy title tự động từ data
  renderTitle?: (data: TData) => React.ReactNode // Custom title rendering (avatar, etc.)
  onEdit?: () => void
  onDelete?: () => void // Handler xóa item
  onBack?: () => void
  fields?: DetailField<TData>[] // Flat fields (không nhóm)
  groups?: DetailFieldGroup<TData>[] // Fields có nhóm
  renderHeaderActions?: (data: TData) => React.ReactNode // Custom header actions
  renderSections?: (data: TData) => React.ReactNode // Custom sections to render after groups/fields
  emptyMessage?: string
  deleteConfirmTitle?: string // Title cho confirm dialog xóa
  deleteConfirmDescription?: string // Description cho confirm dialog xóa
}

/**
 * GenericDetailView - Component hiển thị chi tiết dữ liệu
 * - Header cố định khi cuộn
 * - Body scrollable
 * - Grid 3 cột
 * - Hỗ trợ chia nhóm fields
 */
export function GenericDetailView<TData extends Record<string, any>>({
  data,
  isLoading = false,
  error = null,
  title,
  titleKey,
  renderTitle,
  onEdit,
  onDelete,
  onBack,
  fields = [],
  groups = [],
  renderHeaderActions,
  renderSections,
  emptyMessage = 'Không có dữ liệu',
  deleteConfirmTitle = 'Xác nhận xóa',
  deleteConfirmDescription = 'Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.',
}: GenericDetailViewProps<TData>) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const isMobile = useMobile()
  // Get title
  const getTitle = (): string => {
    if (typeof title === 'function' && data) {
      return title(data)
    }
    if (titleKey && data) {
      return String(data[titleKey] || title)
    }
    return typeof title === 'string' ? title : ''
  }

  // Get field value
  const getFieldValue = (field: DetailField<TData>): any => {
    if (!data) return null
    if (field.accessor) {
      if (typeof field.accessor === 'function') {
        return field.accessor(data)
      }
      return data[field.accessor]
    }
    return null
  }

  // Render field
  const renderField = (field: DetailField<TData>) => {
    const value = getFieldValue(field)
    const span = field.span || 1

    // Mobile: horizontal layout (label và value cùng dòng)
    if (isMobile) {
      return (
        <div
          key={field.key}
          className={cn(
            'flex items-start gap-2 py-2 border-b last:border-b-0',
            span === 1 && 'col-span-1',
            span === 2 && 'col-span-2',
            span === 3 && 'col-span-3'
          )}
        >
          <label className="text-sm font-medium text-muted-foreground flex-shrink-0 min-w-[100px]">
            {field.label}:
          </label>
          <div className="text-sm flex-1 text-right">
            {field.render ? field.render(value, data!) : value ?? <span className="text-muted-foreground">—</span>}
          </div>
        </div>
      )
    }

    // Desktop: vertical layout (label trên, value dưới)
    return (
      <div
        key={field.key}
        className={cn(
          'space-y-1',
          span === 1 && 'col-span-1',
          span === 2 && 'col-span-2',
          span === 3 && 'col-span-3'
        )}
      >
        <label className="text-sm font-medium text-muted-foreground">{field.label}</label>
        <div className="text-sm">
          {field.render ? field.render(value, data!) : value ?? <span className="text-muted-foreground">—</span>}
        </div>
      </div>
    )
  }

  // Loading state - Skeleton loading
  if (isLoading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header skeleton */}
        <div className="flex-shrink-0 border-b bg-card px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
            )}
            <div className="h-8 w-48 rounded-md bg-muted animate-pulse" />
          </div>
        </div>
        {/* Body skeleton */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-32 rounded-md bg-muted animate-pulse" />
              <div className={cn(
                'gap-6',
                isMobile ? 'space-y-0' : 'grid grid-cols-3'
              )}>
                {[1, 2, 3].map((j) => (
                  <div key={j} className={cn(
                    isMobile ? 'py-2 border-b' : 'space-y-2'
                  )}>
                    <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-32 rounded bg-muted animate-pulse mt-2" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-destructive">Lỗi: {error.message}</div>
      </div>
    )
  }

  // Empty state - Better UX với CTA
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="text-4xl mb-4">📭</div>
          <div className="text-lg font-medium text-foreground">{emptyMessage}</div>
          <div className="text-sm text-muted-foreground">
            Không tìm thấy dữ liệu để hiển thị
          </div>
        </div>
        {onBack && (
          <Button onClick={onBack} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        )}
      </div>
    )
  }

  // Combine fields from groups if groups are provided
  const allFields = groups.length > 0 
    ? groups.flatMap(group => group.fields)
    : fields

  if (allFields.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Không có trường dữ liệu để hiển thị</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 border-b bg-card px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 shadow-sm">
        {/* Mobile: 2 hàng riêng biệt */}
        {isMobile ? (
          <div className="space-y-3">
            {/* Hàng 1: Back button + Title */}
            <div className="flex items-center gap-3">
              {onBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="flex-shrink-0 h-11 w-11"
                  title="Quay lại"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {renderTitle && data ? (
                <div className="flex-1 min-w-0">{renderTitle(data)}</div>
              ) : (
                <h1 className="text-xl font-bold truncate flex-1 min-w-0">{getTitle()}</h1>
              )}
            </div>
            
            {/* Hàng 2: Actions */}
            {(renderHeaderActions || onEdit || onDelete) && (
              <div className="flex items-center gap-2 flex-wrap">
                {renderHeaderActions && renderHeaderActions(data)}
                {onEdit && (
                  <Button 
                    onClick={onEdit} 
                    variant="outline" 
                    size="sm"
                    className="flex-1 min-w-[100px] gap-2 h-11"
                  >
                    <Pencil className="h-4 w-4" />
                    Sửa
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    onClick={() => setShowDeleteDialog(true)} 
                    variant="destructive" 
                    size="sm"
                    className="flex-1 min-w-[100px] gap-2 h-11"
                  >
                    <Trash2 className="h-4 w-4" />
                    Xóa
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Desktop: Layout ngang như cũ */
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {onBack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onBack}
                  className="flex-shrink-0"
                  title="Quay lại"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {renderTitle && data ? (
                renderTitle(data)
              ) : (
                <h1 className="text-2xl font-bold truncate">{getTitle()}</h1>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {renderHeaderActions && renderHeaderActions(data)}
              {onEdit && (
                <Button onClick={onEdit} variant="outline" className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Sửa
                </Button>
              )}
              {onDelete && (
                <Button 
                  onClick={() => setShowDeleteDialog(true)} 
                  variant="destructive" 
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Body - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 scroll-smooth">
        <div className="space-y-8">
          {/* Render groups */}
          {groups.length > 0 ? (
            groups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-4">
                <h2 className="text-lg font-semibold text-primary border-b pb-2">
                  {group.title}
                </h2>
                <div className={cn(
                  'gap-6',
                  isMobile ? 'space-y-0' : 'grid grid-cols-3'
                )}>
                  {group.fields.map((field) => renderField(field))}
                </div>
              </div>
            ))
          ) : (
            /* Render flat fields */
            <div className={cn(
              'gap-6',
              isMobile ? 'space-y-0' : 'grid grid-cols-3'
            )}>
              {fields.map((field) => renderField(field))}
            </div>
          )}
          
          {/* Render custom sections */}
          {renderSections && data && renderSections(data)}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{deleteConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{deleteConfirmDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (onDelete) {
                  onDelete()
                  setShowDeleteDialog(false)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

