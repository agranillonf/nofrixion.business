import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../../../../utils'
import { Icon } from '../../atoms'
import { IconNames } from '../../atoms/Icon/Icon'

const statusVariants = cva(
  'rounded-full space-x-1.5 inline-flex items-center text-default-text whitespace-nowrap',
  {
    variants: {
      variant: {
        paid: ['bg-[#D8F2EA]', 'text-[#004D33]'],
        partial: ['bg-[#FCF5CF]', 'text-[#663300]'],
        unpaid: ['bg-[#F1F3F4]'],
        overpaid: ['bg-[#D8F2EA]', 'text-[#004D33]'],
        authorised: ['bg-[#F1F3F4]', 'text-default-text'],
        pending: ['bg-information-bg'],
        pending_approval: ['bg-warning-yellow', 'text-[#663300]'],
        failed: ['bg-[#FEE7EB]', 'text-[#4D000D]'],
        inprogress: ['bg-main-grey'],
        authorise: ['text-[#454D54]'],
        invited: ['bg-main-grey'],
        role_pending: ['bg-warning-yellow', 'text-[#663300]'],
        active: ['bg-[#D8F2EA]', 'text-[#004D33]'],
        expired_link: ['bg-error-bg', 'text-negative-red'],
        scheduled: ['bg-information-bg', 'text-default-text'],
        draft: ['bg-main-grey'],
      },
      size: {
        small: ['text-xs', 'font-normal', 'py-1', 'px-2', 'h-fit'],
        medium: ['text-[0.688rem]', 'font-medium', 'px-2', 'py-[0.125rem]', 'h-fit', 'w-fit'],
        large: ['text-sm', 'font-medium', 'px-3', 'py-1.5', 'h-fit', 'w-fit'],
      },
    },
    defaultVariants: {
      variant: 'unpaid',
      size: 'small',
    },
  },
)

const iconVariants = cva('w-auto mb-[0.063rem]', {
  variants: {
    variant: {
      paid: ['text-[#29A37A]'],
      partial: ['text-[#B25900]'],
      unpaid: ['text-[#C8D0D0]'],
      overpaid: ['text-positive-green'],
      authorised: ['text-[#C8D0D0]'],
      pending: ['text-control-grey-hover'],
      pending_approval: ['text-[#B25900]'],
      failed: ['text-[#F32448]'],
      inprogress: ['text-grey-text'],
      authorise: ['text-[#454D54]'],
      invited: ['text-[#C8D0D0]'],
      role_pending: ['text-[#B25900]'],
      active: ['text-[#29A37A]'],
      expired_link: ['text-negative-red fill-none'],
      scheduled: ['text-[#476685]'],
      draft: ['text-grey-text'],
    },
  },
  defaultVariants: {
    variant: 'unpaid',
  },
})

export interface StatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {}

type TVariant = Exclude<
  Required<Pick<VariantProps<typeof statusVariants>, 'variant'>>['variant'],
  null | undefined
>

const iconName: Record<TVariant, Record<'small' | 'medium' | 'large', IconNames>> = {
  paid: {
    small: 'done/12',
    medium: 'done/12',
    large: 'done/16',
  },
  partial: {
    small: 'partial/12',
    medium: 'partial/12',
    large: 'partial/12',
  },
  unpaid: {
    small: 'not-started/12',
    medium: 'not-started/12',
    large: 'not-started/12',
  },
  overpaid: {
    small: 'done/12',
    medium: 'done/12',
    large: 'done/16',
  },
  authorised: {
    small: 'not-started/12',
    medium: 'not-started/12',
    large: 'not-started/12',
  },
  pending: {
    small: 'pending/12',
    medium: 'pending/12',
    large: 'pending/12',
  },
  failed: {
    small: 'failed/12',
    medium: 'failed/12',
    large: 'failed/16',
  },
  pending_approval: {
    small: 'pending-approval/12',
    medium: 'pending-approval/12',
    large: 'pending-approval/16',
  },
  inprogress: {
    small: 'inprogress/12',
    medium: 'inprogress/12',
    large: 'inprogress/16',
  },
  authorise: {
    small: 'pending-approval/12',
    medium: 'pending-approval/12',
    large: 'pending-approval/16',
  },
  invited: {
    small: 'invited/12',
    medium: 'invited/12',
    large: 'invited/16',
  },
  role_pending: {
    small: 'pending/12',
    medium: 'pending/12',
    large: 'pending/16',
  },
  active: {
    small: 'done/12',
    medium: 'done/12',
    large: 'done/16',
  },
  expired_link: {
    small: 'expired/12',
    medium: 'expired/12',
    large: 'expired/16',
  },
  scheduled: {
    small: 'scheduled/12',
    medium: 'scheduled/12',
    large: 'scheduled/16',
  },
  draft: {
    small: 'not-started/12',
    medium: 'not-started/12',
    large: 'not-started/12',
  },
}

const Status: React.FC<StatusProps> = ({
  className,
  size = 'small',
  variant = 'unpaid',
  ...props
}) => {
  return (
    <div className={cn(statusVariants({ variant, size }), className)} {...props}>
      {variant && (
        <Icon name={iconName[variant][size ?? 'small']} className={cn(iconVariants({ variant }))} />
      )}
      <span className={variant === 'expired_link' ? '' : 'uppercase'}>
        {size === 'large' && variant === 'partial'
          ? 'partially paid'
          : variant === 'inprogress'
          ? 'in progress'
          : variant === 'pending_approval'
          ? 'pending'
          : variant === 'role_pending'
          ? 'role pending'
          : variant === 'expired_link'
          ? 'Expired link'
          : variant}
      </span>
    </div>
  )
}

Status.displayName = 'Status'

export { Status }
