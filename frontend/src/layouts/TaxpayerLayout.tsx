import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import Footer from '../components/Footer'
import { getSession } from '../auth/session'

// Text shown in the top bar breadcrumb for each page
const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/profile': 'My Profile',
  '/income': 'Income Management',
  '/expenses': 'Expenses & Deductions',
  '/tax-calculator': 'Tax Calculator',
  '/tax-returns': 'Tax Returns',
  '/documents': 'Documents',
  '/tax-advisor': 'Find a Tax Advisor',
}

function TaxpayerLayout() {
  const { pathname } = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false) // mobile drawer

  const page = pathname.startsWith('/tax-advisor/')
    ? 'Advisor Profile'
    : pageTitles[pathname] ?? 'TaxMate'

  const initial = getSession()?.name?.charAt(0).toUpperCase() ?? 'K'

  // Every new page starts at the top, and the mobile drawer closes
  // Every new page starts at the top
useEffect(() => {
  contentRef.current?.scrollTo({ top: 0 })
}, [pathname])
  return (
    // Locked to the screen height: the browser page itself never scrolls
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

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

export default TaxpayerLayout