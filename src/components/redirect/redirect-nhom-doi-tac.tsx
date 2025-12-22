import { Navigate, useParams } from 'react-router-dom'

/**
 * Redirect component để chuyển từ URL cũ /doi-tac/nhom-doi-tac sang URL mới
 */
export function RedirectNhomDoiTac() {
  return <Navigate to="/doi-tac/nha-cung-cap" replace />
}

export function RedirectNhomDoiTacNew() {
  return <Navigate to="/doi-tac/nha-cung-cap/moi" replace />
}

export function RedirectNhomDoiTacDetail() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/doi-tac/nha-cung-cap" replace />
  return <Navigate to={`/doi-tac/nha-cung-cap/${id}`} replace />
}

export function RedirectNhomDoiTacEdit() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/doi-tac/nha-cung-cap" replace />
  return <Navigate to={`/doi-tac/nha-cung-cap/${id}/sua`} replace />
}

