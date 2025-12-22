import { useState, useEffect, useMemo, useRef } from 'react'
import { 
  useVaiTroList, 
  usePhanQuyenVaiTroMatrix, 
  useUpdatePhanQuyenVaiTroMatrix 
} from '../hooks'
import { MODULE_GROUPS, ACTIONS } from '../config'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RefreshCw, Save, X, Search, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PhanQuyenVaiTroMatrix } from '@/types/phan-quyen'

interface PhanQuyenMatrixViewProps {
  className?: string
}

// Interface cho cache của từng module
interface ModuleCache {
  localMatrix: PhanQuyenVaiTroMatrix[]
  originalMatrix: PhanQuyenVaiTroMatrix[]
  hasChanges: boolean
}

export function PhanQuyenMatrixView({ className }: PhanQuyenMatrixViewProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [localMatrix, setLocalMatrix] = useState<PhanQuyenVaiTroMatrix[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [originalMatrix, setOriginalMatrix] = useState<PhanQuyenVaiTroMatrix[]>([])
  const [searchModule, setSearchModule] = useState<string>('')
  
  // Cache để lưu thay đổi của từng module
  const moduleCacheRef = useRef<Map<string, ModuleCache>>(new Map())
  
  // Dialog xác nhận khi chuyển module có thay đổi chưa lưu
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingModule, setPendingModule] = useState<string | null>(null)
  const [pendingModuleLabel, setPendingModuleLabel] = useState<string>('')

  // Lấy danh sách vai trò
  const { data: vaiTroList, isLoading: isLoadingVaiTro } = useVaiTroList()

  // Lấy ma trận phân quyền theo module
  const {
    data: matrix,
    isLoading: isLoadingMatrix,
    refetch,
  } = usePhanQuyenVaiTroMatrix(selectedModule)

  // Mutation để cập nhật phân quyền (batch)
  const updateMutation = useUpdatePhanQuyenVaiTroMatrix()

  // Lưu thay đổi hiện tại vào cache
  const saveCurrentModuleToCache = (moduleKey: string | null) => {
    if (!moduleKey || localMatrix.length === 0) return
    
    const hasDiff = JSON.stringify(localMatrix) !== JSON.stringify(originalMatrix)
    if (hasDiff) {
      moduleCacheRef.current.set(moduleKey, {
        localMatrix: JSON.parse(JSON.stringify(localMatrix)),
        originalMatrix: JSON.parse(JSON.stringify(originalMatrix)),
        hasChanges: true,
      })
    }
  }

  // Load module từ cache hoặc server
  const loadModule = (moduleKey: string | null) => {
    if (!moduleKey) {
      setLocalMatrix([])
      setOriginalMatrix([])
      setHasChanges(false)
      return
    }

    // Kiểm tra cache trước
    const cached = moduleCacheRef.current.get(moduleKey)
    if (cached) {
      // Có cache, load từ cache
      setLocalMatrix(JSON.parse(JSON.stringify(cached.localMatrix)))
      setOriginalMatrix(JSON.parse(JSON.stringify(cached.originalMatrix)))
      setHasChanges(cached.hasChanges)
    } else {
      // Không có cache, sẽ load từ server khi matrix data về
      // Reset state để useEffect xử lý
      setLocalMatrix([])
      setOriginalMatrix([])
      setHasChanges(false)
    }
  }

  // Sync local matrix với data từ server (chỉ khi không có cache)
  useEffect(() => {
    if (!matrix || !selectedModule) return

    // Kiểm tra xem có cache không
    const cached = moduleCacheRef.current.get(selectedModule)
    if (cached) {
      // Đã có cache, không cần sync từ server
      return
    }

    // Không có cache, load từ server
    setLocalMatrix(matrix)
    setOriginalMatrix(JSON.parse(JSON.stringify(matrix))) // Deep copy
    setHasChanges(false)
  }, [matrix, selectedModule])

  // Kiểm tra có thay đổi không
  useEffect(() => {
    if (!selectedModule || localMatrix.length === 0) {
      setHasChanges(false)
      return
    }

    const hasDiff = JSON.stringify(localMatrix) !== JSON.stringify(originalMatrix)
    setHasChanges(hasDiff)
    
    // Cập nhật cache
    if (hasDiff) {
      const cached = moduleCacheRef.current.get(selectedModule)
      if (cached) {
        cached.localMatrix = JSON.parse(JSON.stringify(localMatrix))
        cached.hasChanges = true
      } else {
        moduleCacheRef.current.set(selectedModule, {
          localMatrix: JSON.parse(JSON.stringify(localMatrix)),
          originalMatrix: JSON.parse(JSON.stringify(originalMatrix)),
          hasChanges: true,
        })
      }
    } else {
      // Không có thay đổi, xóa cache
      moduleCacheRef.current.delete(selectedModule)
    }
  }, [localMatrix, originalMatrix, selectedModule])

  // Xử lý thay đổi checkbox
  const handleToggle = (vaiTroId: string, action: string, allowed: boolean) => {
    if (!selectedModule) return

    // Cập nhật local state
    setLocalMatrix((prev) =>
      prev.map((item) =>
        item.vai_tro_id === vaiTroId
          ? {
              ...item,
              permissions: item.permissions.map((p) =>
                p.action === action ? { ...p, allowed } : p
              ),
            }
          : item
      )
    )
  }

  // Xử lý select all cho một vai trò
  const handleSelectAllVaiTro = (vaiTroId: string, allowed: boolean) => {
    if (!selectedModule) return

    setLocalMatrix((prev) =>
      prev.map((item) =>
        item.vai_tro_id === vaiTroId
          ? {
              ...item,
              permissions: item.permissions.map((p) => ({
                ...p,
                allowed,
              })),
            }
          : item
      )
    )
  }

  // Xử lý select all cho một action
  const handleSelectAllAction = (action: string, allowed: boolean) => {
    if (!selectedModule) return

    setLocalMatrix((prev) =>
      prev.map((item) => ({
        ...item,
        permissions: item.permissions.map((p) =>
          p.action === action ? { ...p, allowed } : p
        ),
      }))
    )
  }

  // Xử lý lưu tất cả thay đổi
  const handleSave = () => {
    if (!selectedModule || !hasChanges) return

    updateMutation.mutate(
      {
        module: selectedModule,
        matrix: localMatrix,
      },
      {
        onSuccess: () => {
          setOriginalMatrix(JSON.parse(JSON.stringify(localMatrix)))
          setHasChanges(false)
          // Xóa cache sau khi lưu thành công
          moduleCacheRef.current.delete(selectedModule)
        },
      }
    )
  }

  // Xử lý hủy thay đổi
  const handleCancel = () => {
    if (originalMatrix.length > 0) {
      setLocalMatrix(JSON.parse(JSON.stringify(originalMatrix)))
      setHasChanges(false)
      // Xóa cache khi hủy
      if (selectedModule) {
        moduleCacheRef.current.delete(selectedModule)
      }
    }
  }

  // Xử lý chuyển module
  const handleModuleChange = (moduleKey: string) => {
    // Nếu đang chọn module này thì không làm gì
    if (selectedModule === moduleKey) return

    // Kiểm tra xem module hiện tại có thay đổi chưa lưu không
    if (hasChanges && selectedModule) {
      // Có thay đổi chưa lưu, hiển thị dialog xác nhận
      const moduleLabel = MODULE_GROUPS.flatMap((group) => group.modules).find(
        (m) => m.key === moduleKey
      )?.label || moduleKey
      
      setPendingModule(moduleKey)
      setPendingModuleLabel(moduleLabel)
      setShowConfirmDialog(true)
    } else {
      // Không có thay đổi, chuyển module ngay
      saveCurrentModuleToCache(selectedModule)
      setSelectedModule(moduleKey)
      loadModule(moduleKey)
    }
  }

  // Xử lý xác nhận trong dialog
  const handleConfirmDialog = (action: 'save' | 'discard' | 'cancel') => {
    if (action === 'cancel') {
      setShowConfirmDialog(false)
      setPendingModule(null)
      setPendingModuleLabel('')
      return
    }

    if (action === 'save' && selectedModule && hasChanges) {
      // Lưu thay đổi trước khi chuyển
      updateMutation.mutate(
        {
          module: selectedModule,
          matrix: localMatrix,
        },
        {
          onSuccess: () => {
            // Xóa cache sau khi lưu
            moduleCacheRef.current.delete(selectedModule)
            
            // Chuyển sang module mới
            if (pendingModule) {
              setSelectedModule(pendingModule)
              loadModule(pendingModule)
            }
            
            setShowConfirmDialog(false)
            setPendingModule(null)
            setPendingModuleLabel('')
          },
        }
      )
    } else if (action === 'discard' && pendingModule) {
      // Bỏ qua thay đổi, lưu vào cache và chuyển module
      saveCurrentModuleToCache(selectedModule)
      setSelectedModule(pendingModule)
      loadModule(pendingModule)
      setShowConfirmDialog(false)
      setPendingModule(null)
      setPendingModuleLabel('')
    }
  }

  // Kiểm tra xem tất cả permissions của một vai trò có được chọn không
  const isVaiTroAllSelected = (vaiTroId: string) => {
    const vaiTroItem = localMatrix.find((v) => v.vai_tro_id === vaiTroId)
    if (!vaiTroItem) return false
    return vaiTroItem.permissions.every((p) => p.allowed)
  }

  // Kiểm tra xem tất cả vai trò của một action có được chọn không
  const isActionAllSelected = (action: string) => {
    return localMatrix.every((item) => {
      const permission = item.permissions.find((p) => p.action === action)
      return permission?.allowed ?? false
    })
  }

  // Kiểm tra xem một action có được chọn một phần không
  const isActionPartiallySelected = (action: string) => {
    const selectedCount = localMatrix.filter((item) => {
      const permission = item.permissions.find((p) => p.action === action)
      return permission?.allowed ?? false
    }).length
    return selectedCount > 0 && selectedCount < localMatrix.length
  }

  // Lấy tên module đã chọn
  const selectedModuleLabel = useMemo(() => {
    if (!selectedModule) return null
    return MODULE_GROUPS.flatMap((group) => group.modules).find(
      (m) => m.key === selectedModule
    )?.label
  }, [selectedModule])

  // Filter module groups theo từ khóa tìm kiếm
  const filteredModuleGroups = useMemo(() => {
    if (!searchModule.trim()) {
      return MODULE_GROUPS
    }

    const searchLower = searchModule.toLowerCase().trim()
    return MODULE_GROUPS.map((group) => {
      const filteredModules = group.modules.filter((module) =>
        module.label.toLowerCase().includes(searchLower) ||
        group.label.toLowerCase().includes(searchLower)
      )
      return {
        ...group,
        modules: filteredModules,
      }
    }).filter((group) => group.modules.length > 0)
  }, [searchModule])

  // Kiểm tra module có thay đổi chưa lưu (để hiển thị indicator)
  const getModuleHasChanges = (moduleKey: string) => {
    const cached = moduleCacheRef.current.get(moduleKey)
    return cached?.hasChanges ?? false
  }

  const isLoading = isLoadingVaiTro || isLoadingMatrix || updateMutation.isPending

  return (
    <div className={cn('flex flex-col h-full space-y-4', className)}>
      {/* Dialog xác nhận khi chuyển module có thay đổi chưa lưu */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              </div>
              <div>
                <DialogTitle>Thay đổi chưa được lưu</DialogTitle>
                <DialogDescription className="pt-2">
                  Bạn có thay đổi chưa được lưu ở module "{selectedModuleLabel}". 
                  Bạn muốn làm gì trước khi chuyển sang module "{pendingModuleLabel}"?
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
            <Button
              variant="outline"
              onClick={() => handleConfirmDialog('cancel')}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button
              variant="outline"
              onClick={() => handleConfirmDialog('discard')}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Không lưu
            </Button>
            <Button
              variant="default"
              onClick={() => handleConfirmDialog('save')}
              disabled={isLoading}
              className="w-full sm:w-auto gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Lưu và chuyển
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nội dung 2 cột */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Cột trái: Danh sách module */}
        <div className="w-80 flex-shrink-0 border rounded-lg bg-card overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-muted/50">
            <h3 className="text-sm font-semibold mb-3">Danh sách module</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm module..."
                value={searchModule}
                onChange={(e) => setSearchModule(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {filteredModuleGroups.length === 0 ? (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Không tìm thấy module nào
                </div>
              ) : (
                filteredModuleGroups.map((group) => (
                  <div key={group.key} className="mb-4">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {group.label}
                    </div>
                    <div className="space-y-1">
                      {group.modules.map((module) => {
                        const isSelected = selectedModule === module.key
                        const moduleHasChanges = getModuleHasChanges(module.key)

                        return (
                          <button
                            key={module.key}
                            onClick={() => handleModuleChange(module.key)}
                            className={cn(
                              'w-full text-left px-3 py-2 rounded-md text-sm transition-colors relative',
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span>{module.label}</span>
                              {moduleHasChanges && !isSelected && (
                                <span className="h-2 w-2 rounded-full bg-yellow-500 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Cột phải: Ma trận vai trò x quyền */}
        <div className="flex-1 flex flex-col min-w-0 border rounded-lg bg-card overflow-hidden">
          {!selectedModule ? (
            <div className="flex items-center justify-center p-8 flex-1">
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium mb-2">Chưa chọn module</p>
                <p className="text-sm">Vui lòng chọn một module ở bên trái để xem và chỉnh sửa phân quyền</p>
              </div>
            </div>
          ) : isLoadingMatrix ? (
            <div className="flex items-center justify-center p-8 flex-1">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b bg-muted/50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold">
                      Phân quyền: {selectedModuleLabel}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ma trận phân quyền cho tất cả vai trò
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {hasChanges && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancel}
                          disabled={isLoading}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Hủy
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleSave}
                          disabled={isLoading}
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Lưu thay đổi
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => refetch()}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
                      Làm mới
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <div className="inline-block min-w-full">
                  <table className="w-full border-collapse">
                    <thead className="bg-muted sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold border-b sticky left-0 bg-muted z-20 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <span>Vai trò</span>
                          </div>
                        </th>
                        {ACTIONS.map((action) => (
                          <th
                            key={action.key}
                            className="px-4 py-3 text-center text-sm font-semibold border-b min-w-[120px]"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <span>{action.label}</span>
                              <Checkbox
                                checked={isActionAllSelected(action.key)}
                                onCheckedChange={(checked) =>
                                  handleSelectAllAction(action.key, checked ?? false)
                                }
                                disabled={isLoading}
                                className={cn(
                                  isActionPartiallySelected(action.key) &&
                                    'opacity-50'
                                )}
                              />
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {localMatrix.map((vaiTro) => {
                        const isAllSelected = isVaiTroAllSelected(vaiTro.vai_tro_id)

                        return (
                          <tr
                            key={vaiTro.vai_tro_id}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm font-medium border-r sticky left-0 bg-card z-10">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={isAllSelected}
                                  onCheckedChange={(checked) =>
                                    handleSelectAllVaiTro(vaiTro.vai_tro_id, checked ?? false)
                                  }
                                  disabled={isLoading}
                                />
                                <span>{vaiTro.vai_tro_ten}</span>
                              </div>
                            </td>
                            {ACTIONS.map((action) => {
                              const permission = vaiTro.permissions.find(
                                (p) => p.action === action.key
                              )
                              const allowed = permission?.allowed ?? false

                              return (
                                <td
                                  key={`${vaiTro.vai_tro_id}-${action.key}`}
                                  className="px-4 py-3 text-center border-r"
                                >
                                  <Checkbox
                                    checked={allowed}
                                    onCheckedChange={(checked) =>
                                      handleToggle(vaiTro.vai_tro_id, action.key, checked ?? false)
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
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thông báo có thay đổi chưa lưu */}
      {hasChanges && selectedModule && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Bạn có thay đổi chưa được lưu. Vui lòng nhấn "Lưu thay đổi" để áp dụng.
          </p>
        </div>
      )}
    </div>
  )
}
