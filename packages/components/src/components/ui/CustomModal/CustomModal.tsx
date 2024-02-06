import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { cn } from '../../../utils'
import { Button, Icon } from '../../ui/atoms'
import Checkbox from '../Checkbox/Checkbox'

export interface CustomModalProps extends BaseModalProps {
  title?: string
  children: React.ReactNode
  onApplyEnabled?: boolean
  buttonRowClassName?: string
  buttonText?: string
  buttonClaseName?: string
  showSupport?: boolean
  contentClassName?: string
  onUseAsDefaultChanged?: (isDefaultChecked: boolean) => void
  scrollableContent?: boolean
  onCancel?: () => void
}

export interface BaseModalProps {
  open: boolean
  onApply?: (data: any) => void
  onDismiss: () => void
  showDefault?: boolean
  showFooter?: boolean
}

interface CustomModalState {
  isDefaultChecked: boolean
}

const CustomModal = ({
  title,
  children,
  open,
  onApply,
  onDismiss,
  onApplyEnabled = true,
  buttonRowClassName,
  showDefault = true,
  buttonText = 'Apply',
  buttonClaseName,
  showSupport = false,
  contentClassName = 'max-w-md',
  onUseAsDefaultChanged,
  showFooter = true,
  scrollableContent = false,
  onCancel,
}: CustomModalProps) => {
  const [isDefaultChecked, setIsDefaultChecked] = useState<boolean>(false)
  const [currentState, setCurrentState] = useState<CustomModalState>()

  const onApplyClicked = () => {
    if (!onApply) return

    // Add the isDefaultChecked value to the formData
    const formData = {
      isDefaultChecked: isDefaultChecked,
    }

    setCurrentState({ isDefaultChecked: formData.isDefaultChecked })
    onApply(formData)
  }

  const handleOnDismiss = () => {
    onDismiss()

    // Reset to initial state
    if (currentState) {
      setIsDefaultChecked(currentState.isDefaultChecked)
    }
  }

  useEffect(() => {
    if (onUseAsDefaultChanged) {
      onUseAsDefaultChanged(isDefaultChecked)
    }
  }, [isDefaultChecked])

  return (
    <Dialog.Root open={open}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount>
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-25 z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              forceMount
              className={cn(
                'fixed top-[50%] left-[50%] w-full translate-x-[-50%] translate-y-[-50%] z-50',
                contentClassName,
              )}
              onEscapeKeyDown={handleOnDismiss}
              onInteractOutside={handleOnDismiss}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
              >
                {title && (
                  <Dialog.Title asChild>
                    <h3 className="text-2xl font-semibold leading-8 md:leading-6 p-6 md:p-12 md:pb-8 md:pt-0 mt-12">
                      {title}
                    </h3>
                  </Dialog.Title>
                )}
                <div
                  className={cn('px-6 md:px-12', {
                    'pb-12': !showFooter,
                    'max-h-full overflow-y-auto': scrollableContent,
                  })}
                >
                  {children}
                </div>
                {showFooter && (
                  <div
                    className={cn(
                      buttonRowClassName,
                      'bg-main-grey flex flex-col-reverse items-center gap-4 md:gap-0 md:flex-row md:justify-between px-6 md:pl-8 md:pr-6 py-4 mt-4 md:mt-10',
                    )}
                  >
                    {showDefault && (
                      <div>
                        <Checkbox
                          label="Use as my default"
                          value={isDefaultChecked}
                          onChange={setIsDefaultChecked}
                        />
                      </div>
                    )}

                    {showSupport && (
                      <div className="flex mr-4 items-center">
                        <Icon name="support/16" className="text-control-grey-hover" />
                        <a
                          className="ml-2 font-normal text-xs leading-4 text-default-text py-1 underline"
                          href="https://tally.so#tally-open=3NX0Ap"
                        >
                          Contact support
                        </a>
                      </div>
                    )}

                    {onCancel && (
                      <Button
                        variant="secondary"
                        size="large"
                        onClick={onCancel}
                        className="ml-auto mr-4 w-full md:w-[10.625rem]"
                      >
                        Cancel
                      </Button>
                    )}

                    <Button
                      variant="primaryDark"
                      size="large"
                      onClick={onApplyClicked}
                      disabled={!onApplyEnabled}
                      className={cn(
                        'w-full md:w-[10.625rem] px-16',
                        { 'ml-auto': !onCancel },
                        buttonClaseName,
                      )}
                    >
                      {buttonText}
                    </Button>
                  </div>
                )}
              </motion.div>
              <Dialog.Close asChild>
                <button className="absolute top-0 right-0 mt-6 mr-6" onClick={handleOnDismiss}>
                  <Icon
                    name="close/16"
                    className="w-4 h-4 transition stroke-control-grey hover:stroke-control-grey-hover"
                  />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

export default CustomModal
