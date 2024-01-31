import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '../../../../utils'
import { Icon, IconNames } from '../Icon/Icon'

export const buttonVariants = cva(
  'rounded-full inline-flex items-center justify-center whitespace-nowrap align-middle cursor-pointer transition w-full disabled:opacity-20 disabled:cursor-not-allowed select-none',
  {
    variants: {
      variant: {
        primary: [
          'bg-primary-green text-white hover:bg-primary-green-hover stroke:white font-semibold leading-6 disabled:!bg-[#E3E5E8] disabled:text-grey-text disabled:cursor-not-allowed disabled:opacity-100',
        ],
        primaryDark: [
          'bg-[#006A80]',
          'text-white',
          'hover:bg-[#144752]',
          'stroke:white',
          'font-semibold',
          'leading-6',
        ],
        secondary: [
          'bg-secondary-button',
          'text-default-text',
          'hover:bg-secondary-button-hover',
          'font-normal',
          'leading-6',
        ],
        tertiary: [
          'border',
          'border-border-grey',
          'hover:border-border-grey-highlighted',
          'text-default-text',
          'font-normal',
          'leading-6',
        ],
        tertiary_negative: [
          'border',
          'border-negative-red',
          'text-negative-red',
          'hover:text-highlighted-negative-red',
          'hover:border-highlighted-negative-red',
          'font-normal',
          'leading-6',
        ],
        text: [
          'text-grey-text underline underline-offset-2 hover:text-grey-text-hover hover:no-underline',
          'font-normal',
          'leading-6',
        ],
        confirm_negative: [
          'bg-error-bg',
          'text-negative-red',
          'hover:text-highlighted-negative-red',
          'hover:border-highlighted-negative-red',
          'font-normal',
          'leading-6',
        ],
      },
      size: {
        large: ['text-base', 'px-3', 'py-3', 'md:px-6'],
        medium: ['text-sm', 'px-4', 'py-2', 'leading-6'],
        small: ['text-[0.813rem]', 'py-1', 'px-3'],
        'x-small': ['text-[0.813rem]', 'py-1', 'px-3', 'leading-4'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'large',
    },
  },
)

const icon = cva('w-full h-full', {
  variants: {
    variant: {
      primary: ['text-white'],
      primaryDark: ['text-white'],
      secondary: ['text-[#454D54]'],
      tertiary: ['text-[#454D54]'],
      tertiary_negative: ['text-negative-red'],
      text: ['text-[#454D54]', 'hover:text-grey-text-hover'],
      confirm_negative: ['text-negative-red'],
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

const iconContainer = cva('', {
  variants: {
    size: {
      large: ['w-4', 'h-4'],
      medium: ['w-4', 'h-4'],
      small: ['w-4', 'h-4'],
      'x-small': ['w-3', 'h-3'],
    },
  },
  defaultVariants: {
    size: 'large',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  previousArrow?: boolean
  nextArrow?: boolean
  previousIcon?: IconNames
}

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  previousArrow,
  previousIcon,
  nextArrow,
  className,
  children,
  ...props
}) => {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {previousArrow && !previousIcon && (
        <div className={cn(iconContainer({ size }), 'mr-2')}>
          <Icon name="back/16" className={icon({ variant })} />
        </div>
      )}

      {previousIcon && !previousArrow && (
        <div className={cn(iconContainer({ size }), 'mr-2')}>
          <Icon name={previousIcon} className={icon({ variant })} />
        </div>
      )}

      {children}

      {nextArrow && (
        <div className={cn(iconContainer({ size }), 'ml-2')}>
          <Icon name="next/16" className={icon({ variant })} />
        </div>
      )}
    </button>
  )
}

Button.displayName = 'Button'

export { Button }
