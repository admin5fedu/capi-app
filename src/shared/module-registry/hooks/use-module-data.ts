import { useQuery } from '@tanstack/react-query'
import type { ModuleTabDataSource } from '../types'
import { supabase } from '@/lib/supabase'

/**
 * Hook tự động load data dựa trên dataSource config
 */
export function useModuleData<TData = any>(
  dataSource: ModuleTabDataSource,
  enabled: boolean = true
) {
  return useQuery<TData[]>({
    queryKey: [
      'module-data',
      dataSource.type,
      dataSource.tableName,
      dataSource.filter,
      dataSource.apiEndpoint,
    ],
    queryFn: async () => {
      switch (dataSource.type) {
        case 'single_table':
          if (!dataSource.tableName) {
            throw new Error('tableName is required for single_table')
          }
          
          let query = supabase.from(dataSource.tableName).select('*')
          
          // Apply filter nếu có
          if (dataSource.filter) {
            Object.entries(dataSource.filter).forEach(([key, value]) => {
              query = query.eq(key, value)
            })
          }
          
          const { data, error } = await query.order('created_at', { ascending: false })
          
          if (error) throw error
          return (data || []) as TData[]
          
        case 'separate_table':
          if (!dataSource.tableName) {
            throw new Error('tableName is required for separate_table')
          }
          
          const { data: separateData, error: separateError } = await supabase
            .from(dataSource.tableName)
            .select('*')
            .order('created_at', { ascending: false })
          
          if (separateError) throw separateError
          return (separateData || []) as TData[]
          
        case 'custom_query':
          if (!dataSource.queryFn) {
            throw new Error('queryFn is required for custom_query')
          }
          return dataSource.queryFn() as Promise<TData[]>
          
        case 'api':
          if (!dataSource.apiEndpoint) {
            throw new Error('apiEndpoint is required for api')
          }
          const response = await fetch(dataSource.apiEndpoint)
          if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`)
          }
          return response.json() as Promise<TData[]>
          
        default:
          throw new Error(`Unsupported dataSource type: ${dataSource.type}`)
      }
    },
    enabled,
  })
}

