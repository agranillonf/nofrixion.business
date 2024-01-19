import { Pagination, PayoutMetrics, PayoutStatus } from '@nofrixion/moneymoov'
import * as Tabs from '@radix-ui/react-tabs'
import { set } from 'date-fns'

import { LocalPayout, SystemError } from '../../../../types/LocalTypes'
import { DoubleSortByPayouts } from '../../../../types/Sort'
import DashboardTab from '../../DashboardTab/DashboardTab'
import { DateRange } from '../../DateRangePicker/DateRangePicker'
import FilterControlsRow from '../../FilterControlsRow/FilterControlsRow'
import SystemErrorModal from '../../Modals/SystemErrorModal/SystemErrorModal'
import { PayoutsTable } from '../../organisms/PayoutsTable/PayoutsTable'
import ScrollArea from '../../ScrollArea/ScrollArea'
import { FilterableTag } from '../../TagFilter/TagFilter'

export interface PayoutDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  payouts: LocalPayout[] | undefined
  payoutMetrics?: PayoutMetrics
  pagination: Pick<Pagination, 'pageSize' | 'totalSize'>
  searchFilter: string
  merchantCreatedAt?: Date
  currency?: string
  minAmount?: number
  maxAmount?: number
  isLoading: boolean
  selectedPayoutId: string | undefined
  onPageChange: (page: number) => void
  onSort: (sortInfo: DoubleSortByPayouts) => void
  sortBy: DoubleSortByPayouts
  dateRange: DateRange
  onDateChange: (dateRange: DateRange) => void
  onSearch: (searchFilter: string) => void
  setStatus?: (status: PayoutStatus) => void
  setCurrency?: (currency?: string) => void
  setMinAmount?: (minAmount?: number) => void
  setMaxAmount?: (maxAmount?: number) => void
  isLoadingMetrics: boolean
  isInitialState: boolean
  onPayoutClicked?: (paymentRequest: LocalPayout) => void
  tags: FilterableTag[]
  setTags: (tags: FilterableTag[]) => void
  status: PayoutStatus
  onAddPayoutForAuthorise: (payoutId: string) => void
  onRemovePayoutForAuthorise: (payoutId: string) => void
  selectedPayouts: string[]
  payoutsExist: boolean
  isUserAuthoriser: boolean
  systemError?: SystemError
  isSystemErrorOpen?: boolean
  onCloseSystemError?: () => void
}

const PayoutDashboard: React.FC<PayoutDashboardProps> = ({
  payouts,
  payoutMetrics,
  pagination,
  searchFilter,
  merchantCreatedAt,
  dateRange,
  onDateChange,
  onSearch,
  onPageChange,
  onSort,
  setStatus,
  currency,
  setCurrency,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  isLoading = false,
  isLoadingMetrics = false,
  onPayoutClicked,
  selectedPayoutId,
  tags,
  setTags,
  sortBy,
  status,
  onAddPayoutForAuthorise,
  onRemovePayoutForAuthorise,
  selectedPayouts,
  payoutsExist,
  isUserAuthoriser,
  systemError,
  isSystemErrorOpen = false,
  onCloseSystemError,
}) => {
  /// Only show the total amount if there are payouts
  /// with the specified timeframe and currency, no matter the status,
  /// unless there are no payouts at all for the specified status.
  const getTotalAmountPerCurrencyAndStatus = (
    currency: 'eur' | 'gbp',
    status: 'paid' | 'inProgress' | 'failed' | 'pendingApproval' | 'scheduled',
  ) => {
    if (
      payoutMetrics &&
      payoutMetrics.totalAmountsByCurrency &&
      payoutMetrics.totalAmountsByCurrency.all?.[currency] &&
      payoutMetrics[status] &&
      payoutMetrics[status] > 0
    ) {
      return payoutMetrics.totalAmountsByCurrency?.[status]?.[currency] ?? 0
    }
  }

  const handlOnCloseSystemErrorModal = () => {
    if (onCloseSystemError) {
      onCloseSystemError()
    }
  }

  return (
    <>
      <div className="font-inter bg-main-grey text-default-text h-full">
        <div className="mb-4">
          <FilterControlsRow
            dateRange={dateRange}
            setDateRange={onDateChange}
            searchFilter={searchFilter}
            setSearchFilter={onSearch}
            currency={currency}
            setCurrency={setCurrency}
            minAmount={minAmount}
            setMinAmount={setMinAmount}
            maxAmount={maxAmount}
            setMaxAmount={setMaxAmount}
            tags={tags}
            setTags={setTags}
            sortBy={sortBy}
            onSort={(sortInfo) => onSort(sortInfo as DoubleSortByPayouts)}
            firstDate={
              merchantCreatedAt ? set(merchantCreatedAt, { month: 0, date: 1 }) : undefined
            }
          />
        </div>

        <ScrollArea hideScrollbar>
          <Tabs.Root
            defaultValue={PayoutStatus.All}
            onValueChange={(value) => setStatus && setStatus(value as PayoutStatus)}
            value={status}
          >
            {/* Keep the Tab to still get accessibility functions through the keyboard */}
            <Tabs.List className="flex shrink-0 gap-x-4 mb-4">
              <DashboardTab
                status={PayoutStatus.All}
                isLoading={isLoadingMetrics}
                totalRecords={payoutMetrics?.all ?? 0}
                totalAmountInEuros={payoutMetrics?.totalAmountsByCurrency?.all?.eur}
                totalAmountInPounds={payoutMetrics?.totalAmountsByCurrency?.all?.gbp}
              />
              <DashboardTab
                status={PayoutStatus.PENDING_APPROVAL}
                isLoading={isLoadingMetrics}
                totalRecords={payoutMetrics?.pendingApproval ?? 0}
                totalAmountInEuros={getTotalAmountPerCurrencyAndStatus('eur', 'pendingApproval')}
                totalAmountInPounds={getTotalAmountPerCurrencyAndStatus('gbp', 'pendingApproval')}
              />
              <DashboardTab
                status={PayoutStatus.SCHEDULED}
                isLoading={isLoadingMetrics}
                totalRecords={payoutMetrics?.scheduled ?? 0}
                totalAmountInEuros={getTotalAmountPerCurrencyAndStatus('eur', 'scheduled')}
                totalAmountInPounds={getTotalAmountPerCurrencyAndStatus('gbp', 'scheduled')}
              />
              <DashboardTab
                status={PayoutStatus.PENDING}
                isLoading={isLoadingMetrics}
                totalRecords={payoutMetrics?.inProgress ?? 0}
                totalAmountInEuros={getTotalAmountPerCurrencyAndStatus('eur', 'inProgress')}
                totalAmountInPounds={getTotalAmountPerCurrencyAndStatus('gbp', 'inProgress')}
              />
              <DashboardTab
                status={PayoutStatus.FAILED}
                isLoading={isLoadingMetrics}
                totalRecords={payoutMetrics?.failed ?? 0}
                totalAmountInEuros={getTotalAmountPerCurrencyAndStatus('eur', 'failed')}
                totalAmountInPounds={getTotalAmountPerCurrencyAndStatus('gbp', 'failed')}
              />
              <DashboardTab
                status={PayoutStatus.PROCESSED}
                isLoading={isLoadingMetrics}
                totalRecords={payoutMetrics?.paid ?? 0}
                totalAmountInEuros={getTotalAmountPerCurrencyAndStatus('eur', 'paid')}
                totalAmountInPounds={getTotalAmountPerCurrencyAndStatus('gbp', 'paid')}
              />
            </Tabs.List>
            <Tabs.Content value=""></Tabs.Content>
          </Tabs.Root>
        </ScrollArea>

        <div className="flex-row bg-white rounded-lg px-7 py-8">
          <PayoutsTable
            payouts={payouts}
            pagination={{
              pageSize: pagination.pageSize,
              totalSize: pagination.totalSize,
            }}
            onPageChange={onPageChange}
            onSort={onSort}
            isLoading={isLoading}
            onPayoutClicked={onPayoutClicked}
            selectedPayoutId={selectedPayoutId}
            status={status}
            onAddPayoutForAuthorise={onAddPayoutForAuthorise}
            onRemovePayoutForAuthorise={onRemovePayoutForAuthorise}
            selectedPayouts={selectedPayouts}
            payoutsExist={payoutsExist}
            isLoadingMetrics={isLoadingMetrics}
            isUserAuthoriser={isUserAuthoriser}
          />
        </div>

        {/* System error modal */}
        <SystemErrorModal
          open={isSystemErrorOpen}
          title={systemError?.title}
          message={systemError?.message}
          onDismiss={handlOnCloseSystemErrorModal}
        />
      </div>
    </>
  )
}

export { PayoutDashboard }
