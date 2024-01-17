import { PayoutStatus, SortDirection } from '@nofrixion/moneymoov'
import { action } from '@storybook/addon-actions'
import { Meta, StoryFn } from '@storybook/react'

import { mockPayouts } from '../../../../utils/mockedData'
import { AccountsPayableDashboard } from './AccountsPayableDashboard'

export default {
  title: 'Pages/Accounts Payable Dashboard',
  component: AccountsPayableDashboard,
  args: {},
} as Meta<typeof AccountsPayableDashboard>

const Template: StoryFn<typeof AccountsPayableDashboard> = (args) => {
  return (
    <div className="bg-main-grey">
      <AccountsPayableDashboard {...args} />
    </div>
  )
}

export const Showcase = Template.bind({})
Showcase.args = {
  payoutProps: {
    payouts: mockPayouts,
    payoutMetrics: {
      all: 100,
      failed: 10,
      inProgress: 20,
      paid: 30,
      pendingApproval: 40,
      scheduled: 50,
      totalAmountsByCurrency: {
        all: {
          eur: 100,
          gbp: 200,
        },
        failed: {
          eur: 10,
          gbp: 20,
        },
        inProgress: {
          eur: 20,
          gbp: 30,
        },
        paid: {
          eur: 30,
          gbp: 40,
        },
        pendingApproval: {
          eur: 40,
          gbp: 50,
        },
        scheduled: {
          eur: 50,
          gbp: 60,
        },
      },
    },
    pagination: {
      pageSize: 10,
      totalSize: 100,
    },
    onPageChange: action('onPageChange'),
    dateRange: {
      fromDate: new Date(),
      toDate: new Date(),
    },
    onDateChange: action('onDateChange'),
    onSearch: action('onSearch'),
    onSort: action('onSort'),
    searchFilter: '',
    isLoading: false,
    isLoadingMetrics: false,
    isInitialState: false,
    merchantCreatedAt: new Date(),
    setStatus: action('setStatus'),
    currency: undefined,
    setCurrency: action('setCurrency'),
    minAmount: undefined,
    setMinAmount: action('setMinAmount'),
    maxAmount: undefined,
    setMaxAmount: action('setMaxAmount'),
    onPayoutClicked: action('onPayoutClicked'),
    selectedPayoutId: '1',
    tags: [
      {
        id: '1',
        isSelected: false,
        label: 'Tag 1',
      },
      {
        id: '2',
        isSelected: false,
        label: 'Tag 2',
      },
    ],
    setTags: action('setTags'),
    sortBy: {
      primary: {
        name: 'created',
        direction: SortDirection.DESC,
      },
      secondary: {
        name: 'amount',
        direction: SortDirection.DESC,
      },
    },
    status: PayoutStatus.All,
    onAddPayoutForAuthorise: action('onAddPayoutForAuthorise'),
    onRemovePayoutForAuthorise: action('onRemovePayoutForAuthorise'),
    selectedPayouts: [],
    payoutsExist: true,
    isUserAuthoriser: true,
    systemError: undefined,
    isSystemErrorOpen: false,
    onCloseSystemError: action('onCloseSystemError'),
  },
}
