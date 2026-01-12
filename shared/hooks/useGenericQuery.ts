
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';

export function useGenericQuery<T>(key: string, table: string) {
  return useQuery({
    queryKey: [key],
    queryFn: () => api.get<T>(table),
  });
}
