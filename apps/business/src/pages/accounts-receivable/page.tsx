import { AccountsReceivable as AccountsReceivableDashboard } from '@nofrixion/components'

import { NOFRIXION_API_URL } from '../../lib/constants'
import useMerchantStore from '../../lib/stores/useMerchantStore'
import useStore from '../../lib/stores/useStore'

const AccountReceivablePage = () => {
  // const { data: session, status, update } = useSession()
  const merchant = useStore(useMerchantStore, (state) => state.merchant)

  return (
    // Div is needed to prevent the dashboard from being
    // rendered as two separate components
    <div>
      {merchant && (
        <AccountsReceivableDashboard merchantId={merchant.id} apiUrl={NOFRIXION_API_URL} />
      )}
    </div>
  )
}

export default AccountReceivablePage
