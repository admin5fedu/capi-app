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
import { getLevel2ItemsByLoai, buildTreeStructure } from '../utils/danh-muc-helpers'

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

  // Xây dựng tree structure để nhóm theo parent (chỉ lấy danh mục active)
  const treeStructure = React.useMemo(() => {
    const allItems = danhSachDanhMuc.filter(
      (item) => item.loai === loai && item.is_active
    )
    return buildTreeStructure(allItems)
  }, [danhSachDanhMuc, loai])

  // Tìm danh mục được chọn
  const selectedItem = React.useMemo(() => {
    if (!value) return null
    return level2Items.find((item) => item.id === value)
  }, [value, level2Items])

  // Tìm parent của danh mục được chọn
  const selectedParent = React.useMemo(() => {
    if (!selectedItem?.parent_id) return null
    return danhSachDanhMuc.find((item) => item.id === selectedItem.parent_id)
  }, [selectedItem, danhSachDanhMuc])

  // Format hiển thị: [Cấp 1] > [Cấp 2]
  const displayValue = React.useMemo(() => {
    if (!selectedItem) return placeholder
    if (selectedParent) {
      return `${selectedParent.ten} > ${selectedItem.ten}`
    }
    return selectedItem.ten
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

              return (
                <CommandGroup key={parent.id} heading={parent.ten}>
                  {children.map((child) => (
                    <CommandItem
                      key={child.id}
                      value={`${parent.ten} ${child.ten}`}
                      onSelect={() => {
                        onChange(child.id)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === child.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <span>{child.ten}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

