import { cva, VariantProps } from 'class-variance-authority'

import { LocalContact } from '../../../types/LocalTypes'
import { cn } from '../../../utils'
import { defaultAnonymousUserName } from '../../../utils/constants'

const containerVariant = cva('flex flex-col', {
  variants: {
    size: {
      small: [''],
      normal: [''],
      large: ['pr-6'],
    },
  },
  defaultVariants: {
    size: 'small',
  },
})

const nameVariants = cva('', {
  variants: {
    size: {
      small: ['truncate text-13px'],
      normal: ['truncate text-sm/4 mb-2'],
      large: ['text-[1.25rem]', 'font-semibold', 'leading-7', 'mb-2'],
    },
  },
  defaultVariants: {
    size: 'small',
  },
})

const emailVariants = cva('text-grey-text break-all', {
  variants: {
    size: {
      small: ['text-xs truncate'],
      normal: ['text-xs'],
      large: ['text-sm'],
    },
  },
  defaultVariants: {
    size: 'small',
  },
})

export interface ContactProps extends LocalContact {
  size?: VariantProps<typeof nameVariants>['size']
  emailClassName?: string
}

const Contact = ({ name, email, size = 'small', emailClassName }: ContactProps) => {
  return (
    <div className={containerVariant({ size })}>
      <p className={nameVariants({ size })}>{name ?? defaultAnonymousUserName}</p>
      {email && <p className={cn(emailVariants({ size }), emailClassName)}>{email}</p>}
    </div>
  )
}

export default Contact
