import { UserDashboard } from '@nofrixion/components'
import { useStore } from 'zustand'

import { NOFRIXION_API_URL } from '../../lib/constants'
import useMerchantStore from '../../lib/stores/useMerchantStore'

const UserPage = () => {
  const merchant = useStore(useMerchantStore, (state) => state.merchant)

  return (
    <>
      {merchant && (
        <UserDashboard
          merchantId={merchant.id}
          merchantName={merchant.name}
          apiUrl={NOFRIXION_API_URL}
        />
      )}
    </>
  )
}

export default UserPage
