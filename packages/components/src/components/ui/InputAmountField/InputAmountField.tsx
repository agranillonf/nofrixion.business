import { Currency } from '@nofrixion/moneymoov'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cva } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { InputHTMLAttributes, useEffect, useRef, useState } from 'react'
// eslint-disable-next-line import/no-unresolved
import { IMaskInput } from 'react-imask'

import { cn } from '../../../utils'
import { localCurrency } from '../../../utils/constants'
import ResizableComponent from '../ResizableComponent/ResizableComponent'

export interface InputAmountFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  currency: string
  onChange: (value: string) => void
  onCurrencyChange?: (currency: string) => void
  allowCurrencyChange?: boolean
  min?: number // Need to override the default type to use them in IMaskInput
  max?: number // Need to override the default type to use them in IMaskInput
  value: string // Need to override the default type to use them in IMaskInput
  formSubmitted?: boolean
  containerClassName?: string
  currencyClassName?: string
}

const actionItemClassNames =
  'group text-sm leading-6 rounded-1 flex items-center relative select-none outline-none cursor-pointer'

const actionItem = cva(actionItemClassNames, {
  variants: {
    intent: {
      neutral: ['data-[highlighted]:text-grey-text'],
      selected: ['text-[#009999] data-[highlighted]:cursor-default'],
    },
  },
  defaultVariants: {
    intent: 'neutral',
  },
})
const InputAmountField: React.FC<InputAmountFieldProps> = ({
  currency,
  onCurrencyChange,
  allowCurrencyChange = true,
  onChange,
  formSubmitted,
  required,
  className,
  containerClassName,
  currencyClassName,
  ...props
}) => {
  const ref = useRef(null)
  const inputRef = useRef(null)

  const [selectedCurrency, setSelectedCurrency] = useState(
    localCurrency[currency.toLowerCase()]
      ? localCurrency[currency.toLowerCase()]
      : localCurrency.eur,
  )

  const [fieldValue, setFieldValue] = useState<string>('')
  const [requiredErrorPrompt, setRequiredErrorPrompt] = useState<boolean>(false)

  useEffect(() => {
    if (!formSubmitted) {
      return
    }
    if (formSubmitted && required && !fieldValue) {
      setRequiredErrorPrompt(true)
    } else {
      setRequiredErrorPrompt(false)
    }
  }, [formSubmitted])

  useEffect(() => {
    setSelectedCurrency(currency === Currency.EUR ? localCurrency.eur : localCurrency.gbp)
  }, [])

  useEffect(() => {
    onCurrencyChange && onCurrencyChange(selectedCurrency.code)
  }, [selectedCurrency])

  return (
    <>
      {requiredErrorPrompt && (
        <div className="text-[#F32448] font-normal text-xs leading-4 text-right mb-2">REQUIRED</div>
      )}
      <div
        className={cn(
          'flex w-full h-12 border border-border-grey rounded justify-between',
          containerClassName,
        )}
      >
        <div className="flex relative w-full">
          <span
            className={cn(
              'flex absolute inset-y-0 pointer-events-none items-center ml-3 font-normal text-sm text-grey-text',
              currencyClassName,
            )}
          >
            {selectedCurrency.symbol}
          </span>
          <IMaskInput
            className={cn(
              'block w-full pl-7 rounded font-normal text-sm text-default-text appearance-none',
              {
                'mr-1': allowCurrencyChange,
                'pr-2 text-right text-xl leading-5 font-semibold': !allowCurrencyChange,
              },
              className,
            )}
            mask={Number}
            scale={2}
            thousandsSeparator=","
            padFractionalZeros={true}
            normalizeZeros={true}
            radix="."
            mapToRadix={[',']}
            unmask={true}
            ref={ref}
            inputRef={inputRef}
            onAccept={(value) => {
              setFieldValue(value)
              setRequiredErrorPrompt(false)
              onChange && onChange(value)
            }}
            {...props}
          />
        </div>
        {allowCurrencyChange && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <div className="flex h-full items-center pl-3 mr-3 text-grey-text font-normal leading-4 hover:text-default-text bg-transparent text-sm whitespace-nowrap cursor-pointer select-none stroke-grey-text hover:stroke-default-text">
                <ResizableComponent>
                  <span className="mr-2">{selectedCurrency.code}</span>
                </ResizableComponent>

                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 1.25L5 5.25L9 1.25" strokeLinecap="square" />
                </svg>
              </div>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content asChild forceMount sideOffset={5} className="px-6 z-50">
                <motion.div
                  className="bg-white rounded-md shadow-[0px_0px_8px_rgba(4,_41,_49,_0.1)] p-4 space-y-4"
                  initial={{ opacity: 0.5, y: -5, scaleX: 1, scaleY: 1 }}
                  animate={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1 }}
                >
                  <DropdownMenu.Item
                    className={actionItem({
                      intent: selectedCurrency === localCurrency.eur ? 'selected' : 'neutral',
                    })}
                    onClick={() => setSelectedCurrency(localCurrency.eur)}
                  >
                    <span>{Currency.EUR}</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className={actionItem({
                      intent: selectedCurrency === localCurrency.gbp ? 'selected' : 'neutral',
                    })}
                    onClick={() => setSelectedCurrency(localCurrency.gbp)}
                  >
                    <span>{Currency.GBP}</span>
                  </DropdownMenu.Item>
                </motion.div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>
    </>
  )
}

export default InputAmountField
