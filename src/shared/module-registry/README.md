# Module Registry Pattern

## Tổng quan

Module Registry Pattern cho phép định nghĩa modules dựa trên configuration, tự động detect và quyết định có cần tách code hay không.

## Quy định

### 1. Khi nào tách code?
- **Tách code** khi module có tabs với:
  - `dataSource.type === 'separate_table'` (từ database/table khác)
  - `dataSource.type === 'custom_query'` (custom query function)
  - `dataSource.type === 'api'` (từ API endpoint)
  - Có `components` override (custom components)

### 2. Khi nào không tách code?
- **Không tách code** khi module có tabs với:
  - `dataSource.type === 'single_table'` (cùng table, chỉ filter khác)
  - Không có components override

## Cách sử dụng

### Bước 1: Tạo Module Config

```typescript
// features/my-module/config.module.ts
import { registerModule, type ModuleConfig } from '@/shared/module-registry'

export const myModuleConfig: ModuleConfig = {
  id: 'my-module',
  name: 'My Module',
  basePath: '/my-module',
  type: 'multi_tab', // hoặc 'single'
  
  tabs: [
    {
      id: 'tab-1',
      label: 'Tab 1',
      path: '/tab-1',
      dataSource: {
        type: 'single_table', // Không tách code
        tableName: 'my_table',
        filter: { type: 'tab1' }
      }
    }
  ]
}

// Đăng ký module
registerModule(myModuleConfig)
```

### Bước 2: Import config trong module entry

```typescript
// features/my-module/index.tsx
import './config.module' // Đăng ký module

export function MyModule() {
  // Module logic hiện tại (có thể giữ nguyên)
  // Hoặc dùng GenericModuleRouter:
  // return <GenericModuleRouter moduleId="my-module" />
}
```

### Bước 3: Kiểm tra có cần tách code không

```typescript
import { getModule, shouldSeparateModule } from '@/shared/module-registry'

const config = getModule('my-module')
if (shouldSeparateModule(config)) {
  // Cần tách code → Tạo các module riêng cho mỗi tab
} else {
  // Không cần tách → Dùng chung components
}
```

## Ví dụ

### Module không tách code (single_table)

```typescript
// Cùng database, cùng table, chỉ filter khác
tabs: [
  {
    id: 'nha-cung-cap',
    dataSource: {
      type: 'single_table',
      tableName: 'zz_cst_nhom_doi_tac',
      filter: { loai: 'nha_cung_cap' }
    }
  },
  {
    id: 'khach-hang',
    dataSource: {
      type: 'single_table',
      tableName: 'zz_cst_nhom_doi_tac', // Cùng table
      filter: { loai: 'khach_hang' } // Chỉ filter khác
    }
  }
]
```

### Module cần tách code (separate_table)

```typescript
// Mỗi tab từ table/database khác nhau
tabs: [
  {
    id: 'nha-cung-cap',
    dataSource: {
      type: 'separate_table',
      tableName: 'zz_cst_nha_cung_cap' // Table riêng
    },
    // Có thể có custom components
    components: {
      ListView: NhaCungCapCustomListView
    }
  },
  {
    id: 'khach-hang',
    dataSource: {
      type: 'custom_query',
      queryFn: () => queryFromLegacySystem('customers')
    }
  }
]
```

## GenericModuleRouter

Component tự động render module dựa trên config:

```typescript
import { GenericModuleRouter } from '@/shared/module-registry'

export function MyModule() {
  return <GenericModuleRouter moduleId="my-module" />
}
```

Router sẽ tự động:
- Detect loại module (single/multi_tab)
- Kiểm tra có cần tách code không
- Render tabs và components phù hợp
- Load data từ đúng source

## useModuleData Hook

Hook tự động load data dựa trên dataSource config:

```typescript
import { useModuleData } from '@/shared/module-registry'

const { data, isLoading } = useModuleData(tabConfig.dataSource)
```

## Migration Path

1. **Hiện tại**: Module có config nhưng vẫn dùng logic cũ
2. **Tương lai**: Khi cần, chuyển sang dùng `GenericModuleRouter`
3. **Tự động**: Khi config có `separate_table` → Tự động tách code

