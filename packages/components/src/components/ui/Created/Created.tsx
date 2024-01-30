import { cva, VariantProps } from 'class-variance-authority'
import { useEffect, useRef, useState } from 'react'

import { LocalUser } from '../../../types/LocalTypes'
import { formatDateWithYear } from '../../../utils/formatters'
import InfoTooltip from '../InfoTooltip/InfoTooltip'

const createdAtVariants = cva('truncate', {
  variants: {
    size: {
      small: ['text-13px'],
      large: ['text-[1.25rem]', 'font-semibold'],
    },
  },
  defaultVariants: {
    size: 'small',
  },
})

const createdByVariants = cva('text-grey-text truncate', {
  variants: {
    size: {
      small: ['text-xs'],
      large: ['text-sm'],
    },
  },
  defaultVariants: {
    size: 'small',
  },
})

export interface CreatedProps {
  createdAt: Date
  createdByUser?: LocalUser
  createdByMerchantTokenDescription?: string
  size?: VariantProps<typeof createdAtVariants>['size']
}

const Created = ({
  createdAt,
  createdByUser,
  createdByMerchantTokenDescription,
  size = 'small',
}: CreatedProps) => {
  const createdByRef = useRef(null)
  const [isTruncated, setIsTruncated] = useState(false)

  const compareSize = () => {
    if (createdByRef.current) {
      const element: HTMLSpanElement = createdByRef.current
      setIsTruncated(element.scrollWidth > element.clientWidth)
    }
  }

  useEffect(() => {
    compareSize()
    window.addEventListener('resize', compareSize)
    return () => {
      window.removeEventListener('resize', compareSize)
    }
  }, [])

  const createdByUserName = createdByUser
    ? `${createdByUser.firstName} ${createdByUser.lastName}`
    : ''
  return (
    <div className="flex flex-col">
      <span className={createdAtVariants({ size: size })}>{formatDateWithYear(createdAt)}</span>
      {(createdByUser || createdByMerchantTokenDescription) && (
        <InfoTooltip
          content={
            createdByUser
              ? createdByUserName
              : createdByMerchantTokenDescription
              ? createdByMerchantTokenDescription
              : ''
          }
          className="w-full"
          disableHover={!isTruncated}
        >
          <span className={createdByVariants({ size: size })} ref={createdByRef}>
            {createdByUser
              ? createdByUser.firstName + ' ' + createdByUser.lastName
              : createdByMerchantTokenDescription}
          </span>
        </InfoTooltip>
      )}
    </div>
  )
}

export default Created
