import * as RadixScrollArea from '@radix-ui/react-scroll-area'
import { forwardRef } from 'react'

import { cn } from '../../../../utils'

type ScrollAreaProps = {
  enableCustomScrollbar?: true
}

const ScrollArea = forwardRef<
  React.ElementRef<typeof RadixScrollArea.Viewport>,
  React.ComponentPropsWithoutRef<typeof RadixScrollArea.Root> & ScrollAreaProps
>(({ children, enableCustomScrollbar, ...props }, ref) => (
  <RadixScrollArea.Root {...props}>
    <RadixScrollArea.Viewport ref={ref} className="snap-x snap-mandatory">
      {children}
    </RadixScrollArea.Viewport>
    <RadixScrollArea.Scrollbar
      forceMount
      className={cn(
        'flex select-none overflow-hidden touch-none rounded-lg bg-gray-100 transition-colors duration-[160ms] ease-out hover:bg-gray-200 flex-col h-2',
        {
          'hidden md:flex mt-4 mx-auto !relative h-0.5 w-40 bg-[#E0E7EA]': enableCustomScrollbar,
        },
      )}
      orientation="horizontal"
    >
      <RadixScrollArea.Thumb
        className={cn('flex-1 rounded-lg bg-gray-300', {
          'bg-[#477085]': enableCustomScrollbar,
        })}
      />
    </RadixScrollArea.Scrollbar>
  </RadixScrollArea.Root>
))

ScrollArea.displayName = 'ScrollArea'

export default ScrollArea
