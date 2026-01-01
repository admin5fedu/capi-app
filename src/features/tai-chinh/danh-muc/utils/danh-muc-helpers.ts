import type { DanhMucWithParent, DanhMucWithChildren } from '@/types/danh-muc'

/**
 * Kiểm tra danh mục có phải cấp 1 không (không có parent)
 */
export function isLevel1(danhMuc: DanhMucWithParent): boolean {
  return !danhMuc.parent_id
}

/**
 * Kiểm tra danh mục có phải cấp 2 không (có parent)
 */
export function isLevel2(danhMuc: DanhMucWithParent): boolean {
  return !!danhMuc.parent_id
}

/**
 * Lấy danh sách danh mục cấp 1 (không có parent)
 */
export function getLevel1Items(items: DanhMucWithParent[]): DanhMucWithParent[] {
  return items.filter(isLevel1).sort((a, b) => (a.cap ?? 0) - (b.cap ?? 0))
}

/**
 * Lấy danh sách danh mục cấp 2 (có parent)
 */
export function getLevel2Items(items: DanhMucWithParent[]): DanhMucWithParent[] {
  return items.filter(isLevel2).sort((a, b) => (a.cap ?? 0) - (b.cap ?? 0))
}

/**
 * Xây dựng cấu trúc tree từ danh sách phẳng
 */
export function buildTreeStructure(items: DanhMucWithParent[]): DanhMucWithChildren[] {
  const level1Items = getLevel1Items(items)
  const level2Items = getLevel2Items(items)

  return level1Items.map((parent) => {
    const children = level2Items
      .filter((child) => child.parent_id ? String(child.parent_id) === String(parent.id) : false)
      .sort((a, b) => (a.cap ?? 0) - (b.cap ?? 0))

    return {
      ...parent,
      children: children.length > 0 ? children : undefined,
    } as DanhMucWithChildren
  })
}

/**
 * Lấy danh sách danh mục cấp 2 theo loại (chỉ những danh mục có parent)
 */
export function getLevel2ItemsByLoai(
  items: DanhMucWithParent[],
  loai: 'thu' | 'chi'
): DanhMucWithParent[] {
  return getLevel2Items(items).filter((item) => {
    // Check cả loai (alias) và hang_muc (cột thực tế)
    return item.loai === loai || item.hang_muc === loai
  })
}

/**
 * Kiểm tra danh mục có thể làm parent không (phải là cấp 1)
 */
export function canBeParent(danhMuc: DanhMucWithParent): boolean {
  return isLevel1(danhMuc)
}

/**
 * Kiểm tra có thể chọn danh mục này làm parent cho danh mục khác không
 */
export function canBeParentFor(
  potentialParent: DanhMucWithParent,
  child: DanhMucWithParent | null,
  sameLoai: boolean = true
): boolean {
  // Phải là cấp 1
  if (!canBeParent(potentialParent)) return false

  // Nếu đang edit, không thể chọn chính nó
  if (child && potentialParent.id === child.id) return false

  // Nếu yêu cầu cùng loại, phải cùng loại
  if (sameLoai && child && potentialParent.loai !== child.loai) return false

  // Không thể chọn danh mục con của chính nó (tránh vòng lặp)
  if (child) {
    let current: DanhMucWithParent | null = child
    while (current?.parent_id) {
      if (current.parent_id && String(current.parent_id) === String(potentialParent.id)) return false
      // Tìm parent của current (cần có danh sách đầy đủ để check)
      // Tạm thời chỉ check 1 cấp
      break
    }
  }

  return true
}

/**
 * Lấy danh sách danh mục có thể làm parent (cấp 1, cùng loại, không phải chính nó)
 */
export function getAvailableParents(
  allItems: DanhMucWithParent[],
  currentItem: DanhMucWithParent | null,
  loai: string
): DanhMucWithParent[] {
  return getLevel1Items(allItems).filter((item) => {
    if (item.loai !== loai) return false
    if (currentItem && item.id === currentItem.id) return false
    return true
  })
}

/**
 * Sắp xếp danh mục: Thu trước, Chi sau. Trong mỗi loại: cấp 1 trước, các cấp 2 của nó ngay sau
 */
export function sortDanhMucForListView(items: DanhMucWithParent[]): DanhMucWithParent[] {
  // Tách theo loại
  const thuItems = items.filter((item) => item.loai === 'thu')
  const chiItems = items.filter((item) => item.loai === 'chi')

  // Sắp xếp mỗi loại
  const sortedThu = sortByParentAndLevel(thuItems)
  const sortedChi = sortByParentAndLevel(chiItems)

  // Thu trước, Chi sau
  return [...sortedThu, ...sortedChi]
}

/**
 * Sắp xếp trong một loại: cấp 1 trước, các cấp 2 của nó ngay sau
 */
function sortByParentAndLevel(items: DanhMucWithParent[]): DanhMucWithParent[] {
  const level1Items = getLevel1Items(items)
  const level2Items = getLevel2Items(items)

  const result: DanhMucWithParent[] = []

  // Duyệt từng cấp 1, thêm nó và các cấp 2 của nó
  for (const parent of level1Items) {
    result.push(parent)

    // Thêm các cấp 2 của parent này (so sánh string với string vì parent_id là string)
    const children = level2Items
      .filter((child) => String(child.parent_id) === String(parent.id))
      .sort((a, b) => (a.cap ?? 0) - (b.cap ?? 0))

    result.push(...children)
  }

  return result
}

