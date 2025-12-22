/**
 * React Query Configuration Constants
 * Sử dụng cho việc override staleTime theo từng loại data
 */
export const QUERY_STALE_TIME = {
  // Data ít thay đổi (settings, user profile, permissions, roles)
  STATIC: 30 * 60 * 1000, // 30 phút

  // Data thay đổi vừa (danh sách, báo cáo, danh mục, đối tác)
  NORMAL: 3 * 60 * 1000, // 3 phút

  // Data thay đổi nhanh (transactions, orders)
  FAST: 1 * 60 * 1000, // 1 phút

  // Data real-time (notifications, live updates)
  REALTIME: 0, // luôn stale
} as const

export const QUERY_GC_TIME = {
  // Thời gian giữ cache sau khi không còn component nào dùng
  DEFAULT: 10 * 60 * 1000, // 10 phút
  LONG: 30 * 60 * 1000, // 30 phút (cho data ít thay đổi)
} as const

