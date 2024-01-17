import * as RadixScrollArea from '@radix-ui/react-scroll-area'
import classNames from 'classnames'
import { ForwardedRef, forwardRef } from 'react'

interface TableScrollbarProps {
  children: React.ReactNode
  hideScrollbar?: boolean
}

const TableScrollbar = forwardRef(
  (props: TableScrollbarProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <>
        <RadixScrollArea.Root type="auto">
          <RadixScrollArea.Viewport>{props.children}</RadixScrollArea.Viewport>
          <RadixScrollArea.Scrollbar
            ref={ref}
            className={classNames('flex select-none overflow-hidden touch-none px-4', {
              'rounded-2xl bg-gray-100 transition-colors duration-[160ms] ease-out hover:bg-gray-200 flex-col h-4':
                !props.hideScrollbar,
            })}
            orientation="horizontal"
          >
            <RadixScrollArea.Thumb asChild>
              <div
                style={{
                  height: '4px',
                  background: '#ABB2BA',
                  borderRadius: '8px',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                }}
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
