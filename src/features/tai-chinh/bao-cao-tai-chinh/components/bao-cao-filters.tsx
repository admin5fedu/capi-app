import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/ui/date-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { X, Filter, ChevronDown } from 'lucide-react'
import type { BaoCaoFilters } from '@/types/bao-cao-tai-chinh'
import type { LoaiGiaoDich } from '@/types/giao-dich'
import type { DanhMuc } from '@/types/danh-muc'
import type { DoiTac } from '@/types/doi-tac'
import type { NguoiDung } from '@/types/nguoi-dung'
import type { TaiKhoan } from '@/types/tai-khoan'

interface BaoCaoFiltersProps {
  filters: BaoCaoFilters
  onFiltersChange: (filters: BaoCaoFilters) => void
  danhMucList?: DanhMuc[]
  doiTacList?: DoiTac[]
  nguoiDungList?: NguoiDung[]
  taiKhoanList?: TaiKhoan[]
  isLoading?: boolean
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

export function BaoCaoFilters({
  filters,
  onFiltersChange,
  danhMucList = [],
  doiTacList = [],
  nguoiDungList = [],
  taiKhoanList = [],
  isLoading = false,
}: BaoCaoFiltersProps) {
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
            className="w-full justify-between"
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              Xóa tất cả
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Thời gian */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Từ ngày</Label>
            <DatePicker
              value={filters.tuNgay || undefined}
              onChange={(date) => updateFilter('tuNgay', date ? date.toISOString().split('T')[0] : null)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label>Đến ngày</Label>
            <DatePicker
              value={filters.denNgay || undefined}
              onChange={(date) => updateFilter('denNgay', date ? date.toISOString().split('T')[0] : null)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Tìm kiếm */}
        <div className="space-y-2">
          <Label>Tìm kiếm</Label>
          <Input
            placeholder="Mã phiếu, mô tả, số chứng từ..."
            value={filters.keyword || ''}
            onChange={(e) => updateFilter('keyword', e.target.value || undefined)}
            disabled={isLoading}
          />
        </div>

        {/* Danh mục */}
        <div className="space-y-2">
          <Label>Danh mục</Label>
          <MultiSelectPopover
            keyName="danhMuc"
            label="Chọn danh mục"
            options={danhMucList.map((dm) => ({ value: dm.id, label: dm.ten }))}
            selectedValues={filters.danhMucIds}
            onToggle={(value) => toggleArrayFilter('danhMucIds', value, filters.danhMucIds)}
          />
          {filters.danhMucIds && filters.danhMucIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.danhMucIds.map((id) => {
                const danhMuc = danhMucList.find((dm) => dm.id === id)
                return (
                  <Badge key={id} variant="secondary" className="gap-1">
                    {danhMuc?.ten || id}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleArrayFilter('danhMucIds', id, filters.danhMucIds)}
                    />
                  </Badge>
                )
              })}
            </div>
          )}
        </div>

        {/* Đối tác */}
        <div className="space-y-2">
          <Label>Đối tác</Label>
          <MultiSelectPopover
            keyName="doiTac"
            label="Chọn đối tác"
            options={doiTacList.map((dt) => ({ value: dt.id, label: dt.ten }))}
            selectedValues={filters.doiTacIds}
            onToggle={(value) => toggleArrayFilter('doiTacIds', value, filters.doiTacIds)}
          />
          {filters.doiTacIds && filters.doiTacIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.doiTacIds.map((id) => {
                const doiTac = doiTacList.find((dt) => dt.id === id)
                return (
                  <Badge key={id} variant="secondary" className="gap-1">
                    {doiTac?.ten || id}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleArrayFilter('doiTacIds', id, filters.doiTacIds)}
                    />
                  </Badge>
                )
              })}
            </div>
          )}
        </div>

        {/* Loại giao dịch */}
        <div className="space-y-2">
          <Label>Loại giao dịch</Label>
          <MultiSelectPopover
            keyName="loaiGiaoDich"
            label="Chọn loại"
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
          {filters.loaiGiaoDich && filters.loaiGiaoDich.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.loaiGiaoDich.map((loai) => {
                const option = LOAI_GIAO_DICH_OPTIONS.find((opt) => opt.value === loai)
                return (
                  <Badge key={loai} variant="secondary" className="gap-1">
                    {option?.label || loai}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        const newArray = filters.loaiGiaoDich!.filter((v) => v !== loai)
                        updateFilter('loaiGiaoDich', newArray.length > 0 ? newArray : undefined)
                      }}
                    />
                  </Badge>
                )
              })}
            </div>
          )}
        </div>

        {/* Người tạo */}
        <div className="space-y-2">
          <Label>Người tạo</Label>
          <MultiSelectPopover
            keyName="nguoiTao"
            label="Chọn người tạo"
            options={nguoiDungList.map((nd) => ({
              value: nd.id,
              label: nd.ho_ten || nd.email,
            }))}
            selectedValues={filters.nguoiTaoIds}
            onToggle={(value) => toggleArrayFilter('nguoiTaoIds', value, filters.nguoiTaoIds)}
          />
          {filters.nguoiTaoIds && filters.nguoiTaoIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.nguoiTaoIds.map((id) => {
                const nguoiDung = nguoiDungList.find((nd) => nd.id === id)
                return (
                  <Badge key={id} variant="secondary" className="gap-1">
                    {nguoiDung?.ho_ten || nguoiDung?.email || id}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleArrayFilter('nguoiTaoIds', id, filters.nguoiTaoIds)}
                    />
                  </Badge>
                )
              })}
            </div>
          )}
        </div>

        {/* Tài khoản */}
        <div className="space-y-2">
          <Label>Tài khoản</Label>
          <MultiSelectPopover
            keyName="taiKhoan"
            label="Chọn tài khoản"
            options={taiKhoanList.map((tk) => ({ value: tk.id, label: tk.ten }))}
            selectedValues={filters.taiKhoanIds}
            onToggle={(value) => toggleArrayFilter('taiKhoanIds', value, filters.taiKhoanIds)}
          />
          {filters.taiKhoanIds && filters.taiKhoanIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.taiKhoanIds.map((id) => {
                const taiKhoan = taiKhoanList.find((tk) => tk.id === id)
                return (
                  <Badge key={id} variant="secondary" className="gap-1">
                    {taiKhoan?.ten || id}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => toggleArrayFilter('taiKhoanIds', id, filters.taiKhoanIds)}
                    />
                  </Badge>
                )
              })}
            </div>
          )}
        </div>

        {/* Loại tiền */}
        <div className="space-y-2">
          <Label>Loại tiền</Label>
          <MultiSelectPopover
            keyName="loaiTien"
            label="Chọn loại tiền"
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
          {filters.loaiTien && filters.loaiTien.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.loaiTien.map((loai) => (
                <Badge key={loai} variant="secondary" className="gap-1">
                  {loai}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      const newArray = filters.loaiTien!.filter((v) => v !== loai)
                      updateFilter('loaiTien', newArray.length > 0 ? newArray : undefined)
                    }}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

