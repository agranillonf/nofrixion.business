import {
  PaymentRequest,
  PaymentRequestMetrics,
  PaymentRequestStatus,
  useAccounts,
  useCapture,
  useCreateRefund,
  useDeletePaymentRequest,
  useMerchant,
  useMerchantTags,
  usePaymentRequestMetrics,
  usePaymentRequests,
  useRefund,
  useVoid,
} from '@nofrixion/moneymoov'
import * as Tabs from '@radix-ui/react-tabs'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { add, endOfDay, set, startOfDay } from 'date-fns'
import { useEffect, useState } from 'react'
import { useStore } from 'zustand'

import { Button, Icon } from '../../../components/ui/atoms'
import usePaymentRequestColumnsStore from '../../../lib/stores/usePaymentRequestColumnsStore'
import {
  LocalPartialPaymentMethods,
  LocalPaymentMethodTypes,
  LocalPaymentRequestTableColumns,
} from '../../../types/LocalEnums'
import {
  Column,
  LocalAccount,
  LocalCounterparty,
  LocalPaymentRequest,
  LocalPaymentRequestCreate,
  LocalTag,
  SystemError,
} from '../../../types/LocalTypes'
import { DoubleSortByPaymentRequests } from '../../../types/Sort'
import {
  localAccountIdentifierTypeToRemoteAccountIdentifierType,
  localCounterPartyToRemoteCounterParty,
  parseApiTagToLocalTag,
  remoteAccountsToLocalAccounts,
  remotePaymentRequestToLocalPaymentRequest,
} from '../../../utils/parsers'
import CreatePaymentRequestPage from '../../functional/CreatePaymentRequestPage/CreatePaymentRequestPage'
import { SortDirection } from '../../ui/ColumnHeader/ColumnHeader'
import DashboardTab from '../../ui/DashboardTab/DashboardTab'
import { DateRange } from '../../ui/DateRangePicker/DateRangePicker'
import FilterControlsRow from '../../ui/FilterControlsRow/FilterControlsRow'
import PaymentRequestTable from '../../ui/PaymentRequestTable/PaymentRequestTable'
import ScrollArea from '../../ui/ScrollArea/ScrollArea'
import { FilterableTag } from '../../ui/TagFilter/TagFilter'
import { makeToast } from '../../ui/Toast/Toast'
import PaymentRequestDetailsModal from '../PaymentRequestDetailsModal/PaymentRequestDetailsModal'

const queryClient = new QueryClient()

export interface PaymentRequestDashboardProps {
  token?: string // Example: "eyJhbGciOiJIUz..."
  apiUrl?: string // Example: "https://api.nofrixion.com/api/v1"
  merchantId: string
  isWebComponent?: boolean
}

const PaymentRequestDashboard = ({
  token,
  apiUrl = 'https://api.nofrixion.com/api/v1',
  merchantId,
  isWebComponent,
}: PaymentRequestDashboardProps) => {
  const queryClientToUse = isWebComponent ? queryClient : useQueryClient()
  return (
    <QueryClientProvider client={queryClientToUse}>
      <PaymentRequestDashboardMain token={token} merchantId={merchantId} apiUrl={apiUrl} />
    </QueryClientProvider>
  )
}

const PaymentRequestDashboardMain = ({
  token,
  apiUrl = 'https://api.nofrixion.com/api/v1',
  merchantId,
}: PaymentRequestDashboardProps) => {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<DoubleSortByPaymentRequests>({
    primary: {
      direction: SortDirection.NONE,
      name: 'created',
    },
  })

  const [columns, setColumns] = useState<Column[]>([
    {
      id: LocalPaymentRequestTableColumns.Created,
      label: 'Created',
      selected: true,
    },
    {
      id: LocalPaymentRequestTableColumns.For,
      label: 'For',
      selected: true,
    },
    {
      id: LocalPaymentRequestTableColumns.Requested,
      label: 'Requested',
      selected: true,
    },
    {
      id: LocalPaymentRequestTableColumns.Paid,
      label: 'Paid',
      selected: true,
    },
    {
      id: LocalPaymentRequestTableColumns.PaymentAttempts,
      label: 'Payment Attempts',
      selected: true,
    },
    {
      id: LocalPaymentRequestTableColumns.Tags,
      label: 'Tags',
      selected: true,
    },
  ])

  const { paymentRequestColumns, setPaymentRequestColumns } = useStore(
    usePaymentRequestColumnsStore,
    (state) => state,
  ) ?? {
    paymentRequestColumns: undefined,
  }

  useEffect(() => {
    if (paymentRequestColumns) {
      const newColumns = [...columns]
      paymentRequestColumns.forEach((column) => {
        const foundColumn = newColumns.find((c) => c.id === column.id)
        if (foundColumn) {
          foundColumn.selected = column.selected
        }
      })

      setPaymentRequestColumns(columns)
      setColumns(newColumns)
    }
  }, [paymentRequestColumns])

  const [firstMetrics, setFirstMetrics] = useState<PaymentRequestMetrics | undefined>(undefined)

  const [status, setStatus] = useState<PaymentRequestStatus>(PaymentRequestStatus.All)
  const [dateRange, setDateRange] = useState<DateRange>({
    fromDate: startOfDay(add(new Date(), { days: -90 })), // Last 90 days as default
    toDate: endOfDay(new Date()),
  })
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [currencyFilter, setCurrencyFilter] = useState<string | undefined>()
  const [minAmountFilter, setMinAmountFilter] = useState<number | undefined>()
  const [maxAmountFilter, setMaxAmountFilter] = useState<number | undefined>()
  const [tags, setTags] = useState<FilterableTag[]>([])
  const [tagsFilter, setTagsFilter] = useState<string[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [metrics, setMetrics] = useState<PaymentRequestMetrics | undefined>(undefined)
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[] | undefined>(undefined)

  const [isCreatePaymentRequestOpen, setIsCreatePaymentRequestOpen] = useState(false)

  const [selectedPaymentRequestID, setSelectedPaymentRequestID] = useState<string | undefined>(
    undefined,
  )
  const [prefilledPaymentRequest, setPrefilledPaymentRequest] = useState<
    LocalPaymentRequestCreate | undefined
  >(undefined)
  const [showMoreClicked, setShowMoreClicked] = useState(false)

  const [systemError, setSystemError] = useState<SystemError | undefined>(undefined)
  const [isSystemErrorOpen, setIsSystemErrorOpen] = useState<boolean>(false)

  const pageSize = 20

  const onPaymentRequestRowClicked = (paymentRequest: LocalPaymentRequest) => {
    setSelectedPaymentRequestID(paymentRequest.id)
  }

  const onPaymentRequestDetailsModalDismiss = () => {
    setSelectedPaymentRequestID(undefined)
  }

  const getSelectedTagFilters = () => {
    if (!tags) {
      return []
    }

    return tags.filter((tag) => tag.isSelected).map((tag) => tag.id)
  }

  const handleApiError = () => {
    handleSystemErrorMessage({
      title: "This page's data cannot be loaded at the moment",
      message:
        'An error occurred while trying to retrieve the data. Please try again later, or contact support if the error persists.',
    })
  }

  const { data: merchant } = useMerchant({ apiUrl, authToken: token }, { merchantId })

  const { data: paymentRequestsResponse, isLoading: isLoadingPaymentRequests } = usePaymentRequests(
    {
      merchantId: merchantId,
      pageNumber: page,
      pageSize: pageSize,
      status: status,
      fromDateMS: dateRange.fromDate && dateRange.fromDate.getTime(),
      toDateMS: dateRange.toDate && dateRange.toDate.getTime(),
      search: searchFilter?.length >= 3 ? searchFilter : undefined,
      currency: currencyFilter,
      minAmount: minAmountFilter,
      maxAmount: maxAmountFilter,
      tags: tagsFilter,
      preservePreviousPageData: showMoreClicked,
      sortBy: sortBy,
    },
    { apiUrl: apiUrl, authToken: token },
  )

  useEffect(() => {
    if (isLoadingPaymentRequests && !showMoreClicked) {
      setPaymentRequests(undefined)
    } else {
      isLoadingMore && setIsLoadingMore(false)
    }
  }, [isLoadingPaymentRequests])

  const { deletePaymentRequest } = useDeletePaymentRequest({ apiUrl: apiUrl, authToken: token })

  const { processRefund } = useRefund(
    {
      merchantId: merchantId,
    },
    { apiUrl: apiUrl, authToken: token },
  )

  const { processVoid } = useVoid(
    {
      merchantId: merchantId,
    },
    { apiUrl: apiUrl, authToken: token },
  )

  const { processCapture } = useCapture(
    {
      merchantId: merchantId,
    },
    { apiUrl: apiUrl, authToken: token },
  )

  const { createRefund } = useCreateRefund(
    {
      merchantId: merchantId,
    },
    { apiUrl: apiUrl, authToken: token },
    true,
  )

  const [accounts, setAccounts] = useState<LocalAccount[] | undefined>(undefined)

  const { data: accountsResponse } = useAccounts({ merchantId }, { apiUrl, authToken: token })

  useEffect(() => {
    if (accountsResponse?.status === 'success') {
      setAccounts(remoteAccountsToLocalAccounts(accountsResponse.data))
    } else if (accountsResponse?.status === 'error') {
      console.warn(accountsResponse.error)
    }
  }, [accountsResponse])

  const { data: metricsResponse, isLoading: isLoadingMetrics } = usePaymentRequestMetrics(
    {
      merchantId: merchantId,
      fromDateMS: dateRange.fromDate && dateRange.fromDate.getTime(),
      toDateMS: dateRange.toDate && dateRange.toDate.getTime(),
      search: searchFilter?.length >= 3 ? searchFilter : undefined,
      currency: currencyFilter,
      minAmount: minAmountFilter,
      maxAmount: maxAmountFilter,
      tags: tagsFilter,
    },
    { apiUrl: apiUrl, authToken: token },
  )

  const { data: merchantTagsResponse } = useMerchantTags(
    { merchantId: merchantId },
    { apiUrl: apiUrl, authToken: token },
  )

  useEffect(() => {
    if (isLoadingMetrics) {
      setMetrics(undefined)
    }
  }, [isLoadingMetrics])

  const [localMerchantTags, setLocalMerchantTags] = useState<LocalTag[]>([] as LocalTag[])

  useEffect(() => {
    if (paymentRequestsResponse?.status === 'success') {
      setPaymentRequests(paymentRequestsResponse.data.content)
      setTotalRecords(paymentRequestsResponse.data.totalSize)
    } else if (paymentRequestsResponse?.status === 'error') {
      console.error(paymentRequestsResponse.error)
      handleApiError()
    }
  }, [paymentRequestsResponse])

  useEffect(() => {
    setMetrics(undefined)
    setFirstMetrics(undefined)
    setPage(1)
    setPaymentRequests(undefined)
    setStatus(PaymentRequestStatus.All)
  }, [merchantId])

  useEffect(() => {
    const tempTagArray = getSelectedTagFilters()
    setTagsFilter([...tempTagArray])
  }, [tags])

  useEffect(() => {
    if (merchantTagsResponse?.status === 'success') {
      setLocalMerchantTags(merchantTagsResponse.data.map((tag) => parseApiTagToLocalTag(tag)))
      setTags(
        merchantTagsResponse.data.map((tag) => {
          return {
            id: tag.id,
            label: tag.name,
            isSelected: false,
          }
        }),
      )
    } else if (merchantTagsResponse?.status === 'error') {
      console.warn(merchantTagsResponse.error)
      handleApiError()
    }
  }, [merchantTagsResponse])

  useEffect(() => {
    if (metricsResponse?.status === 'success') {
      setMetrics(metricsResponse.data)
    } else if (metricsResponse?.status === 'error') {
      console.error(metricsResponse.error)
      handleApiError()
    }
  }, [metricsResponse])

  const onDeletePaymentRequest = async (paymentRequest: LocalPaymentRequest) => {
    const response = await deletePaymentRequest(paymentRequest.id)

    if (response.error) {
      handleSystemErrorMessage({
        title: 'Delete payment request has failed',
        message: response.error.detail,
      })

      return
    }

    makeToast('success', 'Payment request successfully deleted.')
  }

  const onCopyPaymentRequestLink = async (paymentRequest: LocalPaymentRequest) => {
    const link = `${paymentRequest.hostedPayCheckoutUrl}`
    await navigator.clipboard.writeText(link)

    makeToast('success', 'Link copied into clipboard.')
  }

  const onOpenPaymentPage = async (paymentRequest: LocalPaymentRequest) => {
    window.open(paymentRequest.hostedPayCheckoutUrl, '_blank')
  }

  const onDuplicatePaymentRequest = (paymentRequest: LocalPaymentRequest) => {
    setPrefilledPaymentRequest({
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      description: paymentRequest.description,
      productOrService: paymentRequest.productOrService,
      firstName: paymentRequest.contact?.name?.split(' ')[0],
      lastName: paymentRequest.contact?.name?.split(' ').slice(1).join(' '),
      email: paymentRequest.contact.email,
      paymentConditions: {
        allowPartialPayments:
          paymentRequest.partialPaymentMethod === LocalPartialPaymentMethods.Partial,
      },
      paymentMethods: {
        bank: {
          active: paymentRequest.paymentMethodTypes.includes(LocalPaymentMethodTypes.Pisp),
          priority: paymentRequest.priorityBankID
            ? {
                id: paymentRequest.priorityBankID,
                name: '',
              }
            : undefined,
        },
        card: {
          active: paymentRequest.paymentMethodTypes.includes(LocalPaymentMethodTypes.Card),
          captureFunds: paymentRequest.captureFunds,
        },
        wallet:
          paymentRequest.paymentMethodTypes.includes(LocalPaymentMethodTypes.ApplePay) &&
          paymentRequest.paymentMethodTypes.includes(LocalPaymentMethodTypes.GooglePay),
        lightning: paymentRequest.paymentMethodTypes.includes(LocalPaymentMethodTypes.Lightning),
      },
      notificationEmailAddresses: paymentRequest.notificationEmailAddresses,
    })

    setIsCreatePaymentRequestOpen(true)
  }

  const onCreatePaymentRequest = () => {
    setPrefilledPaymentRequest(undefined)
    setIsCreatePaymentRequestOpen(true)
  }

  const onCloseCreatePaymentRequest = async () => {
    setPrefilledPaymentRequest(undefined)
    setIsCreatePaymentRequestOpen(false)
  }

  // Adds the newly created payment request to the top of the list
  // Increments the metrics all and unpaid counts
  // Sets the newly created payment request as the selected one
  const onPaymentRequestCreated = async (paymentRequest: LocalPaymentRequest) => {
    setIsCreatePaymentRequestOpen(false)

    setSelectedPaymentRequestID(paymentRequest.id)
  }

  const onCardRefundClick = async (authorizationID: string, amount: number, isVoid: boolean) => {
    if (selectedPaymentRequestID) {
      if (isVoid) {
        const voidResult = await processVoid({
          paymentRequestId: selectedPaymentRequestID,
          authorizationId: authorizationID,
        })

        if (voidResult.error) {
          return voidResult.error
        } else {
          makeToast('success', 'Payment successfully voided.')
        }
      } else {
        const refundResult = await processRefund({
          paymentRequestId: selectedPaymentRequestID,
          authorizationId: authorizationID,
          amount: amount,
        })

        if (refundResult.error) {
          return refundResult.error
        } else {
          makeToast('success', 'Payment successfully refunded.')
        }
      }
    }
  }

  const onBankRefundClick = async (
    sourceAccount: LocalAccount,
    counterParty: LocalCounterparty,
    amount: number,
    paymentInitiationID: string,
  ) => {
    const yourReference = `REFUND-${paymentInitiationID}`
    if (selectedPaymentRequestID) {
      const result = await createRefund({
        accountID: sourceAccount.id,
        type: localAccountIdentifierTypeToRemoteAccountIdentifierType(
          sourceAccount.identifier.type,
        ),
        description: `Refund for ${selectedPaymentRequestID}`,
        currency: sourceAccount.currency,
        amount: amount,
        yourReference: yourReference,
        theirReference: 'Refund',
        destination: localCounterPartyToRemoteCounterParty(counterParty),
        allowIncomplete: false,
        paymentRequestId: selectedPaymentRequestID,
      })

      if (result.error) {
        return result.error
      } else {
        makeToast('success', 'Refund successfully submitted for approval.')
      }
    }
  }

  const onCaptureClick = async (authorizationID: string, amount: number) => {
    if (selectedPaymentRequestID) {
      const result = await processCapture({
        paymentRequestId: selectedPaymentRequestID,
        authorizationId: authorizationID,
        amount: amount,
      })

      if (result.error) {
        return result.error
      } else {
        makeToast('success', 'Payment successfully captured.')
      }
    }
  }

  /**
   * Fetches the next page of payment requests and adds them to the local list.
   */
  const fetchNextPage = async () => {
    setShowMoreClicked(true)
    setIsLoadingMore(true)
    setPage((prev) => prev + 1)
  }

  /// Only show the total amount if there are payment requests
  /// with the specified timeframe and currency, no matter the status,
  /// unless there are no payment requests at all for the specified status.
  const getTotalAmountPerCurrencyAndStatus = (
    currency: 'eur' | 'gbp',
    status: 'paid' | 'partiallyPaid' | 'unpaid' | 'authorized',
  ) => {
    if (
      metrics &&
      metrics.totalAmountsByCurrency &&
      metrics.totalAmountsByCurrency.all?.[currency] &&
      metrics[status] &&
      metrics[status] > 0
    ) {
      return metrics.totalAmountsByCurrency?.[status]?.[currency] ?? 0
    }
  }

  // tore the results of the first execution of the metrics
  // and use them as the initial state of the metrics.
  // This way, when they change the dates
  // we don't see the metrics disappear
  useEffect(() => {
    if (!isLoadingMetrics && metrics && !firstMetrics) {
      setFirstMetrics(metrics)
    }
  }, [metrics])

  const onSort = (sortInfo: DoubleSortByPaymentRequests) => {
    setSortBy(sortInfo)
  }

  const paymentRequestStatusToMetricsStatus = (
    status: PaymentRequestStatus,
  ): 'paid' | 'partiallyPaid' | 'unpaid' | 'authorized' | 'all' => {
    switch (status) {
      case PaymentRequestStatus.All:
        return 'all'
      case PaymentRequestStatus.Authorized:
        return 'authorized'
      case PaymentRequestStatus.FullyPaid:
        return 'paid'
      case PaymentRequestStatus.None:
        return 'unpaid'
      case PaymentRequestStatus.PartiallyPaid:
        return 'partiallyPaid'
      default:
        return 'all'
    }
  }

  const onCloseSystemErrorModal = () => {
    setIsSystemErrorOpen(false)
  }

  const handleSystemErrorMessage = (systemError: SystemError) => {
    setSystemError(systemError)
    setIsSystemErrorOpen(true)
  }

  const handleChangeInColumns = (columns: Column[]) => {
    setColumns(columns)
    setPaymentRequestColumns(columns)
  }

  const paymentRequestsExists =
    !isLoadingMetrics &&
    metrics &&
    status &&
    metrics[paymentRequestStatusToMetricsStatus(status)] > 0

  const isInitialState = !isLoadingMetrics && firstMetrics !== undefined && firstMetrics?.all === 0

  const getPaymentRequests = (
    isLoadingMetrics: boolean,
    metrics?: PaymentRequestMetrics,
    paymentRequests?: PaymentRequest[],
  ) => {
    if (isLoadingMetrics && paymentRequests && paymentRequests.length === 0) {
      return undefined
    }

    if (metrics?.all === 0) {
      return []
    }

    return paymentRequests
  }

  return (
    <div className="font-inter bg-main-grey text-default-text h-full">
      <div className="flex gap-8 justify-between items-center mb-8 md:mb-[68px] md:px-4">
        <span className="leading-8 font-medium text-2xl md:text-[1.75rem]">
          Accounts Receivable
        </span>
        <div>
          {accounts && accounts.length > 0 && (
            <Button
              size="large"
              onClick={onCreatePaymentRequest}
              className="w-10 h-10 md:w-full md:h-full"
            >
              <span className="hidden md:inline-block">Create payment request</span>
              <Icon name="add/16" className="md:hidden" />
            </Button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <FilterControlsRow
          dateRange={dateRange}
          setDateRange={setDateRange}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          currency={currencyFilter}
          setCurrency={setCurrencyFilter}
          minAmount={minAmountFilter}
          setMinAmount={setMinAmountFilter}
          maxAmount={maxAmountFilter}
          setMaxAmount={setMaxAmountFilter}
          tags={tags}
          setTags={setTags}
          sortBy={sortBy}
          onSort={(sortInfo) => onSort(sortInfo as DoubleSortByPaymentRequests)}
          firstDate={
            // Set first date to the first day of the year the merchant was created
            merchant?.status == 'success'
              ? set(new Date(merchant?.data.inserted), { month: 0, date: 1 })
              : undefined
          }
        />
      </div>
      <ScrollArea hideScrollbar>
        <Tabs.Root
          defaultValue={PaymentRequestStatus.All}
          onValueChange={(value) => setStatus(value as PaymentRequestStatus)}
          value={status}
        >
          {/* Keep the Tab to still get accessibility functions through the keyboard */}
          <Tabs.List className="flex shrink-0 gap-x-4 mb-4">
            <DashboardTab
              status={PaymentRequestStatus.All}
              isLoading={isLoadingMetrics}
              totalRecords={metrics?.all ?? 0}
              totalAmountInEuros={metrics?.totalAmountsByCurrency?.all?.eur}
              totalAmountInPounds={metrics?.totalAmountsByCurrency?.all?.gbp}
            />
            <DashboardTab
              status={PaymentRequestStatus.None}
              isLoading={isLoadingMetrics}
              totalRecords={metrics?.unpaid ?? 0}
              totalAmountInEuros={getTotalAmountPerCurrencyAndStatus('eur', 'unpaid')}
              totalAmountInPounds={getTotalAmountPerCurrencyAndStatus('gbp', 'unpaid')}
            />
            <DashboardTab
              status={PaymentRequestStatus.Authorized}
              isLoading={isLoadingMetrics}
              totalRecords={metrics?.authorized ?? 0}
              totalAmountInEuros={getTotalAmountPerCurrencyAndStatus('eur', 'authorized')}
              totalAmountInPounds={getTotalAmountPerCurrencyAndStatus('gbp', 'authorized')}
            />
            <DashboardTab
              status={PaymentRequestStatus.PartiallyPaid}
              isLoading={isLoadingMetrics}
              totalRecords={metrics?.partiallyPaid ?? 0}
              totalAmountInEuros={getTotalAmountPerCurrencyAndStatus('eur', 'partiallyPaid')}
              totalAmountInPounds={getTotalAmountPerCurrencyAndStatus('gbp', 'partiallyPaid')}
            />
            <DashboardTab
              status={PaymentRequestStatus.FullyPaid}
              isLoading={isLoadingMetrics}
              totalRecords={metrics?.paid ?? 0}
              totalAmountInEuros={getTotalAmountPerCurrencyAndStatus('eur', 'paid')}
              totalAmountInPounds={getTotalAmountPerCurrencyAndStatus('gbp', 'paid')}
            />
          </Tabs.List>
          <Tabs.Content value=""></Tabs.Content>
        </Tabs.Root>
      </ScrollArea>

      <div className="lg:bg-white lg:min-h-[18rem] lg:pt-10 lg:pb-6 lg:px-6 lg:rounded-lg">
        <PaymentRequestTable
          paymentRequests={getPaymentRequests(isLoadingMetrics, metrics, paymentRequests)?.map(
            (paymentRequest) => remotePaymentRequestToLocalPaymentRequest(paymentRequest),
          )}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChanged={setPage}
          sortBy={sortBy}
          onSort={onSort}
          onPaymentRequestDuplicateClicked={onDuplicatePaymentRequest}
          onPaymentRequestDeleteClicked={onDeletePaymentRequest}
          onPaymentRequestCopyLinkClicked={onCopyPaymentRequestLink}
          isLoading={isLoadingPaymentRequests}
          isEmpty={isInitialState}
          onCreatePaymentRequest={onCreatePaymentRequest}
          onPaymentRequestClicked={onPaymentRequestRowClicked}
          onOpenPaymentPage={onOpenPaymentPage}
          selectedPaymentRequestID={selectedPaymentRequestID}
          paymentRequestsExist={paymentRequestsExists}
          isLoadingMetrics={isLoadingMetrics}
          systemError={systemError}
          isSystemErrorOpen={isSystemErrorOpen}
          onCloseSystemError={onCloseSystemErrorModal}
          columns={columns}
          setColumns={handleChangeInColumns}
        />
      </div>

      {paymentRequests && paymentRequests.length < totalRecords && (
        <div className="flex">
          <Button
            variant="tertiary"
            size="large"
            onClick={fetchNextPage}
            disabled={isLoadingMore}
            className="lg:hidden mx-auto mt-6 mb-2 w-fit"
          >
            Show more
          </Button>
        </div>
      )}

      <CreatePaymentRequestPage
        isOpen={isCreatePaymentRequestOpen}
        onClose={onCloseCreatePaymentRequest}
        token={token}
        merchantId={merchantId}
        apiUrl={apiUrl}
        onPaymentRequestCreated={onPaymentRequestCreated}
        prefilledPaymentRequest={prefilledPaymentRequest}
      />
      <PaymentRequestDetailsModal
        token={token}
        apiUrl={apiUrl}
        merchantId={merchantId}
        selectedPaymentRequestID={selectedPaymentRequestID ?? ''}
        merchantTags={localMerchantTags}
        paymentRequests={paymentRequests?.map((paymentRequest) =>
          remotePaymentRequestToLocalPaymentRequest(paymentRequest),
        )}
        open={!!selectedPaymentRequestID}
        onDismiss={onPaymentRequestDetailsModalDismiss}
        setMerchantTags={setLocalMerchantTags}
        onCardRefund={onCardRefundClick}
        onBankRefund={onBankRefundClick}
        onCapture={onCaptureClick}
        sortBy={sortBy}
        pageNumber={page}
        pageSize={pageSize}
        fromDateMS={dateRange.fromDate && dateRange.fromDate.getTime()}
        toDateMS={dateRange.toDate && dateRange.toDate.getTime()}
        status={status}
        search={searchFilter?.length >= 3 ? searchFilter : undefined}
        currency={currencyFilter}
        minAmount={minAmountFilter}
        maxAmount={maxAmountFilter}
        tags={tagsFilter}
        accounts={accounts ?? []}
      ></PaymentRequestDetailsModal>
    </div>
  )
}

export default PaymentRequestDashboard
