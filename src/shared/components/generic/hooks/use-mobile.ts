import { useState, useEffect } from 'react'

/**
 * Hook để detect mobile screen size
 * Returns true nếu màn hình < 768px (md breakpoint)
 */
export function useMobile() {
  // Khởi tạo với giá trị từ window nếu có (SSR-safe)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check initial (đảm bảo sync với state)
    checkMobile()

    // Listen for resize
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return isMobile
}

