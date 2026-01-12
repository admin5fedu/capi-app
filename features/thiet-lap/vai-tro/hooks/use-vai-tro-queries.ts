
import { useQuery } from '@tanstack/react-query';
import { vaiTroService } from '../services/vai-tro-service';

export const VAI_TRO_QUERY_KEY = 'vai_tro';

export function useVaiTroList() {
  return useQuery({
    queryKey: [VAI_TRO_QUERY_KEY],
    queryFn: vaiTroService.getAll,
  });
}
