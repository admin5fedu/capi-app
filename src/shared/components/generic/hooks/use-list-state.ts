import { useState, useMemo, useEffect } from 'react'
import { SortingState, RowSelectionState } from '@tanstack/react-table'
import type { GenericListViewProps } from '../types'
import { filterDataByKeyword, filterDataByQuickFilters } from '../utils/filter-helpers'

/**
 * Hook quản lý state cho GenericListView
 */
export function useListState<TData extends Record<string, any>>(
  props: GenericListViewProps<TData>
) {
  const {
    data,
    cotHienThi,
    quickFilters = [],
    pageSize = 50,
    onQuickFilterChange,
  } = props

  const [sorting, setSorting] = useState<SortingState>([])
  const [timKiem, setTimKiem] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [quickFilterValues, setQuickFilterValues] = useState<Record<string, any>>({})
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)
  const [pageInputValue, setPageInputValue] = useState('')

  // Filter data theo tìm kiếm (trước khi apply quick filters)
  const dataAfterSearch = useMemo(() => {
    return filterDataByKeyword(data, timKiem, cotHienThi)
  }, [data, timKiem, cotHienThi])

  // Filter data theo quick filters
  const filteredData = useMemo(() => {
    return filterDataByQuickFilters(dataAfterSearch, quickFilterValues)
  }, [dataAfterSearch, quickFilterValues])

  // Handle quick filter change
  useEffect(() => {
    onQuickFilterChange?.(quickFilterValues)
  }, [quickFilterValues, onQuickFilterChange])

  // Lấy các hàng đã chọn
  const selectedRows = useMemo(() => {
    return Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((key) => filteredData.find((_, index) => String(index) === key))
      .filter((row): row is TData => row !== undefined)
  }, [rowSelection, filteredData])

  return {
    // State
    sorting,
    setSorting,
    timKiem,
    setTimKiem,
    rowSelection,
    setRowSelection,
    quickFilterValues,
    setQuickFilterValues,
    currentPageSize,
    setCurrentPageSize,
    pageInputValue,
    setPageInputValue,
    // Computed
    dataAfterSearch,
    filteredData,
    selectedRows,
  }
}

