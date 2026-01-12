
import { useQuery } from '@tanstack/react-query';
import { nhanVienService } from '../services/nhan-vien-service';
import { vaiTroService } from '../../vai-tro/services/vai-tro-service';

export const NHAN_VIEN_QUERY_KEY = 'nhan_vien';

export function useNhanVienList() {
  // Fetch cả 2 danh sách song song
  const nhanVienQuery = useQuery({
    queryKey: [NHAN_VIEN_QUERY_KEY],
    queryFn: nhanVienService.getAll,
  });

  const vaiTroQuery = useQuery({
    queryKey: ['vai_tro_list'], // Dùng key riêng để tránh cache chung
    queryFn: vaiTroService.getAll,
  });

  // Manual Join dữ liệu khi cả 2 đã tải xong
  const mergedData = nhanVienQuery.data?.map(nv => {
    const vaiTro = vaiTroQuery.data?.find(vt => vt.id === nv.vai_tro_id);
    return {
      ...nv,
      zz_capi_vai_tro: vaiTro || null
    };
  });

  return {
    ...nhanVienQuery,
    data: mergedData,
    isLoading: nhanVienQuery.isLoading || vaiTroQuery.isLoading,
  };
}

export function useNhanVienDetail(id: string) {
  const detailQuery = useQuery({
    queryKey: [NHAN_VIEN_QUERY_KEY, id],
    queryFn: () => nhanVienService.getById(id),
    enabled: !!id,
  });

  const vaiTroQuery = useQuery({
    queryKey: ['vai_tro_list'],
    queryFn: vaiTroService.getAll,
    enabled: !!detailQuery.data,
  });

  // Kết nối thông tin vai trò cho bản ghi chi tiết
  const mergedDetail = detailQuery.data ? {
    ...detailQuery.data,
    zz_capi_vai_tro: vaiTroQuery.data?.find(vt => vt.id === detailQuery.data?.vai_tro_id) || null
  } : null;

  return {
    ...detailQuery,
    data: mergedDetail,
    isLoading: detailQuery.isLoading || vaiTroQuery.isLoading,
  };
}
