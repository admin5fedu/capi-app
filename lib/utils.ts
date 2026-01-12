
/**
 * Tiện ích kết hợp class Tailwind cho Shadcn UI
 */
export function cn(...inputs: (string | boolean | undefined | null)[]) {
  return inputs.filter(Boolean).join(' ');
}
