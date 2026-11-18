import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Sidebar, { type NavItem } from '../components/Sidebar'
import TopBar from '../components/TopBar'
import Footer from '../components/Footer'
import { getSession } from '../auth/session'

// Links shown in the advisor sidebar
const ADVISOR_NAV: NavItem[] = [
  { label: 'Dashboard', to: '/advisor/dashboard' },
  { label: 'My Advisor Profile', to: '/advisor/profile' },
  { label: 'Assigned Clients', to: '/advisor/clients' },
]

// Text shown in the top bar breadcrumb for each page
const pageTitles: Record<string, string> = {
  '/advisor/dashboard': 'Advisor Dashboard',
  '/advisor/profile': 'My Advisor Profile',
  '/advisor/clients': 'Assigned Clients',
}

function AdvisorLayout() {
  const { pathname } = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false) // mobile drawer

  const page = pageTitles[pathname] ?? 'TaxMate'
  const initial = getSession()?.name?.charAt(0).toUpperCase() ?? 'A'

  // Every new page starts at the top
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      <Sidebar
        items={ADVISOR_NAV}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          page={page}
          initial={initial}
          onMenuClick={() => setMenuOpen(true)}
        />

        {/* Only this area scrolls */}
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

export default AdvisorLayout