import { Currency, PaymentResult, PayoutEventTypesEnum, PayoutStatus } from '@nofrixion/moneymoov'
import { ZodIssue } from 'zod'

import {
  FieldID,
  LocalAccountIdentifierType,
  LocalAddressType,
  LocalPartialPaymentMethods,
  LocalPaymentAttemptEventType,
  LocalPaymentAttemptStatus,
  LocalPaymentMethodTypes,
  LocalTableIds,
  LocalTimeFrequencyEnum,
  LocalWallets,
  SubTransactionType,
} from './LocalEnums'

export interface LocalContact {
  name?: string
  email?: string
}

export type LocalPaymentStatus = 'paid' | 'partial' | 'unpaid' | 'overpaid' | 'authorised'

export interface LocalPaymentRequest {
  id: string
  status: LocalPaymentStatus
  createdAt: Date
  contact: LocalContact
  amount: number
  amountReceived: number
  amountRefunded: number
  amountPending: number
  currency: Currency
  tags: LocalTag[]
  paymentMethodTypes: LocalPaymentMethodTypes[]
  addresses: LocalAddress[]
  description: string
  productOrService: string
  hostedPayCheckoutUrl: string
  partialPaymentMethod: LocalPartialPaymentMethods
  paymentAttempts: LocalPaymentAttempt[]
  priorityBankID?: string
  priorityBankName?: string
  notificationEmailAddresses?: string
  captureFunds: boolean
  transactions?: LocalTransaction[]
  pispAccountID?: string
  title?: string
  customerName?: string
  createdByUser?: LocalUser
  merchantTokenDescription?: string
  remoteStatus: PaymentResult
  orderID?: string
}

export interface LocalCounterparty {
  accountID?: string
  name: string
  emailAddress?: string
  phoneNumber?: string
  identifier?: LocalAccountIdentifier
  accountInfo?: string
}

export interface LocalAccountIdentifier {
  type: LocalAccountIdentifierType
  currency: string
  bic?: string
  iban?: string
  accountNumber?: string
  sortCode?: string
}

export interface LocalPaymentAttempt {
  attemptKey: string
  occurredAt: Date
  paymentMethod: LocalPaymentMethodTypes
  amount: number
  currency: Currency.EUR | Currency.GBP
  processor?: string
  last4DigitsOfCardNumber?: string
  settledAt?: Date
  settledAmount: number
  settleFailedAt?: Date
  authorisedAmount: number
  cardPayerAuthenticationSetupFailedAt?: Date
  cardAuthorisedAt?: Date
  cardAuthoriseFailedAt?: Date
  cardAuthorisedAmount?: number
  authorisedAt?: Date
  captureAttempts: LocalPaymentRequestCaptureAttempt[]
  refundAttempts: LocalPaymentRequestRefundAttempt[]
  wallet?: LocalWallets | undefined
  status: LocalPaymentStatus
  reconciledTransactionID?: string
  paymentStatus: 'received' | 'pending' | 'failed' | 'unknown'
  paymentProcessor?: LocalPaymentProcessor
  events?: LocalPaymentAttemptEvent[]
  displayStatus: LocalPaymentAttemptStatus
  latestEventOccurredAt?: Date
  pispAuthorisationFailedAt?: Date
}

export interface LocalPaymentAttemptEvent {
  eventType: LocalPaymentAttemptEventType
  occurredAt: Date
  currency: Currency.EUR | Currency.GBP
  refundedAmount?: number
  capturedAmount?: number
  isCardVoid?: boolean
}

export interface SubTransaction {
  occurredAt?: Date
  amount: number
  currency: Currency.EUR | Currency.GBP
  type: SubTransactionType
  awaitingApproval?: boolean
  cancelled?: boolean
}

export interface LocalPaymentRequestRefundAttempt {
  refundPayoutID?: string
  refundInitiatedAt?: Date
  refundSettledAt?: Date
  refundCancelledAt?: Date
  refundInitiatedAmount: number
  refundSettledAmount: number
  refundCancelledAmount: number
  isCardVoid: boolean
}

export interface LocalPaymentRequestCaptureAttempt {
  capturedAt?: Date
  capturedAmount: number
}

export type LocalAddress = {
  addressLine1?: string
  addressLine2?: string
  addressCity?: string
  addressCounty?: string
  addressPostCode?: string
  addressCountryCode?: string
  phone?: string
  email?: string
  addressType: LocalAddressType
}

export interface LocalPaymentRequestCreate {
  amount: number
  currency: Currency
  productOrService: string
  description?: string
  firstName?: string
  lastName?: string
  email?: string
  paymentConditions: {
    allowPartialPayments: boolean
  }
  paymentMethods: {
    bank: {
      active: boolean
      priority?: {
        id: string
        name: string
      }
    }
    card: {
      active: boolean
      captureFunds: boolean
    }
    wallet: boolean
    lightning: boolean
  }
  tagIds?: string[]
  notificationEmailAddresses?: string
  destinationAccountID?: string
}

export interface LocalPaymentConditionsFormValue {
  allowPartialPayments: boolean
  isDefault: boolean
}

export interface LocalPaymentMethodsFormValue {
  isBankEnabled: boolean
  isCardEnabled: boolean
  isWalletEnabled: boolean
  isLightningEnabled: boolean
  isCaptureFundsEnabled: boolean
  priorityBank?: {
    id: string
    name: string
  }
  isDestinationAccountEnabled: boolean
  destinationAccount?: {
    id: string
    name: string
  }
  isDefault: boolean
}

export interface LocalPaymentNotificationsFormValue {
  emailAddresses: string
  isDefault: boolean
}

export interface LocalTag {
  id: string
  merchantID?: string
  name: string
  colourHex?: string
  description?: string
}

export interface LocalTransaction {
  id: string
  accountName: string
  date: Date
  counterParty: LocalCounterparty
  amount: number
  currency: Currency
  balanceAfterTx?: number
  reference: string
  description: string
  type: string
}

export interface LocalPayout {
  id: string
  accountID: string
  merchantID: string
  type: LocalAccountIdentifierType
  description: string
  currency: Currency
  amount: number
  yourReference?: string
  theirReference: string
  status: PayoutStatus
  createdBy?: string
  inserted: Date
  sourceAccountName: string
  sourceAccountNumber: string
  sourceAccountSortCode: string
  sourceAccountIban: string
  destination?: LocalCounterparty
  tags: LocalTag[]
  scheduled?: boolean
  scheduleDate?: Date
  beneficiaryID?: string
  activities: PayoutActivity[]
}

export interface LocalAccount {
  id: string
  merchantID: string
  accountName: string
  accountNumber?: string
  availableBalance: number
  balance: number
  currency: Currency
  displayName: string
  iban?: string
  sortCode?: string
  summary: string
  identifier: LocalAccountIdentifier
  isDefault: boolean
}

export interface LocalBeneficiary {
  id: string
  merchantID: string
  yourReference?: string
  theirReference?: string
  currency: Currency
  name: string
  destination?: LocalCounterparty
}

export enum ApproveType {
  PAYOUT = 'Payout',
  BATCH_PAYOUT = 'BatchPayout',
}

export interface Column {
  id: string
  label: string
  selected: boolean
}

export interface TablePageSize {
  tableId: LocalTableIds
  pageSize: number
}

export interface AutoSuggestions {
  fieldId: string
  values: AutoSuggestionValue[]
}

export interface AutoSuggestionValue {
  value: string
  inserted: Date
}

export interface AutoSuggestionAdd {
  fieldId: FieldID
  value: string
}

export interface LocalUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role?: LocalUserRoles
  isAdmin: boolean
  isAuthoriser: boolean
}

export enum LocalPaymentProcessor {
  None = 'None',
  CyberSource = 'CyberSource',
  Checkout = 'Checkout',
  Stripe = 'Stripe',
  Modulr = 'Modulr',
  Plaid = 'Plaid',
  Yapily = 'Yapily',
  NoFrixion = 'Nofrixion',
}

export interface LocalSettledTransaction {
  settledAt?: Date
  amount: number
  currency: Currency.EUR | Currency.GBP
  processor?: LocalPaymentProcessor
  paymentMethod: LocalPaymentMethodTypes
  isRefund: boolean
  wallet?: LocalWallets
}

export interface LocalAccountWithTransactionMetrics {
  accountID: string
  accountName: string
  availableBalance: number
  balance: number
  currency: Currency
  totalIncomingAmount: number
  totalOutgoingAmount: number
  numberOfTransactions: number
  numberOfIncomingTransactions: number
  numberOfOutgoingTransactions: number
}

export interface LocalAccountMetrics {
  merchantID: string
  totalAvailableBalance: number
  totalBalance: number
  currency: Currency
  numberOfAccounts: number
  periodicBalances: LocalPeriodicBalance[]
  periodicBalancesFromDate: Date
  periodicBalancesToDate: Date
  periodicBalancesFrequency: LocalTimeFrequencyEnum
}

export interface LocalPeriodicBalance {
  balanceAt: Date
  balance: number
}

// This isn't an exact copy of the enum in the API.
// The roles are sorted in order of least to most privileged.
export enum LocalUserRoles {
  NewlyRegistered = 1,
  PaymentRequestor = 2,
  User = 3,
  Approver = 4,
  AdminApprover = 5,
}

export interface PayoutActivity {
  text: string
  timestamp: Date
  status: string
  eventType: PayoutEventTypesEnum
}

export interface SystemError {
  title: string
  message: string
}

interface BaseInvoice {
  Id: string
  InvoiceNumber: string
  PaymentTerms: string
  InvoiceDate: Date
  DueDate: Date
  Contact: string
  Currency: Currency
  Subtotal: number
  Discounts: number
  Taxes: number
  TotalAmount: number
  InvoiceStatus: string
  Reference: string
  RemittanceEmail: string
}

interface IbanDetails {
  DestinationIban: string
  DestinationAccountNumber?: never
  DestinationSortCode?: never
}

interface AccountDetails {
  DestinationIban?: never
  DestinationAccountNumber: number
  DestinationSortCode: number
}

export type LocalInvoice = BaseInvoice & (IbanDetails | AccountDetails)

export interface ValidationResult {
  lineNumber: number
  valid: boolean
  errors?: ZodIssue[]
  result: LocalInvoice
}
