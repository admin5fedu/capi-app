import { useQuery } from '@tanstack/react-query'
import { getBaoCaoData } from '@/api/bao-cao-tai-chinh'
import type {
  BaoCaoFilters,
  BaoCaoData,
  GroupByOption,
  ComparePeriodOption,
} from '@/types/bao-cao-tai-chinh'

export function useBaoCao(
  filters: BaoCaoFilters,
  groupBy?: GroupByOption,
  comparePeriod?: ComparePeriodOption,
  enabled: boolean = true
) {
  return useQuery<BaoCaoData>({
    queryKey: ['bao-cao-tai-chinh', filters, groupBy, comparePeriod],
    queryFn: () => getBaoCaoData(filters, groupBy, comparePeriod),
    enabled,
  })
}

