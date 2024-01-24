import { Currency, Payrun } from '@nofrixion/moneymoov'
import { addDays, format, startOfDay } from 'date-fns'
import { useEffect, useState } from 'react'

import { LocalAccount } from '../../../../types/LocalTypes'
import { cn } from '../../../../utils'
import { formatAmount, formatDateWithYear } from '../../../../utils/formatters'
import { formatCurrency } from '../../../../utils/uiFormaters'
import { Button, Sheet, SheetContent, SheetTitle } from '../../atoms'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../atoms/Accordion/Accordion'
import { Icon } from '../../atoms/Icon/Icon'
import ColumnHeader from '../../ColumnHeader/ColumnHeader'
import InputAmountField from '../../InputAmountField/InputAmountField'
import InputTextAreaField from '../../InputTextAreaField/InputTextAreaField'
import EditableContent from '../../molecules/EditableContent/EditableContent'
import { SelectAccount } from '../../molecules/Select/SelectAccount/SelectAccount'
import { SingleDatePicker } from '../../organisms/SingleDatePicker/SingleDatePicker'
import Switch from '../../Switch/Switch'
import { Toaster } from '../../Toast/Toast'

export interface PayrunDetailsProps {
  onAllPayrunsClick?: () => void
  onRequestAuth: () => void
  onPayrunNameChange?: (newPayrunName: string) => void
  payrun: Payrun
  accounts: LocalAccount[]
}

type AuthFormData = {
  paymentDate: Date
  notes?: string
}

const PayrunDetails: React.FC<PayrunDetailsProps> = ({
  payrun,
  accounts,
  onAllPayrunsClick,
  onRequestAuth,
  onPayrunNameChange,
}) => {
  const [currentCurrencyAccordionOpen, setCurrentCurrencyOpenAccordionOpen] = useState<
    string | undefined
  >()
  const [currentContactAccordionsOpen, setCurrentContactAccordionsOpen] = useState<string[]>([])
  const [localPayrunName, setLocalPayrunName] = useState(payrun?.name ?? '')

  const [amountsToPay, setAmountsToPay] = useState<Record<string, number>>(
    payrun.invoices.reduce((acc, invoice) => {
      acc[invoice.id] = invoice.totalAmount ?? 0
      return acc
    }, {} as Record<string, number>),
  )

  const [isSideModalOpen, setIsSideModalOpen] = useState(false)

  const [invoicesExcludedFromPayout, setInvoicesExcludedFromPayout] = useState<string[]>([])

  const handleOnPayrunNameChange = (newPayrunName: string) => {
    setLocalPayrunName(newPayrunName)
    onPayrunNameChange && onPayrunNameChange(newPayrunName)
  }

  const handleAmountChange = (invoiceId: string, newAmount: number) => {
    setAmountsToPay((prev) => ({ ...prev, [invoiceId]: newAmount }))
  }

  const currenciesFromInvoices: Currency[] = payrun.invoices
    .map((invoice) => invoice.currency)
    .filter((value, index, self) => self.indexOf(value) === index)

  const [selectedAccountsId, setSelectedAccountsId] = useState<Record<Currency, string>>(
    accounts.reduce((acc, account) => {
      if (account.isDefault) {
        acc[account.currency] = account.id
      }
      return acc
    }, {} as Record<Currency, string>),
  )

  useEffect(() => {
    const updatedSelectedAccountsId = accounts.reduce((acc, account) => {
      if (account.isDefault) {
        acc[account.currency] = account.id
      }
      return acc
    }, {} as Record<Currency, string>)

    Object.values(currenciesFromInvoices).forEach((currency) => {
      if (!updatedSelectedAccountsId[currency]) {
        const account = accounts.find((account) => account.currency === currency)
        if (account) {
          updatedSelectedAccountsId[currency] = account.id
        }
      }
    })

    setSelectedAccountsId(updatedSelectedAccountsId)

    // If there are accounts and only one currency, set the accordion open
    if (accounts.length > 0 && currenciesFromInvoices.length === 1) {
      setCurrentCurrencyOpenAccordionOpen(currenciesFromInvoices[0])
    }
  }, [accounts.length])

  const handleAccountChange = (currency: Currency, accountId: string) => {
    setSelectedAccountsId((prev) => ({ ...prev, [currency]: accountId }))
  }

  // Function to add an invoice to the list
  const excludeInvoiceFromPayout = (invoiceId: string) => {
    setInvoicesExcludedFromPayout((prevInvoices) => {
      const newExcludeList = [...prevInvoices, invoiceId]

      // If no invoice for this contact is included in the payout, close the accordion
      const invoicesForContact = payrun.invoices.filter(
        (invoice) =>
          invoice.contact === payrun.invoices.find((invoice) => invoice.id === invoiceId)?.contact,
      )
      if (invoicesForContact.every((invoice) => newExcludeList.includes(invoice.id))) {
        setCurrentContactAccordionsOpen((prev) =>
          prev.filter((openContact) => openContact !== invoicesForContact[0].contact),
        )
      }

      return newExcludeList
    })
  }

  // Function to remove an invoice from the list
  const includeInvoiceInPayout = (invoiceId: string) => {
    setInvoicesExcludedFromPayout((prevInvoices) => prevInvoices.filter((id) => id !== invoiceId))
  }

  const onRequestAuthClick = () => {
    // Open modal to add final data
    setIsSideModalOpen(true)
  }

  const invoicesGroupedByCurrencyAndContact = payrun.invoices.reduce(
    (prevInvoice, currentInvoice) => {
      const currency = currentInvoice.currency
      const contact = currentInvoice.contact

      prevInvoice[currency] = prevInvoice[currency] || {}
      prevInvoice[currency][contact] = prevInvoice[currency][contact] || []

      prevInvoice[currency][contact].push(currentInvoice)

      return prevInvoice
    },
    {} as Record<Currency, Record<string, Payrun['invoices']>>,
  )

  // Check if selected accounts to pay using each currency have balance after the payment
  const isBalanceAfterPaymentValid = Object.keys(selectedAccountsId).every((currency) => {
    const selectedAccount = accounts.find(
      (account) => account.id === selectedAccountsId[currency as Currency],
    )

    if (payrun.invoices.length === 0) {
      return false
    }

    const amountToPay = Object.values(invoicesGroupedByCurrencyAndContact[currency as Currency])
      .flat()
      .filter((invoice) => !invoicesExcludedFromPayout.includes(invoice.id))
      .reduce((total, invoice) => total + (amountsToPay[invoice.id] ?? 0), 0)

    return selectedAccount?.availableBalance && selectedAccount.availableBalance >= amountToPay
  })

  return (
    <div className="font-inter bg-main-grey text-default-text h-full">
      {/* All payruns */}
      <div className="flex justify-between mb-6">
        <button onClick={onAllPayrunsClick} className="flex items-center space-x-3">
          <Icon name="back/12" />
          <span className="hover:underline text-sm">All payruns</span>
        </button>
      </div>

      <div className="flex justify-between items-center mb-[5.5rem]">
        {/* Payrun name */}
        <span className="text-[28px]/8 font-semibold">
          <EditableContent initialValue={localPayrunName} onChange={handleOnPayrunNameChange} />
        </span>

        <div className="flex">
          <Button
            variant="primary"
            size="large"
            onClick={onRequestAuthClick}
            className="space-x-2 w-fit h-10 md:w-full md:h-full transition-all ease-in-out duration-200"
            disabled={!isBalanceAfterPaymentValid}
          >
            Request authorisation
          </Button>
        </div>
      </div>

      {/* Accordion for currencies */}
      <Accordion
        type="single"
        collapsible
        value={currentCurrencyAccordionOpen}
        onValueChange={setCurrentCurrencyOpenAccordionOpen}
        className="flex flex-col gap-y-6"
      >
        {/* Group payrun invoices on currency */}
        {Object.keys(invoicesGroupedByCurrencyAndContact).map((currency) => {
          const selectedAccount = accounts.find(
            (account) => account.id === selectedAccountsId?.[currency as Currency],
          )

          const invoicesToPay = Object.values(
            invoicesGroupedByCurrencyAndContact[currency as Currency],
          )
            .flat()
            .filter((invoice) => !invoicesExcludedFromPayout.includes(invoice.id))

          // Total amount to pay is total set by user mannualy of the invoices that are enabled
          const totalAmountToPay = Object.entries(amountsToPay).reduce(
            (prev, [invoiceId, amount]) => {
              if (invoicesToPay.find((invoice) => invoice.id === invoiceId)) {
                return prev + amount
              }
              return prev
            },
            0,
          )

          const payoutsLength = Object.values(
            invoicesGroupedByCurrencyAndContact[currency as Currency],
          ).filter((invoices) =>
            invoices.some((invoice) => !invoicesExcludedFromPayout.includes(invoice.id)),
          ).length

          const balanceAfterPayment = (selectedAccount?.availableBalance ?? 0) - totalAmountToPay

          return (
            <AccordionItem
              value={currency}
              key={currency}
              className="bg-white rounded-lg px-6 py-2"
            >
              <AccordionTrigger className="py-6">
                <div className="flex w-full items-start">
                  <SelectAccount
                    className="text-right border border-border-grey md:w-[19.5rem] mr-4"
                    value={selectedAccountsId?.[currency as Currency]}
                    onValueChange={(newAccountId) =>
                      handleAccountChange(currency as Currency, newAccountId)
                    }
                    accounts={accounts.filter((account) => account.currency === currency)}
                  />

                  <div className="flex items-center">
                    <span className="text-sm/[3rem] text-grey-text mr-2">
                      Balance after payment
                    </span>
                    <span
                      className={cn('leading-[3rem] font-medium', {
                        'text-negative-red px-2 bg-error-bg rounded-lg leading-8':
                          balanceAfterPayment < 0,
                      })}
                    >
                      {formatCurrency(currency as Currency)} {formatAmount(balanceAfterPayment)}
                    </span>
                  </div>

                  <div className="flex flex-col items-end ml-auto">
                    <h4 className="font-semibold text-[2rem]/[2rem] mb-2 whitespace-nowrap transition">
                      {formatCurrency(currency as Currency)} {formatAmount(totalAmountToPay)}
                    </h4>
                    <div className="flex items-center">
                      <span className="text-[0.8125rem]/4 mr-2">
                        Total for {payoutsLength} payouts
                      </span>
                      <Icon
                        name="arrow-down/8"
                        className={cn('transition-transform', {
                          'rotate-180': currentCurrencyAccordionOpen === currency,
                        })}
                      />
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {/* Group payrun invoices on contact */}
                <Accordion
                  type="multiple"
                  // Use currentContactAccordionsOpen to keep track of which contacts are open
                  // but filter out contacts that have all invoices excluded from the payout
                  value={currentContactAccordionsOpen}
                  onValueChange={setCurrentContactAccordionsOpen}
                >
                  {Object.keys(invoicesGroupedByCurrencyAndContact[currency as Currency]).map(
                    (contact) => {
                      const destinationInvoice =
                        invoicesGroupedByCurrencyAndContact[currency as Currency][contact][0]
                      let destinationDetails = ''
                      switch (currency) {
                        case Currency.EUR:
                          destinationDetails = destinationInvoice.destinationIban ?? ''
                          break
                        case Currency.GBP:
                          destinationDetails = `${destinationInvoice.destinationSortCode} - ${destinationInvoice.destinationAccountNumber}`
                          break
                        default:
                          break
                      }

                      const invoices =
                        invoicesGroupedByCurrencyAndContact[currency as Currency][contact]

                      const isEnabled = !invoices.every((invoice) =>
                        invoicesExcludedFromPayout.includes(invoice.id),
                      )

                      const invoicesIncludedInPayout = invoices.filter(
                        (invoice) => !invoicesExcludedFromPayout.includes(invoice.id),
                      )

                      const totalAmountIncludedInPayout = invoicesIncludedInPayout.reduce(
                        (prevInvoice, currentInvoice) => {
                          return prevInvoice + (currentInvoice?.totalAmount ?? 0)
                        },
                        0,
                      )

                      return (
                        <AccordionItem
                          value={contact}
                          key={contact}
                          className={cn('py-4 border-y border-main-grey', {
                            'text-disabled-text': !isEnabled,
                          })}
                        >
                          <AccordionTrigger
                            onClick={(e) => {
                              if (!isEnabled) {
                                e.preventDefault()
                                e.stopPropagation()
                              }

                              // If the accordion is open, close it
                              if (currentContactAccordionsOpen.includes(contact)) {
                                setCurrentContactAccordionsOpen((prev) =>
                                  prev.filter((openContact) => openContact !== contact),
                                )
                                return
                              }
                            }}
                            className={cn('flex justify-start', {
                              'cursor-default': !isEnabled,
                            })}
                          >
                            <div className="flex w-full">
                              <div className="text-left">
                                <h6 className="font-semibold text-base mb-1">{contact}</h6>
                                <span
                                  className={cn('text-grey-text text-xs', {
                                    'text-disabled-text': !isEnabled,
                                  })}
                                >
                                  {destinationDetails}
                                </span>
                              </div>
                              <div className="flex flex-col items-end ml-auto">
                                <h5 className="font-semibold text-lg/6 mb-1">
                                  {formatCurrency(currency as Currency)}{' '}
                                  {formatAmount(totalAmountIncludedInPayout)}
                                </h5>
                                <div className="flex items-center">
                                  <span className="text-[0.8125rem]/4 mr-2">
                                    {/* Show invoices included */}
                                    {invoicesIncludedInPayout.length}
                                    {' invoice'}
                                    {invoicesIncludedInPayout.length > 1 && 's'} included
                                  </span>
                                  <Icon
                                    name="arrow-down/8"
                                    className={cn('transition-transform', {
                                      'rotate-180': currentContactAccordionsOpen.includes(contact),
                                    })}
                                  />
                                </div>
                              </div>
                            </div>
                            <Switch
                              className="w-auto ml-4"
                              value={isEnabled}
                              onChange={(value) => {
                                // If the switch is on, include all invoices under this contact in the payout
                                if (value) {
                                  invoices.forEach((invoice) => includeInvoiceInPayout(invoice.id))
                                } else {
                                  // If the switch is off, exclude all invoices under this contact from the payout
                                  invoices.forEach((invoice) =>
                                    excludeInvoiceFromPayout(invoice.id),
                                  )
                                }
                              }}
                            />
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex justify-end">
                              <ColumnHeader className="w-40 mr-4" label="Invoice" />
                              <ColumnHeader className="w-40 mr-4" label="Due date" />
                              <ColumnHeader className="w-24 mr-auto" label="Reference" />
                              <ColumnHeader
                                className="w-40 mr-12 text-right"
                                spanClassName="w-full"
                                label="Amount requested"
                              />
                              <ColumnHeader
                                className="w-[8.25rem] text-right"
                                spanClassName="w-full"
                                label="Amount to pay"
                              />
                            </div>

                            {invoices.map((invoice, index) => {
                              const isEnabled = !invoicesExcludedFromPayout.includes(invoice.id)
                              return (
                                <div
                                  key={`invoice-${contact}${index}`}
                                  className={cn(
                                    'flex justify-end text-sm/8 py-1 border-b border-[#F1F2F3] transition last:border-0',
                                    {
                                      'text-disabled-text': !isEnabled,
                                    },
                                  )}
                                >
                                  <span className="w-40 mr-4">{invoice.invoiceNumber}</span>
                                  <span className="w-40 mr-4">
                                    {formatDateWithYear(
                                      new Date(invoice.dueDate),
                                      'cardinal',
                                      true,
                                    )}
                                  </span>
                                  <span className="w-24 mr-auto">{invoice.reference}</span>
                                  <span className="w-40 mr-12 text-right">
                                    {formatCurrency(invoice.currency)}{' '}
                                    {formatAmount(invoice.totalAmount ?? 0)}
                                  </span>
                                  <span className="w-[8.25rem] text-right">
                                    <InputAmountField
                                      className="text-sm/8 transition disabled:text-disabled-text disabled:bg-transparent"
                                      currencyClassName={cn('transition', {
                                        'text-disabled-text': !isEnabled,
                                      })}
                                      containerClassName="h-8"
                                      value={amountsToPay[invoice.id].toString()}
                                      allowCurrencyChange={false}
                                      onChange={(value) =>
                                        handleAmountChange(invoice.id, Number(value))
                                      }
                                      currency={invoice.currency}
                                      // TODO: Validate if we want to limit the amount to pay to the total amount
                                      // or if we want to allow the user to pay more than the total amount
                                      max={invoice.totalAmount}
                                      disabled={!isEnabled}
                                    />
                                  </span>
                                  <Switch
                                    size="small"
                                    className="w-auto ml-4"
                                    value={isEnabled}
                                    onChange={
                                      isEnabled
                                        ? () => excludeInvoiceFromPayout(invoice.id)
                                        : () => includeInvoiceInPayout(invoice.id)
                                    }
                                  />
                                </div>
                              )
                            })}
                          </AccordionContent>
                        </AccordionItem>
                      )
                    },
                  )}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <RequestAuthSideModal
        isOpen={isSideModalOpen}
        onOpenChange={() => setIsSideModalOpen(false)}
        onRequestAuth={onRequestAuth}
      />

      <Toaster positionY="top" positionX="right" duration={3000} />
    </div>
  )
}

interface RequestAuthSideModalProps {
  isOpen: boolean
  onOpenChange: () => void
  onRequestAuth: (authData: AuthFormData) => void
}

const RequestAuthSideModal: React.FC<RequestAuthSideModalProps> = ({
  isOpen,
  onOpenChange,
  onRequestAuth,
}) => {
  const [paymentDate, setPaymentDate] = useState<Date>(addDays(new Date(), 1))
  const [notes, setNotes] = useState<string>('')

  const onValidateDate = (date: Date | undefined): string | undefined => {
    if (date) {
      const maxDate = addDays(new Date(), 61)

      if (
        startOfDay(date) < startOfDay(addDays(new Date(), 1)) ||
        startOfDay(date) > startOfDay(addDays(new Date(), 61))
      ) {
        return `The payment date should be between tomorrow and ${format(maxDate, 'MMM do, yyyy')}`
      }
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full lg:w-[37.5rem] px-8 bg-white pt-14">
        <div className="h-screen overflow-auto w-[27rem]">
          <SheetTitle className="mb-[4.4375rem]">Request authorisation</SheetTitle>

          <div className="mb-9">
            <label htmlFor="paymentDate" className="text-default-text font-semibold text-sm/4">
              Payment date
            </label>
            <SingleDatePicker
              key="paymentDate"
              value={paymentDate}
              onDateChange={setPaymentDate}
              className="mt-3"
              validationErrorMessage={
                'The payment date should be between tomorrow and 61 days from now'
              }
              warningValidation={onValidateDate}
            />
          </div>

          <div className="mb-8">
            <InputTextAreaField
              label="Notes for authoriser"
              value={notes}
              onChange={(value) => setNotes(value)}
              maxLength={140}
            />
          </div>

          <Button
            variant="primary"
            size="large"
            className="w-auto"
            disabled={
              !paymentDate ||
              paymentDate < addDays(new Date(), 1) ||
              paymentDate > addDays(new Date(), 61)
            }
            onClick={() => onRequestAuth({ paymentDate, notes })}
          >
            Send request
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { PayrunDetails }
