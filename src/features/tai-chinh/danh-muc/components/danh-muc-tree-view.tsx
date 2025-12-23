import { useState, useMemo } from 'react'
import { ChevronRight, ChevronDown, Pencil, Trash2, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { DanhMucWithParent, DanhMucWithChildren } from '@/types/danh-muc'
import { buildTreeStructure, isLevel1 } from '../utils/danh-muc-helpers'
import { getThuChiBadgeVariant, getStatusBadgeVariant } from '@/shared/utils/color-utils'
import { LOAI_DANH_MUC } from '../config'

interface DanhMucTreeViewProps {
  data: DanhMucWithParent[]
  onEdit?: (id: string) => void
  onDelete?: (item: DanhMucWithParent) => void
  onView?: (id: string) => void
  isLoading?: boolean
}

interface TreeItemProps {
  item: DanhMucWithChildren
  level: number
  expanded: Set<string>
  onToggleExpand: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (item: DanhMucWithParent) => void
  onView?: (id: string) => void
}

function TreeItem({
  item,
  level,
  expanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onView,
}: TreeItemProps) {
  const hasChildren = item.children && item.children.length > 0
  const isExpanded = expanded.has(item.id)
  const isLevel1Item = isLevel1(item)

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 hover:bg-accent/50 rounded-md group',
          level === 0 && 'font-semibold',
          level === 1 && 'pl-8'
        )}
      >
        {/* Chevron icon cho cấp 1 có children */}
        <div className="w-5 flex items-center justify-center">
          {isLevel1Item && hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0"
              onClick={() => onToggleExpand(item.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <div className="w-5" />
          )}
        </div>

        {/* Tên danh mục */}
        <div
          className="flex-1 flex items-center gap-2 cursor-pointer"
          onClick={() => onView?.(item.id)}
        >
          <span className={cn(level === 1 && 'text-sm')}>{item.ten}</span>
          {level === 1 && (
            <span className="text-xs text-muted-foreground">({item.parent_ten})</span>
          )}
          {isLevel1Item && hasChildren && (
            <Badge variant="outline" className="ml-2 text-xs">
              {item.children?.length || 0} con
            </Badge>
          )}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2">
          <Badge variant={getThuChiBadgeVariant(item.loai)}>
            {LOAI_DANH_MUC.find((l) => l.value === item.loai)?.label || item.loai}
          </Badge>
          <Badge variant={getStatusBadgeVariant(item.is_active)}>
            {item.is_active ? 'Hoạt động' : 'Vô hiệu hóa'}
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(item.id)
              }}
              title="Sửa"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(item)
              }}
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Children */}
      {isLevel1Item && hasChildren && isExpanded && (
        <div className="ml-4 border-l-2 border-border/50">
          {item.children?.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              level={1}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * DanhMucTreeView component - Hiển thị danh mục dạng tree với phân cấp 2 cấp
 */
export function DanhMucTreeView({
  data,
  onEdit,
  onDelete,
  onView,
  isLoading,
}: DanhMucTreeViewProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  // Filter data theo search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data
    
    const lowerSearch = searchTerm.toLowerCase()
    return data.filter((item) => 
      item.ten.toLowerCase().includes(lowerSearch) ||
      item.mo_ta?.toLowerCase().includes(lowerSearch) ||
      item.parent_ten?.toLowerCase().includes(lowerSearch)
    )
  }, [data, searchTerm])

  // Xây dựng tree structure và nhóm theo loại
  const treeByLoai = useMemo(() => {
    const thuItems = filteredData.filter((item) => item.loai === 'thu')
    const chiItems = filteredData.filter((item) => item.loai === 'chi')

    return {
      thu: buildTreeStructure(thuItems),
      chi: buildTreeStructure(chiItems),
    }
  }, [filteredData])

  // Auto-expand khi search
  useMemo(() => {
    if (searchTerm && treeByLoai.thu.length > 0) {
      const allParentIds = new Set<string>()
      treeByLoai.thu.forEach((item) => {
        if (item.children && item.children.length > 0) {
          allParentIds.add(item.id)
        }
      })
      treeByLoai.chi.forEach((item) => {
        if (item.children && item.children.length > 0) {
          allParentIds.add(item.id)
        }
      })
      setExpanded(allParentIds)
    }
  }, [searchTerm, treeByLoai])

  const handleToggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleExpandAll = () => {
    const allParentIds = new Set<string>()
    treeByLoai.thu.forEach((item) => {
      if (item.children && item.children.length > 0) {
        allParentIds.add(item.id)
      }
    })
    treeByLoai.chi.forEach((item) => {
      if (item.children && item.children.length > 0) {
        allParentIds.add(item.id)
      }
    })
    setExpanded(allParentIds)
  }

  const handleCollapseAll = () => {
    setExpanded(new Set())
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải dữ liệu...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar với search và expand/collapse */}
      <div className="flex items-center gap-2 px-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full w-8"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleExpandAll}>
          Mở tất cả
        </Button>
        <Button variant="outline" size="sm" onClick={handleCollapseAll}>
          Đóng tất cả
        </Button>
      </div>

      {/* Thu */}
      {treeByLoai.thu.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2 px-3">Thu</h3>
          <div className="space-y-1">
            {treeByLoai.thu.map((item) => (
              <TreeItem
                key={item.id}
                item={item}
                level={0}
                expanded={expanded}
                onToggleExpand={handleToggleExpand}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </div>
        </div>
      )}

      {/* Chi */}
      {treeByLoai.chi.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2 px-3">Chi</h3>
          <div className="space-y-1">
            {treeByLoai.chi.map((item) => (
              <TreeItem
                key={item.id}
                item={item}
                level={0}
                expanded={expanded}
                onToggleExpand={handleToggleExpand}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </div>
        </div>
      )}

      {treeByLoai.thu.length === 0 && treeByLoai.chi.length === 0 && (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">
            {searchTerm ? 'Không tìm thấy danh mục' : 'Không có dữ liệu'}
          </div>
        </div>
      )}
    </div>
  )
}

