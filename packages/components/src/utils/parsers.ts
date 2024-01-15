import {
  Account,
  AccountIdentifier,
  AccountIdentifierType,
  AccountMetrics,
  AccountTransactionMetrics,
  Beneficiary,
  Counterparty,
  Invoice,
  PartialPaymentMethods,
  PaymentMethodTypes,
  type PaymentRequest,
  type PaymentRequestAddress,
  type PaymentRequestCaptureAttempt,
  type PaymentRequestPaymentAttempt,
  type PaymentRequestRefundAttempt,
  PaymentResult,
  Payout,
  PayoutEvent,
  PayoutEventTypesEnum,
  PayoutStatus,
  type Tag,
  TimeFrequencyEnum,
  Transaction,
  TransactionTypeValue,
  User,
  UserRoles,
  UserStatus,
  Wallets,
} from '@nofrixion/moneymoov'

import { ChartPoint } from '../components/ui/molecules/Chart/AccountChart'
import {
  LocalAccountIdentifierType,
  LocalAddressType,
  LocalPartialPaymentMethods,
  LocalPaymentAttemptEventType,
  LocalPaymentMethodTypes,
  LocalTimeFrequencyEnum,
  LocalWallets,
} from '../types/LocalEnums'
import {
  LocalAccount,
  LocalAccountIdentifier,
  LocalAccountMetrics,
  LocalAccountWithTransactionMetrics,
  LocalAddress,
  LocalBeneficiary,
  LocalCounterparty,
  LocalInvoice,
  LocalPaymentAttempt,
  LocalPaymentAttemptEvent,
  LocalPaymentProcessor,
  LocalPaymentRequest,
  LocalPaymentRequestCaptureAttempt,
  LocalPaymentRequestRefundAttempt,
  LocalPaymentStatus,
  LocalPayout,
  LocalPeriodicBalance,
  LocalTag,
  LocalTransaction,
  LocalUser,
  LocalUserRoles,
  PayoutActivity,
} from '../types/LocalTypes'
import { formatDateWithYear } from './formatters'
import { getPaymentAttemptStatus } from './paymentAttemptsHelper'

const parseApiTagToLocalTag = (tag: Tag): LocalTag => {
  return {
    id: tag.id,
    name: tag.name,
    colourHex: tag.colourHex,
    description: tag.description,
    merchantID: tag.merchantID,
  }
}

const parseLocalTagToApiTag = (tag: LocalTag): Tag => {
  return {
    id: tag.id,
    name: tag.name,
    colourHex: tag.colourHex,
    description: tag.description,
    merchantID: tag.merchantID,
  }
}

const remotePaymentRequestToLocalPaymentRequest = (
  remotePaymentRequest: PaymentRequest,
): LocalPaymentRequest => {
  const {
    addresses,
    inserted,
    customerEmailAddress,
    amount,
    currency,
    status,
    tags,
    amountReceived,
    amountRefunded,
    amountPending,
    orderID,
  } = remotePaymentRequest

  const parseApiStatusToLocalStatus = (status: PaymentResult): LocalPaymentStatus => {
    switch (status) {
      case PaymentResult.FullyPaid:
        return 'paid'
      case PaymentResult.PartiallyPaid:
        return 'partial'
      case PaymentResult.OverPaid:
        return 'overpaid'
      case PaymentResult.Authorized:
        return 'authorised'
      default:
        return 'unpaid'
    }
  }

  const parseApiPaymentMethodTypeToLocalMethodType = (
    paymentMethodType: PaymentMethodTypes,
  ): LocalPaymentMethodTypes => {
    switch (paymentMethodType) {
      case PaymentMethodTypes.Card:
        return LocalPaymentMethodTypes.Card
      case PaymentMethodTypes.Pisp:
        return LocalPaymentMethodTypes.Pisp
      case PaymentMethodTypes.ApplePay:
        return LocalPaymentMethodTypes.ApplePay
      case PaymentMethodTypes.GooglePay:
        return LocalPaymentMethodTypes.GooglePay
      case PaymentMethodTypes.Lightning:
        return LocalPaymentMethodTypes.Lightning
      default:
        return LocalPaymentMethodTypes.None
    }
  }

  const parseApiPaymentMethodTypesToLocalPaymentMethodTypes = (
    paymentMethodTypes: string,
  ): LocalPaymentMethodTypes[] => {
    const paymentMethodTypesArray = paymentMethodTypes.split(',')
    const localPaymentMethodTypesArray: LocalPaymentMethodTypes[] = []

    paymentMethodTypesArray.forEach((paymentMethodType) => {
      paymentMethodType = paymentMethodType.trim()
      switch (paymentMethodType) {
        case 'card':
          localPaymentMethodTypesArray.push(LocalPaymentMethodTypes.Card)
          break
        case 'pisp':
          localPaymentMethodTypesArray.push(LocalPaymentMethodTypes.Pisp)
          break
        case 'applePay':
          localPaymentMethodTypesArray.push(LocalPaymentMethodTypes.ApplePay)
          break
        case 'googlePay':
          localPaymentMethodTypesArray.push(LocalPaymentMethodTypes.GooglePay)
          break
        case 'lightning':
          localPaymentMethodTypesArray.push(LocalPaymentMethodTypes.Lightning)
          break
        default:
          break
      }
    })

    return localPaymentMethodTypesArray
  }

  const parseApiAddressTypeToLocalAddressType = (addressType: string): LocalAddressType => {
    switch (addressType) {
      case 'Shipping':
        return LocalAddressType.Shipping
      case 'Billing':
        return LocalAddressType.Billing
      default:
        return LocalAddressType.Unknown
    }
  }

  const parseApiAddressToLocalAddress = (remoteAddress: PaymentRequestAddress): LocalAddress => {
    const {
      addressLine1,
      addressLine2,
      addressCity,
      addressCounty,
      addressPostCode,
      addressCountryCode,
      phone,
      email,
      addressType,
    } = remoteAddress
    return {
      addressLine1: addressLine1 ?? '',
      addressLine2: addressLine2 ?? '',
      addressCity: addressCity ?? '',
      addressCounty: addressCounty ?? '',
      addressPostCode: addressPostCode ?? '',
      addressCountryCode: addressCountryCode ?? '',
      phone: phone ?? '',
      email: email ?? '',
      addressType: parseApiAddressTypeToLocalAddressType(addressType),
    }
  }

  const parseApiWalletTypeToLocalWalletType = (walletType: Wallets): LocalWallets | undefined => {
    switch (walletType) {
      case Wallets.ApplePay:
        return LocalWallets.ApplePay
      case Wallets.GooglePay:
        return LocalWallets.GooglePay
      default:
        return undefined
    }
  }

  const extractEventsFromPaymentAttempt = (
    paymentRequest: PaymentRequest,
    paymentAttempt: PaymentRequestPaymentAttempt,
  ): LocalPaymentAttemptEvent[] => {
    const events: LocalPaymentAttemptEvent[] = []
    if (paymentAttempt.paymentMethod === PaymentMethodTypes.Card) {
      if (paymentAttempt.refundAttempts.length > 0) {
        paymentAttempt.refundAttempts.forEach((refundAttempt) => {
          if (refundAttempt.refundSettledAt) {
            events.push({
              eventType:
                refundAttempt.refundSettledAmount === paymentAttempt.cardAuthorisedAmount
                  ? refundAttempt.isCardVoid
                    ? LocalPaymentAttemptEventType.Voided
                    : LocalPaymentAttemptEventType.Refunded
                  : LocalPaymentAttemptEventType.PartiallyRefunded,
              occurredAt: new Date(refundAttempt.refundSettledAt),
              currency: paymentAttempt.currency,
              refundedAmount: refundAttempt.refundSettledAmount,
              isCardVoid: refundAttempt.isCardVoid,
            })
          }
        })
      }
      if (paymentAttempt.captureAttempts.length > 0) {
        paymentAttempt.captureAttempts.forEach((captureAttempt) => {
          if (captureAttempt.capturedAt) {
            events.push({
              eventType:
                captureAttempt.capturedAmount === paymentAttempt.cardAuthorisedAmount
                  ? paymentRequest.cardAuthorizeOnly
                    ? LocalPaymentAttemptEventType.Captured
                    : LocalPaymentAttemptEventType.Received
                  : LocalPaymentAttemptEventType.PartiallyCaptured,
              occurredAt: new Date(captureAttempt.capturedAt),
              currency: paymentAttempt.currency,
              capturedAmount: captureAttempt.capturedAmount,
            })
          }

          if (captureAttempt.captureFailedAt) {
            events.push({
              eventType: paymentRequest.cardAuthorizeOnly
                ? LocalPaymentAttemptEventType.CaptureFailed
                : LocalPaymentAttemptEventType.AuthorisationFailed,
              occurredAt: new Date(captureAttempt.captureFailedAt),
              currency: paymentAttempt.currency,
            })
          }
        })
      }
      if (paymentAttempt.cardAuthorisedAt) {
        events.push({
          eventType: LocalPaymentAttemptEventType.Authorised,
          occurredAt: new Date(paymentAttempt.cardAuthorisedAt),
          currency: paymentAttempt.currency,
        })
      }
      if (paymentAttempt.cardAuthoriseFailedAt) {
        events.push({
          eventType: LocalPaymentAttemptEventType.AuthorisationFailed,
          occurredAt: new Date(paymentAttempt.cardAuthoriseFailedAt),
          currency: paymentAttempt.currency,
        })
      }
      if (paymentAttempt.cardPayerAuthenticationSetupFailedAt) {
        events.push({
          eventType: LocalPaymentAttemptEventType.AuthenticationFailure,
          occurredAt: new Date(paymentAttempt.cardPayerAuthenticationSetupFailedAt),
          currency: paymentAttempt.currency,
        })
      }
      if (paymentAttempt.initiatedAt) {
        events.push({
          eventType: LocalPaymentAttemptEventType.AuthenticationSetupStarted,
          occurredAt: new Date(paymentAttempt.initiatedAt),
          currency: paymentAttempt.currency,
        })
      }
    }

    if (paymentAttempt.paymentMethod === PaymentMethodTypes.Pisp) {
      if (paymentAttempt.refundAttempts.length > 0) {
        paymentAttempt.refundAttempts.forEach((refundAttempt) => {
          if (refundAttempt.refundSettledAt) {
            events.push({
              eventType:
                refundAttempt.refundSettledAmount === paymentAttempt.settledAmount
                  ? LocalPaymentAttemptEventType.Refunded
                  : LocalPaymentAttemptEventType.PartiallyRefunded,
              occurredAt: new Date(refundAttempt.refundSettledAt),
              currency: paymentAttempt.currency,
              refundedAmount: refundAttempt.refundSettledAmount,
            })
          } else if (refundAttempt.refundInitiatedAt && !refundAttempt.refundCancelledAt) {
            events.push({
              eventType: LocalPaymentAttemptEventType.RefundAwaitingAuthorisation,
              occurredAt: new Date(refundAttempt.refundInitiatedAt),
              currency: paymentAttempt.currency,
              refundedAmount: refundAttempt.refundInitiatedAmount,
            })
          }
        })
      }

      if (paymentAttempt.settledAt) {
        events.push({
          eventType: LocalPaymentAttemptEventType.Received,
          occurredAt: new Date(paymentAttempt.settledAt),
          currency: paymentAttempt.currency,
        })
      }

      if (paymentAttempt.settleFailedAt) {
        events.push({
          eventType: LocalPaymentAttemptEventType.SettlementFailed,
          occurredAt: new Date(paymentAttempt.settleFailedAt),
          currency: paymentAttempt.currency,
        })
      }

      if (paymentAttempt.authorisedAt) {
        events.push({
          eventType: LocalPaymentAttemptEventType.Authorised,
          occurredAt: new Date(paymentAttempt.authorisedAt),
          currency: paymentAttempt.currency,
        })
      }

      if (paymentAttempt.initiatedAt) {
        events.push({
          eventType: LocalPaymentAttemptEventType.BankPaymentInitiated,
          occurredAt: new Date(paymentAttempt.initiatedAt),
          currency: paymentAttempt.currency,
        })
      }
    }
    return events.sort((a, b) => {
      return new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    })
  }

  const parseApiPartialPaymentMethodToLocalPartialPaymentMethod = (
    partialPaymentMethod: PartialPaymentMethods,
  ): LocalPartialPaymentMethods => {
    switch (partialPaymentMethod) {
      case PartialPaymentMethods.None:
        return LocalPartialPaymentMethods.None
      case PartialPaymentMethods.Partial:
        return LocalPartialPaymentMethods.Partial
      default:
        return LocalPartialPaymentMethods.None
    }
  }

  const parseApiCaptureAttemptsToLocalCaptureAttempts = (
    remoteCaptureAttempts: PaymentRequestCaptureAttempt[],
  ): LocalPaymentRequestCaptureAttempt[] => {
    if (remoteCaptureAttempts.length === 0) {
      return []
    } else {
      const localCaptureAttempts: LocalPaymentRequestCaptureAttempt[] = []
      remoteCaptureAttempts.map((remoteCaptureAttempt) => {
        const { capturedAt, capturedAmount } = remoteCaptureAttempt
        localCaptureAttempts.push({
          capturedAt: new Date(capturedAt ?? 0),
          capturedAmount: capturedAmount,
        })
      })
      return localCaptureAttempts
    }
  }

  const parseApiRefundAttemptsToLocalRefundAttempts = (
    remoteRefundAttempts: PaymentRequestRefundAttempt[],
  ): LocalPaymentRequestRefundAttempt[] => {
    if (remoteRefundAttempts.length === 0) {
      return []
    } else {
      const localRefundAttempts: LocalPaymentRequestRefundAttempt[] = []
      remoteRefundAttempts.map((remoteRefundAttempt) => {
        const {
          refundPayoutID,
          refundInitiatedAt,
          refundSettledAt,
          refundCancelledAt,
          refundInitiatedAmount,
          refundSettledAmount,
          refundCancelledAmount,
          isCardVoid,
        } = remoteRefundAttempt
        localRefundAttempts.push({
          refundPayoutID: refundPayoutID,
          refundInitiatedAt: refundInitiatedAt ? new Date(refundInitiatedAt) : undefined,
          refundSettledAt: refundSettledAt ? new Date(refundSettledAt) : undefined,
          refundCancelledAt: refundCancelledAt ? new Date(refundCancelledAt) : undefined,
          refundInitiatedAmount: refundInitiatedAmount,
          refundSettledAmount: refundSettledAmount,
          refundCancelledAmount: refundCancelledAmount,
          isCardVoid: isCardVoid,
        })
      })
      return localRefundAttempts
    }
  }

  const getPaymentAttemptPaymentStatusForTable = (
    remotePaymentAttempt: PaymentRequestPaymentAttempt,
  ): 'received' | 'pending' | 'failed' | 'unknown' => {
    if (remotePaymentAttempt.status === PaymentResult.Authorized) {
      return 'pending'
    }

    if (
      remotePaymentAttempt.status === PaymentResult.None &&
      (remotePaymentAttempt.settleFailedAt ||
        remotePaymentAttempt.cardAuthoriseFailedAt ||
        remotePaymentAttempt.cardPayerAuthenticationSetupFailedAt)
    ) {
      return 'failed'
    }

    if (remotePaymentAttempt.settledAt || remotePaymentAttempt.cardAuthorisedAt) {
      return 'received'
    }

    return 'unknown'
  }

  const parseApiPaymentProcessorToLocalPaymentProcessor = (
    paymentProcessor: string | undefined,
  ): LocalPaymentProcessor | undefined => {
    switch (paymentProcessor) {
      case 'Modulr':
        return LocalPaymentProcessor.Modulr
      case 'Plaid':
        return LocalPaymentProcessor.Plaid
      case 'Yapily':
        return LocalPaymentProcessor.Yapily
      case 'Stripe':
        return LocalPaymentProcessor.Stripe
      case 'Checkout':
        return LocalPaymentProcessor.Checkout
      case 'CyberSource':
        return LocalPaymentProcessor.CyberSource
      case 'NoFrixion':
        return LocalPaymentProcessor.NoFrixion
      default:
        return LocalPaymentProcessor.None
    }
  }

  const parseApiPaymentAttemptsToLocalPaymentAttempts = (
    remotePaymentAttempts: PaymentRequestPaymentAttempt[],
  ): LocalPaymentAttempt[] => {
    if (remotePaymentAttempts.length === 0) {
      return []
    } else {
      const localPaymentAttempts: LocalPaymentAttempt[] = []
      remotePaymentAttempts
        .sort((a, b) => {
          return new Date(b.initiatedAt ?? 0).getTime() - new Date(a.initiatedAt ?? 0).getTime()
        })
        .map((remotePaymentAttempt) => {
          const {
            attemptKey,
            authorisedAt,
            settledAt,
            attemptedAmount,
            paymentMethod,
            settledAmount,
            captureAttempts,
            refundAttempts,
            currency,
            walletName,
            status,
            authorisedAmount,
            cardAuthorisedAmount,
            cardAuthorisedAt,
            reconciledTransactionID,
            paymentProcessor,
            cardAuthoriseFailedAt,
            cardPayerAuthenticationSetupFailedAt,
            settleFailedAt,
          } = remotePaymentAttempt

          const events = extractEventsFromPaymentAttempt(remotePaymentRequest, remotePaymentAttempt)

          const latestEventOccurredAt =
            events && events.length > 0 && events[0].occurredAt
              ? new Date(events[0].occurredAt)
              : undefined

          localPaymentAttempts.push({
            attemptKey: attemptKey,
            occurredAt: new Date(settledAt ?? authorisedAt ?? cardAuthorisedAt ?? 0),
            paymentMethod: parseApiPaymentMethodTypeToLocalMethodType(paymentMethod),
            amount: attemptedAmount,
            currency: currency,
            processor: walletName ? parseApiWalletTypeToLocalWalletType(walletName) : undefined,
            settledAmount: settledAmount,
            authorisedAt: authorisedAt ? new Date(authorisedAt) : undefined,
            captureAttempts: parseApiCaptureAttemptsToLocalCaptureAttempts(captureAttempts),
            refundAttempts: parseApiRefundAttemptsToLocalRefundAttempts(refundAttempts),
            authorisedAmount: authorisedAmount,
            settledAt: settledAt ? new Date(settledAt) : undefined,
            cardAuthorisedAmount: cardAuthorisedAmount,
            cardAuthorisedAt: cardAuthorisedAt ? new Date(cardAuthorisedAt) : undefined,
            cardAuthoriseFailedAt: cardAuthoriseFailedAt
              ? new Date(cardAuthoriseFailedAt)
              : undefined,
            cardPayerAuthenticationSetupFailedAt: cardPayerAuthenticationSetupFailedAt,
            settleFailedAt: settleFailedAt ? new Date(settleFailedAt) : undefined,
            wallet: walletName ? parseApiWalletTypeToLocalWalletType(walletName) : undefined,
            status: parseApiStatusToLocalStatus(status),
            reconciledTransactionID: reconciledTransactionID,
            paymentStatus: getPaymentAttemptPaymentStatusForTable(remotePaymentAttempt),
            paymentProcessor: parseApiPaymentProcessorToLocalPaymentProcessor(paymentProcessor),
            displayStatus: getPaymentAttemptStatus(remotePaymentAttempt),
            events: events,
            latestEventOccurredAt: latestEventOccurredAt,
          })
        })
      return localPaymentAttempts
    }
  }

  return {
    id: remotePaymentRequest.id,
    status: parseApiStatusToLocalStatus(status),
    createdAt: new Date(inserted),
    contact: {
      name: addresses.length
        ? `${addresses[0].firstName ?? ''} ${addresses[0].lastName ?? ''}`.trim()
        : undefined,
      email: customerEmailAddress ?? undefined,
    },
    amount: amount,
    amountReceived: amountReceived,
    amountRefunded: amountRefunded,
    amountPending: amountPending,
    currency: currency,
    tags: tags.map((tag) => parseApiTagToLocalTag(tag)),
    paymentMethodTypes: parseApiPaymentMethodTypesToLocalPaymentMethodTypes(
      remotePaymentRequest.paymentMethodTypes,
    ),
    addresses: addresses.map((address) => parseApiAddressToLocalAddress(address)),
    description: remotePaymentRequest.description ?? '',
    productOrService: remotePaymentRequest.title ?? '',
    hostedPayCheckoutUrl: remotePaymentRequest.hostedPayCheckoutUrl ?? '',
    partialPaymentMethod: parseApiPartialPaymentMethodToLocalPartialPaymentMethod(
      remotePaymentRequest.partialPaymentMethod,
    ),
    paymentAttempts: parseApiPaymentAttemptsToLocalPaymentAttempts(
      remotePaymentRequest.paymentAttempts,
    ),
    priorityBankID: remotePaymentRequest.priorityBankID,
    notificationEmailAddresses: remotePaymentRequest.notificationEmailAddresses,
    captureFunds: !remotePaymentRequest.cardAuthorizeOnly,
    transactions: remoteTransactionsToLocal(remotePaymentRequest.transactions),
    pispAccountID: remotePaymentRequest.pispAccountID,
    title: remotePaymentRequest.title,
    customerName: remotePaymentRequest.customerName,
    createdByUser: remotePaymentRequest.createdByUser
      ? parseApiUserToLocalUser(remotePaymentRequest.createdByUser)
      : undefined,
    merchantTokenDescription: remotePaymentRequest.merchantTokenDescription,
    remoteStatus: remotePaymentRequest.status,
    orderID: orderID,
  }
}

const parseApiUserToLocalUser = (remoteUser: User, merchantId?: string): LocalUser => {
  const { id, emailAddress, firstName, lastName } = remoteUser
  const userRole =
    parseApiUserRoleToLocalUserRole(
      remoteUser.roles.find((role) => role.merchantID === merchantId)?.roleType,
    ) ?? LocalUserRoles.NewlyRegistered

  return {
    id: id,
    email: emailAddress,
    firstName: firstName,
    lastName: lastName,
    role: userRole,
    isAdmin: userRole >= LocalUserRoles.AdminApprover,
    isAuthoriser: userRole >= LocalUserRoles.Approver,
  }
}

const parseApiAccountIdentifierTypeToLocalAccountIdentifierType = (
  accountIdentifierType: AccountIdentifierType,
): LocalAccountIdentifierType => {
  switch (accountIdentifierType) {
    case AccountIdentifierType.IBAN:
      return LocalAccountIdentifierType.IBAN
    case AccountIdentifierType.SCAN:
      return LocalAccountIdentifierType.SCAN
    default:
      return LocalAccountIdentifierType.IBAN
  }
}

const localAccountIdentifierTypeToRemoteAccountIdentifierType = (
  accountIdentifierType: LocalAccountIdentifierType,
): AccountIdentifierType => {
  switch (accountIdentifierType) {
    case LocalAccountIdentifierType.IBAN:
      return AccountIdentifierType.IBAN
    case LocalAccountIdentifierType.SCAN:
      return AccountIdentifierType.SCAN
    default:
      return AccountIdentifierType.IBAN
  }
}

const parseApiAccountIdentifierToLocalAccountIdentifier = (
  accountIdentifier: AccountIdentifier | undefined,
): LocalAccountIdentifier | undefined => {
  if (accountIdentifier) {
    return {
      type: parseApiAccountIdentifierTypeToLocalAccountIdentifierType(accountIdentifier.type),
      iban: accountIdentifier.iban ?? '',
      sortCode: accountIdentifier.sortCode,
      accountNumber: accountIdentifier.accountNumber,
      currency: accountIdentifier.currency,
    }
  } else {
    return undefined
  }
}

const localAccountIdentifierToRemoteAccountIdentifier = (
  accountIdentifier: LocalAccountIdentifier | undefined,
): AccountIdentifier | undefined => {
  if (accountIdentifier) {
    return {
      type: localAccountIdentifierTypeToRemoteAccountIdentifierType(accountIdentifier.type),
      iban: accountIdentifier.iban,
      sortCode: accountIdentifier.sortCode,
      accountNumber: accountIdentifier.accountNumber,
      currency: accountIdentifier.currency,
    }
  } else {
    return undefined
  }
}

const parseApiCounterPartyToLocalCounterParty = (counterParty: Counterparty): LocalCounterparty => {
  return {
    name: counterParty.name,
    identifier: parseApiAccountIdentifierToLocalAccountIdentifier(counterParty.identifier),
    accountInfo:
      counterParty.identifier?.type == AccountIdentifierType.IBAN
        ? counterParty.identifier.iban
        : counterParty.identifier?.type == AccountIdentifierType.SCAN
        ? `${counterParty.identifier.sortCode} - ${counterParty.identifier.accountNumber}`
        : '',
  }
}

const localCounterPartyToRemoteCounterParty = (counterParty: LocalCounterparty): Counterparty => {
  return {
    name: counterParty.name,
    identifier: localAccountIdentifierToRemoteAccountIdentifier(counterParty.identifier),
  }
}

const remoteTransactionsToLocal = (transactions: Transaction[]): LocalTransaction[] => {
  return transactions.map((transaction) => {
    return {
      id: transaction.id,
      date: new Date(transaction.transactionDate),
      accountName: transaction.accountName,
      counterParty: parseApiCounterPartyToLocalCounterParty(transaction.counterparty),
      amount: transaction.amount,
      currency: transaction.currency,
      balanceAfterTx: transaction.balance,
      reference:
        transaction.amount > 0
          ? transaction.yourReference
          : transaction.yourReference ?? transaction.description,
      description: transaction.description,
      type: TransactionTypeValue[transaction.type],
    }
  })
}

const remotePayoutToLocal = (payout: Payout, user?: User): LocalPayout => {
  return {
    id: payout.id,
    accountID: payout.accountID,
    merchantID: payout.merchantID,
    type: parseApiAccountIdentifierTypeToLocalAccountIdentifierType(payout.type),
    description: payout.description,
    currency: payout.currency,
    amount: payout.amount,
    yourReference: payout.yourReference,
    theirReference: payout.theirReference,
    status: payout.status,
    createdBy: payout.createdBy,
    inserted: payout.inserted,
    sourceAccountName: payout.sourceAccountName,
    sourceAccountNumber: payout.sourceAccountNumber,
    sourceAccountSortCode: payout.sourceAccountSortCode,
    sourceAccountIban: payout.sourceAccountIban,
    destination: payout.destination
      ? parseApiCounterPartyToLocalCounterParty(payout.destination)
      : undefined,
    tags: payout.tags.map((tag) => parseApiTagToLocalTag(tag)),
    scheduled: payout.scheduled,
    scheduleDate: payout.scheduleDate,
    beneficiaryID: payout.beneficiaryID,
    activities: user ? payoutToEventActivities(user, payout) : [],
  }
}

const remotePayoutsToLocal = (payouts: Payout[]): LocalPayout[] => {
  return payouts.map((payout) => {
    return remotePayoutToLocal(payout)
  })
}

const remoteAccountToLocalAccount = (remoteAccount: Account): LocalAccount => {
  const {
    id,
    merchantID,
    accountName,
    accountNumber,
    availableBalance,
    balance,
    currency,
    displayName,
    iban,
    sortCode,
    summary,
    identifier,
    isDefault,
  } = remoteAccount

  return {
    id: id,
    merchantID: merchantID,
    accountName: accountName,
    accountNumber: accountNumber,
    availableBalance: availableBalance,
    balance: balance,
    currency: currency,
    displayName: displayName,
    iban: iban,
    sortCode: sortCode,
    summary: summary,
    identifier: parseApiAccountIdentifierToLocalAccountIdentifier(identifier)!,
    isDefault: isDefault,
  }
}

const remoteAccountsToLocalAccounts = (remoteAccounts: Account[]): LocalAccount[] => {
  return remoteAccounts.map((remoteAccount) => {
    return remoteAccountToLocalAccount(remoteAccount)
  })
}

const remoteBeneficiaryToLocalBeneficiary = (remoteBeneficiary: Beneficiary): LocalBeneficiary => {
  const { id, merchantID, name, yourReference, theirReference, currency, destination } =
    remoteBeneficiary

  return {
    id: id,
    merchantID: merchantID,
    name: name,
    yourReference: yourReference,
    theirReference: theirReference,
    currency: currency,
    destination: parseApiCounterPartyToLocalCounterParty(destination),
  }
}

const remoteBeneficiariesToLocalBeneficiaries = (
  remoteBeneficiaries: Beneficiary[],
): LocalBeneficiary[] => {
  return remoteBeneficiaries.map((remoteBeneficiary) => {
    return remoteBeneficiaryToLocalBeneficiary(remoteBeneficiary)
  })
}

const payoutStatusToStatus = (
  status: PayoutStatus,
):
  | 'paid'
  | 'partial'
  | 'unpaid'
  | 'pending'
  | 'failed'
  | 'pending_approval'
  | 'inprogress'
  | 'scheduled'
  | null
  | undefined => {
  switch (status) {
    case PayoutStatus.PENDING_INPUT:
    case PayoutStatus.QUEUED:
    case PayoutStatus.QUEUED_UPSTREAM:
    case PayoutStatus.PENDING:
      return 'inprogress'
    case PayoutStatus.PROCESSED:
      return 'paid'
    case PayoutStatus.PENDING_APPROVAL:
      return 'pending_approval'
    case PayoutStatus.FAILED:
    case PayoutStatus.REJECTED:
      return 'failed'
    case PayoutStatus.SCHEDULED:
      return 'scheduled'
    default:
      return undefined
  }
}

const userStatusToStatus = (status: UserStatus) => {
  switch (status) {
    case UserStatus.Active:
      return 'active'
    case UserStatus.Invited:
      return 'invited'
    case UserStatus.RolePending:
      return 'role_pending'
  }
}

const userRoleToDisplay = (status: UserRoles) => {
  switch (status) {
    case UserRoles.AdminApprover:
      return 'Admin Approver'
    case UserRoles.Approver:
      return 'Approver'
    case UserRoles.NewlyRegistered:
      return 'Newly Registered'
    case UserRoles.User:
      return 'User'
    case UserRoles.PaymentRequestor:
      return 'Payment Requestor'
  }
}

const remoteAccountWithTransactionMetricsToLocalAccountWithTransactionMetrics = (
  remoteAccountsWithTransactionMetrics: AccountTransactionMetrics,
): LocalAccountWithTransactionMetrics => {
  const {
    accountID,
    accountName,
    balance,
    availableBalance,
    totalIncomingAmount,
    totalOutgoingAmount,
    numberOfTransactions,
    currency,
    numberOfIncomingTransactions,
    numberOfOutgoingTransactions,
  } = remoteAccountsWithTransactionMetrics

  return {
    accountID: accountID,
    accountName: accountName,
    balance: balance,
    availableBalance: availableBalance,
    totalIncomingAmount: totalIncomingAmount,
    totalOutgoingAmount: totalOutgoingAmount,
    numberOfTransactions: numberOfTransactions,
    currency: currency,
    numberOfIncomingTransactions: numberOfIncomingTransactions,
    numberOfOutgoingTransactions: numberOfOutgoingTransactions,
  }
}

const remoteAccountsWithTransactionMetricsToLocalAccountsWithTransactionMetrics = (
  remoteAccountsWithTransactionMetrics: AccountTransactionMetrics[],
): LocalAccountWithTransactionMetrics[] => {
  return remoteAccountsWithTransactionMetrics.map((remoteAccountWithTransactionMetrics) => {
    return remoteAccountWithTransactionMetricsToLocalAccountWithTransactionMetrics(
      remoteAccountWithTransactionMetrics,
    )
  })
}

const remoteTimeFrequencyToLocalTimeFrequency = (
  remoteTimeFrequency: TimeFrequencyEnum,
): LocalTimeFrequencyEnum => {
  switch (remoteTimeFrequency) {
    case TimeFrequencyEnum.Daily:
      return LocalTimeFrequencyEnum.Daily
    default:
      return LocalTimeFrequencyEnum.None
  }
}

const remoteAccountMetricsToLocalAccountMetrics = (
  remoteAccountMetrics: AccountMetrics,
): LocalAccountMetrics => {
  const {
    merchantID,
    currency,
    totalBalance,
    totalAvailableBalance,
    numberOfAccounts,
    periodicBalances,
    periodicBalancesFromDate,
    periodicBalancesToDate,
    periodicBalancesFrequency,
  } = remoteAccountMetrics

  return {
    merchantID: merchantID,
    currency: currency,
    totalBalance: totalBalance,
    totalAvailableBalance: totalAvailableBalance,
    numberOfAccounts: numberOfAccounts,
    periodicBalances: periodicBalances,
    periodicBalancesFromDate: periodicBalancesFromDate,
    periodicBalancesToDate: periodicBalancesToDate,
    periodicBalancesFrequency: remoteTimeFrequencyToLocalTimeFrequency(periodicBalancesFrequency),
  }
}

const periodicBalancesToChartPoints = (periodicBalances: LocalPeriodicBalance[]): ChartPoint[] => {
  return periodicBalances.map((periodicBalance) => {
    return {
      x: new Date(periodicBalance.balanceAt),
      y: periodicBalance.balance,
    }
  })
}

const remoteAccountMetricsArrayToLocalAccountMetricsArray = (
  remoteAccountMetrics: AccountMetrics[],
): LocalAccountMetrics[] => {
  return remoteAccountMetrics.map((remoteAccountMetric) => {
    return remoteAccountMetricsToLocalAccountMetrics(remoteAccountMetric)
  })
}

const parseApiUserRoleToLocalUserRole = (remoteUserRole: UserRoles | undefined): LocalUserRoles => {
  switch (remoteUserRole) {
    case UserRoles.User:
      return LocalUserRoles.User
    case UserRoles.Approver:
      return LocalUserRoles.Approver
    case UserRoles.AdminApprover:
      return LocalUserRoles.AdminApprover
    case UserRoles.PaymentRequestor:
      return LocalUserRoles.PaymentRequestor
    default:
      return LocalUserRoles.NewlyRegistered
  }
}

const payoutToEventActivities = (user: User, payout: Payout): PayoutActivity[] => {
  return payout.events
    ?.filter(
      (item) =>
        item?.eventType !== PayoutEventTypesEnum.Unknown &&
        item?.eventType !== PayoutEventTypesEnum.Webhook,
    )
    .map((payoutEvent) => {
      return payoutEventToActivity(user, payoutEvent, payout)
    })
}

const payoutEventToActivity = (
  user: User,
  payoutEvent: PayoutEvent,
  payout: Payout,
): PayoutActivity => {
  return {
    text: toActivityText(user, payoutEvent, payout),
    timestamp: new Date(payoutEvent.timestamp),
    status: payoutStatusToActivitySatus(payoutEvent.eventType),
    eventType: payoutEvent.eventType,
  }
}

const toActivityText = (user: User, event: PayoutEvent, payout: Payout): string => {
  const userName = user.id === event.userID ? 'you' : event.userName

  switch (event.eventType) {
    case PayoutEventTypesEnum.Created:
      return event.ruleName
        ? `Automatically created by ${event.ruleName}`
        : `Created by ${userName}`
    case PayoutEventTypesEnum.Edited:
      return `Edited by ${userName}`
    case PayoutEventTypesEnum.Authorise:
      return `Authorised by ${userName}`
    case PayoutEventTypesEnum.Initiate:
      return "Waiting for bank's authorisation"
    case PayoutEventTypesEnum.Queued:
      return "Submitted for bank's authorisation"
    case PayoutEventTypesEnum.Settle:
      return 'Successfully paid'
    case PayoutEventTypesEnum.Failure:
      return 'Failed'
    case PayoutEventTypesEnum.Scheduled:
      return `Scheduled for ${formatDateWithYear(
        payout.scheduleDate ? new Date(payout.scheduleDate) : new Date(),
      )}`
    default:
      return 'Unknown'
  }
}

const payoutStatusToActivitySatus = (status: PayoutEventTypesEnum): string => {
  switch (status) {
    case PayoutEventTypesEnum.Authorise:
    case PayoutEventTypesEnum.Scheduled:
      return ''
    case PayoutEventTypesEnum.Failure:
    case PayoutEventTypesEnum.Settle:
      return 'Processed'
    case PayoutEventTypesEnum.Initiate:
      return 'Queued upstream'
    case PayoutEventTypesEnum.Queued:
      return 'Queued'
    case PayoutEventTypesEnum.Created:
    case PayoutEventTypesEnum.Edited:
      return 'Pending authorisation'
    default:
      return ''
  }
}

const localInvoicesToRemoteInvoices = (
  localInvoicePayments: LocalInvoice[] | undefined,
): Invoice[] => {
  if (!localInvoicePayments) {
    return []
  }
  return localInvoicePayments.map((localInvoicePayment) => {
    return localInvoiceToRemoteInvoice(localInvoicePayment)
  })
}

const localInvoiceToRemoteInvoice = (localInvoicePayment: LocalInvoice): Invoice => {
  const {
    InvoiceNumber,
    PaymentTerms,
    InvoiceDate,
    DueDate,
    Contact,
    DestinationIban,
    DestinationAccountNumber,
    DestinationSortCode,
    Currency,
    Subtotal,
    Discounts,
    Taxes,
    TotalAmount,
    OutstandingAmount,
    InvoiceStatus,
    Reference,
    RemittanceEmail,
  } = localInvoicePayment

  return {
    invoiceNumber: InvoiceNumber,
    paymentTerms: PaymentTerms,
    invoiceDate: new Date(InvoiceDate),
    dueDate: new Date(DueDate),
    contact: Contact,
    destinationIban: DestinationIban ? DestinationIban : undefined,
    destinationAccountNumber: DestinationAccountNumber ? DestinationAccountNumber : undefined,
    destinationSortCode: DestinationSortCode ? DestinationSortCode : undefined,
    currency: Currency,
    subtotal: Subtotal ? parseFloat(Subtotal) : undefined,
    discounts: Discounts ? parseFloat(Discounts) : undefined,
    taxes: Taxes ? parseFloat(Taxes) : undefined,
    totalAmount: TotalAmount ? parseFloat(TotalAmount) : undefined,
    outstandingAmount: OutstandingAmount ? parseFloat(OutstandingAmount) : undefined,
    invoiceStatus: InvoiceStatus,
    reference: Reference,
    remittanceEmail: RemittanceEmail,
  }
}

export {
  localAccountIdentifierTypeToRemoteAccountIdentifierType,
  localCounterPartyToRemoteCounterParty,
  localInvoicesToRemoteInvoices,
  localInvoiceToRemoteInvoice,
  parseApiTagToLocalTag,
  parseApiUserRoleToLocalUserRole,
  parseApiUserToLocalUser,
  parseLocalTagToApiTag,
  payoutStatusToStatus,
  payoutToEventActivities,
  periodicBalancesToChartPoints,
  remoteAccountMetricsArrayToLocalAccountMetricsArray,
  remoteAccountsToLocalAccounts,
  remoteAccountsWithTransactionMetricsToLocalAccountsWithTransactionMetrics,
  remoteBeneficiariesToLocalBeneficiaries,
  remoteBeneficiaryToLocalBeneficiary,
  remotePaymentRequestToLocalPaymentRequest,
  remotePayoutsToLocal,
  remotePayoutToLocal,
  remoteTransactionsToLocal,
  userRoleToDisplay,
  userStatusToStatus,
}
