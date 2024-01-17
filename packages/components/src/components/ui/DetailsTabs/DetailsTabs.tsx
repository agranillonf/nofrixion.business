import * as Tabs from '@radix-ui/react-tabs'
import classNames from 'classnames'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { useState } from 'react'

import { LocalPaymentMethodTypes } from '../../../types/LocalEnums'
import { LocalPaymentAttempt, LocalPaymentRequest } from '../../../types/LocalTypes'
import PaymentAttemptsList from '../PaymentAttemptsList/PaymentAttemptsList'
import PaymentInfo from '../PaymentInfo/PaymentInfo'
import ScrollArea from '../ScrollArea/ScrollArea'

const tabs = ['Payment attempts', 'Payment info']

interface TabProps {
  value: string
  selectedTab: string
  children: React.ReactNode
}

const TabContent: React.FC<TabProps> = ({ value, selectedTab, children }) => {
  return (
    <AnimatePresence>
      <Tabs.Content asChild value={value}>
        <motion.div
          key={selectedTab}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
        >
          {children}
        </motion.div>
      </Tabs.Content>
    </AnimatePresence>
  )
}

// Get type of classnames
const underlineClasses = 'w-full h-px absolute bottom-0'

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
  const [selectedTab, setSelectedTab] = useState(tabs[0])

  return (
    <MotionConfig transition={{ ease: 'easeInOut' }}>
      <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
        <Tabs.List className="flex mb-6 lg:mb-11" aria-label="Explore Payment Request Details">
          {tabs.map((tab) => {
            return (
              <Tabs.Trigger
                key={tab}
                className="relative w-full h-10 select-none text-sm/6 text-grey-text transition hover:text-default-text data-[state=active]:text-default-text"
                value={tab}
              >
                {tab}

                {selectedTab == tab ? (
                  <motion.div
                    layoutId="underline"
                    className={classNames(underlineClasses, 'bg-primary-green z-10')}
                  />
                ) : (
                  <div className={classNames(underlineClasses, 'bg-border-grey')} />
                )}

                {/* 
                  Underline for when the animation is happening
                  so that the underline doesn't disappear
                */}
                <div className={classNames(underlineClasses, 'bg-border-grey')} />
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>
        <TabContent value={tabs[0]} selectedTab={selectedTab}>
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
                    x.pispAuthorisationFailedAt ||
                    x.paymentMethod === LocalPaymentMethodTypes.Lightning,
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
        </TabContent>
        <TabContent value={tabs[1]} selectedTab={selectedTab}>
          <PaymentInfo {...paymentRequest} />
        </TabContent>
      </Tabs.Root>
    </MotionConfig>
  )
}

export default DetailsTabs
