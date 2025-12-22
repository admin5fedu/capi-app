import { Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CotHienThi } from '../types'
import { VisibilityState } from '@tanstack/react-table'

interface ColumnVisibilityMenuProps<TData extends Record<string, any>> {
  cotHienThi: CotHienThi<TData>[]
  columnVisibility: VisibilityState
  setColumnVisibility: (visibility: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void
  showColumnMenu: boolean
  setShowColumnMenu: (show: boolean) => void
}

export function ColumnVisibilityMenu<TData extends Record<string, any>>({
  cotHienThi,
  columnVisibility,
  setColumnVisibility,
  showColumnMenu,
  setShowColumnMenu,
}: ColumnVisibilityMenuProps<TData>) {
  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowColumnMenu(!showColumnMenu)}
        title="Chọn cột hiển thị"
      >
        <Settings2 className="h-4 w-4" />
      </Button>
      {showColumnMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowColumnMenu(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-card border rounded-md shadow-lg z-20 p-2 max-h-96 overflow-y-auto">
            {cotHienThi.map((cot) => (
              <label
                key={cot.key}
                className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={columnVisibility[cot.key] !== false}
                  onChange={(e) => {
                    setColumnVisibility((prev) => ({
                      ...prev,
                      [cot.key]: e.target.checked,
                    }))
                  }}
                />
                <span className="text-sm">{cot.label}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

