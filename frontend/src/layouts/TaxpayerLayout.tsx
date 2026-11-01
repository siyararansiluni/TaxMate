import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import Footer from '../components/Footer'

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
  const title =
  Object.entries(PAGE_TITLES).find(
    ([path]) => pathname === path || pathname.startsWith(path + '/'),
  )?.[1] ?? ''

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
           <TopBar page={title} />   
       

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default TaxpayerLayout