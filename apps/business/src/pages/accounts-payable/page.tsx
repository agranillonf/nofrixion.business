import { AccountsPayableDashboard } from '@nofrixion/components'
import { makeToast } from '@nofrixion/components/src/components/ui/Toast/Toast'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useStore } from 'zustand'

import { NOFRIXION_API_URL } from '../../lib/constants'
import { ErrorType, useErrorsStore } from '../../lib/stores/useErrorsStore'
import useMerchantStore from '../../lib/stores/useMerchantStore'

const AccountPayablePage = () => {
  const { payoutId, result } = useParams()
  const merchant = useStore(useMerchantStore, (state) => state.merchant)
  const { errors, removeError } = useErrorsStore()
  const location = useLocation()
  const navigate = useNavigate()

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
  return (
    // Div is needed to prevent the dashboard from being
    // rendered as two separate components
    <div>
      {merchant && (
        <AccountsPayableDashboard
          merchantId={merchant.id}
          apiUrl={NOFRIXION_API_URL}
          onPayrunClick={(payrun) => {
            navigate('payruns/' + payrun.id)
          }}
        />
      )}
    </div>
  )
}

export default AccountPayablePage
