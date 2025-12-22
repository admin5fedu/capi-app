import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PrimaryColor = {
  name: string
  value: string // HSL format: "hue saturation% lightness%"
  preview: string // Hex color for preview
}

export type FontFamily = {
  name: string
  value: string
  cssValue: string // CSS font-family value
}

// Danh sách màu primary có sẵn
export const PRIMARY_COLORS: PrimaryColor[] = [
  {
    name: 'Xanh dương',
    value: '221.2 83.2% 53.3%',
    preview: '#3b82f6',
  },
  {
    name: 'Xanh lá',
    value: '142.1 76.2% 36.3%',
    preview: '#10b981',
  },
  {
    name: 'Tím',
    value: '262.1 83.3% 57.8%',
    preview: '#8b5cf6',
  },
  {
    name: 'Hồng',
    value: '330.4 81.2% 60.4%',
    preview: '#ec4899',
  },
  {
    name: 'Cam',
    value: '24.6 95% 53.1%',
    preview: '#f97316',
  },
  {
    name: 'Đỏ',
    value: '0 84.2% 60.2%',
    preview: '#ef4444',
  },
  {
    name: 'Vàng',
    value: '45.4 93.4% 47.5%',
    preview: '#eab308',
  },
  {
    name: 'Xám',
    value: '222.2 47.4% 11.2%',
    preview: '#1e293b',
  },
]

// Danh sách font chữ có sẵn
export const FONT_FAMILIES: FontFamily[] = [
  {
    name: 'Inter (Mặc định)',
    value: 'inter',
    cssValue: 'Inter, system-ui, -apple-system, sans-serif',
  },
  {
    name: 'Roboto',
    value: 'roboto',
    cssValue: 'Roboto, system-ui, sans-serif',
  },
  {
    name: 'Open Sans',
    value: 'open-sans',
    cssValue: 'Open Sans, system-ui, sans-serif',
  },
  {
    name: 'Poppins',
    value: 'poppins',
    cssValue: 'Poppins, system-ui, sans-serif',
  },
  {
    name: 'Lato',
    value: 'lato',
    cssValue: 'Lato, system-ui, sans-serif',
  },
  {
    name: 'Montserrat',
    value: 'montserrat',
    cssValue: 'Montserrat, system-ui, sans-serif',
  },
]

export type Theme = 'light' | 'dark' | 'system'

interface SettingsState {
  primaryColor: PrimaryColor
  fontFamily: FontFamily
  theme: Theme
}

interface SettingsActions {
  setPrimaryColor: (color: PrimaryColor) => void
  setFontFamily: (font: FontFamily) => void
  setTheme: (theme: Theme) => void
  reset: () => void
}

const defaultPrimaryColor = PRIMARY_COLORS[0] // Xanh dương
const defaultFontFamily = FONT_FAMILIES[0] // Inter
const defaultTheme: Theme = 'system'

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

const initialState: SettingsState = {
  primaryColor: defaultPrimaryColor,
  fontFamily: defaultFontFamily,
  theme: defaultTheme,
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...initialState,

      /**
       * Đặt màu primary
       */
      setPrimaryColor: (color) => {
        set({ primaryColor: color })
        // Áp dụng ngay lập tức
        document.documentElement.style.setProperty('--primary', color.value)
      },

      /**
       * Đặt font chữ
       */
      setFontFamily: (font) => {
        set({ fontFamily: font })
        // Áp dụng ngay lập tức
        document.documentElement.style.setProperty('--font-family', font.cssValue)
        document.body.style.fontFamily = font.cssValue
      },

      /**
       * Đặt theme (light/dark/system)
       */
      setTheme: (theme) => {
        set({ theme })
        // Áp dụng ngay lập tức
        applyTheme(theme)
      },

      /**
       * Reset về mặc định
       */
      reset: () => {
        set({
          primaryColor: defaultPrimaryColor,
          fontFamily: defaultFontFamily,
          theme: defaultTheme,
        })
        // Áp dụng lại mặc định
        document.documentElement.style.setProperty('--primary', defaultPrimaryColor.value)
        document.documentElement.style.setProperty('--font-family', defaultFontFamily.cssValue)
        document.body.style.fontFamily = defaultFontFamily.cssValue
        applyTheme(defaultTheme)
      },
    }),
    {
      name: 'settings-storage',
      // Lưu primaryColor, fontFamily và theme
      partialize: (state) => ({
        primaryColor: state.primaryColor,
        fontFamily: state.fontFamily,
        theme: state.theme,
      }),
      // Khôi phục và áp dụng cài đặt khi load
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Áp dụng màu primary
          document.documentElement.style.setProperty('--primary', state.primaryColor.value)
          // Áp dụng font chữ
          document.documentElement.style.setProperty('--font-family', state.fontFamily.cssValue)
          document.body.style.fontFamily = state.fontFamily.cssValue
          // Áp dụng theme
          applyTheme(state.theme)
        }
      },
    }
  )
)

