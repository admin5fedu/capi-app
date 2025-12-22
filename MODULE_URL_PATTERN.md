# Quy định URL Pattern cho Module Multi-Tab

## 📋 Tổng quan

Tài liệu này quy định cách đặt URL cho các module có nhiều tab (multi-tab modules) để đảm bảo tính nhất quán trong toàn bộ ứng dụng.

## 🎯 Pattern chuẩn

### Module Multi-Tab (có nhiều tab)

**Pattern:** `/{parent-path}/{module-prefix}-{tab-name}`

**Ví dụ:**
- Module "Nhóm đối tác" với 2 tab:
  - `/doi-tac/nha-cung-cap` (tab Nhà cung cấp)
  - `/doi-tac/khach-hang` (tab Khách hàng)
  
- Module "Danh sách đối tác" với 2 tab:
  - `/doi-tac/danh-sach-nha-cung-cap` (tab Nhà cung cấp)
  - `/doi-tac/danh-sach-khach-hang` (tab Khách hàng)

### Module Single (không có tab)

**Pattern:** `/{parent-path}/{module-name}`

**Ví dụ:**
- `/thiet-lap/nguoi-dung`
- `/thiet-lap/vai-tro`
- `/tai-chinh/tai-khoan`

## 📝 Quy tắc chi tiết

### 1. Tab name luôn ở vị trí cuối cùng

✅ **Đúng:**
```
/doi-tac/danh-sach-nha-cung-cap
/doi-tac/danh-sach-khach-hang
```

❌ **Sai:**
```
/doi-tac/danh-sach-doi-tac/nha-cung-cap
/doi-tac/nha-cung-cap/danh-sach
```

### 2. Module prefix phải ngắn gọn và rõ ràng

- Prefix nên là tên module viết không dấu, ngắn gọn
- Tab name là tên tab viết không dấu, ngắn gọn

✅ **Ví dụ tốt:**
- `danh-sach-nha-cung-cap` (prefix: `danh-sach`, tab: `nha-cung-cap`)
- `nhom-doi-tac-nha-cung-cap` (prefix: `nhom-doi-tac`, tab: `nha-cung-cap`)

### 3. Breadcrumb Config

Khi tạo module mới, **BẮT BUỘC** phải thêm vào `src/components/layout/breadcrumb-config.ts`:

```typescript
export const breadcrumbConfig: Record<string, string> = {
  '/doi-tac': 'Đối tác',
  '/doi-tac/danh-sach-nha-cung-cap': 'Danh sách đối tác - Nhà cung cấp',
  '/doi-tac/danh-sach-khach-hang': 'Danh sách đối tác - Khách hàng',
  // ...
}
```

### 4. Routes Configuration

Trong `src/routes.tsx`, cấu hình routes theo pattern:

```typescript
{
  path: 'doi-tac/danh-sach-nha-cung-cap',
  element: <DanhSachDoiTacModule />,
},
{
  path: 'doi-tac/danh-sach-nha-cung-cap/moi',
  element: <DanhSachDoiTacModule />,
},
{
  path: 'doi-tac/danh-sach-nha-cung-cap/:id',
  element: <DanhSachDoiTacModule />,
},
{
  path: 'doi-tac/danh-sach-nha-cung-cap/:id/sua',
  element: <DanhSachDoiTacModule />,
},
```

### 5. Module Entry File

Trong file `index.tsx` của module, detect tab từ URL:

```typescript
export function DanhSachDoiTacModule() {
  const location = useLocation()
  
  // Pattern: /doi-tac/danh-sach-{tab-name}
  const pathParts = location.pathname.split('/').filter(Boolean)
  const modulePath = pathParts[1] || '' // 'danh-sach-nha-cung-cap'
  const tabName = modulePath.replace('danh-sach-', '') // 'nha-cung-cap'
  
  const validTabType = tabName === 'khach-hang' ? 'khach-hang' : 'nha-cung-cap'
  const currentTab: TabType = validTabType === 'khach-hang' ? 'khach_hang' : 'nha_cung_cap'
  
  const basePath = `/doi-tac/danh-sach-${validTabType}`
  // ...
}
```

### 6. List View Component

Trong component list view, detect tab và navigate:

```typescript
// Detect tab từ URL
const pathParts = location.pathname.split('/').filter(Boolean)
const modulePath = pathParts[1] || ''
const tabName = modulePath.replace('danh-sach-', '')
const currentTabFromUrl: TabType = tabName === 'khach-hang' ? 'khach_hang' : 'nha_cung_cap'

// Handler khi chuyển tab
const handleTabChange = (newTab: TabType) => {
  const tabPath = newTab === 'khach_hang' ? 'khach-hang' : 'nha-cung-cap'
  navigate(`/doi-tac/danh-sach-${tabPath}`)
}
```

## ✅ Checklist khi tạo module mới

- [ ] URL pattern tuân theo quy định: `/{parent-path}/{module-prefix}-{tab-name}`
- [ ] Đã thêm breadcrumb config vào `breadcrumb-config.ts`
- [ ] Đã cấu hình routes trong `routes.tsx`
- [ ] Module entry file detect tab đúng từ URL
- [ ] List view component navigate đúng khi chuyển tab
- [ ] Đã cập nhật path trong `home.tsx` (nếu có)

## 📚 Ví dụ tham khảo

### Module "Nhóm đối tác"
- File: `src/features/doi-tac/nhom-doi-tac/index.tsx`
- URLs:
  - `/doi-tac/nha-cung-cap`
  - `/doi-tac/khach-hang`

### Module "Danh sách đối tác"
- File: `src/features/doi-tac/danh-sach-doi-tac/index.tsx`
- URLs:
  - `/doi-tac/danh-sach-nha-cung-cap`
  - `/doi-tac/danh-sach-khach-hang`

## ⚠️ Lưu ý

1. **KHÔNG** dùng pattern `/module-name/tab-name` (thiếu prefix)
2. **KHÔNG** dùng pattern `/module-name/sub-module/tab-name` (quá dài)
3. **LUÔN** đảm bảo tab name ở vị trí cuối cùng trong URL
4. **LUÔN** cập nhật breadcrumb config khi thêm module mới

