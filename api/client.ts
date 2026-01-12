
import { supabase } from '../lib/supabase';

/**
 * Hàm fetcher cơ bản cho các query đơn giản
 */
export const api = {
  get: async <T>(table: string): Promise<T[]> => {
    // Đã sửa lỗi tham số trong lib/supabase.ts, giờ có thể gọi select('*') bình thường
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return (data || []) as T[];
  },
  // Các phương thức khác sẽ được bổ sung khi xây dựng feature
};
