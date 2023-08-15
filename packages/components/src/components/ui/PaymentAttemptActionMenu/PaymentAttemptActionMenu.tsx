import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cva } from 'class-variance-authority'
import { motion } from 'framer-motion'

import { Icon } from '../atoms'

const actionItemClassNames =
  'group text-xs leading-none rounded-1 flex items-center relative select-none outline-none cursor-pointer'
const actionItem = cva(actionItemClassNames, {
  variants: {
    intent: {
      neutral: ['data-[highlighted]:text-grey-text'],
      negative: ['text-negative-red data-[highlighted]:text-highlighted-negative-red'],
      disabled: ['text-disabled-text data-[highlighted]:text-grey-text'],
    },
  },
  defaultVariants: {
    intent: 'neutral',
  },
})

const handleClick = (e: React.MouseEvent<HTMLDivElement>, handler?: () => void) => {
  if (handler) {
    handler()
  }

  e.stopPropagation()
}

export interface PaymentAttemptActionMenuProps {
  onRefund: () => void
  onVoid?: () => void
  onBlur?: () => void
  isCardVoid: boolean
}

interface PaymentAttemptActionMenuItemContentProps {
  label: string
  iconName: 'return/12' | 'void/12'
}

const PaymentAttemptActionMenuItemContent = ({
  label,
  iconName,
}: PaymentAttemptActionMenuItemContentProps) => {
  return (
    <div className="h-6 flex items-center">
      <div className="pr-2">
        <Icon name={iconName} />
      </div>
      {label}
    </div>
  )
}

const PaymentAttemptActionMenu = ({
  onRefund,
  onVoid,
  onBlur,
  isCardVoid,
}: PaymentAttemptActionMenuProps) => {
  const onRefundClick = (e: React.MouseEvent<HTMLDivElement>) => handleClick(e, onRefund)
  const onVoidClick = (e: React.MouseEvent<HTMLDivElement>) => handleClick(e, onVoid)
  const emptyClick = (e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="rounded-full w-6 h-6 inline-flex items-center justify-center outline-none cursor-pointer align-middle hover:bg-grey-bg text-[#8F99A3] hover:text-control-grey-hover data-[state='open']:text-control-grey-hover"
          aria-label="Actions"
          onBlur={onBlur}
        >
          <Icon name="ellipsis/24" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal className="absolute z-[100]">
        <DropdownMenu.Content
          asChild
          forceMount
          sideOffset={5}
          onClick={emptyClick}
          className="z-[100]"
        >
          <motion.div
            className="min-w-[150px] bg-white rounded-md shadow-[0px_0px_8px_rgba(4,_41,_49,_0.1)] space-y-2 p-4"
            initial={{ opacity: 0.5, y: -5, scaleX: 1, scaleY: 1 }}
            animate={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1 }}
          >
            {!isCardVoid && (
              <DropdownMenu.Item className={actionItem()} onClick={onRefundClick}>
                <PaymentAttemptActionMenuItemContent label="Refund" iconName="return/12" />
              </DropdownMenu.Item>
            )}

            {isCardVoid && (
              <DropdownMenu.Item className={actionItem()} onClick={onVoidClick}>
                <PaymentAttemptActionMenuItemContent label="Void" iconName="void/12" />
              </DropdownMenu.Item>
            )}
          </motion.div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default PaymentAttemptActionMenu
