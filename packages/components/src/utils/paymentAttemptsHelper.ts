import { PaymentRequestPaymentAttempt, PaymentResult } from '@nofrixion/moneymoov'

import {
  LocalPaymentAttemptStatus,
  LocalPaymentMethodTypes,
  SubTransactionType,
} from '../types/LocalEnums'
import { LocalPaymentAttempt, LocalSettledTransaction, SubTransaction } from '../types/LocalTypes'

export const getMaxCapturableAmount = (paymentAttempt: LocalPaymentAttempt): number => {
  return (
    getAmountReceived(paymentAttempt) -
    getAmountCaptured(paymentAttempt) -
    getCardAmountVoided(paymentAttempt)
  )
}

export const hasRefundOrCaptureAttempts = (paymentAttempt: LocalPaymentAttempt): boolean => {
  return paymentAttempt.captureAttempts.length > 0 || paymentAttempt.refundAttempts.length > 0
}

/**
 * Checks if a payment attempt is refundable. A payment attempt is refundable if the amount paid is greater than the amount refunded.
 * @param paymentAttempt
 * @returns True if the payment attempt is refundable, false otherwise.
 */
export const isRefundable = (paymentAttempt: LocalPaymentAttempt): boolean => {
  return getMaxRefundableAmount(paymentAttempt) > 0
}

/**
 * Determines if a card payment attempt is refundable or voidable.
 * @param paymentAttempt
 * @returns True if the payment attempt is voidable, false otherwise.
 */
export const isVoid = (paymentAttempt: LocalPaymentAttempt | undefined): boolean => {
  if (paymentAttempt === undefined) {
    return false
  } else {
    return (
      getAmountReceived(paymentAttempt) > 0 &&
      paymentAttempt.captureAttempts.length === 0 &&
      paymentAttempt.refundAttempts.length === 0
    )
  }
}

/**
 * Checks if a payment attempt is captureable. A payment attempt is captureable if the payment method is card and the amount paid is greater than the amount captured.
 * @param paymentAttempt
 * @returns True if the payment attempt is captureable, false otherwise.
 */
export const isCaptureable = (paymentAttempt: LocalPaymentAttempt): boolean => {
  if (paymentAttempt.paymentMethod !== LocalPaymentMethodTypes.Card) {
    return false
  }
  return getMaxCapturableAmount(paymentAttempt) > 0
}

/**
 * Gets the subtransactions of a payment attempt. A subtransaction is a capture or refund attempt. The subtransactions are sorted by date in descending order.
 * @param paymentAttempt
 * @returns The subtransactions of a payment attempt.
 */
export const getSubTransactions = (paymentAttempt: LocalPaymentAttempt): SubTransaction[] => {
  const subtransactions: SubTransaction[] = [
    ...paymentAttempt.captureAttempts.map(({ capturedAt, capturedAmount }) => ({
      occurredAt: capturedAt,
      amount: capturedAmount,
      currency: paymentAttempt.currency,
      type: SubTransactionType.Capture,
    })),
    ...paymentAttempt.refundAttempts
      .filter((x) => x.isCardVoid === false)
      .map(
        ({
          refundSettledAt,
          refundSettledAmount,
          refundInitiatedAmount,
          refundInitiatedAt,
          refundCancelledAt,
        }) => ({
          occurredAt: refundSettledAt ?? refundInitiatedAt,
          amount: refundSettledAmount > 0 ? refundSettledAmount : refundInitiatedAmount,
          currency: paymentAttempt.currency,
          type: SubTransactionType.Refund,
          awaitingApproval: refundSettledAt === undefined && refundInitiatedAt !== undefined,
          cancelled: refundCancelledAt !== undefined && refundSettledAt === undefined,
        }),
      ),
    ...paymentAttempt.refundAttempts
      .filter((x) => x.isCardVoid)
      .map(({ refundSettledAt, refundSettledAmount }) => ({
        occurredAt: refundSettledAt,
        amount: refundSettledAmount,
        currency: paymentAttempt.currency,
        type: SubTransactionType.Void,
      })),
  ]

  return subtransactions.sort((a, b) => {
    return new Date(b.occurredAt ?? 0).getTime() - new Date(a.occurredAt ?? 0).getTime()
  })
}

/**
 * Checks if a payment attempt is partially refundable. A payment attempt is partially refundable
 * if the payment request is authorise only and the no captures have been made.In this case the card
 * is voided which does not allow partial voids.
 * @param paymentAttempt
 * @returns True if the payment attempt is partially refundable, false otherwise.
 */
export const isPartialCardRefundPossible = (
  paymentAttempt: LocalPaymentAttempt | undefined,
): boolean => {
  if (paymentAttempt === undefined) {
    return false
  } else {
    return (
      paymentAttempt.paymentMethod === LocalPaymentMethodTypes.Card &&
      paymentAttempt.cardAuthorisedAmount != null &&
      paymentAttempt.cardAuthorisedAmount > 0 &&
      getAmountCaptured(paymentAttempt) > 0
    )
  }
}

export const getAmountPaid = (paymentAttempt: LocalPaymentAttempt): number => {
  return getAmountReceived(paymentAttempt) - getAmountRefunded(paymentAttempt)
}

export const getAmountReceived = (paymentAttempt: LocalPaymentAttempt): number => {
  switch (paymentAttempt.paymentMethod) {
    case LocalPaymentMethodTypes.Card:
      return paymentAttempt.cardAuthorisedAmount && paymentAttempt.cardAuthorisedAmount > 0 // This is just so prod doesn't break. Need to remove this logic and use only cardAuthorisedAmount after API prod deployment.
        ? paymentAttempt.cardAuthorisedAmount
        : paymentAttempt.authorisedAmount
    case LocalPaymentMethodTypes.Pisp:
      return paymentAttempt.settledAmount
    default:
      return 0
  }
}

export const getAmountRefunded = (paymentAttempt: LocalPaymentAttempt): number => {
  return paymentAttempt.refundAttempts.reduce((acc, curr) => acc + curr.refundSettledAmount, 0)
}

export const getCardAmountRefunded = (paymentAttempt: LocalPaymentAttempt): number => {
  return paymentAttempt.refundAttempts
    .filter((x) => x.isCardVoid === false)
    .reduce((acc, curr) => acc + curr.refundSettledAmount, 0)
}

export const getCardAmountVoided = (paymentAttempt: LocalPaymentAttempt): number => {
  return paymentAttempt.refundAttempts
    .filter((x) => x.isCardVoid === true)
    .reduce((acc, curr) => acc + curr.refundSettledAmount, 0)
}

export const getAmountCaptured = (paymentAttempt: LocalPaymentAttempt): number => {
  return paymentAttempt.captureAttempts.reduce((acc, curr) => acc + curr.capturedAmount, 0)
}

export const getPispRefundInitiatedAmount = (paymentAttempt: LocalPaymentAttempt): number => {
  return paymentAttempt.refundAttempts
    .filter((x) => x.refundSettledAt === undefined)
    .reduce((acc, curr) => acc + curr.refundInitiatedAmount, 0)
}

/**
 * Calculates the maximum amount that can be refunded in a payment request. It is the sum of amount received minus amount captured.
 * @param paymentAttempts
 * @returns The maximum amount that can be refunded in a payment request.
 */
export const getMaxRefundableAmount = (paymentAttempt: LocalPaymentAttempt): number => {
  switch (paymentAttempt.paymentMethod) {
    case LocalPaymentMethodTypes.Card:
      return getAmountCaptured(paymentAttempt) - getCardAmountRefunded(paymentAttempt)
    case LocalPaymentMethodTypes.Pisp:
      return getAmountPaid(paymentAttempt) - getPispRefundInitiatedAmount(paymentAttempt)
    default:
      return 0
  }
}

export const getSettledTransactions = (
  paymentAttempts: LocalPaymentAttempt[],
): LocalSettledTransaction[] => {
  const settledTransactions: LocalSettledTransaction[] = []

  paymentAttempts
    .filter((x) => x.settledAmount > 0 || (x.cardAuthorisedAmount && x.cardAuthorisedAmount > 0))
    .forEach((paymentAttempt) => {
      settledTransactions.push({
        settledAt: paymentAttempt.occurredAt,
        amount: getAmountReceived(paymentAttempt),
        currency: paymentAttempt.currency,
        paymentMethod: paymentAttempt.paymentMethod,
        processor: paymentAttempt.paymentProcessor,
        isRefund: false,
        wallet: paymentAttempt.wallet,
      })

      paymentAttempt.refundAttempts.length > 0 &&
        paymentAttempt.refundAttempts.forEach((refundAttempt) => {
          settledTransactions.push({
            settledAt: refundAttempt.refundSettledAt,
            amount: refundAttempt.refundSettledAmount,
            currency: paymentAttempt.currency,
            paymentMethod: paymentAttempt.paymentMethod,
            processor: paymentAttempt.paymentProcessor,
            isRefund: true,
          })
        })
    })

  return settledTransactions.sort((a, b) => {
    return new Date(b.settledAt ?? 0).getTime() - new Date(a.settledAt ?? 0).getTime()
  })
}

export const getStatusIconName = (
  paymentMethod: LocalPaymentMethodTypes,
  status: LocalPaymentAttemptStatus,
):
  | 'cardAuthorised/28'
  | 'cardPaid/28'
  | 'cardVoided/28'
  | 'cardRefunded/28'
  | 'cardFailed/28'
  | 'cardInProgress/28'
  | 'bankPaid/28'
  | 'bankRefunded/28'
  | 'bankFailed/28'
  | 'bankInProgress/28'
  | undefined => {
  if (paymentMethod === LocalPaymentMethodTypes.Card) {
    switch (status) {
      case LocalPaymentAttemptStatus.Authorised:
        return 'cardAuthorised/28'
      case LocalPaymentAttemptStatus.Received:
        return 'cardPaid/28'
      case LocalPaymentAttemptStatus.Voided:
        return 'cardVoided/28'
      case LocalPaymentAttemptStatus.Refunded:
        return 'cardRefunded/28'
      case LocalPaymentAttemptStatus.PartiallyRefunded:
        return 'cardRefunded/28'
      case LocalPaymentAttemptStatus.Failed:
        return 'cardFailed/28'
      case LocalPaymentAttemptStatus.InProgress:
        return 'cardInProgress/28'
      default:
        return 'cardInProgress/28'
    }
  }

  if (paymentMethod === LocalPaymentMethodTypes.Pisp) {
    switch (status) {
      case LocalPaymentAttemptStatus.Received:
        return 'bankPaid/28'
      case LocalPaymentAttemptStatus.Refunded:
        return 'bankRefunded/28'
      case LocalPaymentAttemptStatus.PartiallyRefunded:
        return 'bankRefunded/28'
      case LocalPaymentAttemptStatus.Failed:
        return 'bankFailed/28'
      case LocalPaymentAttemptStatus.InProgress:
        return 'bankInProgress/28'
      default:
        return 'bankInProgress/28'
    }
  }
}

export const getPaymentAttemptStatus = (
  remotePaymentAttempt: PaymentRequestPaymentAttempt,
): LocalPaymentAttemptStatus => {
  if (
    remotePaymentAttempt.refundAttempts.find((x) => x.refundSettledAt && x.isCardVoid) &&
    remotePaymentAttempt.status === PaymentResult.None
  ) {
    return LocalPaymentAttemptStatus.Voided
  }

  if (
    remotePaymentAttempt.refundAttempts.find((x) => x.refundSettledAt) &&
    remotePaymentAttempt.status === PaymentResult.PartiallyPaid
  ) {
    return LocalPaymentAttemptStatus.PartiallyRefunded
  }

  if (
    remotePaymentAttempt.refundAttempts.find((x) => x.refundSettledAt) &&
    remotePaymentAttempt.status === PaymentResult.None
  ) {
    return LocalPaymentAttemptStatus.Refunded
  }

  if (remotePaymentAttempt.settledAt || remotePaymentAttempt.cardAuthorisedAt) {
    return LocalPaymentAttemptStatus.Received
  }

  if (
    remotePaymentAttempt.status === PaymentResult.None &&
    (remotePaymentAttempt.settleFailedAt ||
      remotePaymentAttempt.cardAuthoriseFailedAt ||
      remotePaymentAttempt.cardPayerAuthenticationSetupFailedAt ||
      remotePaymentAttempt.pispAuthorisationFailedAt)
  ) {
    return LocalPaymentAttemptStatus.Failed
  }

  if (
    remotePaymentAttempt.status === PaymentResult.Authorized ||
    remotePaymentAttempt.initiatedAt
  ) {
    return LocalPaymentAttemptStatus.InProgress
  }

  return LocalPaymentAttemptStatus.InProgress
}
