import type { CotHienThi } from '@/shared/components/generic/types'
import type { FormFieldGroup } from '@/shared/components/generic/generic-form-view'
import type { DetailFieldGroup } from '@/shared/components/generic/generic-detail-view'
import type React from 'react'

/**
 * Module Registry Types
 * Định nghĩa cấu trúc config cho modules
 */

/**
 * Loại data source cho mỗi tab
 */
export type DataSourceType = 'single_table' | 'separate_table' | 'custom_query' | 'api'

/**
 * Cấu hình data source cho tab
 */
export interface ModuleTabDataSource {
  type: DataSourceType
  
  // Cho single_table: query từ cùng table với filter
  tableName?: string
  filter?: Record<string, any>
  
  // Cho separate_table: query từ table riêng
  // (tableName sẽ được dùng)
  
  // Cho custom_query: tự định nghĩa query function
  queryFn?: () => Promise<any[]>
  
  // Cho api: gọi API endpoint
  apiEndpoint?: string
}

/**
 * Cấu hình component overrides (optional)
 * Nếu không có, sẽ dùng generic components
 */
export interface ModuleTabComponents {
  ListView?: React.ComponentType<any>
  FormView?: React.ComponentType<any>
  DetailView?: React.ComponentType<any>
}

/**
 * Cấu hình override cho tab
 */
export interface ModuleTabConfig {
  id: string
  label: string
  path: string
  
  // Data source configuration
  dataSource: ModuleTabDataSource
  
  // Component overrides (optional)
  // Nếu không có, sẽ dùng generic components với config
  components?: ModuleTabComponents
  
  // Config overrides (optional)
  config?: {
    columns?: CotHienThi<any>[]
    formFields?: FormFieldGroup[]
    detailFields?: DetailFieldGroup[]
  }
}

/**
 * Shared config cho module (dùng chung cho tất cả tabs)
 */
export interface ModuleSharedConfig {
  types?: any
  hooks?: any
  components?: any
  services?: any
  defaultColumns?: CotHienThi<any>[]
  defaultFormFields?: FormFieldGroup[]
  defaultDetailFields?: DetailFieldGroup[]
}

/**
 * Cấu hình module
 */
export interface ModuleConfig {
  id: string
  name: string
  basePath: string
  
  // Loại module: single (không có tabs) hoặc multi_tab (có tabs)
  type: 'single' | 'multi_tab'
  
  // Nếu multi_tab
  tabs?: ModuleTabConfig[]
  
  // Shared config (dùng chung cho tất cả tabs)
  shared?: ModuleSharedConfig
  
  // Cho single module
  dataSource?: ModuleTabDataSource
  components?: ModuleTabComponents
  config?: {
    columns?: CotHienThi<any>[]
    formFields?: FormFieldGroup[]
    detailFields?: DetailFieldGroup[]
  }
}

/**
 * Quy định:
 * - Nếu module có tabs với dataSource.type === 'separate_table' hoặc 'custom_query' hoặc 'api'
 *   → Tách code thành các module riêng
 * - Nếu module có tabs với dataSource.type === 'single_table'
 *   → Không tách code, dùng chung components
 */

