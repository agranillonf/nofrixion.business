import { PayoutDashboard } from '@nofrixion/components'
import { makeToast } from '@nofrixion/components/src/components/ui/Toast/Toast'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import { useStore } from 'zustand'

import { NOFRIXION_API_URL } from '../../lib/constants'
import { ErrorType, useErrorsStore } from '../../lib/stores/useErrorsStore'
import useMerchantStore from '../../lib/stores/useMerchantStore'

const PayoutsPage = () => {
  const { payoutId, result } = useParams()
  const merchant = useStore(useMerchantStore, (state) => state.merchant)
  const { errors, removeError } = useErrorsStore()
  const location = useLocation()

  if (result) {
    if (result === 'success') {
      makeToast('success', 'Payout authorised')
    } else if (result === 'error') {
      const error = errors.find(
        (payoutError) => payoutError.type === ErrorType.PAYOUT && payoutError.id === payoutId,
      )?.error

      if (error) {
        makeToast('error', error.detail)
      }

      if (payoutId && error) {
        removeError(payoutId)
      }
    }

    return <Navigate to={location.pathname.replace(`/${payoutId}`, '').replace(`/${result}`, '')} />
  }

  return <>{merchant && <PayoutDashboard merchantId={merchant.id} apiUrl={NOFRIXION_API_URL} />}</>
}

export default PayoutsPage
