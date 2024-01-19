import { LocalPaymentMethodTypes } from '../../../types/LocalEnums'
import CopyLinkButton from '../CopyLinkButton/CopyLinkButton'
import StatusList from '../StatusList/StatusList'

export interface PaymentRequestAttemptsCellProps {
  successfulAttemptsCount: number
  pendingAttemptsCount: number
  failedAttemptsCount: number
  hostedPaymentLink: string
  paymentMethod: LocalPaymentMethodTypes
}

const getPaymentMethodName = (paymentMethod: LocalPaymentMethodTypes): string => {
  switch (paymentMethod) {
    case LocalPaymentMethodTypes.Card:
      return 'card '
    case LocalPaymentMethodTypes.Pisp:
      return 'bank '
    case LocalPaymentMethodTypes.Lightning:
      return 'bitcoin '
    default:
      return ''
  }
}

const getSuccessStatusMessage = (
  successfulAttemptsCount: number,
  pendingAttemptsCount: number,
  failedAttemptsCount: number,
  paymentMethod: LocalPaymentMethodTypes,
): string => {
  if (successfulAttemptsCount > 0) {
    if (
      successfulAttemptsCount ===
      successfulAttemptsCount + pendingAttemptsCount + failedAttemptsCount
    ) {
      return `${successfulAttemptsCount} ${getPaymentMethodName(paymentMethod)} payment${
        successfulAttemptsCount > 1 ? 's' : ''
      } received`
    }

    return `${successfulAttemptsCount} received`
  }

  return ''
}

const getPendingStatusMessage = (
  successfulAttemptsCount: number,
  pendingAttemptsCount: number,
  failedAttemptsCount: number,
  paymentMethod: LocalPaymentMethodTypes,
): string => {
  if (pendingAttemptsCount > 0) {
    if (
      pendingAttemptsCount ===
      successfulAttemptsCount + pendingAttemptsCount + failedAttemptsCount
    ) {
      return `${pendingAttemptsCount} ${getPaymentMethodName(paymentMethod)} payment${
        pendingAttemptsCount > 1 ? 's' : ''
      } in progress`
    }

    return `${pendingAttemptsCount} in progress`
  }

  return ''
}

const getFailureStatusMessage = (
  successfulAttemptsCount: number,
  pendingAttemptsCount: number,
  failedAttemptsCount: number,
  paymentMethod: LocalPaymentMethodTypes,
): string => {
  if (failedAttemptsCount > 0) {
    if (
      failedAttemptsCount ===
      successfulAttemptsCount + pendingAttemptsCount + failedAttemptsCount
    ) {
      return `${failedAttemptsCount} ${getPaymentMethodName(paymentMethod)} payment${
        failedAttemptsCount > 1 ? 's' : ''
      } failed`
    }

    return `${failedAttemptsCount} failed`
  }

  return ''
}

const PaymentRequestAttemptsCell: React.FC<PaymentRequestAttemptsCellProps> = ({
  successfulAttemptsCount,
  pendingAttemptsCount,
  failedAttemptsCount,
  hostedPaymentLink,
  paymentMethod,
}) => {
  return (
    <div className="flex items-center space-x-3">
      {successfulAttemptsCount + pendingAttemptsCount + failedAttemptsCount > 0 ? (
        <StatusList
          successStatusMessage={getSuccessStatusMessage(
            successfulAttemptsCount,
            pendingAttemptsCount,
            failedAttemptsCount,
            paymentMethod,
          )}
          pendingStatusMessage={getPendingStatusMessage(
            successfulAttemptsCount,
            pendingAttemptsCount,
            failedAttemptsCount,
            paymentMethod,
          )}
          failureStatusMessage={getFailureStatusMessage(
            successfulAttemptsCount,
            pendingAttemptsCount,
            failedAttemptsCount,
            paymentMethod,
          )}
        />
      ) : (
        <>
          <span className="text-13px text-default-text font-normal">No payments yet</span>
          <CopyLinkButton link={hostedPaymentLink} variant="filled" />
        </>
      )}
    </div>
  )
}

export default PaymentRequestAttemptsCell
