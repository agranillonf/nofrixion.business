import { Currency } from '@nofrixion/moneymoov'
import { AnimatePresence } from 'framer-motion'
import { Fragment, useState } from 'react'

import { LocalPaymentMethodTypes } from '../../../types/LocalEnums'
import { LocalPaymentAttempt } from '../../../types/LocalTypes'
import { cn } from '../../../utils'
import {
  getAmountRefunded,
  getStatusIconName,
  isCaptureable,
  isRefundable,
  isVoid,
} from '../../../utils/paymentAttemptsHelper'
import { Button, Icon } from '../atoms'
import PaymentAttemptEventsList from '../PaymentAttemptEventsList/PaymentAttemptEventsList'
import AnimateHeightWrapper from '../utils/AnimateHeight'

export interface PaymentAttemptProps {
  paymentAttempt: LocalPaymentAttempt
  cardAuthoriseOnly: boolean
  onRefund: (paymentAttempt: LocalPaymentAttempt) => void
  onVoid: (paymentAttempt: LocalPaymentAttempt) => void
  onCapture: (paymentAttempt: LocalPaymentAttempt) => void
  className?: string
  key: number | undefined
}

const PaymentAttempt = ({
  paymentAttempt,
  onRefund,
  onVoid,
  onCapture,
  className,
}: PaymentAttemptProps) => {
  const formatter = new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const statusIconName = getStatusIconName(
    paymentAttempt.paymentMethod,
    paymentAttempt.displayStatus,
  )

  const [isExpanded, setIsExpanded] = useState(false)

  const refundedAmount = getAmountRefunded(paymentAttempt)
  return (
    <Fragment>
      <div
        className={cn('w-full', className)}
        onKeyDown={() => setIsExpanded((prev) => !prev)}
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="group whitespace-nowrap flex flex-row items-center">
          <div className="flex flex-row items-center w-44 mr-4">
            <span className="mr-2">{statusIconName && <Icon name={statusIconName} />}</span>
            <span className="text-[0.813rem] leading-6">{paymentAttempt.displayStatus}</span>
          </div>
          <div className="w-[5.938rem]">
            <div className="flex flex-row gap-2">
              {paymentAttempt.amount > 0 && (
                <span className="text-sm font-medium leading-6 tabular-nums">
                  {paymentAttempt.currency === Currency.EUR ? '€' : '£'}
                  {formatter.format(Number(paymentAttempt.amount))}
                </span>
              )}
              {refundedAmount > 0 && !paymentAttempt.refundAttempts.find((x) => x.isCardVoid) && (
                <span className="text-[0.688rem] font-normal leading-6 tabular-nums text-grey-text">
                  <span>{'('}</span>
                  {paymentAttempt.currency === Currency.EUR ? '€' : '£'}
                  {formatter.format(Number(getAmountRefunded(paymentAttempt)))}
                  <span>{' refunded)'}</span>
                </span>
              )}
            </div>
          </div>

          <div className="w-[13.778] flex flex-row items-center gap-2 ml-auto">
            <div className="flex gap-2">
              {isCaptureable(paymentAttempt) && (
                <Button
                  variant="primary"
                  size="x-small"
                  className="px-2 w-min"
                  onClick={(e) => {
                    onCapture(paymentAttempt)
                    e.stopPropagation()
                  }}
                >
                  Capture
                </Button>
              )}
              {isRefundable(paymentAttempt) && (
                <Button
                  variant="secondary"
                  size="x-small"
                  className="px-2 w-min"
                  onClick={(e) => {
                    onRefund(paymentAttempt)
                    e.stopPropagation()
                  }}
                >
                  <div className="flex flex-row gap-2 items-center">
                    <Icon name="return/12" />
                    <span>Refund</span>
                  </div>
                </Button>
              )}
              {paymentAttempt.paymentMethod === LocalPaymentMethodTypes.Card &&
                isVoid(paymentAttempt) && (
                  <Button
                    variant="secondary"
                    size="x-small"
                    className="px-2 w-min"
                    onClick={(e) => {
                      onVoid(paymentAttempt)
                      e.stopPropagation()
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <Icon name="void/12" />
                      <span>Void</span>
                    </div>
                  </Button>
                )}
            </div>
            {paymentAttempt.events &&
              paymentAttempt.events.length > 0 &&
              (isExpanded === false ? <Icon name="arrow-down/12" /> : <Icon name="arrow-up/12" />)}
          </div>
        </div>
        <AnimatePresence>
          {isExpanded && (
            <AnimateHeightWrapper layoutId={`${paymentAttempt.attemptKey}`}>
              {paymentAttempt.events && paymentAttempt.events.length > 0 && (
                <PaymentAttemptEventsList
                  paymentAttemptEvents={paymentAttempt.events}
                  className="pt-1"
                />
              )}
            </AnimateHeightWrapper>
          )}
        </AnimatePresence>
      </div>
    </Fragment>
  )
}

export default PaymentAttempt
