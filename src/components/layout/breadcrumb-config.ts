/**
 * Cấu hình breadcrumb cho các routes
 * Map path -> label để hiển thị trong breadcrumb
 */
export const breadcrumbConfig: Record<string, string> = {
  '/': 'Trang chủ',
  '/tai-chinh': 'Tài chính',
  '/tai-chinh/danh-muc': 'Danh mục',
  '/tai-chinh/tai-khoan': 'Tài khoản',
  '/tai-chinh/thu-chi': 'Giao dịch',
  '/tai-chinh/ty-gia': 'Tỷ giá',
  '/doi-tac': 'Đối tác',
  '/doi-tac/nha-cung-cap': 'Nhà cung cấp',
  '/doi-tac/khach-hang': 'Khách hàng',
  '/doi-tac/danh-sach-doi-tac': 'Danh sách đối tác',
  '/doi-tac/danh-sach-nha-cung-cap': 'Danh sách nhà cung cấp',
  '/doi-tac/danh-sach-khach-hang': 'Danh sách khách hàng',
  '/thiet-lap': 'Thiết lập',
  '/thiet-lap/nguoi-dung': 'Người dùng',
  '/thiet-lap/vai-tro': 'Vai trò',
  '/thiet-lap/phan-quyen': 'Phân quyền',
  '/thiet-lap/cai-dat': 'Cài đặt',
  '/ho-so': 'Hồ sơ',
}

/**
 * Lấy breadcrumb labels từ path
 * Hỗ trợ nested paths như /thiet-lap/vai-tro/detail -> ['Trang chủ', 'Thiết lập', 'Vai trò', 'Chi tiết']
 * @param pathname - Đường dẫn hiện tại
 * @param hasDetailLabel - Có detail label từ context không (nếu có thì sẽ skip ID ở cuối path)
 */
export function getBreadcrumbLabels(pathname: string, hasDetailLabel: boolean = false): string[] {
  const labels: string[] = ['Trang chủ']
  
  // Nếu là trang chủ
  if (pathname === '/') {
    return labels
  }

  // Tách path thành các phần
  const parts = pathname.split('/').filter(Boolean)
  
  // Build path từng phần để map với config
  let currentPath = ''
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    currentPath += `/${part}`
    
    // Kiểm tra xem có trong config không
    if (breadcrumbConfig[currentPath]) {
      labels.push(breadcrumbConfig[currentPath])
    } else {
      // Kiểm tra xem có phải là ID không (số thuần túy, UUID, hoặc pattern ID)
      const formattedPart = formatPathPart(part)
      
      // Nếu là ID (formattedPart === null), skip
      if (formattedPart === null) {
        // Skip ID, không thêm vào breadcrumb
        continue
      }
      
      // Nếu là phần cuối cùng và có detailLabel, skip (sẽ được thêm vào bởi detail label)
      if (i === parts.length - 1 && hasDetailLabel) {
        // Không thêm vào vì sẽ có detail label
        continue
      }
      
      // Thêm vào breadcrumb
      labels.push(formattedPart)
    }
  }

  return labels
}

/**
 * Format path part thành label đẹp hơn
 */
function formatPathPart(part: string): string | null {
  const partMap: Record<string, string> = {
    detail: 'Chi tiết',
    edit: 'Chỉnh sửa',
    create: 'Tạo mới',
    'them-moi': 'Thêm mới',
    moi: 'Thêm mới',
    sua: 'Chỉnh sửa',
  }

  // Nếu là UUID hoặc ID dài (>20 ký tự), không format (sẽ được xử lý bởi detail label)
  if (part.length > 20) {
    return null // Return null để skip, sẽ được thay bằng detail label
  }

  // Detect ID số thuần túy (chỉ chứa chữ số, ví dụ: 12, 123, 1)
  const numericIdPattern = /^\d+$/
  if (numericIdPattern.test(part)) {
    return null // Return null để skip ID số, sẽ được thay bằng detail label
  }

  // Detect ID pattern (vd: kh-1, ncc-2, dt-ncc-1, dt-kh-1, user-123, uuid với dấu gạch ngang)
  // Pattern: chữ cái + (gạch ngang + chữ cái/số)* + gạch ngang + số ở cuối
  const idPattern = /^[a-z]+(-\d+)+$/i // Match: kh-5, ncc-1, user-123 (chữ-số)
  const multiDashIdPattern = /^[a-z]+(-[a-z]+)+-\d+$/i // Match: dt-ncc-1, dt-kh-1 (chữ-chữ-số)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i // UUID pattern
  const shortIdPattern = /^[a-z]{2,3}-\d+$/i // Match: kh-5, ncc-1 (2-3 chữ cái + gạch + số)
  
  // Nếu match pattern ID, không format (sẽ được thay bằng detail label)
  if (idPattern.test(part) || multiDashIdPattern.test(part) || uuidPattern.test(part) || shortIdPattern.test(part)) {
    return null
  }

  // Nếu có trong partMap, trả về label từ map
  if (partMap[part]) {
    return partMap[part]
  }

  // Format default: viết hoa chữ cái đầu, thay gạch ngang bằng space
  return part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')
}

