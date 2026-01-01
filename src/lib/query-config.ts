/**
 * React Query Configuration Constants
 * Sử dụng cho việc override staleTime theo từng loại data
 */
export const QUERY_STALE_TIME = {
  // Data ít thay đổi (settings, user profile, permissions, roles)
  STATIC: 30 * 60 * 1000, // 30 phút

  // Data thay đổi vừa (danh sách, báo cáo, danh mục, đối tác)
  // Tăng lên 5 phút để giảm refetch khi quay lại tab
  NORMAL: 5 * 60 * 1000, // 5 phút (tăng từ 3 phút)

  // Data thay đổi nhanh (transactions, orders)
  FAST: 1 * 60 * 1000, // 1 phút

  // Data real-time (notifications, live updates)
  REALTIME: 0, // luôn stale
} as const

export const QUERY_GC_TIME = {
  // Thời gian giữ cache sau khi không còn component nào dùng
  // Tăng lên để giữ cache lâu hơn khi dùng persist
  DEFAULT: 30 * 60 * 1000, // 30 phút (tăng từ 10 phút)
  LONG: 60 * 60 * 1000, // 60 phút (cho data ít thay đổi)
} as const

