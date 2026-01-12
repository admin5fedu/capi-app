
import { useQuery } from '@tanstack/react-query';
import { giaoDichService } from '../services/giao-dich-service';

export const GIAO_DICH_QUERY_KEY = 'giao_dich_list';

export function useGiaoDichList() {
  return useQuery({
    queryKey: [GIAO_DICH_QUERY_KEY],
    queryFn: giaoDichService.getAll,
  });
}
