import { Currency, Invoice, Payrun } from '@nofrixion/moneymoov'
import { addDays, format, startOfDay } from 'date-fns'
import { AnimatePresence } from 'framer-motion'
import _ from 'lodash'
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
import InputTextAreaField from '../../InputTextAreaField/InputTextAreaField'
import EditableContent from '../../molecules/EditableContent/EditableContent'
import { SelectAccount } from '../../molecules/Select/SelectAccount/SelectAccount'
import { SingleDatePicker } from '../../organisms/SingleDatePicker/SingleDatePicker'
import Switch from '../../Switch/Switch'
import { Toaster } from '../../Toast/Toast'
import LayoutWrapper from '../../utils/LayoutWrapper'

export interface PayrunDetailsProps {
  onAllPayrunsClick?: () => void
  onRequestAuth: (invoices: Invoice[], paymentDate: Date, notes?: string) => void
  onPayrunNameChange?: (newPayrunName: string) => void
  payrun: Payrun
  accounts: LocalAccount[]
}

type AuthFormData = {
  paymentDate: Date
  notes?: string
}
interface InvoiceWithState extends Invoice {
  enabled: boolean
}

// Example of payrunState:
// {
//   "EUR": {
//     "Zeta Services": {
//       "enabled": false,
//       "invoices": [
//         {
//           "id": 1,
//           "amount": 100,
//         },
//         {
//           "id": 2,
//           "enabled": false
//         }
//       ]
//     },
//     "Zeta Products": {
//       "enabled": true,
//       "invoices": []
//     }
//   },
//   "GBP": {
//     // ...
//   }
// }

type PayrunState = {
  [currency in Currency]: {
    [contact: string]: {
      enabled: boolean
      invoices: InvoiceWithState[]
    }
  }
}

const getPayrunStateFromPayrun = (payrun: Payrun): PayrunState => {
  return payrun.invoices.reduce((acc, invoice) => {
    if (!acc[invoice.currency]) {
      acc[invoice.currency] = {}
    }

    if (!acc[invoice.currency][invoice.contact]) {
      acc[invoice.currency][invoice.contact] = {
        enabled: true,
        invoices: [],
      }
    }

    acc[invoice.currency][invoice.contact].invoices.push({
      ...invoice,
      enabled: true,
    })

    return acc
  }, {} as PayrunState)
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

  const [isSideModalOpen, setIsSideModalOpen] = useState(false)

  const [savedPayrunState, setSavedPayrunState] = useState<PayrunState>(
    getPayrunStateFromPayrun(payrun),
  )

  const [payrunState, setPayrunState] = useState<PayrunState>(getPayrunStateFromPayrun(payrun))

  const handleOnPayrunNameChange = (newPayrunName: string) => {
    setLocalPayrunName(newPayrunName)
    onPayrunNameChange && onPayrunNameChange(newPayrunName)
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

  const atLeastOneInvoiceEnabled = Object.values(payrunState).some((currency) =>
    Object.values(currency).some(
      (contact) => contact.enabled && contact.invoices.some((i) => i.enabled),
    ),
  )

  const isBalanceAfterPaymentPositive = Object.entries(payrunState).every(
    ([currency, invoicesGroupedByCurrency]) => {
      const selectedAccount = accounts.find(
        (account) => account.id === selectedAccountsId?.[currency as Currency],
      )

      // Balance after payment is the balance of the selected account minus the total amount to pay
      // of every invoice in the payrun that has the same currency as the selected account
      // and that are not disabled
      const includedInvoicesInCurrency = Object.values(invoicesGroupedByCurrency).flatMap(
        (contact) => (contact.enabled ? contact.invoices.filter((invoice) => invoice.enabled) : []),
      )

      const totalAmountToPay = includedInvoicesInCurrency.reduce((prevInvoice, currentInvoice) => {
        return prevInvoice + (currentInvoice?.totalAmount ?? 0)
      }, 0)

      const balanceAfterPayment = (selectedAccount?.availableBalance ?? 0) - totalAmountToPay

      return balanceAfterPayment >= 0
    },
  )

  const isRequestAuthEnabled = atLeastOneInvoiceEnabled && isBalanceAfterPaymentPositive

  const handleAccountChange = (currency: Currency, accountId: string) => {
    setSelectedAccountsId((prev) => ({ ...prev, [currency]: accountId }))
  }

  const onRequestAuthClick = () => {
    // Open modal to add final data
    setIsSideModalOpen(true)
  }

  const handleOnRequestAuth = ({ paymentDate, notes }: AuthFormData) => {
    onRequestAuth(
      Object.values(payrunState)
        .flatMap((currency) => Object.values(currency))
        .filter((contact) => contact.enabled)
        .flatMap((contact) => contact.invoices)
        .filter((invoice) => invoice.enabled),
      paymentDate,
      notes,
    )
  }

  // If only one invoice is included, show: "1 invoice included"
  // If X invoices are included out of Y, show: "X of Y invoices included"
  // If X all invoices are included, show: "All X invoices included"
  const formatInvoiceIncludedText = (invoices: InvoiceWithState[]) => {
    const totalInvoices = invoices.length
    const includedInvoices = invoices.filter((invoice) => invoice.enabled).length

    if (includedInvoices === 1 && includedInvoices === totalInvoices) {
      return '1 invoice included'
    }

    if (includedInvoices === totalInvoices) {
      return `All ${includedInvoices} invoices included`
    }

    return `${includedInvoices} of ${totalInvoices} invoices included`
  }

  const hasDataChanged = !_.isEqual(savedPayrunState, payrunState)

  // Get the difference between the current payrun state and the saved payrun state
  // to get the changes made so we can send them to the backend
  const getDifferenceBetweenPayrunStates = (
    currentState: PayrunState,
    newState: PayrunState,
  ): PayrunState => {
    return Object.entries(currentState).reduce((acc, [currency, contacts]) => {
      Object.entries(contacts).forEach(([contact, contactData]) => {
        const savedContactData = newState[currency as Currency][contact]

        if (!_.isEqual(contactData, savedContactData)) {
          acc[currency as Currency] = {
            ...acc[currency as Currency],
            [contact]: {
              ...contactData,
              invoices: contactData.invoices.filter(
                (invoice) =>
                  invoice.enabled !==
                  savedContactData.invoices.find((i) => i.id === invoice.id)?.enabled,
              ),
            },
          }
        }
      })

      return acc
    }, {} as PayrunState)
  }

  const handleOnSave = () => {
    console.log('Changes made', getDifferenceBetweenPayrunStates(payrunState, savedPayrunState))

    setSavedPayrunState(payrunState)
  }

  const handleOnAllPayrunsClick = () => {
    if (hasDataChanged) {
      const shouldLeavePage = window.confirm(
        'You have unsaved changes. Are you sure you want to leave this page?',
      )

      if (shouldLeavePage) {
        onAllPayrunsClick && onAllPayrunsClick()
      }
    } else {
      onAllPayrunsClick && onAllPayrunsClick()
    }
  }

  return (
    <div className="font-inter bg-main-grey text-default-text h-full">
      {/* All payruns */}
      <div className="flex justify-between mb-6">
        <button onClick={handleOnAllPayrunsClick} className="flex items-center space-x-3">
          <Icon name="back/12" />
          <span className="hover:underline text-sm">All payruns</span>
        </button>
      </div>

      <div className="flex justify-between items-center mb-12">
        {/* Payrun name */}
        <span className="text-[28px]/[3rem] font-semibold">
          <EditableContent initialValue={localPayrunName} onChange={handleOnPayrunNameChange} />
        </span>

        <div className="flex space-x-2 relative">
          <AnimatePresence>
            {!hasDataChanged && (
              <LayoutWrapper
                key="request-auth-button"
                className="absolute right-0 transform translate-y-[-50%]"
              >
                <Button
                  variant="primary"
                  size="large"
                  onClick={onRequestAuthClick}
                  className="w-fit h-10 md:w-full md:h-full transition-all ease-in-out duration-200"
                  disabled={!isRequestAuthEnabled}
                >
                  Request authorisation
                </Button>
              </LayoutWrapper>
            )}
            {hasDataChanged && (
              <LayoutWrapper
                key="save-discard-buttons"
                className="absolute right-0 transform translate-y-[-50%] flex space-x-2"
              >
                <Button
                  variant="secondary"
                  size="large"
                  onClick={() => {
                    setPayrunState(savedPayrunState)
                  }}
                  className="w-fit h-10 md:w-32 md:h-full transition-all ease-in-out duration-200"
                >
                  Discard
                </Button>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleOnSave}
                  className="w-fit h-10 md:w-52 md:h-full transition-all ease-in-out duration-200"
                >
                  Save
                </Button>
              </LayoutWrapper>
            )}
          </AnimatePresence>
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
        {Object.entries(payrunState).map(([currency, invoicesGroupedByCurrency]) => {
          const selectedAccount = accounts.find(
            (account) => account.id === selectedAccountsId?.[currency as Currency],
          )

          // Balance after payment is the balance of the selected account minus the total amount to pay
          // of every invoice in the payrun that has the same currency as the selected account
          // and that are not disabled
          const includedInvoicesInCurrency = Object.values(invoicesGroupedByCurrency).flatMap(
            (contact) =>
              contact.enabled ? contact.invoices.filter((invoice) => invoice.enabled) : [],
          )

          const totalAmountToPay = includedInvoicesInCurrency.reduce(
            (prevInvoice, currentInvoice) => {
              return prevInvoice + (currentInvoice?.totalAmount ?? 0)
            },
            0,
          )

          const balanceAfterPayment = (selectedAccount?.availableBalance ?? 0) - totalAmountToPay

          const payoutsLength = Object.values(invoicesGroupedByCurrency)
            .flatMap(
              (contact) =>
                contact.enabled && contact.invoices.filter((invoice) => invoice.enabled).length,
            )
            .filter((invoice) => invoice).length

          const onCurrencySwitchChange = (value: boolean, contact: string) => {
            setPayrunState((prev) => ({
              ...prev,
              [currency]: {
                ...prev[currency as Currency],
                [contact]: {
                  ...prev[currency as Currency][contact],
                  enabled: value,
                },
              },
            }))

            // If enabling this and all invoices are disabled, enable all invoices
            if (
              value &&
              invoicesGroupedByCurrency[contact].invoices.every((invoice) => !invoice.enabled)
            ) {
              setPayrunState((prev) => ({
                ...prev,
                [currency]: {
                  ...prev[currency as Currency],
                  [contact]: {
                    ...prev[currency as Currency][contact],
                    invoices: prev[currency as Currency][contact].invoices.map((invoice) => ({
                      ...invoice,
                      enabled: true,
                    })),
                  },
                },
              }))
            }
          }

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
                        {/* Should be payouts lenght */}
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
                  {Object.keys(invoicesGroupedByCurrency).map((contact) => {
                    const destinationInvoice = invoicesGroupedByCurrency[contact].invoices[0]
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

                    const invoiceGroupedByCurrencyAndContact = invoicesGroupedByCurrency[contact]

                    const invoices = invoiceGroupedByCurrencyAndContact.invoices

                    const isEnabled = invoiceGroupedByCurrencyAndContact.enabled

                    const totalAmountIncludedInPayout = invoices.reduce(
                      (prevInvoice, currentInvoice) => {
                        return (
                          prevInvoice +
                          (currentInvoice?.enabled ? currentInvoice?.totalAmount ?? 0 : 0)
                        )
                      },
                      0,
                    )

                    const onInvoiceSwitchChange = (value: boolean, invoiceId: string) => {
                      // If disabling this and all invoices are disabled, disable the contact
                      setPayrunState((prev) => {
                        const isParentCurrencyEnabled = prev[currency as Currency][
                          contact
                        ].invoices.some((invoice) => invoice.id !== invoiceId && invoice.enabled)

                        if (!isParentCurrencyEnabled) {
                          setCurrentContactAccordionsOpen((prev) =>
                            prev.filter((openContact) => openContact !== contact),
                          )
                        }

                        return {
                          ...prev,
                          [currency]: {
                            ...prev[currency as Currency],
                            [contact]: {
                              ...prev[currency as Currency][contact],
                              enabled: isParentCurrencyEnabled,
                              invoices: prev[currency as Currency][contact].invoices.map(
                                (prevInvoice) => {
                                  if (prevInvoice.id === invoiceId) {
                                    return {
                                      ...prevInvoice,
                                      enabled: value,
                                    }
                                  }
                                  return prevInvoice
                                },
                              ),
                            },
                          },
                        }
                      })
                    }

                    return (
                      <AccordionItem
                        value={contact}
                        key={contact}
                        className={cn('border-t border-[#F1F2F3]', {
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
                          className={cn('flex justify-start py-4', {
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
                                  {formatInvoiceIncludedText(invoices)}
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
                            onChange={(value) => onCurrencySwitchChange(value, contact)}
                          />
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4">
                          <div className="flex justify-end">
                            <ColumnHeader className="w-40 mr-4" label="Invoice" />
                            <ColumnHeader className="w-40 mr-4" label="Due date" />
                            <ColumnHeader className="w-24 mr-auto" label="Reference" />
                            <ColumnHeader
                              className="w-40 mr-12 text-right"
                              spanClassName="w-full"
                              label="Amount"
                            />
                            <div className="w-8 ml-4" />
                          </div>

                          {invoices.map((invoice, index) => {
                            const isEnabled = invoice.enabled

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
                                  {formatDateWithYear(new Date(invoice.dueDate), 'cardinal', true)}
                                </span>
                                <span className="w-24 mr-auto">{invoice.reference}</span>
                                <span className="w-40 mr-12 text-right tabular-nums">
                                  {formatCurrency(invoice.currency)}{' '}
                                  {formatAmount(invoice.totalAmount ?? 0)}
                                </span>
                                <Switch
                                  size="small"
                                  className="w-8 ml-4"
                                  value={isEnabled}
                                  onChange={(value) => onInvoiceSwitchChange(value, invoice.id)}
                                />
                              </div>
                            )
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <RequestAuthSideModal
        isOpen={isSideModalOpen}
        onOpenChange={() => setIsSideModalOpen(false)}
        onRequestAuth={handleOnRequestAuth}
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
      const maxDate = addDays(new Date(), 60)

      if (startOfDay(date) < startOfDay(addDays(new Date(), 1)) || startOfDay(date) > maxDate) {
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
              key={`paymentDate-${isOpen}`}
              value={paymentDate}
              onDateChange={setPaymentDate}
              className="mt-3"
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
