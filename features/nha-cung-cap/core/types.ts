
import { HangMucDoiTac, NhomDoiTac, DoiTac } from '../../khach-hang/core/types';

// Chúng ta tái sử dụng cấu trúc từ khach-hang nhưng có thể mở rộng nếu cần cho NCC
export type { HangMucDoiTac, NhomDoiTac, DoiTac };

export type NhomNCCInput = {
  hang_muc: 'nha_cung_cap';
  ten_nhom: string;
  mo_ta: string | null;
  nguoi_tao_id?: number | null;
};

export type NCCInput = {
  nhom_doi_tac_id: number | null;
  ten_doi_tac: string;
  cong_ty: string | null;
  so_dien_thoai: string | null;
  dia_chi: string | null;
  email: string | null;
  thong_tin_khac: string | null;
  hang_muc: 'nha_cung_cap';
  nguoi_tao_id?: number | null;
};
