import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'

import { NOFRIXION_BFF_URL } from '../constants'
import { getRoute } from '../utils/utils'

const config = {
  headers: {
    'X-CSRF': '1',
  },
}

enum ClaimType {
  Name = 'name',
  Sub = 'sub',
  Amr = 'amr',
  Sid = 'sid',
  AuthTime = 'auth_time',
  Idp = 'idp',
  BffSessionState = 'bff:session_state',
  BffLogoutUrl = 'bff:logout_url',
  BffSessionExpiresIn = 'bff:session_expires_in',
}

interface Claim {
  type: ClaimType
  value: 'string'
}

const fetchClaims = async () =>
  axios.get(`${NOFRIXION_BFF_URL}/user`, config).then((res) => res.data)

const useClaims = () => {
  return useQuery<Claim[]>(
    ['claims'],
    async () => {
      return fetchClaims()
    },
    {
      retry: false,
      refetchInterval: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  )
}

const useAuthUser = () => {
  const { data: claims, isLoading, isError, refetch } = useClaims()

  const getClaimValue = (type: ClaimType) => {
    return claims?.find((claim) => claim.type === type)?.value
  }

  const logoutUrl = getClaimValue(ClaimType.BffLogoutUrl)
  const username = getClaimValue(ClaimType.Name) ?? getClaimValue(ClaimType.Sub)
  const expiresIn = getClaimValue(ClaimType.BffSessionExpiresIn)
    ? Number(getClaimValue(ClaimType.BffSessionExpiresIn))
    : 0

  const isLoggedIn = !!username && !isError

  const location = useLocation()

  const logOut = useCallback(
    (callback?: string) => {
      const returnUrl = getRoute('/')
      const url = `${logoutUrl}&returnUrl=${returnUrl}?callbackUrl=${callback ?? '/'}`

      window.location.href = url ?? '/'
    },
    [location.state?.from?.pathname, logoutUrl],
  )

  const refresh = useCallback(() => {
    refetch()
  }, [refetch])

  return {
    username,
    logoutUrl,
    isLoading,
    isLoggedIn,
    expiresIn,
    isError,
    logOut,
    refresh,
  }
}

export { useAuthUser }
