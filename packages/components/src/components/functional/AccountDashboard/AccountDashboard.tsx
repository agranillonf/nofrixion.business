import {
  Account,
  BankSettings,
  OpenBankingClient,
  PayoutStatus,
  SortDirection,
  useAccount,
  useBanks,
  useMerchant,
  usePendingPayments,
  useTransactions,
  useUpdateAccountName,
} from '@nofrixion/moneymoov'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { add, endOfDay, startOfDay } from 'date-fns'
import { useEffect, useState } from 'react'
import { useStore } from 'zustand'

import usePageSizesStore from '../../../lib/stores/usePageSizesStore'
import { LocalTableIds } from '../../../types/LocalEnums'
import { LocalPayout, LocalTransaction } from '../../../types/LocalTypes'
import { DoubleSortByTransactions } from '../../../types/Sort'
import { remotePayoutsToLocal, remoteTransactionsToLocal } from '../../../utils/parsers'
import { setPageSizeForTable } from '../../../utils/utils'
import { DateRange } from '../../ui/DateRangePicker/DateRangePicker'
import { AccountDashboard as UIAccountDashboard } from '../../ui/pages/AccountDashboard/AccountDashboard'
import { makeToast } from '../../ui/Toast/Toast'

const queryClient = new QueryClient()

export interface AccountDashboardProps {
  token?: string // Example: "eyJhbGciOiJIUz..."
  onAllCurrentAccountsClick?: () => void
  accountId: string // Example: "bf9e1828-c6a1-4cc5-a012-08daf2ff1b2d"
  apiUrl: string // Example: "https://api.nofrixion.com/api/v1"
  merchantId: string
  isWebComponent?: boolean
}

const AccountDashboard = ({
  token,
  accountId,
  onAllCurrentAccountsClick,
  apiUrl = 'https://api.nofrixion.com/api/v1',
  merchantId,
  isWebComponent,
}: AccountDashboardProps) => {
  const queryClientToUse = isWebComponent ? queryClient : useQueryClient()

  return (
    <QueryClientProvider client={queryClientToUse}>
      <AccountDashboardMain
        token={token}
        accountId={accountId}
        apiUrl={apiUrl}
        onAllCurrentAccountsClick={onAllCurrentAccountsClick}
        merchantId={merchantId}
      />
    </QueryClientProvider>
  )
}

const AccountDashboardMain = ({
  token,
  accountId,
  apiUrl,
  merchantId,
  onAllCurrentAccountsClick,
}: AccountDashboardProps) => {
  const [currentMercahntID, setCurrentMercahntID] = useState<string | undefined>()
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [transactions, setTransactions] = useState<LocalTransaction[]>([])
  const [payouts, setPayouts] = useState<LocalPayout[]>([])
  const [dateRange, setDateRange] = useState<DateRange>({
    fromDate: startOfDay(add(new Date(), { days: -90 })), // Last 90 days as default
    toDate: endOfDay(new Date()),
  })
  const { updateAccountName } = useUpdateAccountName(
    {
      merchantId: merchantId,
    },
    { apiUrl: apiUrl, authToken: token },
  )

  const [pageSize, setPageSize] = useState(20)

  const { pageSizes, setPageSizes } = useStore(usePageSizesStore, (state) => state) ?? {
    pageSizes: undefined,
  }

  useEffect(() => {
    if (pageSizes) {
      const foundPageSize = pageSizes.find((c) => c.tableId === LocalTableIds.TransactionsTable)
      if (foundPageSize) {
        setPageSize(foundPageSize.pageSize)
      }
    }
  }, [pageSizes])

  const onPageSizeChange = (pageSize: number) => {
    setPageSize(pageSize)
    const newPageSizes = setPageSizeForTable(
      { tableId: LocalTableIds.TransactionsTable, pageSize: pageSize },
      pageSizes,
    )
    setPageSizes(newPageSizes)
  }

  const [searchFilter, setSearchFilter] = useState<string>('')
  const [isConnectingToBank, setIsConnectingToBank] = useState(false)
  const [sortDirection, setSortDirection] = useState<DoubleSortByTransactions>({
    primary: {
      direction: SortDirection.NONE,
      name: 'created',
    },
  })

  const onAccountNameChange = async (newAccountName: string) => {
    await updateAccountName({
      accountId: accountId,
      accountName: newAccountName,
    })
  }

  const { data: transactionsResponse, isLoading: isLoadingTransactions } = useTransactions(
    {
      accountId,
      pageNumber: page,
      pageSize: pageSize,
      sortBy: sortDirection,
      fromDateMS: dateRange.fromDate && dateRange.fromDate.getTime(),
      toDateMS: dateRange.toDate && dateRange.toDate.getTime(),
      search: searchFilter,
    },
    { apiUrl: apiUrl, authToken: token },
  )

  const { data: accountResponse, isLoading: isLoadingAccount } = useAccount(
    { merchantId: merchantId, connectedAccounts: true },
    {
      accountId,
    },
    { apiUrl: apiUrl, authToken: token },
  )

  const { data: payoutPageResponse } = usePendingPayments(
    {
      accountId,
      pageNumber: 1,
      pageSize: 5,
      payoutStatuses: [PayoutStatus.PENDING, PayoutStatus.QUEUED, PayoutStatus.QUEUED_UPSTREAM],
    },
    { apiUrl, authToken: token },
  )

  const { data: merchant } = useMerchant({ apiUrl, authToken: token }, { merchantId })

  const { data: banksResponse } = useBanks(
    { merchantId: merchantId },
    { apiUrl: apiUrl, authToken: token },
  )
  const [banks, setBanks] = useState<BankSettings[] | undefined>(undefined)

  useEffect(() => {
    if (banksResponse?.status === 'success') {
      setBanks(banksResponse.data.payByBankSettings)
    } else if (banksResponse?.status === 'error') {
      console.warn(banksResponse.error)
    }
  }, [banksResponse])

  //When switching merchants, go back to current accounts page
  useEffect(() => {
    if (merchantId) {
      setCurrentMercahntID(merchantId)
    }
  }, [])

  useEffect(() => {
    if (onAllCurrentAccountsClick && merchantId && currentMercahntID) {
      if (merchantId != currentMercahntID) {
        onAllCurrentAccountsClick()
      }
    }
  }, [merchantId, currentMercahntID])

  useEffect(() => {
    if (transactionsResponse?.status === 'success') {
      setTransactions(remoteTransactionsToLocal(transactionsResponse.data.content))
      setTotalRecords(transactionsResponse.data.totalSize)
    } else if (transactionsResponse?.status === 'error') {
      // TODO: Handle error
      console.error(transactionsResponse.error)
    }
  }, [transactionsResponse])

  useEffect(() => {
    if (payoutPageResponse?.status === 'success') {
      setPayouts(remotePayoutsToLocal(payoutPageResponse.data.content))
    } else if (payoutPageResponse?.status === 'error') {
      // TODO: Handle error
      console.error(payoutPageResponse.error)
    }
  }, [payoutPageResponse])

  const onPageChange = (page: number) => {
    setPage(page)
  }

  const onSort = (sortInfo: DoubleSortByTransactions) => {
    setSortDirection(sortInfo)
  }

  const onDateChange = (dateRange: DateRange) => {
    setDateRange(dateRange)
  }

  const handleOnRenewConnection = async (account: Account) => {
    if (account && account.consentID) {
      setIsConnectingToBank(true)
      const client = new OpenBankingClient({ apiUrl, authToken: token })

      const response = await client.reAuthoriseConsent({
        consentId: account.consentID,
      })

      if (response.status === 'error') {
        console.error(response.error)
        makeToast('error', `Could not connect to bank. ${response.error.detail}`)
      } else if (response.data.authorisationUrl) {
        window.location.href = response.data.authorisationUrl
      }

      setIsConnectingToBank(false)
    }
  }

  return (
    <UIAccountDashboard
      transactions={transactions}
      pendingPayments={payouts}
      account={accountResponse?.status == 'success' ? accountResponse?.data : undefined}
      onAccountNameChange={onAccountNameChange}
      pagination={{
        pageSize: pageSize,
        totalSize: totalRecords,
      }}
      merchantCreatedAt={
        merchant?.status == 'success' ? new Date(merchant?.data.inserted) : undefined
      }
      onPageChange={onPageChange}
      onSort={onSort}
      dateRange={dateRange}
      onDateChange={onDateChange}
      onSearch={setSearchFilter}
      searchFilter={searchFilter}
      onAllCurrentAccountsClick={onAllCurrentAccountsClick}
      banks={banks}
      onRenewConnection={handleOnRenewConnection}
      isConnectingToBank={isConnectingToBank}
      isLoadingTransactions={isLoadingTransactions}
      isLoadingAccount={isLoadingAccount}
      onPageSizeChange={onPageSizeChange}
    />
  )
}

export default AccountDashboard
