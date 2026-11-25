import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Sidebar, { type NavItem } from '../components/Sidebar'
import TopBar from '../components/TopBar'
import Footer from '../components/Footer'
import { getSession } from '../auth/session'

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'User Management', to: '/admin/users' },
  { label: 'Tax Rules Management', to: '/admin/tax-rules' },
]

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Administrator Dashboard',
  '/admin/users': 'User Management',
  '/admin/tax-rules': 'Tax Rules Management',
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  const initial = getSession()?.name?.charAt(0).toUpperCase() ?? 'A'

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      <Sidebar
        items={ADMIN_NAV}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          page={pageTitles[pathname] ?? 'TaxMate'}
          initial={initial}
          onMenuClick={() => setMenuOpen(true)}
        />

        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto [scrollbar:none] [&::-webkit-scrollbar]:hidden"
        >
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}