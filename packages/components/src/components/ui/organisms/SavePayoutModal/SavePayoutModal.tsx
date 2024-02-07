import { ApiError, Currency } from '@nofrixion/moneymoov'
import { addDays, format, isEqual, parseISO, startOfDay } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { LocalAccountIdentifierType } from '../../../../types/LocalEnums'
import {
  LocalAccount,
  LocalBeneficiary,
  LocalCounterparty,
  LocalPayout,
  SystemError,
} from '../../../../types/LocalTypes'
import { cn } from '../../../../utils'
import { validateIBAN } from '../../../../utils/validation'
import { Button, Icon, Sheet, SheetContent } from '../../atoms'
import InputTextField from '../../atoms/InputTextField/InputTextField'
import { RadioGroup, RadioGroupItem } from '../../atoms/RadioGroup/RadioGroup'
import { ValidationMessage } from '../../atoms/ValidationMessage/ValidationMessage'
import InlineError from '../../InlineError/InlineError'
import InputAmountField from '../../InputAmountField/InputAmountField'
import InputTextAreaField from '../../InputTextAreaField/InputTextAreaField'
import { Loader } from '../../Loader/Loader'
import { SelectAccount } from '../../molecules/Select/SelectAccount/SelectAccount'
import { SelectBeneficiary } from '../../molecules/Select/SelectBeneficiary/SelectBeneficiary'
import AnimateHeightWrapper from '../../utils/AnimateHeight'
import { SingleDatePicker } from '../SingleDatePicker/SingleDatePicker'

export interface SavePayoutModalProps {
  onCreatePayout?: (
    sourceAccount: LocalAccount,
    counterParty: LocalCounterparty,
    amount: number,
    theirReference: string,
    yourReference?: string,
    description?: string,
    createAndApprove?: boolean,
    scheduled?: boolean,
    scheduleDate?: Date,
    beneficiaryID?: string,
  ) => Promise<ApiError | undefined>
  onUpdatePayout?: (
    sourceAccount: LocalAccount,
    counterParty: LocalCounterparty,
    amount: number,
    theirReference: string,
    yourReference?: string,
    description?: string,
    updateAndApprove?: boolean,
    scheduled?: boolean,
    scheduleDate?: Date,
    beneficiaryID?: string,
  ) => Promise<ApiError | undefined>
  onDismiss: () => void
  accounts: LocalAccount[]
  isOpen: boolean
  beneficiaries: LocalBeneficiary[]
  isUserAuthoriser: boolean
  selectedPayout?: LocalPayout
}

const SavePayoutModal: React.FC<SavePayoutModalProps> = ({
  onCreatePayout,
  onUpdatePayout,
  onDismiss,
  accounts,
  beneficiaries,
  isOpen,
  isUserAuthoriser,
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
  const [dateValidationErrorMessage, setDateValidationErrorMessage] = useState<string | undefined>(
    undefined,
  )
  const [showFromAccountAutomaticallyChanged, setShowFromAccountAutomaticallyChanged] =
    useState(false)

  const [formError, setFormError] = useState<string | undefined>(undefined)
  const [payoutAmount, setPayoutAmount] = useState<string | undefined>('')
  const [fromAccount, setFromAccount] = useState<LocalAccount | undefined>()
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

  const [isFromAccountRequiredPrompt, setIsFromAccountRequiredPrompt] = useState<boolean>(false)
  const [destinationAccountRequiredPrompt, setDestinationAccountRequiredPrompt] =
    useState<boolean>(false)

  const [createPayoutClicked, setCreatePayoutClicked] = useState<boolean>(false)
  const [selectedScheduleOption, setSelectedScheduleOption] = useState('immediately')
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(addDays(new Date(), 1))
  const [changesMade, setChangesMade] = useState<boolean>(false)

  const [showPayoutError, setShowPayoutError] = useState(false)
  const [payoutError, setPayoutError] = useState<SystemError | undefined>(undefined)

  useEffect(() => {
    if (!isOpen) {
      resetFields()
    }
  }, [isOpen])

  // After the `showFromAccountAutomaticallyChanged` goes true
  // we need to reset it to false after 3 second
  // so the user can see the message and then it disappears
  useEffect(() => {
    if (showFromAccountAutomaticallyChanged) {
      const timer = setTimeout(() => {
        setShowFromAccountAutomaticallyChanged(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showFromAccountAutomaticallyChanged])

  const singleCurrency =
    accounts
      .map((item) => item.currency)
      .filter((value, index, self) => self.indexOf(value) === index).length === 1
      ? accounts
          .map((item) => item.currency)
          .filter((value, index, self) => self.indexOf(value) === index)[0]
      : undefined

  const [currency, setCurrency] = useState<Currency | undefined>(
    singleCurrency !== undefined ? singleCurrency : Currency.EUR,
  )

  useEffect(() => {
    fillSelectedPayoutFields()
  }, [selectedPayout])

  // Checks if changes have been made when in Edit mode
  useEffect(() => {
    let noChanges =
      fromAccount?.id === selectedPayout?.accountID &&
      payoutAmount === selectedPayout?.amount?.toString() &&
      theirReference === selectedPayout?.theirReference &&
      yourReference === selectedPayout?.yourReference &&
      description === selectedPayout?.description &&
      selectedScheduleOption === (selectedPayout?.scheduled ? 'choose-date' : 'immediately')

    if (selectedPayout?.beneficiaryID) {
      noChanges = noChanges && selectedPayout?.beneficiaryID === selectedBeneficiary?.id
    } else {
      noChanges =
        noChanges &&
        (selectedPayout?.destination?.name ? selectedPayout?.destination?.name : '') ===
          destinationAccountName
      if (currency === Currency.EUR) {
        noChanges =
          noChanges && selectedPayout?.destination?.identifier?.iban === destinationAccountIBAN
      } else if (currency === Currency.GBP) {
        noChanges =
          noChanges &&
          selectedPayout?.destination?.identifier?.accountNumber === destinationAccountNumber
        noChanges =
          noChanges &&
          selectedPayout?.destination?.identifier?.sortCode === destinationAccountSortCode
      }
    }

    if (selectedScheduleOption === 'choose-date') {
      noChanges =
        noChanges &&
        ((!selectedPayout?.scheduleDate && !scheduleDate) ||
          isEqual(parseISO(selectedPayout!.scheduleDate!.toString()), scheduleDate!))
    }

    setChangesMade(!selectedPayout || !noChanges)
  }, [
    selectedPayout,
    fromAccount,
    payoutAmount,
    theirReference,
    yourReference,
    description,
    destinationAccountName,
    destinationAccountIBAN,
    destinationAccountNumber,
    destinationAccountSortCode,
    selectedBeneficiary,
    selectedScheduleOption,
    scheduleDate,
  ])

  const theirReferenceMaxLength = currency === Currency.EUR ? 139 : 17

  const balanceLessThanAmountMessage = "This account doesn't have enough funds for this transaction"

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
    fromAccount && validateAmount(value, fromAccount)
  }

  const handleFromAccountOnChange = (value: string) => {
    setAccountValidationErrorMessage(undefined)
    const account = accounts.find((account) => account.id === value)

    setFromAccount(account ?? getAccountFromCurrencyOrExistingPayout())

    setIsFromAccountRequiredPrompt(false)

    if (account && account.availableBalance < Number(payoutAmount)) {
      setAccountValidationErrorMessage(balanceLessThanAmountMessage)
    }
  }

  const handleValidation = (): boolean => {
    let validationFailed = false
    setAmountValidationErrorMessage(undefined)
    setDestinationAccountRequiredPrompt(false)
    setIsFromAccountRequiredPrompt(false)

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

    setIsFromAccountRequiredPrompt(!fromAccount)

    if (
      !(
        (destinationAccountIBAN || (destinationAccountNumber && destinationAccountSortCode)) &&
        payoutAmount &&
        fromAccount &&
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

    if (fromAccount && fromAccount.availableBalance < Number(payoutAmount)) {
      validationFailed = true
    }

    const validateScheduleDateMessage = onValidateDate(scheduleDate)

    if (validateScheduleDateMessage) {
      setDateValidationErrorMessage(validateScheduleDateMessage)
      validationFailed = true
    }

    return validationFailed
  }

  const buildCounterPartyForSaving = (): LocalCounterparty => {
    return {
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
  }

  const savePayout = async (saveAndApprove?: boolean) => {
    setShowPayoutError(false)
    setPayoutError(undefined)

    setCreatePayoutClicked(true)
    if (handleValidation()) {
      return
    } else {
      if (!saveAndApprove) {
        setIsCreatePayoutButtonDisabled(true)
      } else {
        setIsCreateAndApproveButtonDisabled(true)
      }
      let parsedAmount = Number(payoutAmount)
      parsedAmount = parsedAmount ?? 0

      const counterParty: LocalCounterparty = buildCounterPartyForSaving()

      if (!selectedPayout && onCreatePayout) {
        const apiError = await onCreatePayout(
          fromAccount!,
          counterParty,
          parsedAmount,
          theirReference!,
          yourReference,
          description,
          saveAndApprove,
          selectedScheduleOption === 'choose-date',
          scheduleDate,
          selectedBeneficiary?.id,
        )

        if (apiError) {
          setPayoutError({
            title: saveAndApprove ? 'Payout authorisation error' : 'Create payout has failed',
            message: apiError.detail,
          })
          setShowPayoutError(true)
        }
      } else if (selectedPayout && onUpdatePayout) {
        const apiError = await onUpdatePayout(
          fromAccount!,
          counterParty,
          parsedAmount,
          theirReference!,
          yourReference,
          description,
          saveAndApprove,
          selectedScheduleOption === 'choose-date',
          scheduleDate,
          selectedBeneficiary?.id,
        )

        if (apiError) {
          setPayoutError({
            title: saveAndApprove
              ? 'Payout authorisation error'
              : 'Update payout details has failed',
            message: apiError.detail,
          })
          setShowPayoutError(true)
        }
      }

      setIsCreatePayoutButtonDisabled(false)
      setIsCreateAndApproveButtonDisabled(false)
    }
  }

  const fillSelectedPayoutFields = () => {
    setCurrency(selectedPayout?.currency ? selectedPayout.currency : currency)
    setPayoutAmount(selectedPayout?.amount?.toString() ?? '')
    setTheirReference(selectedPayout?.theirReference)
    setYourReference(selectedPayout?.yourReference)
    setDescription(selectedPayout?.description)

    if (selectedPayout) {
      if (selectedPayout.beneficiaryID) {
        handleBeneficiaryOnChange(selectedPayout.beneficiaryID)
      } else {
        handleBeneficiaryOnChange('addManually')
        setDestinationAccountName(selectedPayout?.destination?.name)
        setDestinationAccountIBAN(selectedPayout?.destination?.identifier?.iban)
        setDestinationAccountNumber(selectedPayout?.destination?.identifier?.accountNumber)
        setDestinationAccountSortCode(selectedPayout?.destination?.identifier?.sortCode)
      }
    } else {
      setSelectedBeneficiary(undefined)
      setAddManuallySelected(false)
    }

    setSelectedScheduleOption(selectedPayout?.scheduled ? 'choose-date' : 'immediately')
    onDateChange(
      selectedPayout?.scheduled && selectedPayout?.scheduleDate
        ? parseISO(selectedPayout.scheduleDate.toString())
        : addDays(new Date(), 1),
    )

    const selectedAccount = getAccountFromCurrencyOrExistingPayout()
    setFromAccount(selectedAccount)
    validateAmount(selectedPayout?.amount?.toString() ?? '', selectedAccount)
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
    setFormError(undefined)
    setCreatePayoutClicked(false)
    setIsCreatePayoutButtonDisabled(false)
    setIsCreateAndApproveButtonDisabled(false)
    setSelectedScheduleOption('immediately')
    setScheduleDate(addDays(new Date(), 1))
    setDateValidationErrorMessage(undefined)
    setFromAccount(getAccountFromCurrencyOrExistingPayout())
    setShowPayoutError(false)
    setPayoutError(undefined)

    if (selectedPayout) {
      fillSelectedPayoutFields()
    }
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
    const valid = validateIBAN(destinationAccountIBAN)

    if (!valid) {
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

    // If the selected account is not in the selected currency, leave the from account picker empty
    if (fromAccount?.currency !== currency) {
      setFromAccount(accounts.find((acc) => acc.currency == currency))
      setShowFromAccountAutomaticallyChanged(true)
    }

    if (selectedBeneficiary && selectedBeneficiary.currency !== currency) {
      setSelectedBeneficiary(undefined)
    }
  }

  const handleBeneficiaryOnChange = (value: string) => {
    setDestinationAccountName('')
    setDestinationAccountIBAN('')
    setDestinationAccountNumber('')
    setDestinationAccountSortCode('')
    setSelectedBeneficiary(undefined)

    setDestinationAccountRequiredPrompt(false)
    setIsFromAccountRequiredPrompt(false)
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
  }

  const onDateChange = (date: Date | undefined) => {
    setScheduleDate(date)
    setDateValidationErrorMessage(undefined)
  }

  const onSavePayoutClick = async () => {
    await savePayout(false)
  }

  const onSaveAndAuthorisePayoutClick = async () => {
    await savePayout(true)
  }

  return (
    <>
      {accounts && (
        <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
          <SheetContent
            className="w-full lg:w-[37.5rem]"
            onOpenAutoFocus={(event) => {
              event.preventDefault()
            }}
          >
            <div className="bg-white h-screen overflow-auto lg:w-[37.5rem] px-8 py-8">
              <div className="h-fit mb-[7.5rem] lg:mb-0">
                {selectedPayout && (
                  <button
                    type="button"
                    className="hover:cursor-pointer block"
                    onClick={onDismiss}
                    tabIndex={-1}
                  >
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
                    <div className="py-2 flex justify-between">
                      <span className="text-default-text font-semibold text-sm leading-4">
                        From account
                      </span>
                      {isFromAccountRequiredPrompt && (
                        <div className="text-[#F32448] font-normal text-xs leading-4">REQUIRED</div>
                      )}
                    </div>
                    <div>
                      <SelectAccount
                        className="text-right border border-border-grey md:w-[27rem]"
                        value={fromAccount?.id ?? ''}
                        onValueChange={handleFromAccountOnChange}
                        accounts={accounts.filter((account) => account.currency === currency)}
                      />
                    </div>
                    <div className="w-full">
                      <ValidationMessage
                        variant="info"
                        message={
                          showFromAccountAutomaticallyChanged
                            ? 'Your account was changed to match the selected currency'
                            : undefined
                        }
                        label="from-account"
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
                          value={
                            addManuallySelected
                              ? 'addManually'
                              : selectedBeneficiary
                              ? selectedBeneficiary?.id
                              : ''
                          }
                          onValueChange={handleBeneficiaryOnChange}
                          beneficiaries={beneficiaries.filter(
                            (beneficiary) => beneficiary.currency === currency,
                          )}
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
                        onChange={setDescription}
                        subText="For internal use only."
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:mt-14 lg:static lg:p-0 fixed bottom-16 left-0 w-full px-6 mx-auto pb-4 z-20">
                  <div className="mb-4">
                    <ValidationMessage label="form" variant="error" message={formError} />
                  </div>

                  {showPayoutError && payoutError && (
                    <div className="lg:mb-14">
                      <InlineError title={payoutError.title} messages={[payoutError.message]} />
                    </div>
                  )}

                  {changesMade && isUserAuthoriser && (
                    <Button
                      variant="primaryDark"
                      size="large"
                      className="disabled:!bg-grey-text disabled:!opacity-100 disabled:cursor-not-allowed"
                      onClick={onSaveAndAuthorisePayoutClick}
                      disabled={isCreateAndApproveButtonDisabled}
                    >
                      {isCreateAndApproveButtonDisabled ? (
                        <Loader className="h-6 w-6 mx-auto" />
                      ) : (
                        <span>
                          {selectedPayout ? 'Save and authorise' : 'Create and authorise'}
                        </span>
                      )}
                    </Button>
                  )}
                  {changesMade && (
                    <Button
                      variant={isUserAuthoriser ? 'secondary' : 'primaryDark'}
                      size="large"
                      className="disabled:!bg-grey-text disabled:!opacity-100 disabled:cursor-not-allowed mt-4"
                      onClick={onSavePayoutClick}
                      disabled={isCreatePayoutButtonDisabled}
                    >
                      {isCreatePayoutButtonDisabled ? (
                        <Loader className="h-6 w-6 mx-auto" />
                      ) : (
                        <span>
                          {isUserAuthoriser && selectedPayout
                            ? 'Save for later authorisation'
                            : 'Submit for authorisation'}
                        </span>
                      )}
                    </Button>
                  )}
                  {!changesMade && (
                    <Button
                      variant="primaryDark"
                      size="large"
                      className="disabled:!bg-[#E3E5E8] disabled:!opacity-100 disabled:cursor-not-allowed disabled:text-grey-text"
                      disabled={!changesMade}
                    >
                      <span>No changes made</span>
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
