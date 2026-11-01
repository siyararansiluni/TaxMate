import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import Footer from '../components/Footer'

//  EXISTING PATHS 
const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/income': 'Income Management',
  '/expenses': 'Expenses & Deductions',
  '/tax-calculator': 'Tax Calculator',
  '/tax-returns': 'Tax Returns',
  '/profile': 'My Profile',
  '/tax-advisor': 'Find a Tax Advisor',
}

function TaxpayerLayout() {
  const { pathname } = useLocation()
  // remember the page where the menu was opened: it counts as open only on that page,
  // so navigating closes it without needing an effect
  const [openPath, setOpenPath] = useState<string | null>(null)
  const menuOpen = openPath === pathname

  const title =
    Object.entries(PAGE_TITLES).find(
      ([path]) => pathname === path || pathname.startsWith(path + '/'),
    )?.[1] ?? ''

  // close the drawer with the Escape key
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenPath(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar open={menuOpen} onClose={() => setOpenPath(null)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar page={title} onMenuClick={() => setOpenPath(pathname)} />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default TaxpayerLayout