-- ============================================
-- Dữ liệu mẫu cho bảng zz_cst_giao_dich
-- ============================================
-- 
-- LƯU Ý: 
-- 1. Chạy file này SAU KHI đã có dữ liệu trong các bảng:
--    - zz_cst_danh_muc (danh mục thu/chi cấp 2)
--    - zz_cst_tai_khoan (tài khoản)
--    - zz_cst_ty_gia (tỷ giá - nếu muốn tạo giao dịch USD)
--    - zz_cst_doi_tac (đối tác - khách hàng/nhà cung cấp)
--    - zz_cst_nguoi_dung (người dùng)
--
-- 2. Thay thế các UUID và ID dưới đây bằng giá trị thực tế từ database của bạn
-- 3. Hoặc sử dụng subquery để lấy ID tự động
-- ============================================

-- Xóa dữ liệu mẫu cũ (nếu có) - Cẩn thận khi chạy trong production!
-- DELETE FROM public.zz_cst_giao_dich WHERE ma_phieu LIKE 'PT-%' OR ma_phieu LIKE 'PC-%' OR ma_phieu LIKE 'LC-%';

-- ============================================
-- Cách 1: Sử dụng subquery để lấy ID tự động
-- ============================================

-- Giao dịch Thu (VND) - Lấy danh mục thu cấp 2 đầu tiên
INSERT INTO public.zz_cst_giao_dich (
  ngay,
  loai,
  ma_phieu,
  danh_muc_id,
  mo_ta,
  so_tien,
  ty_gia_id,
  tai_khoan_id,
  tai_khoan_den_id,
  doi_tac_id,
  so_chung_tu,
  hinh_anh,
  ghi_chu,
  so_tien_vnd,
  created_by
) VALUES (
  '2024-01-15',
  'thu',
  'PT-1',
  (SELECT id FROM public.zz_cst_danh_muc WHERE loai = 'thu' AND parent_id IS NOT NULL AND is_active = true LIMIT 1),
  'Thu tiền bán hàng tháng 1',
  5000000.00,
  NULL,
  NULL,
  (SELECT id FROM public.zz_cst_tai_khoan WHERE is_active = true LIMIT 1),
  (SELECT id FROM public.zz_cst_doi_tac WHERE loai = 'khach_hang' AND trang_thai = true LIMIT 1),
  'HD-001',
  '["https://example.com/image1.jpg"]'::jsonb,
  'Ghi chú phiếu thu',
  5000000.00,
  (SELECT id FROM public.zz_cst_nguoi_dung LIMIT 1)
);

-- Giao dịch Chi (VND) - Lấy danh mục chi cấp 2 đầu tiên
INSERT INTO public.zz_cst_giao_dich (
  ngay,
  loai,
  ma_phieu,
  danh_muc_id,
  mo_ta,
  so_tien,
  ty_gia_id,
  tai_khoan_id,
  tai_khoan_den_id,
  doi_tac_id,
  so_chung_tu,
  hinh_anh,
  ghi_chu,
  so_tien_vnd,
  created_by
) VALUES (
  '2024-01-16',
  'chi',
  'PC-1',
  (SELECT id FROM public.zz_cst_danh_muc WHERE loai = 'chi' AND parent_id IS NOT NULL AND is_active = true LIMIT 1),
  'Chi tiền mua hàng',
  3000000.00,
  NULL,
  (SELECT id FROM public.zz_cst_tai_khoan WHERE is_active = true LIMIT 1),
  NULL,
  (SELECT id FROM public.zz_cst_doi_tac WHERE loai = 'nha_cung_cap' AND trang_thai = true LIMIT 1),
  'PN-001',
  NULL,
  'Ghi chú phiếu chi',
  3000000.00,
  (SELECT id FROM public.zz_cst_nguoi_dung LIMIT 1)
);

-- Giao dịch Luân chuyển (VND)
INSERT INTO public.zz_cst_giao_dich (
  ngay,
  loai,
  ma_phieu,
  danh_muc_id,
  mo_ta,
  so_tien,
  ty_gia_id,
  tai_khoan_id,
  tai_khoan_den_id,
  doi_tac_id,
  so_chung_tu,
  hinh_anh,
  ghi_chu,
  so_tien_vnd,
  created_by
) VALUES (
  '2024-01-17',
  'luan_chuyen',
  'LC-1',
  NULL,
  'Chuyển tiền giữa các tài khoản',
  2000000.00,
  NULL,
  (SELECT id FROM public.zz_cst_tai_khoan WHERE is_active = true LIMIT 1 OFFSET 0),
  (SELECT id FROM public.zz_cst_tai_khoan WHERE is_active = true LIMIT 1 OFFSET 1),
  NULL,
  NULL,
  NULL,
  'Ghi chú luân chuyển',
  2000000.00,
  (SELECT id FROM public.zz_cst_nguoi_dung LIMIT 1)
);

-- Giao dịch Thu (USD) - có tỷ giá
-- Lưu ý: Cần có tài khoản USD và tỷ giá trong database
INSERT INTO public.zz_cst_giao_dich (
  ngay,
  loai,
  ma_phieu,
  danh_muc_id,
  mo_ta,
  so_tien,
  ty_gia_id,
  tai_khoan_id,
  tai_khoan_den_id,
  doi_tac_id,
  so_chung_tu,
  hinh_anh,
  ghi_chu,
  so_tien_vnd,
  created_by
) VALUES (
  '2024-01-18',
  'thu',
  'PT-2',
  (SELECT id FROM public.zz_cst_danh_muc WHERE loai = 'thu' AND parent_id IS NOT NULL AND is_active = true LIMIT 1),
  'Thu tiền bán hàng USD',
  1000.00,
  (SELECT id FROM public.zz_cst_ty_gia ORDER BY ngay_ap_dung DESC LIMIT 1),
  NULL,
  (SELECT id FROM public.zz_cst_tai_khoan WHERE loai_tien = 'USD' AND is_active = true LIMIT 1),
  (SELECT id FROM public.zz_cst_doi_tac WHERE loai = 'khach_hang' AND trang_thai = true LIMIT 1),
  'HD-002',
  NULL,
  'Ghi chú thu USD',
  (SELECT 1000.00 * ty_gia FROM public.zz_cst_ty_gia ORDER BY ngay_ap_dung DESC LIMIT 1),
  (SELECT id FROM public.zz_cst_nguoi_dung LIMIT 1)
);

-- ============================================
-- Cách 2: Sử dụng UUID/ID cụ thể (uncomment và thay thế)
-- ============================================

-- INSERT INTO public.zz_cst_giao_dich (
--   ngay, loai, ma_phieu, danh_muc_id, mo_ta, so_tien, ty_gia_id,
--   tai_khoan_id, tai_khoan_den_id, doi_tac_id, so_chung_tu,
--   hinh_anh, ghi_chu, so_tien_vnd, created_by
-- ) VALUES
-- ('2024-01-15', 'thu', 'PT-1', 
--  'YOUR_DANH_MUC_THU_UUID', 'Thu tiền bán hàng', 5000000.00, NULL,
--  NULL, 'YOUR_TAI_KHOAN_UUID', 'YOUR_DOI_TAC_UUID', 'HD-001',
--  '[]'::jsonb, 'Ghi chú', 5000000.00, 'YOUR_USER_UUID'),
-- ('2024-01-16', 'chi', 'PC-1',
--  'YOUR_DANH_MUC_CHI_UUID', 'Chi tiền mua hàng', 3000000.00, NULL,
--  'YOUR_TAI_KHOAN_UUID', NULL, 'YOUR_DOI_TAC_UUID', 'PN-001',
--  NULL, 'Ghi chú', 3000000.00, 'YOUR_USER_UUID');

-- ============================================
-- Kiểm tra dữ liệu đã insert
-- ============================================

-- SELECT 
--   id,
--   ngay,
--   loai,
--   ma_phieu,
--   so_tien,
--   created_at
-- FROM public.zz_cst_giao_dich
-- ORDER BY created_at DESC;

