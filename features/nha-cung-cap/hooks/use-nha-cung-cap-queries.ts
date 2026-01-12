
import { useQuery } from '@tanstack/react-query';
import { nhaCungCapService } from '../services/nha-cung-cap-service';

export const NCC_QUERY_KEYS = {
  NHOM_LIST: 'ncc_nhom_list',
  NCC_LIST: 'ncc_list',
};

export function useNhomNCCList() {
  return useQuery({
    queryKey: [NCC_QUERY_KEYS.NHOM_LIST],
    queryFn: nhaCungCapService.getNhomAll,
  });
}

export function useNCCList() {
  const nhomQuery = useNhomNCCList();
  
  const nccQuery = useQuery({
    queryKey: [NCC_QUERY_KEYS.NCC_LIST],
    queryFn: nhaCungCapService.getNCCAll,
  });

  const mergedData = nccQuery.data?.map(ncc => {
    const nhom = nhomQuery.data?.find(n => n.id === ncc.nhom_doi_tac_id);
    return {
      ...ncc,
      zz_capi_nhom_doi_tac: nhom || null
    };
  });

  return {
    ...nccQuery,
    data: mergedData,
    isLoading: nccQuery.isLoading || nhomQuery.isLoading,
  };
}
