import { createContext, useContext, useState, ReactNode } from 'react'

interface BreadcrumbContextType {
  detailLabel: string | null
  setDetailLabel: (label: string | null) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [detailLabel, setDetailLabel] = useState<string | null>(null)

  return (
    <BreadcrumbContext.Provider value={{ detailLabel, setDetailLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext)
  if (!context) {
    throw new Error('useBreadcrumb must be used within BreadcrumbProvider')
  }
  return context
}

