/**
 * Helper functions cho filtering/search
 */
import type { CotHienThi } from '../types'

/**
 * Filter data theo keyword search
 */
export function filterDataByKeyword<TData extends Record<string, any>>(
  data: TData[],
  keyword: string,
  cotHienThi: CotHienThi<TData>[]
): TData[] {
  if (!keyword) return data

  const lowerKeyword = keyword.toLowerCase()
  return data.filter((item) => {
    return cotHienThi.some((cot) => {
      const value = typeof cot.accessorKey === 'function'
        ? cot.accessorKey(item)
        : item[cot.accessorKey as keyof TData]
      return String(value || '').toLowerCase().includes(lowerKeyword)
    })
  })
}

/**
 * Filter data theo quick filters
 */
export function filterDataByQuickFilters<TData extends Record<string, any>>(
  data: TData[],
  quickFilterValues: Record<string, any>
): TData[] {
  let filteredData = data

  Object.entries(quickFilterValues).forEach(([key, value]) => {
    // Bỏ qua nếu value là undefined, null, empty string, hoặc empty array
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return
    }

    filteredData = filteredData.filter((item) => {
      const itemValue = item[key as keyof TData]

      // Xử lý multi-select (array values)
      if (Array.isArray(value)) {
        return value.some((filterValue) => {
          // Xử lý boolean trong array
          if (typeof filterValue === 'boolean' || typeof itemValue === 'boolean') {
            const boolFilterValue =
              typeof filterValue === 'boolean' ? filterValue : filterValue === 'true' || filterValue === true
            const itemBoolValue =
              typeof itemValue === 'boolean' ? itemValue : itemValue === 'true' || itemValue === true
            return itemBoolValue === boolFilterValue
          }
          // So sánh giá trị
          return String(itemValue || '').toLowerCase() === String(filterValue).toLowerCase()
        })
      }

      // Xử lý single-select boolean filter
      if (typeof value === 'boolean' || typeof itemValue === 'boolean') {
        // So sánh boolean trực tiếp hoặc convert string 'true'/'false' thành boolean
        const filterValue = typeof value === 'boolean' ? value : value === 'true' || value === true
        const itemBoolValue = typeof itemValue === 'boolean' ? itemValue : itemValue === 'true' || itemValue === true
        return itemBoolValue === filterValue
      }

      // Xử lý filter khác (string, number, etc.) - exact match
      return String(itemValue || '').toLowerCase() === String(value).toLowerCase()
    })
  })

  return filteredData
}

