import { type SelectProps } from '@radix-ui/react-select'

import { cn } from '../../../../../utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../atoms/Select/Select'

export interface SelectPageSizeProps extends SelectProps {
  onValueChange?: (value: string) => void
  defaultValue?: string
  value?: string
  className?: string
}

const pageSizes = [10, 25, 50, 100]

const SelectPageSize: React.FC<SelectPageSizeProps> = ({
  defaultValue,
  value,
  onValueChange,
  className,
  ...props
}) => {
  return (
    <Select defaultValue={defaultValue} value={value} onValueChange={onValueChange} {...props}>
      <SelectTrigger
        subText={value ? value : undefined}
        className={cn('w-full min-h-0 py-2 px-2', className)}
      >
        <SelectValue>{value != undefined ? value : '-'}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {pageSizes.map((pageSize, index) => (
          <SelectItem key={index} value={pageSize.toString()}>
            {pageSize}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { SelectPageSize }
