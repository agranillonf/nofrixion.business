import { ApiError, Currency } from '@nofrixion/moneymoov'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import {
  LocalAccount,
  LocalCounterparty,
  LocalPaymentAttempt,
  LocalPaymentRequest,
  SystemError,
} from '../../../types/LocalTypes'
import { localCurrency } from '../../../utils/constants'
import { formatAmount } from '../../../utils/formatters'
import { getMaxRefundableAmount } from '../../../utils/paymentAttemptsHelper'
import { formatCurrency } from '../../../utils/uiFormaters'
import { Button, Icon, Sheet, SheetContent } from '../atoms'
import InlineError from '../InlineError/InlineError'
import InputAmountField from '../InputAmountField/InputAmountField'
import { Loader } from '../Loader/Loader'
import { SelectAccount } from '../molecules/Select/SelectAccount/SelectAccount'

export interface BankRefundModalProps {
  onRefund: (
    sourceAccount: LocalAccount,
    counterParty: LocalCounterparty,
    amount: number,
    paymentInitiationID: string,
  ) => Promise<ApiError | undefined>
  onDismiss: () => void
  accounts: LocalAccount[]
  bankPaymentAttempt: LocalPaymentAttempt | undefined
  paymentRequest: LocalPaymentRequest | undefined
}

const BankRefundModal: React.FC<BankRefundModalProps> = ({
  onRefund,
  onDismiss,
  accounts,
  bankPaymentAttempt,
  paymentRequest,
}) => {
  const [isRefundButtonDisabled, setIsRefundButtonDisabled] = useState(false)
  const [validationErrorMessage, setValidationErrorMessage] = useState('')
  const maxRefundableAmount = bankPaymentAttempt ? getMaxRefundableAmount(bankPaymentAttempt) : 0
  const [amountToRefund, setAmountToRefund] = useState(
    bankPaymentAttempt ? maxRefundableAmount.toString() : '',
  )
  const counterParty = paymentRequest?.transactions?.find(
    (t) => t.id === bankPaymentAttempt?.reconciledTransactionID,
  )?.counterParty

  const defaultSourceAccount = accounts?.find((a) => a.id === paymentRequest?.pispAccountID)
  const formatter = new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const [selectedAccount, setSelectedAccount] = useState<LocalAccount>(
    defaultSourceAccount ? defaultSourceAccount : accounts[0],
  )

  const [showRefundError, setShowRefundError] = useState(false)
  const [bankRefundError, setBankRefundError] = useState<SystemError | undefined>(undefined)

  const getCurrencySymbol = (transactionCurrency: Currency) => {
    return transactionCurrency === Currency.EUR
      ? localCurrency.eur.symbol
      : localCurrency.gbp.symbol
  }

  const onRefundClick = async () => {
    setShowRefundError(false)
    setBankRefundError(undefined)

    setValidationErrorMessage('')
    const parsedAmount = Number(amountToRefund)
    if (parsedAmount < 0) {
      setValidationErrorMessage('The amount must be greater than 0.')
    } else if (parsedAmount === 0) {
      setValidationErrorMessage("The amount can't be 0.")
    } else if (maxRefundableAmount && parsedAmount > maxRefundableAmount) {
      setValidationErrorMessage("You can't refund more than the remaining amount.")
    } else if (counterParty && amountToRefund && selectedAccount) {
      setIsRefundButtonDisabled(true)
      let parsedAmount = Number(amountToRefund)
      parsedAmount = (parsedAmount ?? 0) > maxRefundableAmount ? maxRefundableAmount : parsedAmount

      const apiError = await onRefund(
        selectedAccount,
        counterParty,
        parsedAmount,
        bankPaymentAttempt?.attemptKey ? bankPaymentAttempt?.attemptKey : '',
      )

      if (apiError) {
        setBankRefundError({ title: 'Bank refund has failed', message: apiError.detail })
        setShowRefundError(true)
      } else {
        onDismiss()
      }
    }
  }

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      onDismiss()
    }
  }

  return (
    <>
      {bankPaymentAttempt && paymentRequest && (
        <Sheet open={!!bankPaymentAttempt} onOpenChange={handleOnOpenChange}>
          <SheetContent className="w-full lg:w-[37.5rem]">
            <div className="bg-white h-screen overflow-auto lg:w-[37.5rem] px-8 py-8">
              <div className="h-fit mb-[7.5rem] lg:mb-0">
                <button type="button" className="hover:cursor-pointer block" onClick={onDismiss}>
                  <Icon name="back/24" />
                </button>
                <span className="block text-2xl font-semibold text-default-text mt-8">
                  Refund payment
                </span>

                <div className="mt-12 md:flex">
                  <div className="md:w-[152px]">
                    <span className="text-sm leading-8 font-normal text-grey-text md:leading-[48px]">
                      Refund
                    </span>
                  </div>

                  <div className="text-left">
                    <div className="md:w-40">
                      <InputAmountField
                        currency={bankPaymentAttempt.currency}
                        onCurrencyChange={() => {}}
                        allowCurrencyChange={false}
                        value={amountToRefund}
                        onChange={(value) => setAmountToRefund(value)}
                      />
                    </div>
                    <span className="mt-2 block text-13px leading-5 font-normal text-grey-text">
                      There are {getCurrencySymbol(bankPaymentAttempt.currency)}{' '}
                      {formatter.format(getMaxRefundableAmount(bankPaymentAttempt))} available to
                      refund.
                    </span>
                    <AnimatePresence>
                      {validationErrorMessage && (
                        <motion.div
                          className="mt-6 bg-warning-yellow text-sm p-3 rounded"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {validationErrorMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <div className="mt-10 md:flex items-baseline">
                  <div className="md:w-[152px]">
                    <span className="text-sm leading-6 font-normal text-grey-text ">
                      From account
                    </span>
                  </div>
                  <div className="text-left">
                    {accounts.length > 1 ? (
                      <SelectAccount
                        className="text-right border border-border-grey "
                        value={selectedAccount.id}
                        onValueChange={(value) => {
                          setSelectedAccount(
                            accounts.find((account) => account.id === value) ?? accounts[0],
                          )
                        }}
                        accounts={accounts}
                      />
                    ) : (
                      <div className="flex gap-5">
                        <span className="font-semibold w-full break-words text-sm/5 break-keep">
                          {accounts[0].accountName}
                        </span>{' '}
                        <div className="text-[#73888C] text-sm font-normal flex flex-row gap-1 items-center">
                          <span>{formatCurrency(accounts[0].currency)}</span>
                          <span>{formatAmount(accounts[0].availableBalance)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 md:flex items-baseline">
                  <div className="md:w-[152px]">
                    <span className="text-sm font-normal text-grey-text">To account</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold w-full break-words text-sm/5">
                      {counterParty?.name}
                    </p>
                    {counterParty && counterParty.accountInfo && (
                      <p className="text-xs/5 w-full text-ellipsis break-words text-grey-text">
                        {counterParty.accountInfo}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 md:flex items-baseline">
                  <div className="md:w-[152px]">
                    <span className="text-sm font-normal text-grey-text">Reference</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold w-full break-words text-sm/5">Refund</p>
                  </div>
                </div>

                <div className="lg:mt-14 lg:static lg:p-0 fixed bottom-16 left-0 w-full px-6 mx-auto pb-4 z-20">
                  {bankRefundError && showRefundError && (
                    <div className="lg:mb-14">
                      <InlineError
                        title={bankRefundError.title}
                        messages={[bankRefundError.message]}
                      />
                    </div>
                  )}

                  {import.meta.env.VITE_PUBLIC_APP_ENVIRONMENT === 'PROD' ||
                  (counterParty && counterParty.accountInfo) ? (
                    <Button
                      variant="primaryDark"
                      size="large"
                      className="disabled:!bg-grey-text disabled:!opacity-100 disabled:cursor-not-allowed"
                      onClick={onRefundClick}
                      disabled={isRefundButtonDisabled}
                    >
                      {isRefundButtonDisabled ? (
                        <Loader className="h-6 w-6 mx-auto" />
                      ) : (
                        <span>Submit for approval</span>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="primaryDark"
                      size="large"
                      className="disabled:!opacity-100 disabled:cursor-not-allowed disabled:bg-[#E3E5E8] disabled:text-[#73808C]"
                      disabled={true}
                    >
                      <span>Refund not available in sandbox</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}

export default BankRefundModal
