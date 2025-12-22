# Module Development Guide

## ⚠️ QUAN TRỌNG: Quy tắc về file index

### Vấn đề thường gặp
Khi tạo module mới, **KHÔNG BAO GIỜ** tạo file `index.ts` trống trong thư mục module root. Điều này sẽ gây lỗi import vì bundler sẽ ưu tiên `index.ts` thay vì `index.tsx`.

### Quy tắc bắt buộc

1. **Module entry file phải là `index.tsx`** (KHÔNG phải `index.ts`)
   ```typescript
   // ✅ ĐÚNG: src/features/tai-chinh/tai-khoan/index.tsx
   export function TaiKhoanModule() { ... }
   export default TaiKhoanModule
   ```

2. **KHÔNG tạo file `index.ts` trống** trong module root
   ```typescript
   // ❌ SAI: src/features/tai-chinh/tai-khoan/index.ts (file trống)
   // Tài khoản
   ```

3. **Nếu cần export từ subdirectories**, sử dụng `index.ts`:
   ```typescript
   // ✅ OK: src/features/tai-chinh/tai-khoan/components/index.ts
   export { TaiKhoanListView } from './tai-khoan-list-view'
   export { TaiKhoanFormView } from './tai-khoan-form-view'
   ```

### Cấu trúc module chuẩn

```
src/features/
  └── module-name/
      ├── index.tsx          ← Module entry (PHẢI là .tsx)
      ├── config.ts
      ├── components/
      │   ├── index.ts       ← OK: Export từ subdirectory
      │   └── component.tsx
      ├── hooks/
      │   ├── index.ts       ← OK: Export từ subdirectory
      │   └── use-hook.ts
      └── services/
          ├── index.ts       ← OK: Export từ subdirectory
          └── service.ts
```

### Checklist khi tạo module mới

- [ ] Tạo `index.tsx` (KHÔNG phải `index.ts`)
- [ ] Export cả named và default export
- [ ] KHÔNG tạo file `index.ts` trống trong module root
- [ ] Kiểm tra import trong `routes.tsx` hoạt động đúng

### Kiểm tra lỗi

Chạy script kiểm tra:
```bash
node scripts/check-module-exports.js
```

### Xử lý khi gặp lỗi import

Nếu gặp lỗi: `The requested module does not provide an export named 'XxxModule'`

1. Kiểm tra xem có file `index.ts` trống không:
   ```bash
   ls src/features/your-module/index.*
   ```

2. Nếu có cả `index.ts` và `index.tsx`, xóa `index.ts`:
   ```bash
   rm src/features/your-module/index.ts
   ```

3. Restart dev server

---

## Multi-Tab Module Pattern (URL-Based Routing)

### Tổng quan

Khi module có nhiều tabs (ví dụ: Nhà cung cấp và Khách hàng), sử dụng **URL-based routing** thay vì state-based để đảm bảo:
- Breadcrumb gọn, không thừa
- Back button hoạt động đúng
- URL shareable và SEO-friendly
- Tab state persistent

### Quy định

#### 1. URL Structure

Mỗi tab là một route riêng, KHÔNG dùng query params:

```typescript
// ✅ ĐÚNG: Mỗi tab là route riêng
/doi-tac/nha-cung-cap           // List Nhà cung cấp
/doi-tac/nha-cung-cap/moi       // Thêm mới
/doi-tac/nha-cung-cap/:id       // Detail
/doi-tac/nha-cung-cap/:id/sua   // Edit

/doi-tac/khach-hang             // List Khách hàng
/doi-tac/khach-hang/moi
/doi-tac/khach-hang/:id
/doi-tac/khach-hang/:id/sua

// ❌ SAI: Dùng query params
/doi-tac/nhom-doi-tac?tab=nha-cung-cap
```

#### 2. Breadcrumb Pattern

Breadcrumb hiển thị **tên tab** thay vì tên module:

```typescript
// Breadcrumb khi ở tab "Nhà cung cấp"
Trang chủ / Đối tác / Nhà cung cấp

// Breadcrumb khi ở tab "Khách hàng"
Trang chủ / Đối tác / Khách hàng
```

Cập nhật `breadcrumb-config.ts`:

```typescript
// src/components/layout/breadcrumb-config.ts
export const breadcrumbConfig: Record<string, string> = {
  '/doi-tac': 'Đối tác',
  '/doi-tac/nha-cung-cap': 'Nhà cung cấp',
  '/doi-tac/khach-hang': 'Khách hàng',
  // ...
}
```

#### 3. Module Implementation

**Bước 1: Detect tab từ URL**

```typescript
// src/features/doi-tac/nhom-doi-tac/index.tsx
import { useLocation } from 'react-router-dom'

export function NhomDoiTacModule() {
  const location = useLocation()
  
  // Detect tabType từ URL path
  const pathParts = location.pathname.split('/').filter(Boolean)
  const tabTypeFromPath = pathParts[1] // parent-module -> [0], tab-name -> [1]
  
  // Validate và set default
  const validTabType = tabTypeFromPath === 'khach-hang' 
    ? 'khach-hang' 
    : 'nha-cung-cap'
  
  const currentTab: TabType = validTabType === 'khach-hang' 
    ? 'khach_hang' 
    : 'nha_cung_cap'
  
  // Base path dựa trên tab type
  const basePath = `/doi-tac/${validTabType}`
  
  const { /* ... */ } = useModuleNavigation({ basePath })
  
  // ...
}
```

**Bước 2: ListView navigate khi chuyển tab**

```typescript
// src/features/doi-tac/nhom-doi-tac/components/list-view.tsx
import { useNavigate, useLocation } from 'react-router-dom'

export function NhomDoiTacListView() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Detect tab từ URL
  const pathParts = location.pathname.split('/').filter(Boolean)
  const tabTypeFromPath = pathParts[1]
  const currentTabFromUrl: TabType = tabTypeFromPath === 'khach-hang' 
    ? 'khach_hang' 
    : 'nha_cung_cap'
  
  // Handler khi chuyển tab - navigate đến URL mới
  const handleTabChange = (newTab: TabType) => {
    const tabPath = newTab === 'khach_hang' ? 'khach-hang' : 'nha-cung-cap'
    navigate(`/doi-tac/${tabPath}`)
  }
  
  return (
    <Tabs value={currentTabFromUrl} onValueChange={handleTabChange}>
      {/* ... */}
    </Tabs>
  )
}
```

#### 4. Routes Configuration

Đăng ký routes cho mỗi tab:

```typescript
// src/routes.tsx
{
  // Tab 1: Nhà cung cấp
  path: 'doi-tac/nha-cung-cap',
  element: <NhomDoiTacModule />,
},
{
  path: 'doi-tac/nha-cung-cap/moi',
  element: <NhomDoiTacModule />,
},
{
  path: 'doi-tac/nha-cung-cap/:id',
  element: <NhomDoiTacModule />,
},
{
  path: 'doi-tac/nha-cung-cap/:id/sua',
  element: <NhomDoiTacModule />,
},
// Tab 2: Khách hàng
{
  path: 'doi-tac/khach-hang',
  element: <NhomDoiTacModule />,
},
// ... tương tự
```

#### 5. Backward Compatibility (Optional)

Nếu có URL cũ cần redirect:

```typescript
// src/routes.tsx
{
  // Redirect từ URL cũ
  path: 'doi-tac/nhom-doi-tac',
  element: <Navigate to="/doi-tac/nha-cung-cap" replace />,
},
```

Tạo redirect component:

```typescript
// src/components/redirect/redirect-module-name.tsx
import { Navigate, useParams } from 'react-router-dom'

export function RedirectModuleName() {
  return <Navigate to="/doi-tac/nha-cung-cap" replace />
}
```

#### 6. Menu/Sidebar

Link đến tab mặc định:

```typescript
// src/components/layout/sidebar.tsx
{
  id: 'doi-tac-nhom',
  label: 'Nhóm đối tác',
  path: '/doi-tac/nha-cung-cap', // Link đến tab mặc định
}
```

### Checklist cho Multi-Tab Module

- [ ] URL structure: Mỗi tab là route riêng (không dùng query params)
- [ ] Breadcrumb config: Thêm routes cho từng tab
- [ ] Module detect tab từ URL path
- [ ] ListView navigate khi chuyển tab (không dùng state)
- [ ] Routes đăng ký đầy đủ cho tất cả tabs
- [ ] Back button hoạt động đúng (từ URL)
- [ ] Menu/Sidebar link đến tab mặc định
- [ ] Redirect component (nếu có URL cũ)

### Ví dụ tham khảo

Xem module `src/features/doi-tac/nhom-doi-tac/`:
- ✅ URL-based routing: `/doi-tac/nha-cung-cap`, `/doi-tac/khach-hang`
- ✅ Breadcrumb: Hiển thị tên tab
- ✅ Tab navigation: Navigate thay vì state
- ✅ Back button: Quay về đúng tab từ URL

### Lưu ý

- **KHÔNG** dùng `useState` để lưu tab state
- **KHÔNG** dùng query params (`?tab=...`)
- **NÊN** detect tab từ URL pathname
- **NÊN** navigate đến URL mới khi chuyển tab
- **NÊN** đặt tên URL theo tên tab (snake-case hoặc kebab-case)

---

## Breadcrumb Pattern Standard

### Nguyên tắc chung

Breadcrumb hiển thị đường dẫn điều hướng từ trang chủ đến trang hiện tại, giúp người dùng hiểu vị trí hiện tại trong hệ thống.

### Cấu trúc Breadcrumb cho Detail Page

Khi vào trang detail của một entity, breadcrumb phải có cấu trúc:

```
/ [Trang chủ] / [Module cha] / [Module con] / [Label của entity]
```

**Ví dụ:**
- ✅ Đúng: `/ Đối tác / Danh sách nhà cung cấp / Công ty TNHH Vật liệu Xây dựng ABC`
- ❌ Sai: `/ Đối tác / Danh sách nhà cung cấp / dt-ncc-1 / Công ty TNHH Vật liệu Xây dựng ABC`

### Quy tắc xử lý ID trong URL

1. **ID phải được skip** khi có `detailLabel` từ context
2. **Pattern ID được detect:**
   - `kh-1`, `ncc-1` (chữ-số)
   - `dt-ncc-1`, `dt-kh-1` (chữ-chữ-số)
   - UUID: `123e4567-e89b-12d3-a456-426614174000`
   - ID dài > 20 ký tự

3. **Khi có detailLabel:**
   - ID ở cuối path sẽ bị skip
   - Detail label sẽ được thêm vào cuối breadcrumb

### Cách implement trong Detail View

```typescript
import { useBreadcrumb } from '@/components/layout/breadcrumb-context'

export function EntityDetailView({ id }: { id: string }) {
  const { data: entity } = useEntityById(id)
  const { setDetailLabel } = useBreadcrumb()

  useEffect(() => {
    if (entity?.ten) {
      setDetailLabel(entity.ten) // Set label từ tên entity
    }
    return () => {
      setDetailLabel(null) // Clear khi unmount
    }
  }, [entity?.ten, setDetailLabel])

  // ... rest of component
}
```

### Cấu hình Breadcrumb Config

Thêm route mới vào `breadcrumb-config.ts`:

```typescript
export const breadcrumbConfig: Record<string, string> = {
  '/doi-tac': 'Đối tác',
  '/doi-tac/danh-sach-nha-cung-cap': 'Danh sách nhà cung cấp',
  // ... thêm các route khác
}
```

### Checklist khi tạo Detail View mới

- [ ] Import `useBreadcrumb` từ `@/components/layout/breadcrumb-context`
- [ ] Set `detailLabel` trong `useEffect` với giá trị từ entity (thường là `ten` hoặc `ho_ten`)
- [ ] Clear `detailLabel` khi component unmount
- [ ] Đảm bảo ID pattern được detect đúng (kiểm tra trong `breadcrumb-config.ts`)
- [ ] Test breadcrumb hiển thị đúng: không có ID, chỉ có label

### Ví dụ thực tế

**Module: Danh sách đối tác**

**URL:** `/doi-tac/danh-sach-nha-cung-cap/dt-ncc-1`

**Breadcrumb hiển thị:**
```
/ Đối tác / Danh sách nhà cung cấp / Công ty TNHH Vật liệu Xây dựng ABC
```

**Code:**
```typescript
// doi-tac-detail-view.tsx
useEffect(() => {
  if (doiTac?.ten) {
    setDetailLabel(doiTac.ten)
  }
  return () => {
    setDetailLabel(null)
  }
}, [doiTac?.ten, setDetailLabel])
```

### Lưu ý

- Không bao giờ hiển thị ID trong breadcrumb khi có detailLabel
- Detail label phải là thông tin có ý nghĩa với người dùng (tên, tiêu đề, v.v.)
- Luôn clear detailLabel khi component unmount để tránh breadcrumb bị sai ở trang khác

---
