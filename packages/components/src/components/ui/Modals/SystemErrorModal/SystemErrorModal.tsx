import { Icon } from '../../atoms/Icon/Icon'
import CustomModal, { BaseModalProps } from '../../CustomModal/CustomModal'

export interface SystemErrorModalProps extends BaseModalProps {
  onDismiss: () => void
  onCancel?: () => void
  onApply?: () => void
  title?: string
  message?: string
  primaryButtonText?: string
  showSupport?: boolean
}

const SystemErrorModal = ({
  title,
  message,
  onDismiss,
  onApply,
  onCancel,
  open,
  showSupport = true,
  primaryButtonText = 'Understood',
}: SystemErrorModalProps) => {
  const handleOnDismiss = () => {
    onDismiss()
  }

  return (
    <CustomModal
      open={open}
      onApply={onApply ?? handleOnDismiss}
      onDismiss={handleOnDismiss}
      buttonText={primaryButtonText}
      showDefault={false}
      showSupport={showSupport}
      contentClassName=" max-w-[33rem]"
      onCancel={onCancel}
    >
      <div className="mt-6 md:mt-12 h-full">
        <div className="flex flex-col items-center">
          <Icon name="alert/48" className="text-negative-red" />
        </div>
        <h3 className="text-2xl font-semibold leading-8 my-8 text-default-text">{title}</h3>
        <p className="text-sm font-normal leading-5 text-default-text">{message}</p>
      </div>
    </CustomModal>
  )
}

export default SystemErrorModal
