
import { useQuery } from '@tanstack/react-query';
import { danhMucTaiChinhService } from '../services/danh-muc-tai-chinh-service';
import { DanhMucTaiChinh } from '../core/types';

export const DMTC_QUERY_KEY = 'danh_muc_tai_chinh';

export function useDanhMucTaiChinhList() {
  return useQuery({
    queryKey: [DMTC_QUERY_KEY],
    queryFn: danhMucTaiChinhService.getAll,
  });
}
