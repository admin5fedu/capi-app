import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X, ChevronDown } from 'lucide-react'
import type { BaoCaoTaiKhoanFilters, BaoCaoTaiKhoanData } from '@/types/bao-cao-tai-khoan'
import type { LoaiGiaoDich } from '@/types/giao-dich'
import type { DanhMuc } from '@/types/danh-muc'
import type { DoiTac } from '@/types/doi-tac'
import type { NguoiDung } from '@/types/nguoi-dung'
import type { TaiKhoan } from '@/types/tai-khoan'
import { BaoCaoTaiKhoanExport } from './bao-cao-tai-khoan-export'
import { DateRangePicker } from '@/features/tai-chinh/bao-cao-tai-chinh/components/date-range-picker'
import { LOAI_TAI_KHOAN } from '@/features/tai-chinh/tai-khoan/config'

interface BaoCaoTaiKhoanToolbarProps {
  filters: BaoCaoTaiKhoanFilters
  onFiltersChange: (filters: BaoCaoTaiKhoanFilters) => void
  danhMucList?: DanhMuc[]
  doiTacList?: DoiTac[]
  nguoiDungList?: NguoiDung[]
  taiKhoanList?: TaiKhoan[]
  isLoading?: boolean
  baoCaoData?: BaoCaoTaiKhoanData
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

export function BaoCaoTaiKhoanToolbar({
  filters,
  onFiltersChange,
  danhMucList = [],
  doiTacList = [],
  nguoiDungList = [],
  taiKhoanList = [],
  isLoading: _isLoading = false,
  baoCaoData,
}: BaoCaoTaiKhoanToolbarProps) {
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({})

  const updateFilter = <K extends keyof BaoCaoTaiKhoanFilters>(key: K, value: BaoCaoTaiKhoanFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = <K extends keyof BaoCaoTaiKhoanFilters>(
    key: K,
    value: string,
    currentArray?: string[]
  ) => {
    const array = currentArray || []
    const newArray = array.includes(value)
      ? array.filter((v) => v !== value)
      : [...array, value]
    updateFilter(key, (newArray.length > 0 ? newArray : undefined) as BaoCaoTaiKhoanFilters[K])
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Boolean(
    filters.tuNgay ||
    filters.denNgay ||
    (filters.taiKhoanIds && filters.taiKhoanIds.length > 0) ||
    (filters.loaiTaiKhoan && filters.loaiTaiKhoan.length > 0) ||
    (filters.loaiTien && filters.loaiTien.length > 0) ||
    (filters.loaiGiaoDich && filters.loaiGiaoDich.length > 0) ||
    (filters.danhMucIds && filters.danhMucIds.length > 0) ||
    (filters.doiTacIds && filters.doiTacIds.length > 0) ||
    (filters.nguoiTaoIds && filters.nguoiTaoIds.length > 0) ||
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
            className="h-9 text-xs whitespace-nowrap"
          >
            {label}
            {count > 0 && (
              <Badge variant="secondary" className="ml-1.5 h-5 min-w-5 px-1.5 text-[10px]">
                {count}
              </Badge>
            )}
            <ChevronDown className="ml-1.5 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
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
                      onSelect={() => {
                        onToggle(option.value)
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onToggle(option.value)
                      }}
                      className="cursor-pointer"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => {
                          onToggle(option.value)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="mr-2"
                      />
                      {option.label}
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

  // Build active filters list
  const allActiveFilters = useMemo(() => {
    const activeFilters: Array<{ id: string; label: string; type: string; onRemove: () => void }> = []

    if (filters.taiKhoanIds && filters.taiKhoanIds.length > 0) {
      filters.taiKhoanIds.forEach((id: string) => {
        const tk = taiKhoanList.find((t) => String(t.id) === id)
        if (tk) {
          activeFilters.push({
            id: `tai-khoan-${id}`,
            label: tk.ten_tai_khoan || tk.ten || '',
            type: 'Tài khoản',
            onRemove: () => {
              const newIds = filters.taiKhoanIds?.filter((i: string) => i !== id)
              updateFilter('taiKhoanIds', newIds && newIds.length > 0 ? newIds : undefined)
            },
          })
        }
      })
    }

    if (filters.loaiTaiKhoan && filters.loaiTaiKhoan.length > 0) {
      filters.loaiTaiKhoan.forEach((loai: string) => {
        const loaiInfo = LOAI_TAI_KHOAN.find((l) => l.value === loai)
        activeFilters.push({
          id: `loai-tai-khoan-${loai}`,
          label: loaiInfo?.label || loai,
          type: 'Loại TK',
          onRemove: () => {
            const newArray = filters.loaiTaiKhoan?.filter((l: string) => l !== loai)
            updateFilter('loaiTaiKhoan', newArray && newArray.length > 0 ? newArray : undefined)
          },
        })
      })
    }

    if (filters.loaiTien && filters.loaiTien.length > 0) {
      filters.loaiTien.forEach((loai: string) => {
        activeFilters.push({
          id: `loai-tien-${loai}`,
          label: loai,
          type: 'Loại tiền',
          onRemove: () => {
            const newArray = filters.loaiTien?.filter((l: string) => l !== loai)
            updateFilter('loaiTien', newArray && newArray.length > 0 ? newArray : undefined)
          },
        })
      })
    }

    if (filters.loaiGiaoDich && filters.loaiGiaoDich.length > 0) {
      filters.loaiGiaoDich.forEach((loai: string) => {
        const loaiInfo = LOAI_GIAO_DICH_OPTIONS.find((l) => l.value === loai)
        activeFilters.push({
          id: `loai-${loai}`,
          label: loaiInfo?.label || loai,
          type: 'Loại',
          onRemove: () => {
            const newArray = filters.loaiGiaoDich?.filter((l: string) => l !== loai)
            updateFilter('loaiGiaoDich', newArray && newArray.length > 0 ? newArray : undefined)
          },
        })
      })
    }

    if (filters.danhMucIds && filters.danhMucIds.length > 0) {
      filters.danhMucIds.forEach((id: string) => {
        const dm = danhMucList.find((d) => String(d.id) === id)
        if (dm) {
          activeFilters.push({
            id: `danh-muc-${id}`,
            label: dm.ten || dm.ten_danh_muc || '',
            type: 'Danh mục',
            onRemove: () => {
              const newIds = filters.danhMucIds?.filter((i: string) => i !== id)
              updateFilter('danhMucIds', newIds && newIds.length > 0 ? newIds : undefined)
            },
          })
        }
      })
    }

    if (filters.doiTacIds && filters.doiTacIds.length > 0) {
      filters.doiTacIds.forEach((id: string) => {
        const dt = doiTacList.find((d) => String(d.id) === id)
        if (dt) {
          activeFilters.push({
            id: `doi-tac-${id}`,
            label: dt.ten_doi_tac || '',
            type: 'Đối tác',
            onRemove: () => {
              const newIds = filters.doiTacIds?.filter((i: string) => i !== id)
              updateFilter('doiTacIds', newIds && newIds.length > 0 ? newIds : undefined)
            },
          })
        }
      })
    }

    if (filters.nguoiTaoIds && filters.nguoiTaoIds.length > 0) {
      filters.nguoiTaoIds.forEach((id: string) => {
        const nt = nguoiDungList.find((n) => String(n.id) === id)
        if (nt) {
          activeFilters.push({
            id: `nguoi-tao-${id}`,
            label: nt.ho_va_ten || nt.ho_ten || nt.email || '',
            type: 'Người tạo',
            onRemove: () => {
              const newIds = filters.nguoiTaoIds?.filter((i: string) => i !== id)
              updateFilter('nguoiTaoIds', newIds && newIds.length > 0 ? newIds : undefined)
            },
          })
        }
      })
    }

    return activeFilters
  }, [filters, taiKhoanList, danhMucList, doiTacList, nguoiDungList])

  // Limit visible chips to 3, rest in popover
  const visibleChips = allActiveFilters.slice(0, 3)
  const hiddenChips = allActiveFilters.slice(3)

  return (
    <div className="border-b bg-background sticky top-0 z-20">
      <div className="flex items-center gap-4 px-6 py-3">
        {/* Section 1: Fixed date range */}
        <div className="flex-shrink-0">
          <DateRangePicker
            tuNgay={filters.tuNgay || null}
            denNgay={filters.denNgay || null}
            onChange={(tuNgay, denNgay) => {
              updateFilter('tuNgay', tuNgay)
              updateFilter('denNgay', denNgay)
            }}
          />
        </div>

        {/* Section 2: Scrollable filters */}
        <div className="flex-1 min-w-0 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {/* Tài khoản */}
            <MultiSelectPopover
              keyName="taiKhoan"
              label="Tài khoản"
              options={taiKhoanList.map((tk) => ({ value: String(tk.id), label: tk.ten_tai_khoan || tk.ten || '' }))}
              selectedValues={filters.taiKhoanIds}
              onToggle={(value) => toggleArrayFilter('taiKhoanIds', value, filters.taiKhoanIds)}
            />

            {/* Loại tài khoản */}
            <MultiSelectPopover
              keyName="loaiTaiKhoan"
              label="Loại TK"
              options={LOAI_TAI_KHOAN.map((l) => ({ value: l.value, label: l.label }))}
              selectedValues={filters.loaiTaiKhoan}
              onToggle={(value) => toggleArrayFilter('loaiTaiKhoan', value, filters.loaiTaiKhoan)}
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

            {/* Loại giao dịch */}
            <MultiSelectPopover
              keyName="loaiGiaoDich"
              label="Loại"
              options={LOAI_GIAO_DICH_OPTIONS.map((l) => ({ value: l.value, label: l.label }))}
              selectedValues={filters.loaiGiaoDich}
              onToggle={(value) => {
                const current = filters.loaiGiaoDich || []
                const newArray = current.includes(value as LoaiGiaoDich)
                  ? current.filter((v) => v !== value)
                  : [...current, value as LoaiGiaoDich]
                updateFilter('loaiGiaoDich', newArray.length > 0 ? newArray : undefined)
              }}
            />

            {/* Danh mục */}
            <MultiSelectPopover
              keyName="danhMuc"
              label="Danh mục"
              options={danhMucList.map((dm) => ({ value: String(dm.id), label: dm.ten || dm.ten_danh_muc || '' }))}
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

            {/* Người tạo */}
            <MultiSelectPopover
              keyName="nguoiTao"
              label="Người tạo"
              options={nguoiDungList.map((nt) => ({ value: String(nt.id), label: nt.ho_va_ten || nt.ho_ten || nt.email || '' }))}
              selectedValues={filters.nguoiTaoIds}
              onToggle={(value) => toggleArrayFilter('nguoiTaoIds', value, filters.nguoiTaoIds)}
            />

            {/* Active filter chips */}
            {allActiveFilters.length > 0 && (
              <>
                <div className="h-6 w-px bg-border flex-shrink-0" />
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Visible chips */}
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

        {/* Section 3: Fixed actions */}
        {baoCaoData && (
          <div className="flex items-center gap-2 px-6 py-3 border-l bg-background flex-shrink-0">
            <BaoCaoTaiKhoanExport data={baoCaoData} filters={filters} />
          </div>
        )}
      </div>
    </div>
  )
}

