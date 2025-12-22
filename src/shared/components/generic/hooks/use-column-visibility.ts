import { useState, useEffect } from 'react'
import { VisibilityState } from '@tanstack/react-table'
import type { CotHienThi } from '../types'

/**
 * Hook quản lý column visibility với localStorage persistence
 */
export function useColumnVisibility<TData extends Record<string, any>>(
  cotHienThi: CotHienThi<TData>[],
  tenLuuTru: string = 'generic-list-columns'
) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [showColumnMenu, setShowColumnMenu] = useState(false)

  // Load column visibility từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem(tenLuuTru)
    if (saved) {
      try {
        setColumnVisibility(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading column visibility:', e)
      }
    } else {
      // Set default visibility
      const defaultVisibility: VisibilityState = {}
      cotHienThi.forEach((cot) => {
        defaultVisibility[cot.key] = cot.defaultVisible !== false
      })
      setColumnVisibility(defaultVisibility)
    }
  }, [tenLuuTru, cotHienThi])

  // Save column visibility vào localStorage
  useEffect(() => {
    localStorage.setItem(tenLuuTru, JSON.stringify(columnVisibility))
  }, [columnVisibility, tenLuuTru])

  return {
    columnVisibility,
    setColumnVisibility,
    showColumnMenu,
    setShowColumnMenu,
  }
}

