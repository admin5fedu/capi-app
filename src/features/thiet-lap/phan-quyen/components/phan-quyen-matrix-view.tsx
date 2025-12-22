import { useState, useEffect } from 'react'
import { useVaiTroList, usePhanQuyenMatrix, useUpdatePhanQuyen } from '../hooks'
import { MODULES, ACTIONS } from '../config'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PhanQuyenMatrix } from '@/types/phan-quyen'

interface PhanQuyenMatrixViewProps {
  className?: string
}

export function PhanQuyenMatrixView({ className }: PhanQuyenMatrixViewProps) {
  const [selectedVaiTroId, setSelectedVaiTroId] = useState<string>('')
  const [localMatrix, setLocalMatrix] = useState<PhanQuyenMatrix[]>([])

  // Lấy danh sách vai trò
  const { data: vaiTroList, isLoading: isLoadingVaiTro } = useVaiTroList()

  // Lấy matrix phân quyền
  const {
    data: matrix,
    isLoading: isLoadingMatrix,
    refetch,
  } = usePhanQuyenMatrix(selectedVaiTroId || null)

  // Mutation để cập nhật phân quyền
  const updateMutation = useUpdatePhanQuyen()

  // Sync local matrix với data từ server
  useEffect(() => {
    if (matrix) {
      setLocalMatrix(matrix)
    }
  }, [matrix])

  // Xử lý thay đổi checkbox
  const handleToggle = (module: string, action: string, allowed: boolean) => {
    if (!selectedVaiTroId) return

    // Cập nhật local state
    setLocalMatrix((prev) =>
      prev.map((item) =>
        item.module === module
          ? {
              ...item,
              actions: item.actions.map((a) =>
                a.action === action ? { ...a, allowed } : a
              ),
            }
          : item
      )
    )

    // Cập nhật ngay lập tức lên server
    updateMutation.mutate({
      vaiTroId: selectedVaiTroId,
      module,
      action,
      allowed,
    })
  }

  // Xử lý select all cho một module
  const handleSelectAllModule = (module: string, allowed: boolean) => {
    if (!selectedVaiTroId) return

    const moduleItem = localMatrix.find((m) => m.module === module)
    if (!moduleItem) return

    // Cập nhật tất cả actions của module
    moduleItem.actions.forEach((action) => {
      updateMutation.mutate({
        vaiTroId: selectedVaiTroId,
        module,
        action: action.action,
        allowed,
      })
    })
  }

  // Xử lý select all cho một action
  const handleSelectAllAction = (action: string, allowed: boolean) => {
    if (!selectedVaiTroId) return

    // Cập nhật tất cả modules cho action này
    localMatrix.forEach((moduleItem) => {
      updateMutation.mutate({
        vaiTroId: selectedVaiTroId,
        module: moduleItem.module,
        action,
        allowed,
      })
    })
  }

  // Kiểm tra xem tất cả actions của một module có được chọn không
  const isModuleAllSelected = (module: string) => {
    const moduleItem = localMatrix.find((m) => m.module === module)
    if (!moduleItem) return false
    return moduleItem.actions.every((a) => a.allowed)
  }

  // Kiểm tra xem tất cả modules của một action có được chọn không
  const isActionAllSelected = (action: string) => {
    return localMatrix.every((moduleItem) => {
      const actionItem = moduleItem.actions.find((a) => a.action === action)
      return actionItem?.allowed ?? false
    })
  }

  const isLoading = isLoadingVaiTro || isLoadingMatrix || updateMutation.isPending

  return (
    <div className={cn('flex flex-col h-full space-y-4', className)}>
      {/* Header với dropdown chọn vai trò */}
      <div className="flex items-center justify-between gap-4 p-4 bg-card border rounded-lg">
        <div className="flex items-center gap-4 flex-1">
          <label className="text-sm font-medium whitespace-nowrap">Chọn vai trò:</label>
          <select
            value={selectedVaiTroId}
            onChange={(e) => {
              setSelectedVaiTroId(e.target.value)
              setLocalMatrix([])
            }}
            className="flex-1 max-w-xs px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoadingVaiTro}
          >
            <option value="">-- Chọn vai trò --</option>
            {vaiTroList?.map((vaiTro) => (
              <option key={vaiTro.id} value={vaiTro.id}>
                {vaiTro.ten}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={!selectedVaiTroId || isLoading}
          className="gap-2"
        >
          <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          Làm mới
        </Button>
      </div>

      {/* Matrix Table */}
      {selectedVaiTroId ? (
        <div className="flex-1 overflow-auto border rounded-lg bg-card">
          {isLoadingMatrix ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full border-collapse">
                <thead className="bg-muted sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold border-b sticky left-0 bg-muted z-20 min-w-[200px]">
                      Module
                    </th>
                    {ACTIONS.map((action) => (
                      <th
                        key={action.key}
                        className="px-4 py-3 text-center text-sm font-semibold border-b min-w-[100px]"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span>{action.label}</span>
                          <Checkbox
                            checked={isActionAllSelected(action.key)}
                            onCheckedChange={(checked) =>
                              handleSelectAllAction(action.key, checked ?? false)
                            }
                            disabled={isLoading}
                          />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map((module) => {
                    const moduleItem = localMatrix.find((m) => m.module === module.key)
                    const isAllSelected = isModuleAllSelected(module.key)

                    return (
                      <tr
                        key={module.key}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium border-r sticky left-0 bg-card z-10">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={isAllSelected}
                              onCheckedChange={(checked) =>
                                handleSelectAllModule(module.key, checked ?? false)
                              }
                              disabled={isLoading}
                            />
                            <span>{module.label}</span>
                          </div>
                        </td>
                        {ACTIONS.map((action) => {
                          const actionItem = moduleItem?.actions.find(
                            (a) => a.action === action.key
                          )
                          const allowed = actionItem?.allowed ?? false

                          return (
                            <td
                              key={`${module.key}-${action.key}`}
                              className="px-4 py-3 text-center border-r"
                            >
                              <Checkbox
                                checked={allowed}
                                onCheckedChange={(checked) =>
                                  handleToggle(module.key, action.key, checked ?? false)
                                }
                                disabled={isLoading}
                              />
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center border rounded-lg bg-muted/30">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium mb-2">Chưa chọn vai trò</p>
            <p className="text-sm">Vui lòng chọn một vai trò để xem và chỉnh sửa phân quyền</p>
          </div>
        </div>
      )}
    </div>
  )
}

