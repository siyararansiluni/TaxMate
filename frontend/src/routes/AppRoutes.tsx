import { Routes, Route, Navigate } from 'react-router-dom'

import RegisterTaxpayer from '../pages/RegisterTaxpayer'
import RegisterAdvisor from '../pages/RegisterAdvisor'

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



import AdvisorLayout from '../layouts/AdvisorLayout'
import ProtectedRoute from './ProtectedRoute'
import AdvisorDashboard from '../pages/AdvisorDashboard'

function AppRoutes() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />

      <Route path="/register" element={<Navigate to="/login" replace state={{ openAccountType: true }} />} />
<Route path="/register/taxpayer" element={<RegisterTaxpayer />} />
<Route path="/register/advisor" element={<RegisterAdvisor />} />

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
      {/* Tax advisor only: advisor sidebar layout */}

  <Route element={<ProtectedRoute allowedRoles={['ADVISOR']} />}>
    <Route element={<AdvisorLayout />}>
    <Route path="/advisor/dashboard" element={<AdvisorDashboard />} />
    <Route
      path="/advisor/profile"
      element={<ComingSoon title="My Advisor Profile" />}
    />
    <Route
      path="/advisor/clients"
      element={<ComingSoon title="Assigned Clients" />}
    />
    </Route>
  </Route>

      {/* Administrator only (replace ComingSoon with the real page later) */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route
          path="/admin/dashboard"
          element={<ComingSoon title="Administrator Dashboard" />}
        />
      </Route>
      

      
      
    </Routes>
  )
}

export default AppRoutes