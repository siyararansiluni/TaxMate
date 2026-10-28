import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function TaxpayerLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default TaxpayerLayout