import { useEffect } from 'react'
import { useSettingsStore } from '@/store/settings-store'

/**
 * Hook để khởi tạo và áp dụng cài đặt khi app khởi động
 * Đảm bảo cài đặt được áp dụng ngay cả khi store chưa được hydrate
 */
export function useSettingsInit() {
  const { primaryColor, fontFamily } = useSettingsStore()

  useEffect(() => {
    // Áp dụng màu primary
    if (primaryColor) {
      document.documentElement.style.setProperty('--primary', primaryColor.value)
    }

    // Áp dụng font chữ
    if (fontFamily) {
      document.documentElement.style.setProperty('--font-family', fontFamily.cssValue)
      document.body.style.fontFamily = fontFamily.cssValue
    }
  }, [primaryColor, fontFamily])
}

