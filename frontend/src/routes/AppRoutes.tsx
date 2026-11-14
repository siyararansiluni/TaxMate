import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../pages/Home'
import Login from '../pages/Login'
import ComingSoon from '../pages/ComingSoon'
import TaxPayerDashboard from '../pages/TaxPayerDashboard'
import MyProfile from '../pages/MyProfile'
import IncomeManagement from '../pages/IncomeManagement'
import ExpensesDeductions from '../pages/ExpensesDeductions'
import TaxCalculator from '../pages/TaxCalculator'
import TaxReturns from '../pages/TaxReturns'
import Documents from '../pages/Documents'
import FindTaxAdvisor from '../pages/FindTaxAdvisor'
import AdvisorProfile from '../pages/AdvisorProfile'

import TaxpayerLayout from '../layouts/TaxpayerLayout'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />

      {/* Taxpayer only: shared sidebar layout */}
      <Route element={<ProtectedRoute allowedRoles={['TAXPAYER']} />}>
        <Route element={<TaxpayerLayout />}>
          <Route path="/dashboard" element={<TaxPayerDashboard />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/income" element={<IncomeManagement />} />
          <Route path="/expenses" element={<ExpensesDeductions />} />
          <Route path="/tax-calculator" element={<TaxCalculator />} />
          <Route path="/tax-returns" element={<TaxReturns />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/tax-advisor" element={<FindTaxAdvisor />} />
          <Route path="/tax-advisor/:advisorId" element={<AdvisorProfile />} />
        </Route>
      </Route>

      {/* Tax advisor only (replace ComingSoon with the real page later) */}
      <Route element={<ProtectedRoute allowedRoles={['ADVISOR']} />}>
        <Route
          path="/advisor/dashboard"
          element={<ComingSoon title="Tax Advisor Dashboard" />}
        />
      </Route>

      {/* Administrator only (replace ComingSoon with the real page later) */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route
          path="/admin/dashboard"
          element={<ComingSoon title="Administrator Dashboard" />}
        />
      </Route>

      {/* Any unknown URL goes back to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes