import { useState } from 'react'
import { useThongTinCongTy } from './hooks'
import { ThongTinCongTyDetailView, ThongTinCongTyFormView } from './components'
import { KiemTraQuyen } from '@/shared/components/auth'

/**
 * Module Thông tin công ty - Có detail view và form chỉnh sửa
 */
export function ThongTinCongTyModule() {
  const { data: thongTin, isLoading: dangTai, error: loadError } = useThongTinCongTy()
  const [isEditMode, setIsEditMode] = useState(false)

  const handleEdit = () => {
    setIsEditMode(true)
  }

  const handleCancel = () => {
    setIsEditMode(false)
  }

  const handleComplete = () => {
    setIsEditMode(false)
  }

  if (dangTai) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-destructive font-medium">Lỗi khi tải dữ liệu</div>
        <div className="text-sm text-muted-foreground">
          {loadError instanceof Error ? loadError.message : 'Có lỗi xảy ra khi tải thông tin công ty'}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Tải lại
        </button>
      </div>
    )
  }

  return (
    <KiemTraQuyen>
      <div className="flex-1 flex flex-col min-h-0">
        {isEditMode ? (
          <ThongTinCongTyFormView
            data={thongTin || null}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        ) : (
          <div className="bg-card border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
            <ThongTinCongTyDetailView
              data={thongTin || null}
              isLoading={dangTai}
              error={loadError}
              onEdit={handleEdit}
            />
          </div>
        )}
      </div>
    </KiemTraQuyen>
  )
}

export default ThongTinCongTyModule

// Re-export hooks and services for convenience
export * from './hooks'
export * from './services'

