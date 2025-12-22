import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useSettingsStore, PRIMARY_COLORS, FONT_FAMILIES, type PrimaryColor, type FontFamily, type Theme } from '@/store/settings-store'
import { Check, RotateCcw, Sun, Moon, Monitor } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function CaiDatModule() {
  const { primaryColor, fontFamily, theme, setPrimaryColor, setFontFamily, setTheme, reset } = useSettingsStore()
  const [showResetDialog, setShowResetDialog] = useState(false)

  const handleColorChange = (color: PrimaryColor) => {
    setPrimaryColor(color)
    toast.success(`Đã đổi màu sang ${color.name}`)
  }

  const handleFontChange = (font: FontFamily) => {
    setFontFamily(font)
    toast.success(`Đã đổi font sang ${font.name}`)
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    const themeNames: Record<Theme, string> = {
      light: 'Sáng',
      dark: 'Tối',
      system: 'Hệ thống',
    }
    toast.success(`Đã đổi chế độ sang ${themeNames[newTheme]}`)
  }

  const handleReset = () => {
    reset()
    setShowResetDialog(false)
    toast.success('Đã khôi phục cài đặt mặc định')
  }

  const getCurrentDisplayMode = () => {
    if (theme === 'dark') return 'dark'
    if (theme === 'light') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  
  const [currentDisplayMode, setCurrentDisplayMode] = React.useState<'light' | 'dark'>(getCurrentDisplayMode())
  
  React.useEffect(() => {
    setCurrentDisplayMode(getCurrentDisplayMode())
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        setCurrentDisplayMode(mediaQuery.matches ? 'dark' : 'light')
      }
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    } else {
      setCurrentDisplayMode(theme)
    }
  }, [theme])

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden bg-card border rounded-lg">
        {/* Header */}
        <div className="flex-shrink-0 border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Cài đặt</h1>
            <Button variant="outline" size="sm" onClick={() => setShowResetDialog(true)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Mặc định
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {/* Chế độ hiển thị */}
            <div className="space-y-3">
              <h2 className="text-base font-semibold">Chế độ hiển thị</h2>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={cn(
                    'p-2 rounded-md border transition-all text-left flex items-center gap-2',
                    theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'
                  )}
                >
                  <Sun className={cn('h-4 w-4 flex-shrink-0', theme === 'light' ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="text-xs font-medium">Sáng</span>
                  {theme === 'light' && <Check className="h-3 w-3 text-primary ml-auto" />}
                </button>

                <button
                  onClick={() => handleThemeChange('dark')}
                  className={cn(
                    'p-2 rounded-md border transition-all text-left flex items-center gap-2',
                    theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'
                  )}
                >
                  <Moon className={cn('h-4 w-4 flex-shrink-0', theme === 'dark' ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="text-xs font-medium">Tối</span>
                  {theme === 'dark' && <Check className="h-3 w-3 text-primary ml-auto" />}
                </button>

                <button
                  onClick={() => handleThemeChange('system')}
                  className={cn(
                    'p-2 rounded-md border transition-all text-left flex items-center gap-2',
                    theme === 'system' ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent'
                  )}
                >
                  <Monitor className={cn('h-4 w-4 flex-shrink-0', theme === 'system' ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="text-xs font-medium">Hệ thống</span>
                  {theme === 'system' && <Check className="h-3 w-3 text-primary ml-auto" />}
                </button>
              </div>
              <div className="text-xs text-muted-foreground">
                Đang hiển thị: {currentDisplayMode === 'dark' ? 'Tối' : 'Sáng'}
              </div>
            </div>

            {/* Màu Primary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Màu Primary</h2>
                <span className="text-xs text-muted-foreground">{primaryColor.name}</span>
              </div>
              <div className="grid grid-cols-8 gap-1.5">
                {PRIMARY_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color)}
                    className={cn(
                      'relative aspect-square rounded border transition-all hover:scale-110',
                      primaryColor.value === color.value
                        ? 'border-primary ring-1 ring-primary'
                        : 'border-border/50 hover:border-primary/50'
                    )}
                    style={{ backgroundColor: color.preview }}
                    title={color.name}
                  >
                    {primaryColor.value === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Font chữ */}
            <div className="space-y-3">
              <h2 className="text-base font-semibold">Font chữ</h2>
              <div className="grid grid-cols-3 gap-2">
                {FONT_FAMILIES.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => handleFontChange(font)}
                    className={cn(
                      'p-2 rounded-md border transition-all text-left flex items-center justify-between',
                      fontFamily.value === font.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-accent'
                    )}
                    style={{ fontFamily: font.cssValue }}
                  >
                    <span className="text-xs font-medium">{font.name}</span>
                    {fontFamily.value === font.value && (
                      <Check className="h-3 w-3 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Khôi phục cài đặt mặc định</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn khôi phục tất cả cài đặt về mặc định? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>
              Khôi phục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default CaiDatModule
