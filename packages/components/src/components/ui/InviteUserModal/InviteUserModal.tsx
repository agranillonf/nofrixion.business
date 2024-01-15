import { ApiError } from '@nofrixion/moneymoov'
import { useEffect, useState } from 'react'

import { SystemError } from '../../../types/LocalTypes'
import { validateEmail } from '../../../utils/validation'
import { Button, Sheet, SheetContent } from '../atoms'
import InputTextField from '../atoms/InputTextField/InputTextField'
import { ValidationMessage } from '../atoms/ValidationMessage/ValidationMessage'
import InlineError from '../InlineError/InlineError'
import { Loader } from '../Loader/Loader'

export interface InviteUserModalProps {
  merchantID: string
  onInvite: (merchantID: string, emailAddress: string) => Promise<ApiError | undefined>
  onDismiss: () => void
  isOpen: boolean
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  merchantID,
  onInvite,
  onDismiss,
  isOpen,
}) => {
  const [isInviteButtonDisabled, setIsInviteButtonDisabled] = useState(false)

  const [formError, setFormError] = useState<string | undefined>(undefined)
  const [emailAddress, setEmailAddress] = useState<string | undefined>(undefined)

  const [sendInviteClicked, setSendInviteClicked] = useState(false)

  const [showInviteUserError, setShowInviteUserError] = useState(false)
  const [inviteUserError, setInviteUserError] = useState<SystemError | undefined>(undefined)

  useEffect(() => {
    if (!isOpen) {
      resetFields()
    }
  }, [isOpen])

  const handleValidation = (): boolean => {
    let validationFailed = false

    if (emailAddress && validateEmail(emailAddress)) {
      setIsInviteButtonDisabled(false)
      validationFailed = true
    }

    return validationFailed
  }

  const onInviteClick = async () => {
    setInviteUserError(undefined)
    setShowInviteUserError(false)
    setIsInviteButtonDisabled(true)
    setSendInviteClicked(true)

    if (!handleValidation()) {
      setIsInviteButtonDisabled(false)
      return
    } else {
      const apiError = await onInvite(merchantID, emailAddress!)

      if (apiError) {
        setInviteUserError({
          title: 'Invite user to MoneyMoov has failed',
          message: apiError.detail,
        })
        setShowInviteUserError(true)
      }

      setIsInviteButtonDisabled(false)
    }
  }

  const resetFields = () => {
    setEmailAddress(undefined)
    setFormError(undefined)
    setSendInviteClicked(false)
    setIsInviteButtonDisabled(false)
    setInviteUserError(undefined)
    setShowInviteUserError(false)
  }

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      onDismiss()
    }
  }

  const onValidateEmail = (email: string) => {
    if (email && !validateEmail(email)) {
      setIsInviteButtonDisabled(false)
      return 'Make sure the email address is valid.'
    }
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
        <SheetContent className="w-full lg:w-[37.5rem]">
          <div className="bg-white h-screen overflow-auto lg:w-[37.5rem] px-8">
            <div className="h-fit mb-[7.5rem] lg:mb-0">
              <span className="block text-2xl font-semibold text-default-text mt-10 mb-10">
                Invite user
              </span>
              <div className="lg:w-[27rem]">
                <div className="text-left mt-2">
                  <InputTextField
                    label="Email address"
                    type="email"
                    value={emailAddress ?? ''}
                    onChange={(value) => {
                      setFormError(undefined)
                      setSendInviteClicked(false)
                      setEmailAddress(value)
                    }}
                    warningValidation={onValidateEmail}
                    required
                    maxLength={254}
                    formSubmitted={sendInviteClicked}
                  />
                </div>

                <div className="lg:mt-16 lg:static lg:p-0 fixed bottom-16 left-0 w-full px-6 mx-auto pb-4 z-20">
                  {showInviteUserError && inviteUserError && (
                    <div className="lg:mb-14">
                      <InlineError
                        title={inviteUserError.title}
                        messages={[inviteUserError.message]}
                      />
                    </div>
                  )}
                  <div>
                    <ValidationMessage label="form" variant="error" message={formError} />
                  </div>
                  <Button
                    variant="primaryDark"
                    size="large"
                    className="mt-4 disabled:!bg-grey-text disabled:!opacity-100 disabled:cursor-not-allowed lg:w-[10.25rem]"
                    onClick={() => onInviteClick()}
                    disabled={isInviteButtonDisabled}
                  >
                    {isInviteButtonDisabled ? (
                      <Loader className="h-6 w-6 mx-auto" />
                    ) : (
                      <span>Send invitation</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default InviteUserModal
