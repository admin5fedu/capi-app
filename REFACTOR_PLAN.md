# Kế hoạch Refactor và Cải thiện Code

## ✅ Đã hoàn thành

### 1. Shared Utilities
- ✅ Tạo `src/shared/utils/format-utils.ts` - Centralized formatting functions
  - `formatCurrency()` - Format tiền tệ
  - `formatCurrencyCompact()` - Format compact cho charts
  - `formatPercent()` - Format phần trăm
  - `formatPercentChange()` - Format thay đổi phần trăm
  - `formatNumber()` - Format số với dấu phân cách

### 2. Generic Components
- ✅ Tạo `src/components/charts/generic-chart-card.tsx` - Generic chart card wrapper
- ✅ Refactor tất cả `formatCurrency` functions để sử dụng shared utils

### 3. Code Cleanup
- ✅ Loại bỏ duplicate `formatCurrency` functions
- ✅ Standardize imports từ shared utils

## 📋 Kế hoạch tiếp theo

### Phase 1: Generic Chart Components (Ưu tiên cao)
**Mục tiêu**: Tạo reusable chart components để giảm duplicate code

1. **Generic Line Chart Component**
   - Location: `src/components/charts/generic-line-chart.tsx`
   - Props: data, xKey, yKeys, colors, config
   - Usage: Xu hướng thu/chi, số dư tích lũy

2. **Generic Bar Chart Component**
   - Location: `src/components/charts/generic-bar-chart.tsx`
   - Props: data, xKey, yKeys, colors, orientation, config
   - Usage: So sánh thu/chi, top items

3. **Generic Pie Chart Component**
   - Location: `src/components/charts/generic-pie-chart.tsx`
   - Props: data, nameKey, valueKey, colors, config
   - Usage: Phân bổ theo tài khoản, tỷ lệ thu/chi

4. **Generic Area Chart Component**
   - Location: `src/components/charts/generic-area-chart.tsx`
   - Props: data, xKey, yKey, color, config
   - Usage: Số dư tích lũy

### Phase 2: Generic Financial Table Components (Ưu tiên trung bình)
**Mục tiêu**: Tạo reusable table components cho báo cáo tài chính

1. **Generic Financial Summary Table**
   - Location: `src/components/tables/generic-financial-table.tsx`
   - Props: 
     - columns: Array<{key, label, accessor, formatter?, align?}>
     - data: Array<Record<string, any>>
     - summaryRow?: boolean
     - highlightPositive?: boolean
   - Usage: Tất cả các bảng tổng hợp trong báo cáo

2. **Generic Financial Table Wrapper**
   - Enhance `BaoCaoTableWrapper` thành generic component
   - Location: `src/components/tables/generic-table-wrapper.tsx`
   - Props: title, content, mobileView, icon, className

### Phase 3: Dashboard Components (Ưu tiên trung bình)
**Mục tiêu**: Cải thiện GenericDashboard và tạo metric components

1. **Enhance GenericDashboard**
   - Thêm support cho custom layouts
   - Thêm animation/transitions
   - Thêm loading states

2. **Generic Metric Card**
   - Location: `src/components/dashboard/generic-metric-card.tsx`
   - Props: label, value, icon, trend, color, size
   - Usage: KPI cards trong dashboard

### Phase 4: API & Data Layer (Ưu tiên thấp)
**Mục tiêu**: Tối ưu và generic hóa data fetching

1. **Generic Report Hook**
   - Location: `src/shared/hooks/use-generic-report.ts`
   - Generic hook cho các loại báo cáo
   - Support filters, pagination, caching

2. **Report Data Utilities**
   - Location: `src/shared/utils/report-utils.ts`
   - Common grouping functions
   - Common aggregation functions
   - Date period utilities

### Phase 5: Performance Optimization (Ưu tiên thấp)
**Mục tiêu**: Tối ưu performance cho large datasets

1. **Virtual Scrolling cho Tables**
   - Implement virtual scrolling cho tables lớn
   - Location: `src/components/tables/virtual-table.tsx`

2. **Chart Data Memoization**
   - Optimize chart data preparation
   - Use React.memo cho chart components

3. **Lazy Loading**
   - Lazy load charts và tables
   - Code splitting cho report modules

## 🎯 Best Practices đã áp dụng

1. ✅ **DRY (Don't Repeat Yourself)**: Centralized formatting utilities
2. ✅ **Single Responsibility**: Mỗi component có một nhiệm vụ rõ ràng
3. ✅ **Reusability**: Generic components có thể tái sử dụng
4. ✅ **Type Safety**: TypeScript types cho tất cả components
5. ✅ **Consistent Naming**: Naming convention nhất quán

## 📝 Notes

- Tất cả refactor đều backward compatible
- Các file cũ vẫn hoạt động nhờ re-exports
- Có thể migrate từng phần một, không cần migrate hết cùng lúc

