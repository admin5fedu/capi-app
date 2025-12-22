import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/components/ui/command'
import { Checkbox } from '@/components/ui/checkbox'
import React from 'react'
import type { QuickFilter } from '../types'
import { filterDataByQuickFilters } from '../utils/filter-helpers'

interface MobileFilterPopoverProps<TData extends Record<string, any>> {
  quickFilters: QuickFilter[]
  quickFilterValues: Record<string, any>
  setQuickFilterValues: (values: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void
  dataAfterSearch: TData[]
  onClearFilters?: () => void
}

export function MobileFilterPopover<TData extends Record<string, any>>({
  quickFilters,
  quickFilterValues,
  setQuickFilterValues,
  dataAfterSearch,
  onClearFilters,
}: MobileFilterPopoverProps<TData>) {
  if (quickFilters.length === 0) return null

  // Tính tổng số giá trị đã chọn
  const getActiveFiltersCount = () => {
    let count = 0
    Object.entries(quickFilterValues).forEach(([, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          count += value.length
        } else {
          count += 1
        }
      }
    })
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()
  const hasActiveFilters = activeFiltersCount > 0

  // Helper function để check xem một giá trị có được chọn không
  const isValueSelected = (filterKey: string, optionValue: any) => {
    const currentValue = quickFilterValues[filterKey]
    if (Array.isArray(currentValue)) {
      return currentValue.some((v) => String(v) === String(optionValue))
    }
    return String(currentValue) === String(optionValue)
  }

  // Helper function để toggle giá trị trong multi-select
  const toggleFilterValue = (filterKey: string, optionValue: any, isMultiSelect: boolean) => {
    if (isMultiSelect) {
      setQuickFilterValues((prev) => {
        const currentValue = prev[filterKey]
        const currentArray = Array.isArray(currentValue) ? currentValue : []
        const valueStr = String(optionValue)

        if (currentArray.some((v) => String(v) === valueStr)) {
          const newArray = currentArray.filter((v) => String(v) !== valueStr)
          return {
            ...prev,
            [filterKey]: newArray.length > 0 ? newArray : undefined,
          }
        } else {
          return {
            ...prev,
            [filterKey]: [...currentArray, optionValue],
          }
        }
      })
    } else {
      setQuickFilterValues((prev) => ({
        ...prev,
        [filterKey]: prev[filterKey] === optionValue ? undefined : optionValue,
      }))
    }
  }

  // Helper function để tính số lượng items phù hợp với một option
  const getOptionCount = (filterKey: string, optionValue: any) => {
    const testFilterValues = { [filterKey]: optionValue }
    const testData = filterDataByQuickFilters(dataAfterSearch, testFilterValues)
    return testData.length
  }

  // Lấy danh sách filter đang active để hiển thị ở trên
  const getActiveFilters = () => {
    const active: Array<{ filter: QuickFilter; value: any; displayLabel: string }> = []
    
    quickFilters.forEach((filter) => {
      const value = quickFilterValues[filter.key]
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        return
      }

      const selectedValues = Array.isArray(value) ? value : [value]
      selectedValues.forEach((val) => {
        let displayLabel = String(val)
        if (filter.type === 'select' && filter.options) {
          const selectedOption = filter.options.find((opt) => String(opt.value) === String(val))
          displayLabel = selectedOption?.label || String(val)
        } else if (filter.type === 'boolean') {
          displayLabel = val === true ? 'Hoạt động' : 'Vô hiệu hóa'
        } else if (filter.type === 'text') {
          displayLabel = val
        }

        active.push({ filter, value: val, displayLabel })
      })
    })

    return active
  }

  const activeFilters = getActiveFilters()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10 relative"
          title="Bộ lọc"
        >
          <Filter className="h-4 w-4" />
          {hasActiveFilters && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-bold"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="end">
        <div className="max-h-[600px] overflow-y-auto">
          {/* Phần Active Filters */}
          {hasActiveFilters && (
            <div className="p-3 border-b space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Bộ lọc đang áp dụng</span>
                {onClearFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="h-7 text-xs text-destructive hover:text-destructive"
                  >
                    Xóa tất cả
                  </Button>
                )}
              </div>
              <div className="space-y-1.5">
                {activeFilters.map((item, index) => {
                  const isMultiSelect = item.filter.multiSelect === true
                  const currentValue = quickFilterValues[item.filter.key]
                  
                  return (
                    <div
                      key={`${item.filter.key}-${index}-${item.value}`}
                      className="flex items-center justify-between gap-2 p-2 bg-muted/50 rounded-md"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-muted-foreground line-clamp-1">
                          {item.filter.label}
                        </div>
                        <div className="text-sm font-medium line-clamp-1">
                          {item.displayLabel}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => {
                          if (isMultiSelect && Array.isArray(currentValue)) {
                            const newArray = currentValue.filter((v) => String(v) !== String(item.value))
                            setQuickFilterValues((prev) => ({
                              ...prev,
                              [item.filter.key]: newArray.length > 0 ? newArray : undefined,
                            }))
                          } else {
                            setQuickFilterValues((prev) => ({
                              ...prev,
                              [item.filter.key]: undefined,
                            }))
                          }
                        }}
                      >
                        <X className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Phần Filter Buttons */}
          <div className="p-3 space-y-2">
            <div className="text-sm font-semibold mb-2">
              {hasActiveFilters ? 'Thêm bộ lọc' : 'Chọn bộ lọc'}
            </div>
            {quickFilters.map((filter) => {
              const isMultiSelect = filter.multiSelect === true
              const currentValue = quickFilterValues[filter.key]
              const hasValue =
                currentValue !== undefined &&
                currentValue !== null &&
                currentValue !== '' &&
                (!Array.isArray(currentValue) || currentValue.length > 0)

              if (filter.type === 'select' && filter.options) {
                return (
                  <Popover key={filter.key}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={hasValue ? 'default' : 'outline'}
                        size="sm"
                        className="w-full justify-start h-9"
                      >
                        <span className="flex-1 text-left">{filter.label}</span>
                        {hasValue && (
                          <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                            {Array.isArray(currentValue) ? currentValue.length : 1}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder={`Tìm ${filter.label.toLowerCase()}...`} className="h-9" />
                        <CommandEmpty>Không tìm thấy.</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-y-auto">
                          {!isMultiSelect && (
                            <div
                              className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer"
                              onClick={() => {
                                setQuickFilterValues((prev) => ({
                                  ...prev,
                                  [filter.key]: undefined,
                                }))
                              }}
                            >
                              <Checkbox
                                checked={!hasValue}
                                onCheckedChange={() => {
                                  setQuickFilterValues((prev) => ({
                                    ...prev,
                                    [filter.key]: undefined,
                                  }))
                                }}
                              />
                              <span className="flex-1 text-sm">Tất cả</span>
                              <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium">
                                {dataAfterSearch.length}
                              </Badge>
                            </div>
                          )}
                          {filter.options.map((option) => {
                            const isSelected = isValueSelected(filter.key, option.value)
                            const optionCount = getOptionCount(filter.key, option.value)
                            return (
                              <div
                                key={String(option.value)}
                                className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer"
                                onClick={() => {
                                  toggleFilterValue(filter.key, option.value, isMultiSelect)
                                }}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => {
                                    toggleFilterValue(filter.key, option.value, isMultiSelect)
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className="flex-1 text-sm">{option.label}</span>
                                <Badge
                                  variant="outline"
                                  className="h-5 px-1.5 text-[10px] font-medium text-muted-foreground"
                                >
                                  {optionCount}
                                </Badge>
                              </div>
                            )
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )
              }

              if (filter.type === 'boolean') {
                return (
                  <Popover key={filter.key}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={hasValue ? 'default' : 'outline'}
                        size="sm"
                        className="w-full justify-start h-9"
                      >
                        <span className="flex-1 text-left">{filter.label}</span>
                        {hasValue && (
                          <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                            {Array.isArray(currentValue) ? currentValue.length : 1}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[220px] p-0" align="start">
                      <Command>
                        <CommandGroup>
                          {!isMultiSelect && (
                            <div
                              className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer"
                              onClick={() => {
                                setQuickFilterValues((prev) => ({
                                  ...prev,
                                  [filter.key]: undefined,
                                }))
                              }}
                            >
                              <Checkbox
                                checked={!hasValue}
                                onCheckedChange={() => {
                                  setQuickFilterValues((prev) => ({
                                    ...prev,
                                    [filter.key]: undefined,
                                  }))
                                }}
                              />
                              <span className="flex-1 text-sm">Tất cả</span>
                              <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium">
                                {dataAfterSearch.length}
                              </Badge>
                            </div>
                          )}
                          <div
                            className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer"
                            onClick={() => {
                              toggleFilterValue(filter.key, true, isMultiSelect)
                            }}
                          >
                            <Checkbox
                              checked={isValueSelected(filter.key, true)}
                              onCheckedChange={() => {
                                toggleFilterValue(filter.key, true, isMultiSelect)
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="flex-1 text-sm">Hoạt động</span>
                            <Badge
                              variant="outline"
                              className="h-5 px-1.5 text-[10px] font-medium text-muted-foreground"
                            >
                              {getOptionCount(filter.key, true)}
                            </Badge>
                          </div>
                          <div
                            className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer"
                            onClick={() => {
                              toggleFilterValue(filter.key, false, isMultiSelect)
                            }}
                          >
                            <Checkbox
                              checked={isValueSelected(filter.key, false)}
                              onCheckedChange={() => {
                                toggleFilterValue(filter.key, false, isMultiSelect)
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="flex-1 text-sm">Vô hiệu hóa</span>
                            <Badge
                              variant="outline"
                              className="h-5 px-1.5 text-[10px] font-medium text-muted-foreground"
                            >
                              {getOptionCount(filter.key, false)}
                            </Badge>
                          </div>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )
              }

              if (filter.type === 'text') {
                return (
                  <div key={filter.key} className="space-y-1.5">
                    <label className="text-sm font-medium">{filter.label}</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={quickFilterValues[filter.key] || ''}
                        onChange={(e) =>
                          setQuickFilterValues((prev) => ({
                            ...prev,
                            [filter.key]: e.target.value || undefined,
                          }))
                        }
                        placeholder={filter.placeholder || filter.label}
                        className="w-full h-9 pl-3 pr-3 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )
              }

              return null
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

