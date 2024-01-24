import { Counterparty, Tag } from './ApiResponses'
import {
  AccountIdentifierType,
  Currency,
  PayoutStatus,
  SortDirection,
  TimeFrequencyEnum,
} from './Enums'

export interface PagedResponseProps
  extends FilterResponseProps,
    MerchantProps,
    AccountProps,
    PayoutsProps {
  pageNumber?: number
  pageSize?: number
  status?: string
}

export interface PaymentRequestPageProps
  extends PagedResponseProps,
    FilterResponseProps,
    PaymentRequestProps,
    MerchantProps {}

export interface PayoutPageProps extends PagedResponseProps, FilterResponseProps {}

export interface AccountsWithTransactionsMetricsProps
  extends PagedResponseProps,
    FilterResponseProps {}

export interface UserRoleAndUserInvitePageProps extends PagedResponseProps, FilterResponseProps {}

export interface FilterResponseProps {
  fromDate?: Date
  toDate?: Date
  search?: string
  currency?: string
  minAmount?: number
  maxAmount?: number
  tags?: string[]
  sort?: string
}

export interface MetricsProps extends FilterResponseProps, MerchantProps {}

export interface BeneficiaryProps extends PagedResponseProps {
  search?: string
  currency?: string
}

export interface ApiProps {
  apiUrl: string
  authToken?: string
}

export interface MerchantProps {
  merchantId?: string
}

export interface getAccountProps {
  merchantId?: string
  connectedAccounts?: boolean
}

export interface AccountProps {
  accountId?: string
}

export interface PaymentRequestProps {
  paymentRequestId?: string
  includeEvents?: boolean
  merchantId?: string
}

export interface TransactionsProps extends AccountProps {
  pageNumber?: number
  pageSize?: number
  fromDate?: Date
  toDate?: Date
  sort?: string
  search?: string
}

export interface useTransactionsProps extends AccountProps {
  pageNumber?: number
  pageSize?: number
  fromDateMS?: number
  toDateMS?: number
  search?: string
  sortBy?: SortByTransactions
}

type SortByTransactionsOptions = 'created' | 'to' | 'reference' | 'amount' | 'description' | 'type'
export type SortByTransactions = SortBy<SortByTransactionsOptions>

export interface usePaymentRequestProps extends MerchantProps, PaymentRequestProps {
  merchantId: string
}

export interface usePaymentRequestsProps
  extends MerchantProps,
    PaymentRequestProps,
    PaymentRequestPageProps {
  merchantId: string
  fromDateMS?: number
  toDateMS?: number
  preservePreviousPageData?: boolean
  sortBy?: SortByPaymentRequests
}

type SortByPaymentRequestsOptions = 'created' | 'amount' | 'title'
export type SortByPaymentRequests = SortBy<SortByPaymentRequestsOptions>

export interface usePayoutsProps extends MerchantProps, PayoutPageProps {
  merchantId: string
  fromDateMS?: number
  toDateMS?: number
  statuses: PayoutStatus[]
  sortBy?: SortByPayouts
}

type SortByPayoutsOptions = 'created' | 'status' | 'amount' | 'counterPartyName' | 'scheduleDate'
export type SortByPayouts = SortBy<SortByPayoutsOptions>

export interface useUsersAndInvitesProps extends MerchantProps, PayoutPageProps {
  merchantId: string
  sortBy?: SortByUsersAndInvites
}

type SortByUsersAndInvitesOptions = 'status' | 'lastModified' | 'name' | 'role'
export type SortByUsersAndInvites = SortBy<SortByUsersAndInvitesOptions>

export interface useUsersAndInvitesMetricsProps extends MerchantProps, PayoutPageProps {
  merchantId: string
  search?: string
}

export interface usePaymentRequestMetricsProps extends MetricsProps {
  fromDateMS?: number
  toDateMS?: number
}

export interface usePayoutMetricsProps extends MetricsProps {
  fromDateMS?: number
  toDateMS?: number
}

export interface useBeneficiaryProps {
  merchantId?: string
  pageNumber?: number
  pageSize?: number
  search?: string
  currency?: string
}

export interface RefundProps {
  authorizationId: string
  paymentRequestId: string
  amount?: number
}

export interface VoidProps {
  authorizationId: string
  paymentRequestId: string
}

export interface CaptureProps {
  authorizationId: string
  paymentRequestId: string
  amount?: number
}

export interface DeleteTagProps {
  id: string
  tagId: string
  existingTagsIds: string[]
}

export interface AddTagProps {
  id: string
  tag: Tag
  existingTagsIds: string[]
}

export interface CreateTagProps {
  tag: Tag
}

export interface PayoutsProps extends AccountProps {
  pageNumber?: number
  pageSize?: number
  fromDate?: Date
  toDate?: Date
  payoutStatuses?: PayoutStatus[]
}

export interface usePendingPaymentsProps extends AccountProps {
  pageNumber?: number
  pageSize?: number
  fromDateMS?: number
  toDateMS?: number
  payoutStatuses?: PayoutStatus[]
}

export interface CreatePayoutProps {
  accountID: string
  type: AccountIdentifierType
  description?: string
  currency: Currency
  amount: number
  yourReference?: string
  theirReference: string
  destination: Counterparty
  invoiceID?: string
  allowIncomplete: boolean
  paymentRequestId?: string
  scheduled?: boolean
  scheduleDate?: Date
  beneficiaryID?: string
}

export interface PayoutProps {
  payoutId?: string
}

export interface PayrunProps {
  payrunId?: string
}

export interface DeleteConnectedAccountProps {
  accountId: string
}

export interface ConsentProps {
  consentId?: string
  merchantId?: string
  emailAddress?: string
}

export interface UserInviteProps {
  inviteId?: string
}

export interface useAccountsWithTransactionMetricsProps
  extends MerchantProps,
    AccountsWithTransactionsMetricsProps {
  fromDateMS?: number
  toDateMS?: number
  sortBy?: SortByAccountsWithTransactionMetrics
}

export interface SortByAccountsWithTransactionMetrics {
  name: 'numberOfTransactions'
  direction: SortDirection
}

export interface AccountsMetricsProps extends MerchantProps {
  fromDate?: Date
  toDate?: Date
  timeFrequency?: TimeFrequencyEnum
}

export interface UpdatePayoutProps {
  payoutID: string
  accountID?: string
  type?: AccountIdentifierType
  description?: string
  currency?: Currency
  amount?: number
  yourReference?: string
  theirReference?: string
  destination?: Counterparty
  scheduled?: boolean
  scheduleDate?: Date
  beneficiaryID?: string
}

interface IndividualSortBy<T> {
  name: T
  direction: SortDirection
}

interface SortBy<T> {
  primary: IndividualSortBy<T>
  secondary?: IndividualSortBy<T>
}
