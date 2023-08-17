import {
  AccountIdentifierType,
  AddressType,
  CardTokenCreateModes,
  Currency,
  PartialPaymentMethods,
  PaymentMethodTypes,
  PaymentProcessor,
  PaymentResult,
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
}

export type PaymentRequestPaymentAttempt = {
  attemptKey: string
  paymentRequestID: string
  initiatedAt: Date
  authorisedAt?: Date
  cardAuthorisedAt?: Date
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
  status: string
  currentUserID?: string
  approvePayoutUrl?: string
  createdBy?: string
  inserted: Date
  sourceAccountName: string
  destination?: Counterparty
  invoiceID: string
}
