import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'

import { LocalInvoice, SystemError } from '../../../../types/LocalTypes'
import { Button } from '../../atoms'
import { Icon } from '../../atoms/Icon/Icon'
import { Loader } from '../../Loader/Loader'
import ImportInvoiceModal from '../../Modals/ImportInvoiceModal/ImportInvoiceModal'
import SystemErrorModal from '../../Modals/SystemErrorModal/SystemErrorModal'
import AnimatedTabs from '../../molecules/AnimatedTabs/AnimatedTabs'
import { Toaster } from '../../Toast/Toast'
import LayoutWrapper from '../../utils/LayoutWrapper'
import { PayoutDashboard, PayoutDashboardProps } from '../PayoutDashboard/PayoutDashboard'
import { PayrunDashboard, PayrunDashboardProps } from '../PayrunDashboard/PayrunDashboard'
import payrunEmptyState from './assets/payrun-empty-state.svg'

export interface AccountsPayableDashboardProps {
  systemError?: SystemError
  isSystemErrorOpen?: boolean
  onCloseSystemError?: () => void
  onCreatePayout: () => void
  onApproveBatchPayouts: () => void
  payoutProps: PayoutDashboardProps
  payrunProps: PayrunDashboardProps
  onImportInvoices: (invoices: LocalInvoice[]) => void
  isImportInvoiceModalOpen: boolean
  setIsImportInvoiceModalOpen: (isOpen: boolean) => void
}

interface PayrunsEmptyStateProps {
  onImportPaymentsFileClick?: () => void
}

const PayrunsEmptyState: React.FC<PayrunsEmptyStateProps> = ({ onImportPaymentsFileClick }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 lg:bg-white rounded-lg">
      <img src={payrunEmptyState} className="mb-12 md:h-48" alt="Payrun empty state graphic" />

      <span className="text-2xl font-semibold mb-6">Create your first payrun</span>

      <div className="text-sm/6 text-grey-text mb-12">
        <p>Automatically organise supplier payments from your invoices</p>
        <p>Combine multiple invoices into single payouts, and authorise them all at once.</p>
      </div>

      <Button
        variant="primary"
        size="medium"
        className="w-64 md:w-auto"
        onClick={onImportPaymentsFileClick}
      >
        <Icon name="import/16" className="mr-2" />
        Import payments file
      </Button>
    </div>
  )
}

enum TabValues {
  PAYOUTS = 'payouts',
  PAYRUNS = 'payruns',
}

const tabs = {
  [TabValues.PAYOUTS]: 'Payouts',
  [TabValues.PAYRUNS]: 'Payruns',
}

const AccountsPayableDashboard: React.FC<AccountsPayableDashboardProps> = ({
  systemError,
  isSystemErrorOpen = false,
  onCloseSystemError,
  onCreatePayout,
  onApproveBatchPayouts,
  payoutProps,
  payrunProps,
  onImportInvoices,
  isImportInvoiceModalOpen,
  setIsImportInvoiceModalOpen,
}) => {
  const [isApproveButtonDisabled, setIsApproveButtonDisabled] = useState(false)
  const [currentTab, setCurrentTab] = useState<TabValues>(TabValues.PAYOUTS)

  const handlOnCloseSystemErrorModal = () => {
    if (onCloseSystemError) {
      onCloseSystemError()
    }
  }

  const onTabChange = (tab: TabValues) => {
    setCurrentTab(tab)
  }

  const onImportPaymentsFileClick = () => {
    setIsImportInvoiceModalOpen(true)
  }

  const handleApproveBatchPayouts = async () => {
    setIsApproveButtonDisabled(true)
    onApproveBatchPayouts()
  }

  return (
    <div className="font-inter bg-main-grey text-default-text h-full">
      <div className="flex gap-8 justify-between items-center mb-8 md:mb-9 md:px-4 h-12">
        <span className="leading-8 font-semibold text-2xl md:text-[1.75rem]">Accounts payable</span>

        <div className="flex">
          {payoutProps.isUserAuthoriser && (
            <div className="mr-4">
              <AnimatePresence>
                {currentTab == tabs.payouts &&
                  payoutProps.selectedPayouts &&
                  payoutProps.selectedPayouts.length > 1 && (
                    <LayoutWrapper layout={'preserve-aspect'}>
                      <Button
                        variant={'secondary'}
                        size="large"
                        onClick={handleApproveBatchPayouts}
                        className="space-x-2 w-fit h-10 md:w-full md:h-full transition-all ease-in-out duration-200 disabled:!bg-grey-text disabled:!opacity-100 disabled:cursor-not-allowed"
                        disabled={isApproveButtonDisabled}
                      >
                        {isApproveButtonDisabled ? (
                          <Loader className="h-6 w-6 mx-[77px]" />
                        ) : (
                          <>
                            <Icon name="authorise/16" />
                            <span className="hidden md:inline-block">
                              Authorise {payoutProps.selectedPayouts.length} pending
                            </span>
                          </>
                        )}
                      </Button>
                    </LayoutWrapper>
                  )}
              </AnimatePresence>
            </div>
          )}
          {!(currentTab === tabs.payruns && payrunProps.payruns?.length === 0) && (
            <Button
              size="large"
              onClick={() =>
                currentTab == tabs.payouts ? onCreatePayout() : setIsImportInvoiceModalOpen(true)
              }
              className="w-10 h-10 md:w-full md:h-full"
            >
              <span className="hidden md:inline-block">
                {currentTab == tabs.payouts ? 'Create payout' : 'Create payrun'}
              </span>
              <Icon name="add/16" className="md:hidden" />
            </Button>
          )}
        </div>
      </div>
      <AnimatedTabs
        onTabChange={(tab) => onTabChange(tab as TabValues)}
        fullWidthTabs={false}
        className="lg:mb-6"
        tabs={[
          {
            icon: 'outgoing/16',
            title: tabs.payouts,
            content: <PayoutDashboard {...payoutProps} />,
          },
          {
            icon: 'payrun/16',
            title: tabs.payruns,
            content:
              payrunProps.payruns && payrunProps.payruns.length > 0 ? (
                <PayrunDashboard {...payrunProps} />
              ) : (
                <PayrunsEmptyState onImportPaymentsFileClick={onImportPaymentsFileClick} />
              ),
          },
        ]}
      />

      <SystemErrorModal
        open={isSystemErrorOpen}
        title={systemError?.title}
        message={systemError?.message}
        onDismiss={handlOnCloseSystemErrorModal}
      />

      <Toaster positionY="top" positionX="right" duration={3000} />

      <ImportInvoiceModal
        isOpen={isImportInvoiceModalOpen}
        onClose={() => setIsImportInvoiceModalOpen(false)}
        onImport={onImportInvoices}
      />
    </div>
  )
}

export { AccountsPayableDashboard }
