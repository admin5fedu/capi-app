
import { useQuery } from '@tanstack/react-query';
import { tyGiaService } from '../services/ty-gia-service';

export const TY_GIA_QUERY_KEY = 'ty_gia_list';

export function useTyGiaList() {
  return useQuery({
    queryKey: [TY_GIA_QUERY_KEY],
    queryFn: tyGiaService.getAll,
  });
}
