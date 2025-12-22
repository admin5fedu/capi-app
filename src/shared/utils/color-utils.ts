import type { VariantProps } from 'class-variance-authority'
import type { badgeVariants } from '@/components/ui/badge'

type BadgeVariant = VariantProps<typeof badgeVariants>['variant']

/**
 * Map loại tài khoản sang màu badge
 */
export function getTaiKhoanLoaiBadgeVariant(loai: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    tien_mat: 'tien_mat',
    ngan_hang: 'ngan_hang',
    vi_dien_tu: 'vi_dien_tu',
    khac: 'khac',
  }
  return map[loai] || 'default'
}

/**
 * Map loại danh mục sang màu badge
 */
export function getDanhMucLoaiBadgeVariant(loai: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    khach_hang: 'khach_hang',
    nha_cung_cap: 'nha_cung_cap',
    san_pham: 'san_pham',
    dich_vu: 'dich_vu',
    khac: 'khac',
  }
  return map[loai] || 'default'
}

/**
 * Map loại thu/chi sang màu badge
 */
export function getThuChiBadgeVariant(loai: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    thu: 'thu',
    chi: 'chi',
  }
  return map[loai] || 'default'
}

/**
 * Map trạng thái sang màu badge
 */
export function getStatusBadgeVariant(isActive: boolean | null | undefined): BadgeVariant {
  return isActive ? 'success' : 'error'
}

/**
 * Render Badge component với variant tự động
 */
export function renderBadge(
  label: string,
  variant: BadgeVariant = 'default',
  className?: string
) {
  // This is a helper function, actual rendering should be done in components
  return { label, variant, className }
}

