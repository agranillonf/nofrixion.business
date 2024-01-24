import { PayrunDetails } from '@nofrixion/components'
import { useParams } from 'react-router-dom'
import { useStore } from 'zustand'

import { NOFRIXION_API_URL } from '../../lib/constants'
import useMerchantStore from '../../lib/stores/useMerchantStore'

const PayrunPage = () => {
  const { payrunId } = useParams()
  const merchant = useStore(useMerchantStore, (state) => state.merchant)

  return (
    // Div is needed to prevent the dashboard from being
    // rendered as two separate components
    <div>
      {merchant && payrunId && (
        <PayrunDetails merchantId={merchant.id} payrunId={payrunId} apiUrl={NOFRIXION_API_URL} />
      )}
    </div>
  )
}

export default PayrunPage
