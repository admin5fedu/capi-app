import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { HomePage, TaiChinhSubmenuPage, DoiTacSubmenuPage, ThietLapSubmenuPage } from '@/pages'
import { LoginPage } from '@/pages/login'
import { NguoiDungModule } from '@/features/thiet-lap/nguoi-dung'
import { VaiTroModule } from '@/features/thiet-lap/vai-tro'
import { PhanQuyenModule } from '@/features/thiet-lap/phan-quyen'
import { CaiDatModule } from '@/features/thiet-lap/cai-dat/index'
import { TaiKhoanModule } from '@/features/tai-chinh/tai-khoan'
import { DanhMucModule } from '@/features/tai-chinh/danh-muc'
import { NhomDoiTacModule } from '@/features/doi-tac/nhom-doi-tac'
import { DanhSachDoiTacModule } from '@/features/doi-tac/danh-sach-doi-tac'
import { HoSoPage } from '@/pages/ho-so'
import { ModulePlaceholder } from '@/components/placeholder/module-placeholder'
import {
  RedirectNhomDoiTac,
  RedirectNhomDoiTacNew,
  RedirectNhomDoiTacDetail,
  RedirectNhomDoiTacEdit,
} from '@/components/redirect/redirect-nhom-doi-tac'

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
        path: 'tai-chinh/danh-muc',
        element: <DanhMucModule />,
      },
      {
        path: 'tai-chinh/danh-muc/moi',
        element: <DanhMucModule />,
      },
      {
        path: 'tai-chinh/danh-muc/:id',
        element: <DanhMucModule />,
      },
      {
        path: 'tai-chinh/danh-muc/:id/sua',
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
        element: (
          <ModulePlaceholder
            title="Thu chi"
            description="Module quản lý các khoản thu chi và dòng tiền đang được phát triển."
          />
        ),
      },
      {
        path: 'doi-tac',
        element: <DoiTacSubmenuPage />,
      },
      {
        // Redirect từ URL cũ sang URL mới (backward compatibility)
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
        path: 'doi-tac/nha-cung-cap',
        element: <NhomDoiTacModule />,
      },
      {
        path: 'doi-tac/nha-cung-cap/moi',
        element: <NhomDoiTacModule />,
      },
      {
        path: 'doi-tac/nha-cung-cap/:id',
        element: <NhomDoiTacModule />,
      },
      {
        path: 'doi-tac/nha-cung-cap/:id/sua',
        element: <NhomDoiTacModule />,
      },
      {
        path: 'doi-tac/khach-hang',
        element: <NhomDoiTacModule />,
      },
      {
        path: 'doi-tac/khach-hang/moi',
        element: <NhomDoiTacModule />,
      },
      {
        path: 'doi-tac/khach-hang/:id',
        element: <NhomDoiTacModule />,
      },
      {
        path: 'doi-tac/khach-hang/:id/sua',
        element: <NhomDoiTacModule />,
      },
      {
        path: 'doi-tac/danh-sach-doi-tac',
        element: <Navigate to="/doi-tac/danh-sach-nha-cung-cap" replace />,
      },
      {
        path: 'doi-tac/danh-sach-nha-cung-cap',
        element: <DanhSachDoiTacModule />,
      },
      {
        path: 'doi-tac/danh-sach-nha-cung-cap/moi',
        element: <DanhSachDoiTacModule />,
      },
      {
        path: 'doi-tac/danh-sach-nha-cung-cap/:id',
        element: <DanhSachDoiTacModule />,
      },
      {
        path: 'doi-tac/danh-sach-nha-cung-cap/:id/sua',
        element: <DanhSachDoiTacModule />,
      },
      {
        path: 'doi-tac/danh-sach-khach-hang',
        element: <DanhSachDoiTacModule />,
      },
      {
        path: 'doi-tac/danh-sach-khach-hang/moi',
        element: <DanhSachDoiTacModule />,
      },
      {
        path: 'doi-tac/danh-sach-khach-hang/:id',
        element: <DanhSachDoiTacModule />,
      },
      {
        path: 'doi-tac/danh-sach-khach-hang/:id/sua',
        element: <DanhSachDoiTacModule />,
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
        path: 'thiet-lap/phan-quyen',
        element: <PhanQuyenModule />,
      },
      {
        path: 'thiet-lap/cai-dat',
        element: <CaiDatModule />,
      },
      {
        path: 'ho-so',
        element: <HoSoPage />,
      },
    ],
  },
])

