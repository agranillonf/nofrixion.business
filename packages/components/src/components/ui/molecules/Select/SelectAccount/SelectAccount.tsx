import { Currency } from '@nofrixion/moneymoov'
import { type SelectProps } from '@radix-ui/react-select'

import { LocalAccount } from '../../../../../types/LocalTypes'
import { cn } from '../../../../../utils'
import { formatAmount } from '../../../../../utils/formatters'
import { formatCurrency } from '../../../../../utils/uiFormaters'
// import { cn } from '../../../../../utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../atoms/Select/Select'

export interface SelectAccountPros extends SelectProps {
  onValueChange?: (value: string) => void
  defaultValue?: string
  value?: string
  subText?: string
  className?: string
  accounts: LocalAccount[]
  currency?: Currency
}

const SelectAccount: React.FC<SelectAccountPros> = ({
  defaultValue,
  value,
  onValueChange,
  className,
  accounts,
  ...props
}) => {
  const account = accounts.find((x) => x.id === value)

  return (
    <Select defaultValue={defaultValue} value={value} onValueChange={onValueChange} {...props}>
      {
        <SelectTrigger
          className={cn('w-full md:w-[375px] py-3 rounded h-12 font-normal', className)}
          placeholder="Select account"
        >
          <SelectValue asChild>
            <div className="w-full flex justify-between align-middle">
              {account && (
                <>
                  <span className="break-keep truncate">
                    {accounts.find((x) => x.id === value)?.accountName}
                  </span>
                  <span className="text-[#73888C] whitespace-nowrap">
                    {account && formatCurrency(account.currency)}{' '}
                    <span className="tabular-nums">
                      {account && formatAmount(account.availableBalance)}
                    </span>
                  </span>
                </>
              )}
              {!account && (
                <span className="font-normal text-grey-text text-sm">Select account</span>
              )}
            </div>
          </SelectValue>
        </SelectTrigger>
      }
      <SelectContent className={cn('w-full md:w-[375px] z-[200]', className)}>
        {accounts.map((account) => (
          <SelectItem key={account.id} value={account.id} isText={false}>
            <div className="w-full flex justify-between">
              <span className="break-keep">{account.accountName}</span>
              <span className="text-[#73888C] font-normal">
                {formatCurrency(account.currency)} {formatAmount(account.availableBalance)}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { SelectAccount }
