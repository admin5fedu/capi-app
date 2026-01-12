
import { useQuery } from '@tanstack/react-query';
import { khachHangService } from '../services/khach-hang-service';

export const KH_QUERY_KEYS = {
  NHOM_LIST: 'kh_nhom_list',
  KH_LIST: 'kh_list',
};

export function useNhomKhachHangList() {
  return useQuery({
    queryKey: [KH_QUERY_KEYS.NHOM_LIST],
    queryFn: () => khachHangService.getNhomAll('khach_hang'),
  });
}

export function useKhachHangList() {
  const nhomQuery = useNhomKhachHangList();
  
  const khQuery = useQuery({
    queryKey: [KH_QUERY_KEYS.KH_LIST],
    queryFn: () => khachHangService.getDoiTacAll('khach_hang'),
  });

  // Manual Join
  const mergedData = khQuery.data?.map(kh => {
    const nhom = nhomQuery.data?.find(n => n.id === kh.nhom_doi_tac_id);
    return {
      ...kh,
      zz_capi_nhom_doi_tac: nhom || null
    };
  });

  return {
    ...khQuery,
    data: mergedData,
    isLoading: khQuery.isLoading || nhomQuery.isLoading,
  };
}
