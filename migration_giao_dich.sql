-- ============================================
-- Migration: Tạo bảng zz_cst_giao_dich
-- Module: Giao dịch (Thu/Chi/Luân chuyển)
-- ============================================

-- 1. Tạo bảng zz_cst_giao_dich
CREATE TABLE IF NOT EXISTS public.zz_cst_giao_dich (
  id SERIAL PRIMARY KEY,
  ngay DATE NOT NULL,
  loai VARCHAR(20) NOT NULL CHECK (loai IN ('thu', 'chi', 'luan_chuyen')),
  ma_phieu VARCHAR(100) NOT NULL UNIQUE,
  danh_muc_id UUID REFERENCES public.zz_cst_danh_muc(id) ON DELETE SET NULL,
  mo_ta TEXT,
  so_tien NUMERIC(15, 2) NOT NULL DEFAULT 0 CHECK (so_tien >= 0),
  ty_gia_id INTEGER REFERENCES public.zz_cst_ty_gia(id) ON DELETE SET NULL,
  tai_khoan_id UUID REFERENCES public.zz_cst_tai_khoan(id) ON DELETE SET NULL,
  tai_khoan_den_id UUID REFERENCES public.zz_cst_tai_khoan(id) ON DELETE SET NULL,
  doi_tac_id UUID REFERENCES public.zz_cst_doi_tac(id) ON DELETE SET NULL,
  so_chung_tu VARCHAR(100),
  hinh_anh JSONB DEFAULT '[]'::jsonb,
  ghi_chu TEXT,
  so_tien_vnd NUMERIC(15, 2) CHECK (so_tien_vnd >= 0),
  created_by UUID REFERENCES public.zz_cst_nguoi_dung(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tạo indexes để tối ưu performance
CREATE INDEX IF NOT EXISTS idx_giao_dich_ngay ON public.zz_cst_giao_dich(ngay DESC);
CREATE INDEX IF NOT EXISTS idx_giao_dich_loai ON public.zz_cst_giao_dich(loai);
CREATE INDEX IF NOT EXISTS idx_giao_dich_ma_phieu ON public.zz_cst_giao_dich(ma_phieu);
CREATE INDEX IF NOT EXISTS idx_giao_dich_danh_muc_id ON public.zz_cst_giao_dich(danh_muc_id);
CREATE INDEX IF NOT EXISTS idx_giao_dich_tai_khoan_id ON public.zz_cst_giao_dich(tai_khoan_id);
CREATE INDEX IF NOT EXISTS idx_giao_dich_tai_khoan_den_id ON public.zz_cst_giao_dich(tai_khoan_den_id);
CREATE INDEX IF NOT EXISTS idx_giao_dich_doi_tac_id ON public.zz_cst_giao_dich(doi_tac_id);
CREATE INDEX IF NOT EXISTS idx_giao_dich_created_by ON public.zz_cst_giao_dich(created_by);
CREATE INDEX IF NOT EXISTS idx_giao_dich_created_at ON public.zz_cst_giao_dich(created_at DESC);

-- 3. Tạo trigger để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_zz_cst_giao_dich_updated_at
  BEFORE UPDATE ON public.zz_cst_giao_dich
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.zz_cst_giao_dich ENABLE ROW LEVEL SECURITY;

-- 5. Tạo RLS Policies

-- Policy: Cho phép SELECT - Tất cả authenticated users có thể xem
CREATE POLICY "Cho phép xem giao dịch cho authenticated users"
  ON public.zz_cst_giao_dich
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Cho phép INSERT - Chỉ authenticated users có thể tạo
CREATE POLICY "Cho phép tạo giao dịch cho authenticated users"
  ON public.zz_cst_giao_dich
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Cho phép UPDATE - Chỉ authenticated users có thể cập nhật
CREATE POLICY "Cho phép cập nhật giao dịch cho authenticated users"
  ON public.zz_cst_giao_dich
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Cho phép DELETE - Chỉ authenticated users có thể xóa
CREATE POLICY "Cho phép xóa giao dịch cho authenticated users"
  ON public.zz_cst_giao_dich
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- 6. Dữ liệu mẫu (Sample Data)
-- ============================================

-- Lưu ý: Cần có dữ liệu trong các bảng liên quan trước:
-- - zz_cst_danh_muc (danh mục thu/chi)
-- - zz_cst_tai_khoan (tài khoản)
-- - zz_cst_ty_gia (tỷ giá - nếu có giao dịch USD)
-- - zz_cst_doi_tac (đối tác - khách hàng/nhà cung cấp)
-- - zz_cst_nguoi_dung (người dùng)

-- Ví dụ dữ liệu mẫu (thay thế UUID và ID bằng giá trị thực tế từ database của bạn):

-- INSERT INTO public.zz_cst_giao_dich (
--   ngay,
--   loai,
--   ma_phieu,
--   danh_muc_id,
--   mo_ta,
--   so_tien,
--   ty_gia_id,
--   tai_khoan_id,
--   tai_khoan_den_id,
--   doi_tac_id,
--   so_chung_tu,
--   hinh_anh,
--   ghi_chu,
--   so_tien_vnd,
--   created_by
-- ) VALUES
-- -- Giao dịch Thu (VND)
-- (
--   '2024-01-15',
--   'thu',
--   'PT-1',
--   'UUID_DANH_MUC_THU_1', -- Thay bằng UUID thực tế từ zz_cst_danh_muc
--   'Thu tiền bán hàng tháng 1',
--   5000000.00,
--   NULL, -- Không có tỷ giá vì là VND
--   NULL, -- Thu không cần tài khoản đi
--   'UUID_TAI_KHOAN_1', -- Tài khoản đến - Thay bằng UUID thực tế
--   'UUID_DOI_TAC_1', -- Đối tác - Thay bằng UUID thực tế
--   'HD-001',
--   '["https://example.com/image1.jpg"]'::jsonb,
--   'Ghi chú phiếu thu',
--   5000000.00,
--   'UUID_NGUOI_DUNG_1' -- Thay bằng UUID thực tế
-- ),
-- -- Giao dịch Chi (VND)
-- (
--   '2024-01-16',
--   'chi',
--   'PC-1',
--   'UUID_DANH_MUC_CHI_1', -- Thay bằng UUID thực tế
--   'Chi tiền mua hàng',
--   3000000.00,
--   NULL,
--   'UUID_TAI_KHOAN_2', -- Tài khoản đi - Thay bằng UUID thực tế
--   NULL, -- Chi không cần tài khoản đến
--   'UUID_DOI_TAC_2', -- Thay bằng UUID thực tế
--   'PN-001',
--   NULL,
--   'Ghi chú phiếu chi',
--   3000000.00,
--   'UUID_NGUOI_DUNG_1'
-- ),
-- -- Giao dịch Luân chuyển (VND)
-- (
--   '2024-01-17',
--   'luan_chuyen',
--   'LC-1',
--   NULL, -- Luân chuyển không cần danh mục
--   'Chuyển tiền giữa các tài khoản',
--   2000000.00,
--   NULL,
--   'UUID_TAI_KHOAN_1', -- Tài khoản đi
--   'UUID_TAI_KHOAN_2', -- Tài khoản đến
--   NULL, -- Luân chuyển không cần đối tác
--   NULL,
--   NULL,
--   'Ghi chú luân chuyển',
--   2000000.00,
--   'UUID_NGUOI_DUNG_1'
-- ),
-- -- Giao dịch Thu (USD) - có tỷ giá
-- (
--   '2024-01-18',
--   'thu',
--   'PT-2',
--   'UUID_DANH_MUC_THU_1',
--   'Thu tiền bán hàng USD',
--   1000.00, -- Số tiền USD
--   1, -- ID tỷ giá - Thay bằng ID thực tế từ zz_cst_ty_gia
--   NULL,
--   'UUID_TAI_KHOAN_USD_1', -- Tài khoản USD
--   'UUID_DOI_TAC_1',
--   'HD-002',
--   NULL,
--   'Ghi chú thu USD',
--   24500000.00, -- so_tien_vnd = 1000 * 24500
--   'UUID_NGUOI_DUNG_1'
-- );

-- ============================================
-- 7. Comments cho documentation
-- ============================================

COMMENT ON TABLE public.zz_cst_giao_dich IS 'Bảng lưu trữ các giao dịch tài chính: Thu, Chi, Luân chuyển';
COMMENT ON COLUMN public.zz_cst_giao_dich.id IS 'ID tự động tăng (SERIAL)';
COMMENT ON COLUMN public.zz_cst_giao_dich.ngay IS 'Ngày giao dịch';
COMMENT ON COLUMN public.zz_cst_giao_dich.loai IS 'Loại giao dịch: thu, chi, luan_chuyen';
COMMENT ON COLUMN public.zz_cst_giao_dich.ma_phieu IS 'Mã phiếu (unique): PT-xxx (Thu), PC-xxx (Chi), LC-xxx (Luân chuyển)';
COMMENT ON COLUMN public.zz_cst_giao_dich.danh_muc_id IS 'Danh mục thu/chi (NULL cho luân chuyển)';
COMMENT ON COLUMN public.zz_cst_giao_dich.so_tien IS 'Số tiền giao dịch (>= 0)';
COMMENT ON COLUMN public.zz_cst_giao_dich.ty_gia_id IS 'Tỷ giá áp dụng (NULL nếu VND)';
COMMENT ON COLUMN public.zz_cst_giao_dich.tai_khoan_id IS 'Tài khoản đi (NULL cho thu)';
COMMENT ON COLUMN public.zz_cst_giao_dich.tai_khoan_den_id IS 'Tài khoản đến (NULL cho chi)';
COMMENT ON COLUMN public.zz_cst_giao_dich.hinh_anh IS 'Mảng JSON chứa URLs hình ảnh';
COMMENT ON COLUMN public.zz_cst_giao_dich.so_tien_vnd IS 'Số tiền quy đổi sang VND (tự động tính nếu có tỷ giá USD)';

