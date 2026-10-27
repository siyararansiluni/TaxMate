
import { Navigate, Route, Routes } from 'react-router-dom'

import Home from '../pages/Home'
import Login from '../pages/Login'
import TaxPayerDashboard from '../pages/TaxPayerDashboard'
import IncomeManagement from '../pages/IncomeManagement'
import ExpensesDeductions from '../pages/ExpensesDeductions'
import TaxCalculator from '../pages/TaxCalculator'
import TaxReturns from '../pages/TaxReturns'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<TaxPayerDashboard />} />
      <Route path="/income" element={<IncomeManagement />} />
      <Route path="/expenses" element={<ExpensesDeductions />} />
      <Route path="/tax-calculator" element={<TaxCalculator />} />
      <Route path="/tax-returns" element={<TaxReturns />} />
      <Route path="*" element={<Navigate to="/income" replace />} />
    </Routes>
  )
}
