import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'

import { Loader } from '../../components/ui/Loader/Loader'
import { useAuth } from '../../lib/auth/useAuth'
import { useErrorsStore } from '../stores/useErrorsStore'
import { tryParseApiError, tryParseConnectedAccountError } from '../utils/errorUtils'
import { getRoute } from '../utils/utils'
import AppLogout from './AppLogout'
import { AuthContextType } from './AuthProvider'

export const ProtectedRoutes = () => {
  const authContext = useAuth() as AuthContextType
  const location = useLocation()
  const { addError } = useErrorsStore()
  const { payoutId, result } = useParams()

  // React router won't pass the search params to the child routes
  // so we need to parse them here and add them to the errors store
  // so they are available in the child routes
  useEffect(() => {
    const apiError = tryParseApiError(payoutId, result, location.search)

    if (apiError) {
      addError(apiError)
    }

    const connectedAccountError = tryParseConnectedAccountError(location.search)

    if (connectedAccountError) {
      addError(connectedAccountError)
    }
  }, [location])

  if (authContext.authState == undefined || authContext.authState?.isLoading) {
    return <Loader className="flex items-center justify-center p-24 min-h-screen" />
  }

  if (!authContext.authState?.isLoggedIn || authContext.authState?.isError) {
    // user is not authenticated, redirect to login page with the return url
    return <Navigate to={getRoute('/')} replace state={{ from: location }} />
  } else {
    return (
      <AppLogout>
        <Outlet />
      </AppLogout>
    )
  }
}
