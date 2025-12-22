import { Plus, Search, X } from 'lucide-react'
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

interface QuickFiltersProps<TData extends Record<string, any>> {
  quickFilters: QuickFilter[]
  quickFilterValues: Record<string, any>
  setQuickFilterValues: (values: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void
  dataAfterSearch: TData[]
}

export function QuickFilters<TData extends Record<string, any>>({
  quickFilters,
  quickFilterValues,
  setQuickFilterValues,
  dataAfterSearch,
}: QuickFiltersProps<TData>) {
  if (quickFilters.length === 0) return null

  // Tính tổng số giá trị đã chọn (bao gồm cả multi-select)
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

  // Helper function để check xem một giá trị có được chọn không (hỗ trợ multi-select)
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
          // Remove value
          const newArray = currentArray.filter((v) => String(v) !== valueStr)
          return {
            ...prev,
            [filterKey]: newArray.length > 0 ? newArray : undefined,
          }
        } else {
          // Add value
          return {
            ...prev,
            [filterKey]: [...currentArray, optionValue],
          }
        }
      })
    } else {
      // Single select
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

  return (
    <div className="space-y-2.5 flex-shrink-0">
      <div className="flex flex-wrap gap-2 items-center px-2.5 py-1.5 bg-muted/30 border border-border/50 rounded-md">
        {/* Filter Buttons */}
        {quickFilters.map((filter) => {
          const isMultiSelect = filter.multiSelect === true
          const currentValue = quickFilterValues[filter.key]
          const hasValue =
            currentValue !== undefined &&
            currentValue !== null &&
            currentValue !== '' &&
            (!Array.isArray(currentValue) || currentValue.length > 0)

          if (filter.type === 'select' && filter.options) {
            const selectedCount = Array.isArray(currentValue) ? currentValue.length : hasValue ? 1 : 0

            return (
              <Popover key={filter.key}>
                <PopoverTrigger asChild>
                  <Button
                    variant={hasValue ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 gap-1.5 text-xs font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {filter.label}
                    {selectedCount > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px] font-semibold">
                        {selectedCount}
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
            const selectedCount = Array.isArray(currentValue) ? currentValue.length : hasValue ? 1 : 0

            return (
              <Popover key={filter.key}>
                <PopoverTrigger asChild>
                  <Button
                    variant={hasValue ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 gap-1.5 text-xs font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {filter.label}
                    {selectedCount > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 px-1.5 text-[10px] font-semibold">
                        {selectedCount}
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
              <div key={filter.key} className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
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
                  className="h-8 pl-9 pr-3 text-xs border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 min-w-[160px]"
                />
              </div>
            )
          }

          return null
        })}

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <>
            {/* Divider */}
            <div className="h-5 w-px bg-border/60" />

            {quickFilters.map((filter) => {
              const value = quickFilterValues[filter.key]
              if (
                value === undefined ||
                value === null ||
                value === '' ||
                (Array.isArray(value) && value.length === 0)
              ) {
                return null
              }

              // Lấy danh sách giá trị đã chọn (hỗ trợ cả single và multi-select)
              const selectedValues = Array.isArray(value) ? value : [value]

              return (
                <React.Fragment key={filter.key}>
                  {selectedValues.map((val, index) => {
                    let displayLabel = String(val)
                    if (filter.type === 'select' && filter.options) {
                      const selectedOption = filter.options.find(
                        (opt) => String(opt.value) === String(val)
                      )
                      displayLabel = selectedOption?.label || String(val)
                    } else if (filter.type === 'boolean') {
                      displayLabel = val === true ? 'Hoạt động' : 'Vô hiệu hóa'
                    }

                    return (
                      <Badge
                        key={`${filter.key}-${index}-${val}`}
                        variant="secondary"
                        className="gap-1 py-0.5 px-2 text-xs font-medium h-6 bg-secondary/80 hover:bg-secondary border border-border/50 transition-all"
                      >
                        <span className="text-xs font-semibold">{displayLabel}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (Array.isArray(value)) {
                              const newArray = value.filter((v) => String(v) !== String(val))
                              setQuickFilterValues((prev) => ({
                                ...prev,
                                [filter.key]: newArray.length > 0 ? newArray : undefined,
                              }))
                            } else {
                              setQuickFilterValues((prev) => ({
                                ...prev,
                                [filter.key]: undefined,
                              }))
                            }
                          }}
                          className="ml-0.5 rounded-full hover:bg-destructive/20 hover:text-destructive p-0.5 transition-colors"
                          aria-label={`Xóa ${displayLabel}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  })}
                </React.Fragment>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

