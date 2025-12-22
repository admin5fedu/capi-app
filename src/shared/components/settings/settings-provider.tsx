import { useEffect } from 'react'
import { useSettingsStore, type Theme } from '@/store/settings-store'

interface SettingsProviderProps {
  children: React.ReactNode
}

/**
 * Áp dụng theme vào document
 */
const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  
  if (theme === 'system') {
    // Sử dụng system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  } else if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/**
 * Provider để đảm bảo cài đặt được áp dụng khi app khởi động
 */
export function SettingsProvider({ children }: SettingsProviderProps) {
  const { primaryColor, fontFamily, theme } = useSettingsStore()

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

    // Áp dụng theme
    if (theme) {
      applyTheme(theme)
    }
  }, [primaryColor, fontFamily, theme])

  // Lắng nghe thay đổi system preference khi theme là 'system'
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      applyTheme('system')
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [theme])

  return <>{children}</>
}

