import { Account, Payrun, useAccounts, usePayrun } from '@nofrixion/moneymoov'
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { remoteAccountsToLocalAccounts } from '../../../utils/parsers'
import { PayrunDetails as UIPayrunDetails } from '../../ui/pages/PayrunDetails/PayrunDetails'

export interface PayrunDetailsProps {
  token?: string // Example: "eyJhbGciOiJIUz..."
  apiUrl?: string // Example: "https://api.nofrixion.com/api/v1"
  merchantId?: string // Example: "5f9f8a7f-..."
  payrunId: string
  onAllPayrunsClick: () => void
}

const PayrunDetails = ({
  token,
  apiUrl = 'https://api.nofrixion.com/api/v1',
  merchantId,
  payrunId,
  onAllPayrunsClick,
}: PayrunDetailsProps) => {
  const queryClient = useQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <PayrunDetailsMain
        token={token}
        merchantId={merchantId}
        payrunId={payrunId}
        apiUrl={apiUrl}
        onAllPayrunsClick={onAllPayrunsClick}
      />
    </QueryClientProvider>
  )
}

const PayrunDetailsMain = ({
  token,
  apiUrl = 'https://api.nofrixion.com/api/v1',
  merchantId,
  payrunId,
  onAllPayrunsClick,
}: PayrunDetailsProps) => {
  const [payrun, setPayrun] = useState<Payrun | undefined>()
  const [accounts, setAccounts] = useState<Account[]>([])

  const { data: payrunResponse } = usePayrun({ payrunId }, { apiUrl, authToken: token })

  useEffect(() => {
    if (payrunResponse?.status === 'success') {
      setPayrun(payrunResponse.data)
    } else if (payrunResponse?.status === 'error') {
      console.error(payrunResponse.error)
    }
  }, [payrunResponse])

  const { data: accountsResponse } = useAccounts({ merchantId }, { apiUrl, authToken: token })

  useEffect(() => {
    if (accountsResponse?.status === 'success') {
      setAccounts(accountsResponse.data)
    } else if (accountsResponse?.status === 'error') {
      console.error(accountsResponse.error)
    }
  }, [accountsResponse])

  const onRequestAuth = () => {
    // TODO: Implement
    console.log('onRequestAuth')
  }

  if (!payrun) {
    return <div>Loading...</div>
  }

  return (
    <UIPayrunDetails
      payrun={payrun}
      onRequestAuth={onRequestAuth}
      onAllPayrunsClick={onAllPayrunsClick}
      accounts={remoteAccountsToLocalAccounts(accounts)}
    />
  )
}

export default PayrunDetails
