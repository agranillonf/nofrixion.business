import * as RadixScrollArea from '@radix-ui/react-scroll-area'
import classNames from 'classnames'
import { ForwardedRef, forwardRef, useState } from 'react'

import { cn } from '../../../utils'

interface TableScrollbarProps {
  children: React.ReactNode
  hideScrollbar?: boolean
}

const TableScrollbar = forwardRef(
  (props: TableScrollbarProps, ref: ForwardedRef<HTMLDivElement>) => {
    const [isTrackHovered, setIsTrackHovered] = useState(false)
    return (
      <>
        <RadixScrollArea.Root type="auto">
          <RadixScrollArea.Viewport>{props.children}</RadixScrollArea.Viewport>
          <RadixScrollArea.Scrollbar
            ref={ref}
            className={classNames('flex select-none overflow-hidden touch-non', {
              'rounded-2xl bg-[#F6F8F9] transition-colors duration-100 ease-out hover:bg-[#EAF0F1] flex-col h-4':
                !props.hideScrollbar,
            })}
            orientation="horizontal"
            onMouseEnter={() => setIsTrackHovered(true)}
            onMouseLeave={() => setIsTrackHovered(false)}
          >
            <RadixScrollArea.Thumb asChild>
              <div
                style={{
                  height: '16px',
                }}
                className={cn(
                  'hover:border-[#EAF0F1] hover:bg-[#73808C] border-[6px] border-[#F6F8F9] bg-[#ABB2BA] rounded-lg my-auto transition-colors duration-100 ease-out',
                  { 'border-[#EAF0F1] bg-[#73808C]': isTrackHovered },
                )}
              ></div>
            </RadixScrollArea.Thumb>
          </RadixScrollArea.Scrollbar>
          <RadixScrollArea.Corner />
        </RadixScrollArea.Root>
      </>
    )
  },
)
TableScrollbar.displayName = 'TableScrollbar'
export default TableScrollbar
