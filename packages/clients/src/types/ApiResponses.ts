import { Invoice } from './ApiRequests'
import {
  AccountIdentifierType,
  AddressType,
  AISAccountBalanceType,
  AISAccountIdentificationType,
  AISAccountType,
  AISCreditLineType,
  AISUsageType,
  CardTokenCreateModes,
  Currency,
  PartialPaymentMethods,
  PaymentMethodTypes,
  PaymentProcessor,
  PaymentProcessorsEnum,
  PaymentResult,
  PayoutEventTypesEnum,
  PayoutStatus,
  TimeFrequencyEnum,
  UserInviteStatusEnum,
  UserRoles,
  UserStatus,
  Wallets,
} from './Enums'

export type PaymentRequestPageResponse = PageResponse<PaymentRequest>

export type PaymentRequest = {
  id: string
  merchantID: string
  amount: number
  currency: Currency
  customerID?: string
  orderID?: string
  paymentMethodTypes: string
  description?: string
  pispAccountID?: string
  baseOriginUrl: string
  callbackUrl?: string
  successWebHookUrl?: string
  cardAuthorizeOnly: boolean
  cardCreateToken: boolean
  cardTokenCreateModes: CardTokenCreateModes
  ignoreAddressVerification: boolean
  cardIgnoreCVN: boolean
  cardProcessorMerchantID?: string
  paymentProcessor: PaymentProcessor
  pispRecipientReference?: string
  lightningInvoice?: string
  status: PaymentResult
  hostedPayCheckoutUrl?: string
  partialPaymentMethod: PartialPaymentMethods
  inserted: Date
  insertedSortable: string
  lastUpdated: Date
  useHostedPaymentPage: boolean
  customerEmailAddress?: string
  cardStripePaymentIntentID?: string
  cardStripePaymentIntentSecret?: string
  addresses: PaymentRequestAddress[]
  jwk?: string
  tags: Tag[]
  priorityBankID?: string
  title?: string
  paymentAttempts: PaymentRequestPaymentAttempt[]
  notificationEmailAddresses?: string
  transactions: Transaction[]
  customerName?: string
  createdByUser?: User
  merchantTokenDescription?: string
  amountReceived: number
  amountRefunded: number
  amountPending: number
}

export type PaymentRequestPaymentAttempt = {
  attemptKey: string
  paymentRequestID: string
  initiatedAt: Date
  authorisedAt?: Date
  cardAuthorisedAt?: Date
  cardAuthoriseFailedAt?: Date
  cardPayerAuthenticationSetupFailedAt?: Date
  settledAt?: Date
  refundedAt?: Date
  settleFailedAt?: Date
  paymentMethod: PaymentMethodTypes
  attemptedAmount: number
  authorisedAmount: number
  cardAuthorisedAmount?: number
  settledAmount: number
  refundAttempts: PaymentRequestRefundAttempt[]
  captureAttempts: PaymentRequestCaptureAttempt[]
  currency: Currency.EUR | Currency.GBP
  paymentProcessor: PaymentProcessor
  status: PaymentResult
  walletName?: Wallets
  reconciledTransactionID?: string
  pispAuthorisationFailedAt?: Date
}

export type PaymentRequestMinimal = {
  id: string
  merchantID: string
  amount: number
  currency: Currency
  merchantName?: string
  description?: string
  paymentProcessor: PaymentProcessor
  callbackUrl?: string
  cardStripePaymentIntentSecret?: string
  jwk?: string
  paymentMethodTypes: string
  cardTransmitRawDetails: boolean
  cardProcessorMerchantID?: string
  ignoreAddressVerification: boolean
  cardIgnoreCVN: boolean
  pispRecipientReference?: string
  useHostedPaymentPage: boolean
  cardNoPayerAuthentication: boolean
}

export type PaymentRequestAddress = {
  id: string
  paymentRequestID: string
  addressType: AddressType
  firstName?: string
  lastName?: string
  addressLine1?: string
  addressLine2?: string
  addressCity?: string
  addressCounty?: string
  addressPostCode?: string
  addressCountryCode?: string
  phone?: string
  email?: string
}

export type PaymentRequestRefundAttempt = {
  refundPayoutID?: string
  refundInitiatedAt?: Date
  refundSettledAt?: Date
  refundCancelledAt?: Date
  refundInitiatedAmount: number
  refundSettledAmount: number
  refundCancelledAmount: number
  isCardVoid: boolean
}

export type PaymentRequestCaptureAttempt = {
  capturedAt?: Date
  capturedAmount: number
  captureFailedAt?: Date
}

export interface Pagination {
  pageNumber: number
  pageSize: number
  totalPages: number
  totalSize: number
}

export interface PageResponse<T> extends Pagination {
  content: T[]
}

export type ApiError = {
  type?: string
  title: string
  status?: number
  detail: string
  errors?: { [key: string]: string[] }
}

export type ApiResponse<T> =
  | {
      status: 'success'
      data: T
      timestamp: Date
    }
  | {
      status: 'error'
      error: ApiError
      timestamp: Date
    }

export type Tag = {
  id: string
  merchantID?: string
  name: string
  colourHex?: string
  description?: string
}

export type PaymentRequestMetrics = {
  all: number
  paid: number
  unpaid: number
  partiallyPaid: number
  authorized: number
  totalAmountsByCurrency: Record<
    'all' | 'paid' | 'partiallyPaid' | 'unpaid' | 'authorized',
    Record<'eur' | 'gbp', number | undefined>
  >
}

export type UserPaymentDefaults = {
  paymentMethodsDefaults?: PaymentMethodsDefaults
  paymentConditionsDefaults?: PaymentConditionsDefaults
  notificationEmailsDefaults?: NotificationEmailsDefaults
}

export type PaymentMethodsDefaults = {
  pisp: boolean
  pispPriorityBank: boolean
  pispPriorityBankID: string
  card: boolean
  wallet: boolean
  lightning: boolean
  cardAuthorizeOnly: boolean
}

export type PaymentConditionsDefaults = {
  allowPartialPayments: boolean
}

export type NotificationEmailsDefaults = {
  emailAddresses: string
}

export type MerchantBankSettings = {
  merchantID: string
  payByBankSettings: BankSettings[]
}

export type BankSettings = {
  bankID: string
  bankName: string
  order: number
  logo: string
  currency: Currency
  processor: PaymentProcessor
  personalInstitutionID?: string
  businessInstitutionID?: string
  message?: string
  messageImageUrl?: string
}

export interface Account {
  id: string
  merchantID: string
  accountName: string
  accountNumber: string
  availableBalance: number
  balance: number
  currency: Currency
  displayName: string
  iban?: string
  sortCode?: string
  summary: string
  identifier: AccountIdentifier
  isDefault: boolean
  isConnectedAccount: boolean
  bankName: string
  expiryDate?: string
  consentID?: string
}

export interface AccountIdentifier {
  type: AccountIdentifierType
  currency: string
  bic?: string
  iban?: string
  accountNumber?: string
  sortCode?: string
}

export interface Merchant {
  id: string
  name: string
  enabled: boolean
  companyID: string
  merchantCategoryCode: string
  shortName: string
  paymentAccountLimit: number
  inserted: string
  jurisdiction: string
  hostedPayVersion: number
  webHookLimit: number
  displayQrOnHostedPay: boolean
  yourRole: string
  userRoles: any[] // TODO: Add type
  tags: any[]
  paymentAccounts: any[] // TODO: Add type
}

export interface Transaction {
  id: string
  merchantID: string
  accountID: string
  accountName: string
  amount: number
  currency: Currency
  description: string
  transactionDate: string
  yourReference: string
  theirReference: string
  balance: number
  counterparty: Counterparty
  type: TransactionType
}

export type TransactionType =
  | 'Internal'
  | 'SEPA_CT'
  | 'SEPA_INST'
  | 'UK_FAST'
  | 'UK_BACS'
  | 'Reversal'

export const TransactionTypeValue: { [key in TransactionType]: string } = {
  Internal: 'Internal',
  SEPA_CT: 'SEPA Credit Transfer',
  SEPA_INST: 'SEPA Instant',
  UK_FAST: 'Faster Payments',
  UK_BACS: 'Bankers Automated Clearing House',
  Reversal: 'Reversal',
}

export type TransactionPageResponse = PageResponse<Transaction>

export interface Counterparty {
  accountID?: string
  name: string
  emailAddress?: string
  phoneNumber?: string
  identifier?: AccountIdentifier
}

export interface User {
  id: string
  emailAddress: string
  firstName: string
  lastName: string
  roles: UserRole[]
}

export interface Payout {
  id: string
  accountID: string
  merchantID: string
  userID?: string
  approverID?: string
  type: AccountIdentifierType
  description: string
  currency: Currency
  amount: number
  yourReference?: string
  theirReference: string
  merchantTokenDescription: string
  status: PayoutStatus
  currentUserID?: string
  currentUserRole?: string // TODO: Add type
  approvePayoutUrl?: string
  createdBy?: string
  inserted: Date
  sourceAccountName: string
  sourceAccountNumber: string
  sourceAccountSortCode: string
  sourceAccountIban: string
  destination?: Counterparty
  tags: Tag[]
  scheduled?: boolean
  scheduleDate?: Date
  beneficiaryID?: string
  events: PayoutEvent[]
}

export interface PayoutEvent {
  userID: string
  userName?: string
  timestamp: Date
  status: PayoutStatus
  eventType: PayoutEventTypesEnum
  ruleName?: string
}

export interface PayoutUpdate {
  ID?: string
  accountID?: string
  type?: AccountIdentifierType
  description?: string
  currency?: Currency
  amount?: number
  yourReference?: string
  theirReference?: string
  destination?: Counterparty
  tags?: Tag[]
  tagIds?: string[]
  scheduled?: boolean
  scheduleDate?: Date
  beneficiaryID?: string
}

export type PayoutMetrics = {
  all: number
  paid: number
  inProgress: number
  pendingApproval: number
  failed: number
  scheduled: number
  totalAmountsByCurrency: Record<
    'all' | 'paid' | 'pendingApproval' | 'inProgress' | 'failed' | 'scheduled',
    Record<'eur' | 'gbp', number | undefined>
  >
}

export type PayoutPageResponse = PageResponse<Payout>

export type UserRoleAndUserInvitePageResponse = PageResponse<UserRoleAndUserInvite>

export type Beneficiary = {
  id: string
  merchantID: string
  name: string
  yourReference: string
  theirReference: string
  currency: Currency
  destination: Counterparty
}

export type BeneficiaryPageResponse = PageResponse<Beneficiary>

export type BatchPayout = {
  id: string
  payouts: Payout[]
}

export type ConsentResponse = {
  consentId: string
  authorisationUrl: string
}

export type Consent = {
  id: string
  institutionId: string
  emailAddress: string
  isEnabled: boolean
  callbackUrl: string
  successWebHookUrl: string
  expiryDate: Date
  inserted: Date
  provider: PaymentProcessorsEnum
}

export type AISAccount = {
  id: string
  usageType: AISUsageType
  accountType: AISAccountType
  type: string
  description: string
  balance: number
  currency: string
  nickname: string
  details: string
  accountNames: AISAccountName[]
  aAccountIdentifications: AISAccountIdentification[]
  accountBalances: AISAccountBalance[]
  consolidatedAccountInformation: AISConsolidatedAccountInformation
}

export type AISAccountName = {
  name: string
}

export type AISAccountIdentification = {
  type: AISAccountIdentificationType
  identification: string
  accountBalances: AISAccountBalance[]
}

export type AISAccountBalance = {
  type: AISAccountBalanceType
  dateTime: Date
  balanceAmount: AISAmount
  creditLineIncluded: boolean
  creditLines: AISCreditLine[]
}

export type AISAmount = {
  amount: number
  currency: string
}

export type AISCreditLine = {
  type: AISCreditLineType
  creditLineAmount: AISAmount
}

export type AISConsolidatedAccountInformation = {
  id: string
  accountBalances: AISAccountBalance[]
}

export type UserRoleAndUserInvite = {
  userID?: string
  merchantID: string
  emailAddress: string
  name: string
  inviteID?: string
  lastModified: Date
  roleType: UserRoles
  status: UserStatus
  userRoleID?: string
}

export type UserMetrics = {
  all: number
  invited: number
  rolePending: number
  active: number
}

export type UserInvite = {
  id: string
  inviteeEmailAddress: string
  inviteeFirstName?: string
  inviteeLastName?: string
  inviterEmailAddress: string
  inviterFirstName: string
  inviterLastName: string
  merchantID: string
  registrationUrl: string
  lastInvited: Date
  merchantName: string
  message: string
  status: UserInviteStatusEnum
}

export type UserRole = {
  id: string
  userID: string
  merchantID: string
  firstName: string
  lastName: string
  emailAddress: string
  roleType: UserRoles
}

export type AccountTransactionMetrics = {
  accountID: string
  accountName: string
  currency: Currency
  balance: number
  availableBalance: number
  totalIncomingAmount: number
  totalOutgoingAmount: number
  numberOfTransactions: number
  numberOfIncomingTransactions: number
  numberOfOutgoingTransactions: number
}

export type AccountTransactionMetricsPageResponse = PageResponse<AccountTransactionMetrics>

export type AccountMetrics = {
  merchantID: string
  currency: Currency
  totalBalance: number
  totalAvailableBalance: number
  numberOfAccounts: number
  periodicBalances: PeriodicBalance[]
  periodicBalancesFromDate: Date
  periodicBalancesToDate: Date
  periodicBalancesFrequency: TimeFrequencyEnum
}

export type PeriodicBalance = {
  balanceAt: Date
  balance: number
}

export interface Payrun {
  id: string
  name?: string
  merchantID: string
  invoices: Invoice[]
  totalAmount: number
  inserted: Date
  lastUpdated: Date
  scheduleDate?: Date
  accountsToPay?: Record<Currency, string>
}

export type PayrunPageResponse = PageResponse<Payrun>
