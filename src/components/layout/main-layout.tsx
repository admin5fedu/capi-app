import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './sidebar'
import { Navbar } from './navbar'
import { BreadcrumbProvider } from './breadcrumb-context'
import { MobileFooterNavigation } from './mobile-footer-navigation'

export function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false) // Mặc định mở (false = mở)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // Mobile: mặc định đóng

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block">
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </aside>

      {/* Sidebar - Mobile: Slide in từ trái, nằm trong layout */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen z-40 transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar isCollapsed={false} />
      </aside>

      {/* Overlay - Mobile: Chỉ hiện khi sidebar mở */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        <BreadcrumbProvider>
          <Navbar onToggleSidebar={toggleMobileMenu} onToggleDesktopSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6 flex flex-col min-h-0">
            <Outlet />
          </main>
          {/* Mobile Footer Navigation */}
          <MobileFooterNavigation />
        </BreadcrumbProvider>
      </div>
    </div>
  )
}

