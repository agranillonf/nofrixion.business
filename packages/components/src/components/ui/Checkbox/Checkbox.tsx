import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { useId } from 'react'

import { cn } from '../../../utils'
import { Icon } from '../atoms'
import InfoTooltip from '../InfoTooltip/InfoTooltip'

export interface CheckboxProps {
  label?: string
  description?: string
  infoText?: string
  value: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}

const Checkbox = ({ label, description, value, infoText, onChange, disabled }: CheckboxProps) => {
  const id = useId()

  return (
    <div className="flex md:items-center select-none cursor-pointer text-sm w-fit">
      <RadixCheckbox.Root
        className="bg-white outline outline-1 outline-border-grey border-border-grey rounded-sm min-w-[1rem] min-h-[1rem] w-4 h-4"
        id={id}
        checked={value}
        onCheckedChange={onChange}
        onClick={(event) => event.stopPropagation()}
        disabled={disabled}
      >
        <RadixCheckbox.Indicator
          className={cn('w-full h-full block p-[2px]', { 'bg-[#EDF2F7]': disabled })}
        >
          <Icon
            name="checked/12"
            className={cn('text-[#40BFBF] ', disabled ? 'text-[#ABB2BA]' : 'text-[#40BFBF]')}
          />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>

      {label && (
        <label
          className={cn('cursor-pointer pl-3 pr-2 mb-0 -mt-0.5 md:mt-0', {
            'whitespace-nowrap': !description,
          })}
          htmlFor={id}
        >
          {label}

          {description && (
            <div className="mt-1 text-grey-text font-normal text-xs">{description}</div>
          )}
        </label>
      )}

      {infoText && <InfoTooltip content={infoText} />}
    </div>
  )
}

export default Checkbox
