import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../pages/Home'
import Login from '../pages/Login'
import TaxPayerDashboard from '../pages/TaxPayerDashboard'
import MyProfile from '../pages/MyProfile'  
import IncomeManagement from '../pages/IncomeManagement'
import ExpensesDeductions from '../pages/ExpensesDeductions'
import TaxCalculator from '../pages/TaxCalculator'
import TaxReturns from '../pages/TaxReturns'

import TaxpayerLayout from '../layouts/TaxpayerLayout'

function AppRoutes() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Pages without the taxpayer sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />

      {/* Pages with the shared taxpayer sidebar */}
      <Route element={<TaxpayerLayout />}>
        <Route path="/dashboard" element={<TaxPayerDashboard />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/income" element={<IncomeManagement />} />
        <Route path="/expenses" element={<ExpensesDeductions />} />
        <Route path="/tax-calculator" element={<TaxCalculator />} />
        <Route path="/tax-returns" element={<TaxReturns />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes