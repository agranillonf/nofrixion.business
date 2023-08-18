﻿import { Currency } from '@nofrixion/clients'
import { format } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import { cn } from '../../../utils'
import { localCurrency } from '../../../utils/constants'
import { Button, Icon } from '../atoms'
import InputAmountField from '../InputAmountField/InputAmountField'
import { Loader } from '../Loader/Loader'
export interface CaptureModalProps {
  initialAmount: string
  currency: Currency.EUR | Currency.GBP
  onCapture: () => Promise<void>
  onDismiss: () => void
  setAmountToCapture: (amount: string) => void
  maxCapturableAmount: number
  lastFourDigitsOnCard?: string
  processor?: string
  transactionDate: Date
  contactName?: string
}

const CaptureModal: React.FC<CaptureModalProps> = ({
  initialAmount,
  currency,
  onCapture,
  onDismiss,
  setAmountToCapture,
  maxCapturableAmount,
  lastFourDigitsOnCard,
  processor,
  transactionDate,
  contactName,
}) => {
  const [isCaptureButtonDisabled, setIsCaptureButtonDisabled] = useState(false)
  const [validationErrorMessage, setValidationErrorMessage] = useState('')
  const formatter = new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const getCurrencySymbol = (transactionCurrency: string) => {
    return transactionCurrency === Currency.EUR
      ? localCurrency.eur.symbol
      : localCurrency.gbp.symbol
  }

  const onCaptureClick = async () => {
    setIsCaptureButtonDisabled(true)

    setValidationErrorMessage('')
    const parsedAmount = Number(initialAmount)
    if (parsedAmount < 0) {
      setValidationErrorMessage('The amount must be greater than 0.')
      setIsCaptureButtonDisabled(false)
    } else if (parsedAmount === 0) {
      setValidationErrorMessage("The amount can't be 0.")
      setIsCaptureButtonDisabled(false)
    } else if (maxCapturableAmount && parsedAmount > maxCapturableAmount) {
      setValidationErrorMessage("You can't capture more than the remaining amount.")
      setIsCaptureButtonDisabled(false)
    } else {
      await onCapture()
    }
  }

  return (
    <div className="bg-white h-screen overflow-auto lg:w-[37.5rem] px-8 py-8 z-50">
      <div className="max-h-full">
        <div className="h-fit">
          <button type="button" className="hover:cursor-pointer block" onClick={onDismiss}>
            <Icon name="back/24" />
          </button>
          <span className="block text-2xl font-semibold text-default-text mt-8">
            Confirm card payment capture
          </span>
          <p className="mt-12 text-default-text text-sm font-normal">
            You are about to capture the card payment made
            {contactName && <span className="font-semibold">{` by ${contactName}`}</span>} on{' '}
            <span className="font-semibold">{format(transactionDate, 'MMM do, yyyy')}</span>
            {lastFourDigitsOnCard ? (
              <>
                {' with the'}
                {processor && <span className="font-semibold">{` ${processor}`}</span>}
                {` card ending in ${lastFourDigitsOnCard}.`}
              </>
            ) : (
              '.'
            )}
          </p>
          <div className="mt-12 md:flex">
            <div className="md:w-[152px]">
              <span className="text-sm leading-8 font-normal text-grey-text md:leading-[48px]">
                Capture
              </span>
            </div>
            <div className="text-left">
              <div className="md:w-40">
                <InputAmountField
                  currency={currency}
                  onCurrencyChange={() => {}}
                  allowCurrencyChange={false}
                  value={formatter.format(Number(initialAmount))}
                  onChange={(e) => setAmountToCapture(e.target.value)}
                ></InputAmountField>
              </div>
              <span className="mt-2 block text-13px leading-5 font-normal text-grey-text">
                There are {getCurrencySymbol(currency)} {formatter.format(maxCapturableAmount)}{' '}
                remaining to capture.
              </span>
              <AnimatePresence>
                {validationErrorMessage && (
                  <motion.div
                    className="mt-6 bg-[#ffe6eb] text-sm p-3 rounded"
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
          <div className="lg:mt-14 lg:static lg:p-0 fixed bottom-16 left-0 w-full px-6 mx-auto pb-4 z-20">
            <Button
              variant="primaryDark"
              size="big"
              className={cn({
                '!bg-grey-text disabled:!opacity-100 cursor-not-allowed': isCaptureButtonDisabled,
              })}
              onClick={onCaptureClick}
              disabled={isCaptureButtonDisabled}
            >
              {isCaptureButtonDisabled ? <Loader className="h-6 w-6 mx-auto" /> : 'Confirm capture'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaptureModal
