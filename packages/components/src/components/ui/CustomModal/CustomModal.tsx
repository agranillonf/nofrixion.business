import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import { cn } from '../../../utils'
import { Button, Icon } from '../../ui/atoms'
import Checkbox from '../Checkbox/Checkbox'

export interface CustomModalProps extends BaseModalProps {
  title: string
  children: React.ReactNode
  onApplyEnabled?: boolean
  buttonRowClassName?: string
  buttonText?: string
  buttonClaseName?: string
}

export interface BaseModalProps {
  open: boolean
  onApply?: (data: any) => void
  onDismiss: () => void
  showDefault?: boolean
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
  buttonClaseName = 'w-full md:w-auto px-16 ml-auto',
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
              className="fixed top-[50%] left-[50%] w-full max-w-md translate-x-[-50%] translate-y-[-50%] z-50"
              onEscapeKeyDown={handleOnDismiss}
              onInteractOutside={handleOnDismiss}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col min-h-full justify-center overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                  <Dialog.Title asChild>
                    <h3 className="text-2xl font-medium leading-8 md:leading-6 p-6 md:p-12 md:pt-2 mt-6">
                      {title}
                    </h3>
                  </Dialog.Title>
                  <div className="px-6 md:px-12">{children}</div>
                  <div
                    className={cn(
                      buttonRowClassName,
                      'bg-main-grey flex flex-col-reverse items-center gap-4 md:gap-0 md:flex-row md:justify-between px-6 md:pl-8 md:pr-6 py-4 mt-4 md:mt-12',
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

                    <Button
                      variant="primaryDark"
                      size="medium"
                      onClick={onApplyClicked}
                      disabled={!onApplyEnabled}
                      className={buttonClaseName}
                    >
                      {buttonText}
                    </Button>
                  </div>
                </div>
                <Dialog.Close asChild>
                  <button className="absolute top-0 right-0 mt-6 mr-6" onClick={handleOnDismiss}>
                    <Icon
                      name="close/16"
                      className="w-4 h-4 transition stroke-control-grey hover:stroke-control-grey-hover"
                    />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

export default CustomModal
