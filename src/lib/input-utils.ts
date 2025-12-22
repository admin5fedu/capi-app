import { z } from 'zod'

/**
 * Format số với dấu phân cách hàng nghìn
 * @example formatNumber(1000000) => "1.000.000"
 */
export function formatNumber(value: number | string): string {
  if (value === '' || value === null || value === undefined) return ''
  const numStr = String(value).replace(/\./g, '')
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Parse số từ chuỗi có dấu phân cách
 * @example parseNumber("1.000.000") => 1000000
 */
export function parseNumber(value: string): number {
  if (!value) return 0
  return Number(value.replace(/\./g, ''))
}

/**
 * Validation số điện thoại Việt Nam
 * Hỗ trợ: 10 số (bắt đầu 0) hoặc 11 số (bắt đầu 84)
 */
export function validateVietnamesePhone(phone: string): boolean {
  if (!phone) return false
  const cleaned = phone.replace(/\s+/g, '')
  // 10 số bắt đầu bằng 0
  const pattern10 = /^0[3|5|7|8|9][0-9]{8}$/
  // 11 số bắt đầu bằng 84
  const pattern11 = /^84[3|5|7|8|9][0-9]{8}$/
  return pattern10.test(cleaned) || pattern11.test(cleaned)
}

/**
 * Format số điện thoại Việt Nam
 * @example formatPhone("0912345678") => "0912 345 678"
 */
export function formatPhone(value: string): string {
  if (!value) return ''
  const cleaned = value.replace(/\s+/g, '')
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  if (cleaned.length === 11 && cleaned.startsWith('84')) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }
  return cleaned
}

/**
 * Zod schema cho số điện thoại Việt Nam
 */
export const vietnamesePhoneSchema = z.string().refine(
  (val) => !val || validateVietnamesePhone(val),
  { message: 'Số điện thoại không hợp lệ. Ví dụ: 0912345678 hoặc 84912345678' }
)

/**
 * Format date theo định dạng Việt Nam (DD/MM/YYYY)
 */
export function formatDateVN(date: Date | string | null | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Parse date từ định dạng Việt Nam (DD/MM/YYYY)
 */
export function parseDateVN(dateStr: string): Date | null {
  if (!dateStr) return null
  const parts = dateStr.split('/')
  if (parts.length !== 3) return null
  
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const year = parseInt(parts[2], 10)
  
  const date = new Date(year, month, day)
  if (isNaN(date.getTime())) return null
  
  // Validate ngày hợp lệ
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return null
  }
  
  return date
}

/**
 * Validate date string theo format DD/MM/YYYY
 */
export function validateDateVN(dateStr: string): boolean {
  return parseDateVN(dateStr) !== null
}

/**
 * Apply mask pattern cho input
 * @example applyMask("1234567890", "###-###-####") => "123-456-7890"
 */
export function applyMask(value: string, mask: string): string {
  if (!value || !mask) return value
  
  const valueChars = value.replace(/\D/g, '').split('')
  let result = ''
  let valueIndex = 0
  
  for (let i = 0; i < mask.length && valueIndex < valueChars.length; i++) {
    if (mask[i] === '#') {
      result += valueChars[valueIndex++]
    } else {
      result += mask[i]
    }
  }
  
  return result
}

/**
 * Remove mask từ giá trị
 * @example removeMask("123-456-7890") => "1234567890"
 */
export function removeMask(value: string): string {
  return value.replace(/\D/g, '')
}

