import { AnimatePresence, LayoutGroup } from 'framer-motion'

import { Button, Icon } from '../../ui/atoms'
import LayoutWrapper from '../../ui/utils/LayoutWrapper'

export interface CurrentAccountsHeaderProps {
  onCreatePaymentAccount: () => void
}

const CurrentAccountsHeader = ({ onCreatePaymentAccount }: CurrentAccountsHeaderProps) => {
  return (
    <div className="flex gap-8 justify-between items-center mb-8 md:mb-[68px]">
      <span className="md:pl-4 leading-8 font-medium text-2xl md:text-[1.75rem]">
        Currents accounts
      </span>
      <LayoutGroup>
        <AnimatePresence initial={false}>
          <LayoutWrapper>
            <Button size="big" onClick={onCreatePaymentAccount} variant="secondary">
              <Icon name="add/16" className="text-default-text" />
              <span className="pl-2 md:inline-block">New Account</span>
            </Button>
          </LayoutWrapper>
        </AnimatePresence>
      </LayoutGroup>
    </div>
  )
}

export default CurrentAccountsHeader
