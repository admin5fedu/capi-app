import type { ModuleConfig, ModuleTabConfig } from './types'

/**
 * Module Registry
 * Quản lý đăng ký và lấy cấu hình modules
 */

const moduleRegistry = new Map<string, ModuleConfig>()

/**
 * Đăng ký một module vào registry
 */
export function registerModule(config: ModuleConfig): void {
  moduleRegistry.set(config.id, config)
}

/**
 * Lấy cấu hình module theo ID
 */
export function getModule(id: string): ModuleConfig | undefined {
  return moduleRegistry.get(id)
}

/**
 * Lấy tất cả modules đã đăng ký
 */
export function getAllModules(): ModuleConfig[] {
  return Array.from(moduleRegistry.values())
}

/**
 * Kiểm tra xem module có cần tách code không
 * (dựa trên quy định: nếu có tab với separate_table/custom_query/api → tách)
 */
export function shouldSeparateModule(config: ModuleConfig): boolean {
  if (config.type !== 'multi_tab' || !config.tabs) {
    return false
  }
  
  // Nếu có tab nào đó không phải single_table → cần tách
  return config.tabs.some(
    (tab) =>
      tab.dataSource.type !== 'single_table' ||
      tab.components !== undefined // Có custom components cũng cần tách
  )
}

/**
 * Lấy danh sách tabs cần tách code
 */
export function getTabsToSeparate(config: ModuleConfig): ModuleTabConfig[] {
  if (config.type !== 'multi_tab' || !config.tabs) {
    return []
  }
  
  return config.tabs.filter(
    (tab) =>
      tab.dataSource.type !== 'single_table' ||
      tab.components !== undefined
  )
}

