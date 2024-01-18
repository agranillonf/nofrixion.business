import { type SelectProps } from '@radix-ui/react-select'

import { cn } from '../../../../../utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../atoms/Select/Select'

const options = {
  today: 'Today',
  yesterday: 'Yesterday',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  last90Days: 'Last 90 days',
  all: 'All',
}

type TDateRangeOptions = keyof typeof options

export interface SelectDateRangePros extends SelectProps {
  onValueChange?: (value: TDateRangeOptions) => void
  defaultValue?: TDateRangeOptions
  value?: TDateRangeOptions
  subText?: string
  className?: string
}

const SelectDateRange: React.FC<SelectDateRangePros> = ({
  defaultValue,
  value,
  onValueChange,
  subText,
  className,
  ...props
}) => {
  const handleOnValueChange = (value: string) => {
    onValueChange && onValueChange(value as TDateRangeOptions)
  }

  return (
    <Select
      defaultValue={defaultValue}
      value={value}
      onValueChange={handleOnValueChange}
      {...props}
    >
      <SelectTrigger subText={subText} className={cn('w-full md:w-[130px]', className)}>
        <SelectValue>{value != undefined ? options[value] : 'Custom'}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.keys(options).map((key) => (
          <SelectItem key={key} value={key}>
            {options[key as keyof typeof options]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { SelectDateRange, type TDateRangeOptions }
