import { Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import TaxPayerDashboard from '../pages/TaxPayerDashboard'
import IncomeManagement from '../pages/IncomeManagement'
import ExpensesDeductions from '../pages/ExpensesDeductions'
import TaxCalculator from '../pages/TaxCalculator'
import TaxReturns from '../pages/TaxReturns'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<TaxPayerDashboard />} />
      <Route path="/income" element={<IncomeManagement />} />
      <Route path="/expenses" element={<ExpensesDeductions />} />
      <Route path="/tax-calculator" element={<TaxCalculator />} />
      <Route path="/tax-returns" element={<TaxReturns />} />
    </Routes>
  )
}

export default AppRoutes