/**
 * Helper functions cho pagination
 */

/**
 * Tính toán range hiển thị (1-50 / 100)
 */
export function getPaginationRange(
  pageIndex: number,
  pageSize: number,
  totalItems: number
): { start: number; end: number; total: number } {
  const start = pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, totalItems)
  return { start, end, total: totalItems }
}

/**
 * Validate và normalize page number
 */
export function normalizePageNumber(page: number | string, maxPage: number): number {
  const pageNum = typeof page === 'string' ? parseInt(page, 10) : page
  if (isNaN(pageNum) || pageNum < 1) return 1
  if (pageNum > maxPage) return maxPage
  return pageNum
}

