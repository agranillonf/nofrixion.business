import { Switch as SwitchHeadless } from '@headlessui/react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '../../../utils'

export interface SwitchProps extends VariantProps<typeof switchVariants> {
  label?: string
  value: boolean
  onChange: (value: boolean) => void
  icon?: string
  className?: string
}

const switchVariants = cva(
  'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out',
  {
    variants: {
      size: {
        small: ['h-4 w-8'],
        medium: ['h-5 w-10'],
      },
    },
  },
)

const circleVariants = cva('inline-block transform rounded-full bg-white transition', {
  variants: {
    size: {
      small: ['h-3 w-3'],
      medium: ['h-4 w-4'],
    },
    active: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      size: 'small',
      active: true,
      class: 'translate-x-[1.125rem]',
    },
    {
      size: 'medium',
      active: true,
      class: 'translate-x-[1.375rem]',
    },
    {
      size: 'small',
      active: false,
      class: 'translate-x-[0.15rem]',
    },
    {
      size: 'medium',
      active: false,
      class: 'translate-x-[0.125rem]',
    },
  ],
})

const Switch = ({ label, value, icon, className, onChange, size = 'medium' }: SwitchProps) => {
  return (
    <div className={cn('flex w-full select-none items-center', className)}>
      <SwitchHeadless.Group>
        {label && (
          <SwitchHeadless.Label className="cursor-pointer flex items-center flex-1">
            <img src={icon} alt={`${label} icon`} className="w-6 h-6 mr-4 inline-block" />
            <span className="align-middle pr-2">{label}</span>
          </SwitchHeadless.Label>
        )}
        <SwitchHeadless
          checked={value}
          onChange={onChange}
          className={cn(
            {
              'bg-primary-green': value,
              'bg-border-grey': !value,
            },
            switchVariants({ size }),
          )}
        >
          <span className={cn(circleVariants({ size, active: value }))} />
        </SwitchHeadless>
      </SwitchHeadless.Group>
    </div>
  )
}

export default Switch
