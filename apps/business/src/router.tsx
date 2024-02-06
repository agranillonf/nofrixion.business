import { LocalUserRoles } from '@nofrixion/components/src/types/LocalTypes'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'

import HomeUI from './components/HomeUI'
import { ProtectedRoutes } from './lib/auth/ProtectedRoutes'
import { RoleProtectedRoute } from './lib/auth/RoleProtectedRoute'
import { getRoute } from './lib/utils/utils'
import AccountPayablePage from './pages/accounts-payable/page'
import PayrunDetailsPage from './pages/accounts-payable/payrun'
import AccountReceivablePage from './pages/accounts-receivable/page'
import AccountDashboardPage from './pages/current-accounts/account-dashboard'
import CurrentAccountsPage from './pages/current-accounts/page'
import DashboardPage from './pages/dashboard/page'
import Layout from './pages/layout'
import NotFound from './pages/NotFound'
import PricingPage from './pages/pricing/page'
import UsersPage from './pages/users/page'
import Root from './root'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route path="*" element={<NotFound />} />
      <Route path={getRoute('/')} element={<HomeUI />} />
      <Route element={<ProtectedRoutes />}>
        <Route path={getRoute('/home')} element={<Layout />}>
          <Route element={<RoleProtectedRoute />}>
            <Route index element={<DashboardPage />} />
          </Route>
          {/* Accounts payable */}
          <Route element={<RoleProtectedRoute />}>
            <Route path="accounts-payable" element={<AccountPayablePage />} />
          </Route>
          <Route element={<RoleProtectedRoute />}>
            <Route path="accounts-payable/payruns/:payrunId" element={<PayrunDetailsPage />} />
          </Route>
          <Route element={<RoleProtectedRoute />}>
            <Route path="accounts-payable/:payoutId/:result" element={<AccountPayablePage />} />
          </Route>
          <Route
            element={<RoleProtectedRoute minimumRequiredRole={LocalUserRoles.PaymentRequestor} />}
          >
            <Route path="accounts-receivable" element={<AccountReceivablePage />} />
          </Route>
          {/* Current accounts */}
          <Route element={<RoleProtectedRoute />}>
            <Route path="current-accounts" element={<CurrentAccountsPage />} />
          </Route>
          <Route element={<RoleProtectedRoute />}>
            <Route path="current-accounts/connected/:bankId" element={<CurrentAccountsPage />} />
          </Route>
          <Route element={<RoleProtectedRoute />}>
            <Route path="current-accounts/:accountId" element={<AccountDashboardPage />} />
          </Route>
          {/* User management */}
          <Route
            element={<RoleProtectedRoute minimumRequiredRole={LocalUserRoles.AdminApprover} />}
          >
            <Route path="users" element={<UsersPage />} />
          </Route>
          <Route path="pricing" element={<PricingPage />} />
        </Route>
      </Route>
    </Route>,
  ),
)

export default router
