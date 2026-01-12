
import { useQuery } from '@tanstack/react-query';
import { taiKhoanService } from '../services/tai-khoan-service';

export const TAI_KHOAN_QUERY_KEY = 'tai_khoan_list';

export function useTaiKhoanList() {
  return useQuery({
    queryKey: [TAI_KHOAN_QUERY_KEY],
    queryFn: taiKhoanService.getAll,
  });
}
