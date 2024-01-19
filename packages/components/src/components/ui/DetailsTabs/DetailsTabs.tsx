import { LocalPaymentAttempt, LocalPaymentRequest } from '../../../types/LocalTypes'
import AnimatedTabs from '../molecules/AnimatedTabs/AnimatedTabs'
import PaymentAttemptsList from '../PaymentAttemptsList/PaymentAttemptsList'
import PaymentInfo from '../PaymentInfo/PaymentInfo'
import ScrollArea from '../ScrollArea/ScrollArea'

export interface DetailsTabsProps {
  paymentRequest: LocalPaymentRequest
  onRefund: (paymentAttempt: LocalPaymentAttempt) => void
  onVoid: (paymentAttempt: LocalPaymentAttempt) => void
  onCapture: (paymentAttempt: LocalPaymentAttempt) => void
}

const DetailsTabs: React.FC<DetailsTabsProps> = ({
  paymentRequest,
  onRefund,
  onVoid,
  onCapture,
}) => {
  return (
    <AnimatedTabs
      tabs={[
        {
          title: 'Payment attempts',
          content: (
            <ScrollArea>
              <PaymentAttemptsList
                paymentAttempts={paymentRequest.paymentAttempts
                  .filter(
                    (x) =>
                      x.cardAuthorisedAt ||
                      x.authorisedAt ||
                      x.settledAt ||
                      x.cardPayerAuthenticationSetupFailedAt ||
                      x.cardAuthoriseFailedAt ||
                      x.settleFailedAt ||
                      x.pispAuthorisationFailedAt,
                  )
                  .sort((a, b) => {
                    return (
                      new Date(b.latestEventOccurredAt ?? 0).getTime() -
                      new Date(a.latestEventOccurredAt ?? 0).getTime()
                    )
                  })}
                cardAuthoriseOnly={!paymentRequest.captureFunds}
                onRefund={onRefund}
                onVoid={onVoid}
                onCapture={onCapture}
              ></PaymentAttemptsList>
            </ScrollArea>
          ),
        },
        {
          title: 'Payment info',
          content: <PaymentInfo {...paymentRequest} />,
        },
      ]}
    />
  )
}

export default DetailsTabs
