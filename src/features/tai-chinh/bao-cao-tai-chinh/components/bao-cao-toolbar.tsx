import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X, ChevronDown } from 'lucide-react'
import type { BaoCaoFilters, BaoCaoData } from '@/types/bao-cao-tai-chinh'
import type { LoaiGiaoDich } from '@/types/giao-dich'
import type { DanhMuc } from '@/types/danh-muc'
import type { DoiTac } from '@/types/doi-tac'
import type { NguoiDung } from '@/types/nguoi-dung'
import type { TaiKhoan } from '@/types/tai-khoan'
import { BaoCaoExport } from './bao-cao-export'
import { DateRangePicker } from './date-range-picker'

interface BaoCaoToolbarProps {
  filters: BaoCaoFilters
  onFiltersChange: (filters: BaoCaoFilters) => void
  danhMucList?: DanhMuc[]
  doiTacList?: DoiTac[]
  nguoiDungList?: NguoiDung[]
  taiKhoanList?: TaiKhoan[]
  isLoading?: boolean
  baoCaoData?: BaoCaoData
}

const LOAI_GIAO_DICH_OPTIONS: Array<{ value: LoaiGiaoDich; label: string }> = [
  { value: 'thu', label: 'Thu' },
  { value: 'chi', label: 'Chi' },
  { value: 'luan_chuyen', label: 'Luân chuyển' },
]

const LOAI_TIEN_OPTIONS = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' },
]

export function BaoCaoToolbar({
  filters,
  onFiltersChange,
  danhMucList = [],
  doiTacList = [],
  nguoiDungList = [],
  taiKhoanList = [],
  isLoading = false,
  baoCaoData,
}: BaoCaoToolbarProps) {
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({})

  const updateFilter = <K extends keyof BaoCaoFilters>(key: K, value: BaoCaoFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = <K extends keyof BaoCaoFilters>(
    key: K,
    value: string,
    currentArray?: string[]
  ) => {
    const array = currentArray || []
    const newArray = array.includes(value)
      ? array.filter((v) => v !== value)
      : [...array, value]
    updateFilter(key, (newArray.length > 0 ? newArray : undefined) as BaoCaoFilters[K])
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Boolean(
    filters.tuNgay ||
    filters.denNgay ||
    (filters.danhMucIds && filters.danhMucIds.length > 0) ||
    (filters.doiTacIds && filters.doiTacIds.length > 0) ||
    (filters.loaiGiaoDich && filters.loaiGiaoDich.length > 0) ||
    (filters.nguoiTaoIds && filters.nguoiTaoIds.length > 0) ||
    (filters.taiKhoanIds && filters.taiKhoanIds.length > 0) ||
    (filters.loaiTien && filters.loaiTien.length > 0) ||
    filters.keyword
  )

  const MultiSelectPopover = ({
    keyName,
    label,
    options,
    selectedValues,
    onToggle,
  }: {
    keyName: string
    label: string
    options: Array<{ value: string; label: string }>
    selectedValues?: string[]
    onToggle: (value: string) => void
  }) => {
    const isOpen = openPopovers[keyName] || false
    const count = selectedValues?.length || 0

    return (
      <Popover
        open={isOpen}
        onOpenChange={(open) => setOpenPopovers({ ...openPopovers, [keyName]: open })}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 justify-between min-w-[140px] shrink-0"
            disabled={isLoading}
          >
            <span className="truncate">
              {count > 0 ? `${label} (${count})` : label}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder={`Tìm kiếm ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>Không tìm thấy.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues?.includes(option.value) || false
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => onToggle(option.value)}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onToggle(option.value)
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox 
                        checked={isSelected} 
                        onCheckedChange={() => onToggle(option.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="flex-1">{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  // Collect all active filter badges
  const allActiveFilters = useMemo(() => {
    const result: Array<{ id: string; label: string; type: string; onRemove: () => void }> = []
    
    filters.danhMucIds?.forEach((id) => {
      const danhMuc = danhMucList.find((dm) => String(dm.id) === id)
      result.push({
        id: `danhMuc-${id}`,
        label: danhMuc?.ten || danhMuc?.ten_danh_muc || id,
        type: 'Danh mục',
        onRemove: () => toggleArrayFilter('danhMucIds', id, filters.danhMucIds),
      })
    })
    
    filters.doiTacIds?.forEach((id) => {
      const doiTac = doiTacList.find((dt) => String(dt.id) === id)
      result.push({
        id: `doiTac-${id}`,
        label: doiTac?.ten_doi_tac || id,
        type: 'Đối tác',
        onRemove: () => toggleArrayFilter('doiTacIds', id, filters.doiTacIds),
      })
    })
    
    filters.loaiGiaoDich?.forEach((loai) => {
      const option = LOAI_GIAO_DICH_OPTIONS.find((opt) => opt.value === loai)
      result.push({
        id: `loai-${loai}`,
        label: option?.label || loai,
        type: 'Loại',
        onRemove: () => {
          const newArray = filters.loaiGiaoDich!.filter((v) => v !== loai)
          updateFilter('loaiGiaoDich', newArray.length > 0 ? newArray : undefined)
        },
      })
    })
    
    filters.nguoiTaoIds?.forEach((id) => {
      const nguoiDung = nguoiDungList.find((nd) => String(nd.id) === id)
      result.push({
        id: `nguoiTao-${id}`,
        label: nguoiDung?.ho_va_ten || nguoiDung?.ho_ten || nguoiDung?.email || id,
        type: 'Người tạo',
        onRemove: () => toggleArrayFilter('nguoiTaoIds', id, filters.nguoiTaoIds),
      })
    })
    
    filters.taiKhoanIds?.forEach((id) => {
      const taiKhoan = taiKhoanList.find((tk) => String(tk.id) === id)
      result.push({
        id: `taiKhoan-${id}`,
        label: taiKhoan?.ten_tai_khoan || taiKhoan?.ten || id,
        type: 'Tài khoản',
        onRemove: () => toggleArrayFilter('taiKhoanIds', id, filters.taiKhoanIds),
      })
    })
    
    filters.loaiTien?.forEach((loai) => {
      result.push({
        id: `loaiTien-${loai}`,
        label: loai,
        type: 'Loại tiền',
        onRemove: () => {
          const newArray = filters.loaiTien!.filter((v) => v !== loai)
          updateFilter('loaiTien', newArray.length > 0 ? newArray : undefined)
        },
      })
    })
    
    return result
  }, [filters, danhMucList, doiTacList, nguoiDungList, taiKhoanList, toggleArrayFilter, updateFilter])

  const MAX_VISIBLE_CHIPS = 3
  const visibleChips = allActiveFilters.slice(0, MAX_VISIBLE_CHIPS)
  const hiddenChips = allActiveFilters.slice(MAX_VISIBLE_CHIPS)

  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      <div className="flex items-center">
        {/* Section 0: Fixed Date Range Picker */}
        <div className="flex items-center px-6 py-3 border-r bg-background flex-shrink-0">
          <DateRangePicker
            tuNgay={filters.tuNgay}
            denNgay={filters.denNgay}
            onChange={(tuNgay, denNgay) => {
              updateFilter('tuNgay', tuNgay)
              updateFilter('denNgay', denNgay)
            }}
            disabled={isLoading}
          />
        </div>

        {/* Section 1: Scrollable filters and chips */}
        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-3 px-6 py-3 min-w-fit">
            {/* Filters */}
            <div className="flex items-center gap-2 flex-shrink-0">

        {/* Danh mục */}
        <MultiSelectPopover
          keyName="danhMuc"
          label="Danh mục"
          options={danhMucList.map((dm) => ({ value: String(dm.id), label: dm.ten || '' }))}
          selectedValues={filters.danhMucIds}
          onToggle={(value) => toggleArrayFilter('danhMucIds', value, filters.danhMucIds)}
        />

        {/* Đối tác */}
        <MultiSelectPopover
          keyName="doiTac"
          label="Đối tác"
          options={doiTacList.map((dt) => ({ value: String(dt.id), label: dt.ten_doi_tac || '' }))}
          selectedValues={filters.doiTacIds}
          onToggle={(value) => toggleArrayFilter('doiTacIds', value, filters.doiTacIds)}
        />

        {/* Loại giao dịch */}
        <MultiSelectPopover
          keyName="loaiGiaoDich"
          label="Loại"
          options={LOAI_GIAO_DICH_OPTIONS.map((opt) => ({
            value: opt.value,
            label: opt.label,
          }))}
          selectedValues={filters.loaiGiaoDich}
          onToggle={(value) => {
            const current = filters.loaiGiaoDich || []
            const newArray = current.includes(value as LoaiGiaoDich)
              ? current.filter((v) => v !== value)
              : [...current, value as LoaiGiaoDich]
            updateFilter('loaiGiaoDich', newArray.length > 0 ? newArray : undefined)
          }}
        />

        {/* Người tạo */}
        <MultiSelectPopover
          keyName="nguoiTao"
          label="Người tạo"
          options={nguoiDungList.map((nd) => ({
            value: String(nd.id),
            label: nd.ho_va_ten || nd.ho_ten || nd.email || '',
          }))}
          selectedValues={filters.nguoiTaoIds}
          onToggle={(value) => toggleArrayFilter('nguoiTaoIds', value, filters.nguoiTaoIds)}
        />

        {/* Tài khoản */}
        <MultiSelectPopover
          keyName="taiKhoan"
          label="Tài khoản"
          options={taiKhoanList.map((tk) => ({ value: String(tk.id), label: tk.ten_tai_khoan || tk.ten || '' }))}
          selectedValues={filters.taiKhoanIds}
          onToggle={(value) => toggleArrayFilter('taiKhoanIds', value, filters.taiKhoanIds)}
        />

        {/* Loại tiền */}
        <MultiSelectPopover
          keyName="loaiTien"
          label="Loại tiền"
          options={LOAI_TIEN_OPTIONS}
          selectedValues={filters.loaiTien}
          onToggle={(value) => {
            const current = filters.loaiTien || []
            const newArray = current.includes(value as 'VND' | 'USD')
              ? current.filter((v) => v !== value)
              : [...current, value as 'VND' | 'USD']
            updateFilter('loaiTien', newArray.length > 0 ? newArray : undefined)
          }}
        />

            </div>

            {/* Active filter chips */}
            {allActiveFilters.length > 0 && (
              <>
                <div className="h-6 w-px bg-border flex-shrink-0" />
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Active filter chips - visible */}
                  {visibleChips.map((filter) => (
                    <Badge key={filter.id} variant="secondary" className="gap-1 text-xs flex-shrink-0 whitespace-nowrap">
                      {filter.label}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={filter.onRemove}
                      />
                    </Badge>
                  ))}

                  {/* More filters indicator */}
                  {hiddenChips.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Badge variant="secondary" className="gap-1 text-xs flex-shrink-0 cursor-pointer whitespace-nowrap">
                          +{hiddenChips.length} khác
                        </Badge>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-2" align="start">
                        <div className="space-y-2">
                          <div className="text-sm font-medium mb-2">Các bộ lọc đã chọn:</div>
                          <div className="flex flex-wrap gap-2">
                            {allActiveFilters.map((filter) => (
                              <Badge key={filter.id} variant="secondary" className="gap-1 text-xs">
                                <span className="text-muted-foreground text-[10px]">{filter.type}:</span>
                                {filter.label}
                                <X
                                  className="h-3 w-3 cursor-pointer"
                                  onClick={filter.onRemove}
                                />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}

                  {/* Clear filters */}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-9 text-muted-foreground hover:text-foreground flex-shrink-0 whitespace-nowrap"
                    >
                      <X className="h-4 w-4 mr-1.5" />
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 2: Fixed actions */}
        {baoCaoData && (
          <div className="flex items-center gap-2 px-6 py-3 border-l bg-background flex-shrink-0">
            <BaoCaoExport data={baoCaoData} filters={filters} />
          </div>
        )}
      </div>
    </div>
  )
}

