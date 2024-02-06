import { PayrunDetails } from '@nofrixion/components'
import SystemErrorModal from '@nofrixion/components/src/components/ui/Modals/SystemErrorModal/SystemErrorModal'
import { TabValues } from '@nofrixion/components/src/components/ui/pages/AccountsPayableDashboard/AccountsPayableDashboard'
import { useState } from 'react'
import { unstable_useBlocker, useNavigate, useParams } from 'react-router-dom'
import { useStore } from 'zustand'

import { NOFRIXION_API_URL } from '../../lib/constants'
import useMerchantStore from '../../lib/stores/useMerchantStore'

const PayrunPage = () => {
  const { payrunId } = useParams()
  const merchant = useStore(useMerchantStore, (state) => state.merchant)
  const navigate = useNavigate()
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const blocker = unstable_useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname,
  )

  const onAllPayrunsClick = () => {
    navigate(`../accounts-payable?tab=${TabValues.PAYRUNS}`)
  }

  const onDataChange = (hasUnsavedChanges: boolean) => {
    setHasUnsavedChanges(hasUnsavedChanges)
  }

  return (
    // Div is needed to prevent the dashboard from being
    // rendered as two separate components
    <div>
      {merchant && payrunId && (
        <>
          <PayrunDetails
            merchantId={merchant.id}
            payrunId={payrunId}
            apiUrl={NOFRIXION_API_URL}
            onAllPayrunsClick={onAllPayrunsClick}
            onDataChange={onDataChange}
          />

          <SystemErrorModal
            title="Leave without saving"
            message="If you leave without saving all changes made are going to be lost."
            open={blocker.state === 'blocked'}
            showSupport={false}
            primaryButtonText="Leave"
            onDismiss={() => {
              blocker.state === 'blocked' && blocker.reset()
            }}
            onCancel={() => {
              blocker.state === 'blocked' && blocker.reset()
            }}
            onApply={() => blocker.state === 'blocked' && blocker.proceed()}
          />
        </>
      )}
    </div>
  )
}

export default PayrunPage
