import { createBrowserRouter } from 'react-router-dom'
// import { Navigate } from 'react-router-dom' // Unused
import { MainLayout } from '@/components/layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { HomePage, TaiChinhSubmenuPage, DoiTacSubmenuPage, ThietLapSubmenuPage } from '@/pages'
import { LoginPage } from '@/pages/login'
import { NguoiDungModule } from '@/features/thiet-lap/nguoi-dung'
import { VaiTroModule } from '@/features/thiet-lap/vai-tro'
import { PhongBanModule } from '@/features/thiet-lap/phong-ban'
import { PhanQuyenModule } from '@/features/thiet-lap/phan-quyen'
import { CaiDatModule } from '@/features/thiet-lap/cai-dat/index'
import { ThongTinCongTyModule } from '@/features/thiet-lap/thong-tin-cong-ty'
import { TaiKhoanModule } from '@/features/tai-chinh/tai-khoan'
import { DanhMucModule } from '@/features/tai-chinh/danh-muc'
import { TyGiaModule } from '@/features/tai-chinh/ty-gia'
import { GiaoDichModule } from '@/features/tai-chinh/thu-chi'
import { BaoCaoTaiChinhModule } from '@/features/tai-chinh/bao-cao-tai-chinh'
import { BaoCaoTaiKhoanModule } from '@/features/tai-chinh/bao-cao-tai-khoan'
// import { NhomDoiTacModule } from '@/features/doi-tac/nhom-doi-tac/index.tsx' // Unused - using redirect components
// import { DanhSachDoiTacModule } from '@/features/doi-tac/danh-sach-doi-tac' // Unused - using redirect components
import { KhachHangModule } from '@/features/doi-tac/khach-hang'
import { NhaCungCapModule } from '@/features/doi-tac/nha-cung-cap'
import { HoSoPage } from '@/pages/ho-so'
// import { ModulePlaceholder } from '@/components/placeholder/module-placeholder' // Unused
import {
  RedirectNhomDoiTac,
  RedirectNhomDoiTacNew,
  RedirectNhomDoiTacDetail,
  RedirectNhomDoiTacEdit,
} from '@/components/redirect/redirect-nhom-doi-tac'
import {
  RedirectDanhSachNhaCungCap,
  RedirectDanhSachNhaCungCapNew,
  RedirectDanhSachNhaCungCapDetail,
  RedirectDanhSachNhaCungCapEdit,
  RedirectDanhSachKhachHang,
  RedirectDanhSachKhachHangNew,
  RedirectDanhSachKhachHangDetail,
  RedirectDanhSachKhachHangEdit,
} from '@/components/redirect/redirect-doi-tac'

export const router = createBrowserRouter([
  {
    path: '/dang-nhap',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'tai-chinh',
        element: <TaiChinhSubmenuPage />,
      },
      {
        path: 'tai-chinh/danh-muc-tai-chinh',
        element: <DanhMucModule />,
      },
      {
        path: 'tai-chinh/danh-muc-tai-chinh/moi',
        element: <DanhMucModule />,
      },
      {
        path: 'tai-chinh/danh-muc-tai-chinh/:id',
        element: <DanhMucModule />,
      },
      {
        path: 'tai-chinh/danh-muc-tai-chinh/:id/sua',
        element: <DanhMucModule />,
      },
      {
        path: 'tai-chinh/tai-khoan',
        element: <TaiKhoanModule />,
      },
      {
        path: 'tai-chinh/tai-khoan/moi',
        element: <TaiKhoanModule />,
      },
      {
        path: 'tai-chinh/tai-khoan/:id',
        element: <TaiKhoanModule />,
      },
      {
        path: 'tai-chinh/tai-khoan/:id/sua',
        element: <TaiKhoanModule />,
      },
      {
        path: 'tai-chinh/thu-chi',
        element: <GiaoDichModule />,
      },
      {
        path: 'tai-chinh/thu-chi/moi',
        element: <GiaoDichModule />,
      },
      {
        path: 'tai-chinh/thu-chi/:id',
        element: <GiaoDichModule />,
      },
      {
        path: 'tai-chinh/thu-chi/:id/sua',
        element: <GiaoDichModule />,
      },
      {
        path: 'tai-chinh/ty-gia',
        element: <TyGiaModule />,
      },
      {
        path: 'tai-chinh/ty-gia/moi',
        element: <TyGiaModule />,
      },
      {
        path: 'tai-chinh/ty-gia/:id',
        element: <TyGiaModule />,
      },
      {
        path: 'tai-chinh/ty-gia/:id/sua',
        element: <TyGiaModule />,
      },
      {
        path: 'tai-chinh/bao-cao',
        element: <BaoCaoTaiChinhModule />,
      },
      {
        path: 'tai-chinh/bao-cao-tai-khoan',
        element: <BaoCaoTaiKhoanModule />,
      },
      {
        path: 'doi-tac',
        element: <DoiTacSubmenuPage />,
      },
      // Module Khách hàng
      {
        path: 'doi-tac/nhom-khach-hang',
        element: <KhachHangModule />,
      },
      {
        path: 'doi-tac/nhom-khach-hang/moi',
        element: <KhachHangModule />,
      },
      {
        path: 'doi-tac/nhom-khach-hang/:id',
        element: <KhachHangModule />,
      },
      {
        path: 'doi-tac/nhom-khach-hang/:id/sua',
        element: <KhachHangModule />,
      },
      {
        path: 'doi-tac/danh-sach-khach-hang',
        element: <KhachHangModule />,
      },
      {
        path: 'doi-tac/danh-sach-khach-hang/moi',
        element: <KhachHangModule />,
      },
      {
        path: 'doi-tac/danh-sach-khach-hang/:id',
        element: <KhachHangModule />,
      },
      {
        path: 'doi-tac/danh-sach-khach-hang/:id/sua',
        element: <KhachHangModule />,
      },
      // Module Nhà cung cấp
      {
        path: 'doi-tac/nhom-nha-cung-cap',
        element: <NhaCungCapModule />,
      },
      {
        path: 'doi-tac/nhom-nha-cung-cap/moi',
        element: <NhaCungCapModule />,
      },
      {
        path: 'doi-tac/nhom-nha-cung-cap/:id',
        element: <NhaCungCapModule />,
      },
      {
        path: 'doi-tac/nhom-nha-cung-cap/:id/sua',
        element: <NhaCungCapModule />,
      },
      {
        path: 'doi-tac/danh-sach-nha-cung-cap',
        element: <NhaCungCapModule />,
      },
      {
        path: 'doi-tac/danh-sach-nha-cung-cap/moi',
        element: <NhaCungCapModule />,
      },
      {
        path: 'doi-tac/danh-sach-nha-cung-cap/:id',
        element: <NhaCungCapModule />,
      },
      {
        path: 'doi-tac/danh-sach-nha-cung-cap/:id/sua',
        element: <NhaCungCapModule />,
      },
        // Redirect từ URL cũ sang URL mới (backward compatibility)
      {
        path: 'doi-tac/nhom-doi-tac',
        element: <RedirectNhomDoiTac />,
      },
      {
        path: 'doi-tac/nhom-doi-tac/moi',
        element: <RedirectNhomDoiTacNew />,
      },
      {
        path: 'doi-tac/nhom-doi-tac/:id/sua',
        element: <RedirectNhomDoiTacEdit />,
      },
      {
        path: 'doi-tac/nhom-doi-tac/:id',
        element: <RedirectNhomDoiTacDetail />,
      },
      {
        // Redirect từ URL cũ sang URL mới
        path: 'doi-tac/danh-sach-doi-tac',
        element: <RedirectDanhSachNhaCungCap />,
      },
      {
        // Redirect từ URL cũ sang URL mới
        path: 'doi-tac/danh-sach-nha-cung-cap',
        element: <RedirectDanhSachNhaCungCap />,
      },
      {
        path: 'doi-tac/danh-sach-nha-cung-cap/moi',
        element: <RedirectDanhSachNhaCungCapNew />,
      },
      {
        path: 'doi-tac/danh-sach-nha-cung-cap/:id',
        element: <RedirectDanhSachNhaCungCapDetail />,
      },
      {
        path: 'doi-tac/danh-sach-nha-cung-cap/:id/sua',
        element: <RedirectDanhSachNhaCungCapEdit />,
      },
      {
        // Redirect từ URL cũ sang URL mới
        path: 'doi-tac/danh-sach-khach-hang',
        element: <RedirectDanhSachKhachHang />,
      },
      {
        path: 'doi-tac/danh-sach-khach-hang/moi',
        element: <RedirectDanhSachKhachHangNew />,
      },
      {
        path: 'doi-tac/danh-sach-khach-hang/:id',
        element: <RedirectDanhSachKhachHangDetail />,
      },
      {
        path: 'doi-tac/danh-sach-khach-hang/:id/sua',
        element: <RedirectDanhSachKhachHangEdit />,
      },
      {
        path: 'thiet-lap',
        element: <ThietLapSubmenuPage />,
      },
      {
        path: 'thiet-lap/nguoi-dung',
        element: <NguoiDungModule />,
      },
      {
        path: 'thiet-lap/nguoi-dung/moi',
        element: <NguoiDungModule />,
      },
      {
        path: 'thiet-lap/nguoi-dung/:id',
        element: <NguoiDungModule />,
      },
      {
        path: 'thiet-lap/nguoi-dung/:id/sua',
        element: <NguoiDungModule />,
      },
      {
        path: 'thiet-lap/vai-tro',
        element: <VaiTroModule />,
      },
      {
        path: 'thiet-lap/vai-tro/moi',
        element: <VaiTroModule />,
      },
      {
        path: 'thiet-lap/vai-tro/:id',
        element: <VaiTroModule />,
      },
      {
        path: 'thiet-lap/vai-tro/:id/sua',
        element: <VaiTroModule />,
      },
      {
        path: 'thiet-lap/phong-ban',
        element: <PhongBanModule />,
      },
      {
        path: 'thiet-lap/phong-ban/moi',
        element: <PhongBanModule />,
      },
      {
        path: 'thiet-lap/phong-ban/:id',
        element: <PhongBanModule />,
      },
      {
        path: 'thiet-lap/phong-ban/:id/sua',
        element: <PhongBanModule />,
      },
      {
        path: 'thiet-lap/phan-quyen',
        element: <PhanQuyenModule />,
      },
      {
        path: 'thiet-lap/cai-dat',
        element: <CaiDatModule />,
      },
      {
        path: 'thiet-lap/thong-tin-cong-ty',
        element: <ThongTinCongTyModule />,
      },
      {
        path: 'ho-so',
        element: <HoSoPage />,
      },
    ],
  },
])

