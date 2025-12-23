import { GenericListView } from '@/shared/components/generic/generic-list-view'
import { useModuleData } from '../hooks/use-module-data'
import type { ModuleTabConfig } from '../types'

interface GenericModuleTabViewProps {
  tabConfig: ModuleTabConfig
  onEdit?: (id: string) => void
  onAddNew?: () => void
  onView?: (id: string) => void
  onRefresh?: () => void
}

/**
 * Generic Module Tab View
 * Tự động render ListView dựa trên tab config
 */
export function GenericModuleTabView({
  tabConfig,
  // onEdit, // Unused
  onAddNew,
  onView,
  onRefresh,
}: GenericModuleTabViewProps) {
  // Tự động load data dựa trên dataSource config
  const { data = [], isLoading, error, refetch } = useModuleData(
    tabConfig.dataSource,
    true
  )

  // Lấy columns từ config (override hoặc default)
  const columns = tabConfig.config?.columns || []

  // TODO: Tạo actions tự động từ config
  // Hiện tại cần truyền từ bên ngoài vì phụ thuộc vào module cụ thể
  const hanhDongItems: any[] = [] // Sẽ được truyền từ parent
  const bulkActions: any[] = []

  return (
    <GenericListView
      data={data}
      cotHienThi={columns}
      hanhDongItems={hanhDongItems}
      bulkActions={bulkActions}
      isLoading={isLoading}
      error={error}
      onRefresh={onRefresh || (() => refetch())}
      onAddNew={onAddNew}
      onRowClick={(row: any) => onView?.(row.id)}
      tenLuuTru={`module-${tabConfig.id}-columns`}
      timKiemPlaceholder="Tìm kiếm..."
      enableRowSelection={true}
      pageSize={50}
    />
  )
}

