import { Navigate, useParams } from 'react-router-dom'

/**
 * Redirect components cho các URL cũ của module đối tác
 */

export function RedirectDanhSachNhaCungCap() {
  return <Navigate to="/doi-tac/nha-cung-cap/danh-sach" replace />
}

export function RedirectDanhSachNhaCungCapNew() {
  return <Navigate to="/doi-tac/nha-cung-cap/danh-sach/moi" replace />
}

export function RedirectDanhSachNhaCungCapDetail() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/doi-tac/nha-cung-cap/danh-sach" replace />
  return <Navigate to={`/doi-tac/nha-cung-cap/danh-sach/${id}`} replace />
}

export function RedirectDanhSachNhaCungCapEdit() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/doi-tac/nha-cung-cap/danh-sach" replace />
  return <Navigate to={`/doi-tac/nha-cung-cap/danh-sach/${id}/sua`} replace />
}

export function RedirectDanhSachKhachHang() {
  return <Navigate to="/doi-tac/khach-hang/danh-sach" replace />
}

export function RedirectDanhSachKhachHangNew() {
  return <Navigate to="/doi-tac/khach-hang/danh-sach/moi" replace />
}

export function RedirectDanhSachKhachHangDetail() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/doi-tac/khach-hang/danh-sach" replace />
  return <Navigate to={`/doi-tac/khach-hang/danh-sach/${id}`} replace />
}

export function RedirectDanhSachKhachHangEdit() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/doi-tac/khach-hang/danh-sach" replace />
  return <Navigate to={`/doi-tac/khach-hang/danh-sach/${id}/sua`} replace />
}

