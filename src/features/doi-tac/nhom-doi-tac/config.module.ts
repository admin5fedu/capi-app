import { registerModule, type ModuleConfig } from '@/shared/module-registry'
import { COT_HIEN_THI } from './config'

/**
 * Module Configuration cho Nhóm đối tác
 * Sử dụng Module Registry Pattern
 * 
 * Quy định: Vì tất cả tabs dùng cùng 1 database (single_table)
 * → Không tách code, dùng chung components
 */
export const nhomDoiTacModuleConfig: ModuleConfig = {
  id: 'nhom-doi-tac',
  name: 'Nhóm đối tác',
  basePath: '/doi-tac/nhom-doi-tac',
  type: 'multi_tab',

  // Shared config (dùng chung cho tất cả tabs)
  shared: {
    defaultColumns: COT_HIEN_THI.filter((cot) => cot.key !== 'loai'), // Ẩn cột loại vì đã có tab
  },

  tabs: [
    {
      id: 'nha-cung-cap',
      label: 'Nhà cung cấp',
      path: '/nha-cung-cap',

      // Cùng table, filter theo loai
      dataSource: {
        type: 'single_table',
        tableName: 'zz_cst_nhom_doi_tac',
        filter: { loai: 'nha_cung_cap' },
      },

      // Dùng chung columns từ shared
      config: {
        columns: COT_HIEN_THI.filter((cot) => cot.key !== 'loai'),
      },
    },
    {
      id: 'khach-hang',
      label: 'Khách hàng',
      path: '/khach-hang',

      // Cùng table, filter theo loai
      dataSource: {
        type: 'single_table',
        tableName: 'zz_cst_nhom_doi_tac',
        filter: { loai: 'khach_hang' },
      },

      // Dùng chung columns từ shared
      config: {
        columns: COT_HIEN_THI.filter((cot) => cot.key !== 'loai'),
      },
    },
  ],
}

// Đăng ký module vào registry
registerModule(nhomDoiTacModuleConfig)

