import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { DanhMucWithParent } from '@/types/danh-muc'
import { getLevel2ItemsByLoai } from '../utils/danh-muc-helpers'

interface DanhMucComboboxProps {
  value?: string | null
  onChange: (value: string | null) => void
  loai: 'thu' | 'chi'
  danhSachDanhMuc: DanhMucWithParent[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

/**
 * DanhMucCombobox - Combobox để chọn danh mục cấp 2, nhóm theo cấp 1
 * Chỉ hiển thị danh mục cấp 2 (có parent_id) và nhóm theo danh mục cha
 */
export function DanhMucCombobox({
  value,
  onChange,
  loai,
  danhSachDanhMuc,
  placeholder = 'Chọn danh mục...',
  disabled = false,
  className,
}: DanhMucComboboxProps) {
  const [open, setOpen] = React.useState(false)

  // Lấy danh sách danh mục cấp 2 theo loại
  const level2Items = React.useMemo(() => {
    return getLevel2ItemsByLoai(danhSachDanhMuc, loai)
  }, [danhSachDanhMuc, loai])

  // Xây dựng tree structure để nhóm theo parent (chỉ lấy cấp 1 và cấp 2 của loại này)
  const treeStructure = React.useMemo(() => {
    // Lấy tất cả danh mục theo loại
    const allItems = danhSachDanhMuc.filter(
      (item) => item.loai === loai || item.hang_muc === loai
    )
    
    // Chỉ lấy cấp 1 và cấp 2
    const level1Items = allItems.filter((item) => !item.parent_id || !item.danh_muc_cha_id)
    const level2Items = allItems.filter((item) => item.parent_id || item.danh_muc_cha_id)
    
    // Build tree: chỉ hiển thị cấp 1 có con là cấp 2
    return level1Items
      .map((parent) => {
        const children = level2Items.filter((child) => {
          const childParentId = child.parent_id || child.danh_muc_cha_id
          const parentId = parent.id
          return String(childParentId) === String(parentId)
        })
        
        return {
          ...parent,
          children: children.length > 0 ? children : undefined,
        }
      })
      .filter((parent) => parent.children && parent.children.length > 0) // Chỉ hiển thị cấp 1 có con
  }, [danhSachDanhMuc, loai])

  // Tìm danh mục được chọn
  const selectedItem = React.useMemo(() => {
    if (!value) return null
    const numValue = typeof value === 'string' ? Number(value) : value
    return level2Items.find((item) => {
      const itemId = typeof item.id === 'string' ? Number(item.id) : item.id
      return itemId === numValue
    })
  }, [value, level2Items])

  // Tìm parent của danh mục được chọn
  const selectedParent = React.useMemo(() => {
    if (!selectedItem) return null
    const parentId = selectedItem.parent_id || selectedItem.danh_muc_cha_id
    if (!parentId) return null
    return danhSachDanhMuc.find((item) => {
      const itemId = typeof item.id === 'string' ? Number(item.id) : item.id
      const parentIdNum = typeof parentId === 'string' ? Number(parentId) : parentId
      return itemId === parentIdNum
    })
  }, [selectedItem, danhSachDanhMuc])

  // Format hiển thị: [Cấp 1] > [Cấp 2]
  const displayValue = React.useMemo(() => {
    if (!selectedItem) return placeholder
    const parentName = selectedParent?.ten || selectedParent?.ten_danh_muc || ''
    const itemName = selectedItem.ten || selectedItem.ten_danh_muc || ''
    if (selectedParent && parentName) {
      return `${parentName} > ${itemName}`
    }
    return itemName
  }, [selectedItem, selectedParent, placeholder])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Tìm kiếm danh mục..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
            {treeStructure.map((parent) => {
              const children = parent.children || []
              if (children.length === 0) return null

              const parentName = parent.ten || parent.ten_danh_muc || ''

              return (
                <CommandGroup key={parent.id} heading={parentName}>
                  {children.map((child) => {
                    const childName = child.ten || child.ten_danh_muc || ''
                    const childId = typeof child.id === 'string' ? Number(child.id) : child.id
                    const currentValue = typeof value === 'string' ? Number(value) : value
                    
                    return (
                      <CommandItem
                        key={child.id}
                        value={`${parentName} ${childName}`}
                        onSelect={() => {
                          // Đảm bảo onSelect được gọi khi click chuột
                          onChange(String(childId))
                          setOpen(false)
                        }}
                        onClick={(e) => {
                          // Xử lý click trực tiếp như một fallback
                          e.preventDefault()
                          e.stopPropagation()
                          onChange(String(childId))
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4 pointer-events-none',
                            currentValue === childId ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span className="pointer-events-none">{childName}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

