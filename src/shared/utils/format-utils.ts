/**
 * Shared formatting utilities for financial data
 */

/**
 * Format currency value
 */
export function formatCurrency(
  value: number | null | undefined,
  options?: {
    currency?: string
    notation?: 'standard' | 'compact'
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  }
): string {
  if (value === null || value === undefined) return '—'
  
  const {
    currency = 'VND',
    notation = 'standard',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options || {}

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    notation,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value)
}

/**
 * Format currency compact (for charts)
 */
export function formatCurrencyCompact(value: number | null | undefined): string {
  return formatCurrency(value, {
    notation: 'compact',
    maximumFractionDigits: 1,
  })
}

/**
 * Format percent value
 */
export function formatPercent(
  value: number,
  total: number,
  options?: {
    showSign?: boolean
    decimals?: number
  }
): string {
  if (total === 0) return '0%'
  
  const { showSign = false, decimals = 1 } = options || {}
  const percent = (value / total) * 100
  const sign = showSign && percent >= 0 ? '+' : ''
  
  return `${sign}${percent.toFixed(decimals)}%`
}

/**
 * Format percent change
 */
export function formatPercentChange(
  value: number,
  options?: {
    decimals?: number
  }
): string {
  const { decimals = 1 } = options || {}
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('vi-VN').format(value)
}

