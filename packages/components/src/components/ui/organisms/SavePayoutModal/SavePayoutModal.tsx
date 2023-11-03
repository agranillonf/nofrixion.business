﻿import { Currency } from '@nofrixion/moneymoov'
import { addDays, format, startOfDay } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { LocalAccountIdentifierType } from '../../../../types/LocalEnums'
import {
  LocalAccount,
  LocalBeneficiary,
  LocalCounterparty,
  LocalPayout,
} from '../../../../types/LocalTypes'
import { cn } from '../../../../utils'
import { Button, Icon, Sheet, SheetContent } from '../../atoms'
import InputTextField from '../../atoms/InputTextField/InputTextField'
import { RadioGroup, RadioGroupItem } from '../../atoms/RadioGroup/RadioGroup'
import { ValidationMessage } from '../../atoms/ValidationMessage/ValidationMessage'
import InputAmountField from '../../InputAmountField/InputAmountField'
import InputTextAreaField from '../../InputTextAreaField/InputTextAreaField'
import { Loader } from '../../Loader/Loader'
import { SelectAccount } from '../../molecules/Select/SelectAccount/SelectAccount'
import { SelectBeneficiary } from '../../molecules/Select/SelectBeneficiary/SelectBeneficiary'
import AnimateHeightWrapper from '../../utils/AnimateHeight'
import { SingleDatePicker } from '../SingleDatePicker/SingleDatePicker'
export interface SavePayoutModalProps {
  onCreatePayout: (
    sourceAccount: LocalAccount,
    counterParty: LocalCounterparty,
    amount: number,
    theirReference: string,
    yourReference?: string,
    description?: string,
    createAndApprove?: boolean,
    scheduled?: boolean,
    scheduleDate?: Date,
  ) => Promise<void>
  onDismiss: () => void
  accounts: LocalAccount[]
  isOpen: boolean
  beneficiaries: LocalBeneficiary[]
  selectedPayout?: LocalPayout
}

const SavePayoutModal: React.FC<SavePayoutModalProps> = ({
  onCreatePayout,
  onDismiss,
  accounts,
  beneficiaries,
  isOpen,
  selectedPayout,
}) => {
  const [isCreatePayoutButtonDisabled, setIsCreatePayoutButtonDisabled] = useState(false)
  const [isCreateAndApproveButtonDisabled, setIsCreateAndApproveButtonDisabled] = useState(false)
  const [amountValidationErrorMessage, setAmountValidationErrorMessage] = useState<
    string | undefined
  >(undefined)
  const [accountValidationErrorMessage, setAccountValidationErrorMessage] = useState<
    string | undefined
  >(undefined)
  const [beneficiaryValidationErrorMessage, setBeneficiaryValidationErrorMessage] = useState<
    string | undefined
  >(undefined)
  const [dateValidationErrorMessage, setDateValidationErrorMessage] = useState<string | undefined>(
    undefined,
  )

  const [formError, setFormError] = useState<string | undefined>(undefined)
  const [payoutAmount, setPayoutAmount] = useState<string | undefined>('')
  const [theirReference, setTheirReference] = useState<string | undefined>('')
  const [yourReference, setYourReference] = useState<string | undefined>('')
  const [description, setDescription] = useState<string | undefined>('')
  const [addManuallySelected, setAddManuallySelected] = useState<boolean>(false)
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<LocalBeneficiary | undefined>(
    undefined,
  )
  const [destinationAccountName, setDestinationAccountName] = useState<string | undefined>('')
  const [destinationAccountIBAN, setDestinationAccountIBAN] = useState<string | undefined>('')
  const [destinationAccountNumber, setDestinationAccountNumber] = useState<string | undefined>('')
  const [destinationAccountSortCode, setDestinationAccountSortCode] = useState<string | undefined>(
    '',
  )

  const [destinationAccountRequiredPrompt, setDestinationAccountRequiredPrompt] =
    useState<boolean>(false)

  const [createPayoutClicked, setCreatePayoutClicked] = useState<boolean>(false)
  const [selectedScheduleOption, setSelectedScheduleOption] = useState('immediately')
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(addDays(new Date(), 1))

  useEffect(() => {
    if (!isOpen) {
      resetFields()
    }
  }, [isOpen])

  const singleCurrency =
    accounts
      .map((item) => item.currency)
      .filter((value, index, self) => self.indexOf(value) === index).length === 1
      ? accounts
          .map((item) => item.currency)
          .filter((value, index, self) => self.indexOf(value) === index)[0]
      : undefined

  const [currency, setCurrency] = useState<Currency | undefined>(singleCurrency)

  const [selectedAccount, setSelectedAccount] = useState<LocalAccount | undefined>(
    accounts?.filter((x) => x.currency === currency)[0],
  )

  useEffect(() => {
    setCurrency(selectedPayout?.currency ? selectedPayout.currency : currency)
    setPayoutAmount(selectedPayout?.amount?.toString() ?? '')
    setTheirReference(selectedPayout?.theirReference)
    setYourReference(selectedPayout?.yourReference)
    setDescription(selectedPayout?.description)
    setDestinationAccountName(selectedPayout?.destination?.name)
    setDestinationAccountIBAN(selectedPayout?.destination?.identifier?.iban)
    setDestinationAccountNumber(selectedPayout?.destination?.identifier?.accountNumber)
    setDestinationAccountSortCode(selectedPayout?.destination?.identifier?.sortCode)
    const selectedAccount = getAccountFromCurrencyOrExistingPayout()
    setSelectedAccount(selectedAccount)
    validateAmount(selectedPayout?.amount?.toString() ?? '', selectedAccount)
  }, [selectedPayout])

  const theirReferenceMaxLength = currency === Currency.EUR ? 139 : 17

  const balanceLessThanAmountMessage = "This account doesn't have enough funds for this transaction"

  const beneficiaryDifferentCurrencyMessage =
    'This account has a different currency than the chosen amount.'

  const getAccountFromCurrencyOrExistingPayout = () => {
    return accounts?.filter((x) =>
      selectedPayout ? x.id === selectedPayout.accountID : x.currency === currency,
    )[0]
  }

  const validateAmount = (amount: string, account: LocalAccount) => {
    if (account && account.availableBalance < Number(amount)) {
      setAccountValidationErrorMessage(balanceLessThanAmountMessage)
    } else {
      setAccountValidationErrorMessage(undefined)
    }
  }

  const handleAmountOnChange = (value: string) => {
    setPayoutAmount(value)
    selectedAccount && validateAmount(value, selectedAccount)
  }

  const handleAccountOnChange = (value: string) => {
    setAccountValidationErrorMessage(undefined)
    const account = accounts.find((account) => account.id === value)
    setSelectedAccount(account ?? getAccountFromCurrencyOrExistingPayout())

    if (account && account.availableBalance < Number(payoutAmount)) {
      setAccountValidationErrorMessage(balanceLessThanAmountMessage)
    }
  }

  const handleValidation = (): boolean => {
    let validationFailed = false
    setAmountValidationErrorMessage(undefined)
    setDestinationAccountRequiredPrompt(false)
    if (
      beneficiaries &&
      beneficiaries.length > 0 &&
      !selectedBeneficiary &&
      !addManuallySelected &&
      !selectedPayout
    ) {
      validationFailed = true
      setDestinationAccountRequiredPrompt(true)
    }

    const parsedAmount = Number(payoutAmount)
    if (parsedAmount < 0) {
      validationFailed = true
      setAmountValidationErrorMessage('The amount must be greater than 0.')
    } else if (parsedAmount === 0) {
      validationFailed = true
      setAmountValidationErrorMessage("The amount can't be 0.")
    }
    if (
      !(
        (destinationAccountIBAN || (destinationAccountNumber && destinationAccountSortCode)) &&
        payoutAmount &&
        selectedAccount &&
        theirReference
      )
    ) {
      setFormError('Please fill all required fields')
      validationFailed = true
    } else {
      setFormError(undefined)
    }

    const validateAccountNameMessage = onValidateDestinationAccountName(
      destinationAccountName ?? '',
    )

    if (validateAccountNameMessage) {
      validationFailed = true
    }

    if (currency === Currency.EUR) {
      const validateAccountIBANMessage = onValidateDestinationAccountIBAN(
        destinationAccountIBAN ?? '',
      )

      if (validateAccountIBANMessage) {
        validationFailed = true
      }
    }

    const validateTheirReferenceMessage = onValidateTheirReference(theirReference ?? '')

    if (validateTheirReferenceMessage) {
      validationFailed = true
    }

    const validateYourReferenceMessage = onValidateYourReference(yourReference ?? '')

    if (validateYourReferenceMessage) {
      validationFailed = true
    }

    if (selectedBeneficiary && selectedBeneficiary.currency !== currency) {
      validationFailed = true
    }

    if (selectedAccount && selectedAccount.availableBalance < Number(payoutAmount)) {
      validationFailed = true
    }

    const validateScheduleDateMessage = onValidateDate(scheduleDate)

    if (validateScheduleDateMessage) {
      setDateValidationErrorMessage(validateScheduleDateMessage)
      validationFailed = true
    }

    return validationFailed
  }

  const onCreatePayoutClick = async (createAndApprove?: boolean) => {
    setCreatePayoutClicked(true)
    if (handleValidation()) {
      return
    } else {
      if (!createAndApprove) {
        setIsCreatePayoutButtonDisabled(true)
      } else {
        setIsCreateAndApproveButtonDisabled(true)
      }
      let parsedAmount = Number(payoutAmount)
      parsedAmount = parsedAmount ?? 0

      const counterParty: LocalCounterparty = {
        name: destinationAccountName ?? '',
        identifier: selectedBeneficiary?.destination?.identifier ?? {
          iban: destinationAccountIBAN ?? '',
          accountNumber: destinationAccountNumber ?? '',
          sortCode: destinationAccountSortCode ?? '',
          type:
            currency && currency === Currency.EUR
              ? LocalAccountIdentifierType.IBAN
              : LocalAccountIdentifierType.SCAN,
          currency: currency ? currency : Currency.EUR,
        },
      }

      await onCreatePayout(
        selectedAccount!,
        counterParty,
        parsedAmount,
        theirReference!,
        yourReference,
        description,
        createAndApprove,
        selectedScheduleOption === 'choose-date',
        scheduleDate,
      )

      setIsCreatePayoutButtonDisabled(false)
      setIsCreateAndApproveButtonDisabled(false)
    }
  }
  const resetFields = () => {
    setPayoutAmount(undefined)
    setTheirReference(undefined)
    setYourReference(undefined)
    setDescription(undefined)
    setDestinationAccountName(undefined)
    setDestinationAccountIBAN(undefined)
    setDestinationAccountNumber(undefined)
    setDestinationAccountSortCode(undefined)
    setAddManuallySelected(false)
    setSelectedBeneficiary(undefined)
    setDestinationAccountRequiredPrompt(false)
    setAmountValidationErrorMessage(undefined)
    setAccountValidationErrorMessage(undefined)
    setBeneficiaryValidationErrorMessage(undefined)
    setFormError(undefined)
    setCreatePayoutClicked(false)
    setIsCreatePayoutButtonDisabled(false)
    setIsCreateAndApproveButtonDisabled(false)
    setSelectedScheduleOption('immediately')
    setScheduleDate(addDays(new Date(), 1))
    setDateValidationErrorMessage(undefined)
    setSelectedAccount(getAccountFromCurrencyOrExistingPayout())
  }

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      onDismiss()
    }
  }

  const onValidateDestinationAccountName = (destinationAccountName: string): string | undefined => {
    // eslint-disable-next-line no-useless-escape
    const accountNameRegex = /^['\.\-\/&\s]*?\w+['\.\-\/&\s\w]*$/g

    if (destinationAccountName.length > 0 && !accountNameRegex.test(destinationAccountName)) {
      return `The account name is not valid`
    }
  }

  const onValidateDestinationAccountIBAN = (destinationAccountIBAN: string): string | undefined => {
    const ibanReplaceRegex = /^[a-zA-Z]{2}[0-9]{2}([a-zA-Z0-9]){11,30}$/g

    if (destinationAccountIBAN.length > 0 && !ibanReplaceRegex.test(destinationAccountIBAN)) {
      return `The IBAN is not valid. Please check for incorrectly entered characters.`
    }

    const bank = destinationAccountIBAN.slice(4) + destinationAccountIBAN.slice(0, 4)
    const asciiShift = 55
    const sb = []

    for (const c of bank) {
      let v
      if (/[A-Z]/.test(c)) {
        v = c.charCodeAt(0) - asciiShift
      } else {
        v = parseInt(c, 10)
      }
      sb.push(v)
    }

    const checkSumString = sb.join('')
    let checksum = parseInt(checkSumString[0], 10)

    for (let i = 1; i < checkSumString.length; i++) {
      const v = parseInt(checkSumString.charAt(i), 10)
      checksum = (checksum * 10 + v) % 97
    }

    if (checksum !== 1) {
      return `The IBAN is not valid. Please check for incorrectly entered characters.`
    }
  }

  const onValidateTheirReference = (theirReference: string): string | undefined => {
    if (theirReference.length > theirReferenceMaxLength) {
      return `Their reference is too long`
    }
    const theirReferenceReplaceRegex = /[\\.\-/&\s]/g

    const cleanTheirReference = theirReference.replace(theirReferenceReplaceRegex, '')

    if (cleanTheirReference.length < 6) {
      return 'Reference must contain atleast 6 alphanumeric characters'
    }

    const theirReferenceMatchRegex = /^([^\W_]|[\\.\-/&\s]){6,}$/g

    if (theirReference.length > 0 && !theirReferenceMatchRegex.test(theirReference)) {
      return 'Reference must contain only alphanumeric, space, hyphen(-), full stop (.), ampersand (&), and forward slash (/).'
    }
  }

  const onValidateYourReference = (yourReference: string): string | undefined => {
    const yourReferenceMatchRegex = /^[\w\-\s]*$/g

    if (yourReference.length > 0 && !yourReferenceMatchRegex.test(yourReference)) {
      return 'Your reference must contain only alphanumeric, space, and hyphen(-).'
    }
  }

  const onValidateDate = (date: Date | undefined): string | undefined => {
    if (selectedScheduleOption === 'choose-date' && !date) {
      return 'Invalid schedule date.'
    }

    if (selectedScheduleOption === 'choose-date' && date) {
      const maxDate = addDays(new Date(), 61)

      if (
        startOfDay(date) < startOfDay(addDays(new Date(), 1)) ||
        startOfDay(date) > startOfDay(addDays(new Date(), 61))
      ) {
        return `The payment date should be between tomorrow and ${format(maxDate, 'MMM do, yyyy')}`
      }
    }
  }

  const onCurrencyChange = (currency: string) => {
    if (!selectedBeneficiary && (!selectedPayout || selectedPayout.currency !== currency)) {
      setDestinationAccountName('')
      setDestinationAccountIBAN('')
      setDestinationAccountNumber('')
      setDestinationAccountSortCode('')
    }
    setCurrency(currency as Currency)

    if (!selectedAccount || selectedAccount.currency !== currency) {
      const newAccount = accounts?.filter((x) => x.currency === currency)[0]
      setSelectedAccount(newAccount)
      payoutAmount && validateAmount(payoutAmount, newAccount)
    }

    if (selectedBeneficiary && selectedBeneficiary.currency !== currency) {
      setBeneficiaryValidationErrorMessage(beneficiaryDifferentCurrencyMessage)
    } else {
      setBeneficiaryValidationErrorMessage(undefined)
    }
  }

  const handleBeneficiaryOnChange = (value: string) => {
    setDestinationAccountName('')
    setDestinationAccountIBAN('')
    setDestinationAccountNumber('')
    setDestinationAccountSortCode('')
    setBeneficiaryValidationErrorMessage(undefined)
    setSelectedBeneficiary(undefined)

    setDestinationAccountRequiredPrompt(false)
    let beneficiary: LocalBeneficiary | undefined
    if (value === 'addManually') {
      setAddManuallySelected(true)
    } else {
      setAddManuallySelected(false)
      beneficiary = beneficiaries.find((beneficiary) => beneficiary.id === value)
      setSelectedBeneficiary(beneficiary ?? undefined)
      setDestinationAccountName(beneficiary?.name ?? '')
      setDestinationAccountIBAN(beneficiary?.destination?.identifier?.iban ?? '')
      setDestinationAccountNumber(beneficiary?.destination?.identifier?.accountNumber ?? '')
      setDestinationAccountSortCode(beneficiary?.destination?.identifier?.sortCode ?? '')
    }

    if (beneficiary && beneficiary.currency !== currency) {
      setBeneficiaryValidationErrorMessage(beneficiaryDifferentCurrencyMessage)
    }
  }

  const onDateChange = (date: Date | undefined) => {
    setScheduleDate(date)
    setDateValidationErrorMessage(undefined)
  }

  return (
    <>
      {accounts && (
        <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
          <SheetContent className="w-full lg:w-[37.5rem]">
            <div className="bg-white h-screen overflow-auto lg:w-[37.5rem] px-8 py-8">
              <div className="h-fit mb-[7.5rem] lg:mb-0">
                {selectedPayout && (
                  <button type="button" className="hover:cursor-pointer block" onClick={onDismiss}>
                    <Icon name="back/24" />
                  </button>
                )}
                <span className="block text-2xl font-semibold text-default-text mt-8">
                  {selectedPayout ? 'Edit payout' : 'New payout'}
                </span>

                <div className="mt-12 md:flex w-full">
                  <div className="text-left ">
                    <div>
                      {currency && (
                        <InputAmountField
                          currency={currency}
                          onCurrencyChange={onCurrencyChange}
                          allowCurrencyChange={true}
                          value={payoutAmount ?? ''}
                          onChange={handleAmountOnChange}
                          required
                          formSubmitted={createPayoutClicked}
                        ></InputAmountField>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-fit">
                  <ValidationMessage
                    variant="warning"
                    message={amountValidationErrorMessage}
                    label="amount"
                  />
                </div>

                <div className="md:w-[27rem]">
                  <div className="mt-10 flex-row items-baseline">
                    <div className="mb-2">
                      <span className="text-default-text font-semibold text-sm leading-4">
                        From account
                      </span>
                    </div>
                    <div>
                      <SelectAccount
                        className="text-right border border-border-grey md:w-[27rem]"
                        value={selectedAccount?.id}
                        onValueChange={handleAccountOnChange}
                        accounts={accounts.filter((account) => account.currency === currency)}
                      />
                    </div>
                  </div>
                  <div>
                    <ValidationMessage
                      label="account"
                      variant="warning"
                      message={accountValidationErrorMessage}
                    />
                  </div>

                  {beneficiaries.length > 0 && (
                    <div
                      className={cn('mt-8 flex-row items-baseline', {
                        'mb-10': !addManuallySelected,
                      })}
                    >
                      <div className="py-2 flex justify-between">
                        <span className="text-default-text font-semibold text-sm leading-4">
                          Destination account
                        </span>
                        {destinationAccountRequiredPrompt && (
                          <div className="text-[#F32448] font-normal text-xs leading-4">
                            REQUIRED
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <SelectBeneficiary
                          className="text-right border border-border-grey"
                          value={addManuallySelected ? 'addManually' : selectedBeneficiary?.id}
                          onValueChange={handleBeneficiaryOnChange}
                          beneficiaries={beneficiaries}
                        />
                      </div>
                    </div>
                  )}

                  <AnimatePresence initial={false}>
                    {(selectedBeneficiary ||
                      addManuallySelected ||
                      selectedPayout ||
                      !beneficiaries ||
                      beneficiaries.length === 0) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                        animate={{
                          opacity: 1,
                          height: 'auto',
                          marginTop: '32px',
                          marginBottom: '32px',
                          transition: { duration: 0.3 },
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          marginTop: 0,
                          marginBottom: 0,
                          transition: { duration: 0.3 },
                        }}
                      >
                        <div className="items-baseline mt-10">
                          <div className="text-left">
                            <InputTextField
                              label="Account name"
                              maxLength={40}
                              value={destinationAccountName ?? ''}
                              onChange={(value) => setDestinationAccountName(value)}
                              warningValidation={onValidateDestinationAccountName}
                              placeholder="The person or company that owns the account"
                              required
                              formSubmitted={createPayoutClicked}
                              disabled={selectedBeneficiary ? true : false}
                            />
                          </div>
                        </div>
                        <AnimatePresence initial={false}>
                          {(destinationAccountIBAN ||
                            ((addManuallySelected ||
                              selectedPayout ||
                              !beneficiaries ||
                              beneficiaries.length === 0) &&
                              currency === Currency.EUR)) && (
                            <AnimateHeightWrapper layoutId="eur-account-details">
                              <div className="text-left mt-2">
                                <InputTextField
                                  label="Account IBAN"
                                  value={destinationAccountIBAN ?? ''}
                                  onChange={(value) =>
                                    setDestinationAccountIBAN(value.toUpperCase())
                                  }
                                  warningValidation={onValidateDestinationAccountIBAN}
                                  placeholder='e.g. "GB29NWBK60161331926819"'
                                  required
                                  formSubmitted={createPayoutClicked}
                                  disabled={selectedBeneficiary ? true : false}
                                />
                              </div>
                            </AnimateHeightWrapper>
                          )}
                        </AnimatePresence>
                        <AnimatePresence initial={false}>
                          {((destinationAccountSortCode && destinationAccountNumber) ||
                            ((addManuallySelected ||
                              selectedPayout ||
                              !beneficiaries ||
                              beneficiaries.length === 0) &&
                              currency === Currency.GBP)) && (
                            <AnimateHeightWrapper layoutId="gbp-account-details">
                              <div className="text-left mt-2">
                                <InputTextField
                                  variant="numeric"
                                  label="Account number"
                                  maxLength={8}
                                  value={destinationAccountNumber ?? ''}
                                  onChange={(value) => setDestinationAccountNumber(value)}
                                  placeholder='e.g. "12345678"'
                                  required
                                  formSubmitted={createPayoutClicked}
                                  disabled={selectedBeneficiary ? true : false}
                                />
                              </div>
                              <div className="text-left mt-2">
                                <InputTextField
                                  variant="numeric"
                                  label="Account sort code"
                                  maxLength={6}
                                  value={destinationAccountSortCode ?? ''}
                                  onChange={(value) => setDestinationAccountSortCode(value)}
                                  placeholder='e.g. "123456"'
                                  required
                                  formSubmitted={createPayoutClicked}
                                  disabled={selectedBeneficiary ? true : false}
                                />
                              </div>
                            </AnimateHeightWrapper>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div>
                    <ValidationMessage
                      variant="warning"
                      message={beneficiaryValidationErrorMessage}
                      className="-mt-6"
                      label="beneficiary"
                    />
                  </div>

                  <div className="mt-10 items-baseline">
                    <div className="text-left">
                      <div className="flex flex-col">
                        <div className="py-2 flex justify-between">
                          <label className="text-default-text font-semibold text-sm leading-4">
                            {'Payment date'}
                          </label>
                        </div>
                      </div>
                      <RadioGroup
                        value={selectedScheduleOption}
                        onValueChange={setSelectedScheduleOption}
                        className="text-sm/4 space-y-3 mb-4"
                      >
                        <div className="flex items-center space-x-3 mt-4">
                          <RadioGroupItem value="immediately" id="option-1" />
                          <label className="cursor-pointer" htmlFor="option-1">
                            Immediately
                          </label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="choose-date" id="option-2" />
                          <label className="cursor-pointer" htmlFor="option-2">
                            Choose date
                          </label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="ml-7 mb-6 min-h-fit">
                      <AnimatePresence>
                        {selectedScheduleOption === 'choose-date' && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <SingleDatePicker
                              value={scheduleDate}
                              onDateChange={onDateChange}
                              validationErrorMessage={dateValidationErrorMessage}
                              warningValidation={onValidateDate}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div
                    className={cn('items-baseline', {
                      'mt-10': beneficiaries?.length === 0,
                      'mt-8': beneficiaryValidationErrorMessage,
                    })}
                  >
                    <div className="text-left">
                      <InputTextField
                        label="Their reference"
                        maxLength={currency === Currency.EUR ? 139 : 17}
                        value={theirReference ?? ''}
                        onChange={(value) => setTheirReference(value)}
                        warningValidation={onValidateTheirReference}
                        subText="This is what the recipient is going to see."
                        required
                        formSubmitted={createPayoutClicked}
                      />
                    </div>
                  </div>

                  <div className="mt-10 items-baseline">
                    <div className="text-left">
                      <InputTextField
                        label="Your reference"
                        maxLength={50}
                        value={yourReference ?? ''}
                        onChange={(value) => setYourReference(value)}
                        warningValidation={onValidateYourReference}
                        subText="For internal use only."
                      />
                    </div>
                  </div>

                  <div className="mt-10 items-baseline">
                    <div className="text-left">
                      <InputTextAreaField
                        label="Description"
                        maxLength={140}
                        value={description ?? ''}
                        onChange={(e) => setDescription(e.target.value)}
                        subText="For internal use only."
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:mt-14 lg:static lg:p-0 fixed bottom-16 left-0 w-full px-6 mx-auto pb-4 z-20">
                  <div className="mb-4">
                    <ValidationMessage label="form" variant="error" message={formError} />
                  </div>
                  <Button
                    variant="primaryDark"
                    size="large"
                    className="disabled:!bg-grey-text disabled:!opacity-100 disabled:cursor-not-allowed"
                    onClick={() => onCreatePayoutClick(true)}
                    disabled={isCreateAndApproveButtonDisabled}
                  >
                    {isCreateAndApproveButtonDisabled ? (
                      <Loader className="h-6 w-6 mx-auto" />
                    ) : (
                      <span>{selectedPayout ? 'Save changes' : 'Create and authorise'}</span>
                    )}
                  </Button>

                  {!selectedPayout && (
                    <Button
                      variant="secondary"
                      size="large"
                      className="disabled:!bg-grey-text disabled:!opacity-100 disabled:cursor-not-allowed mt-4"
                      onClick={() => onCreatePayoutClick(false)}
                      disabled={isCreatePayoutButtonDisabled}
                    >
                      {isCreatePayoutButtonDisabled ? (
                        <Loader className="h-6 w-6 mx-auto" />
                      ) : (
                        <span>Save for later authorisation</span>
                      )}
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

export default SavePayoutModal
