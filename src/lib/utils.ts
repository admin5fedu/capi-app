import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Hàm cn kết hợp clsx và tailwind-merge để xử lý class Tailwind chuyên nghiệp
 * Giúp merge các class một cách thông minh, tránh conflict và override đúng cách
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (px-2 bị override bởi px-4)
 * cn('bg-red-500', isActive && 'bg-blue-500') // => Conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

