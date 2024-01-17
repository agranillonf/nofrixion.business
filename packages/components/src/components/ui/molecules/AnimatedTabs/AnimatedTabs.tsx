import * as Tabs from '@radix-ui/react-tabs'
import classNames from 'classnames'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { useEffect, useState } from 'react'

import { cn } from '../../../../utils'
import { Icon, IconNames } from '../../atoms/Icon/Icon'

type TabType = {
  title: string
  icon?: IconNames
  content: React.ReactNode
}

interface TabProps {
  value: string
  selectedTab: string
  children: React.ReactNode
}

export interface AnimatedTabsProps {
  tabs: TabType[]
  onTabChange?: (tab: string) => void
  fullWidthTabs?: boolean
  className?: string
}

const underlineClasses = 'w-full h-px absolute bottom-0'

const TabContent: React.FC<TabProps> = ({ value, selectedTab, children }) => {
  return (
    <AnimatePresence>
      <Tabs.Content value={value}>
        <motion.div
          key={selectedTab}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
        >
          {children}
        </motion.div>
      </Tabs.Content>
    </AnimatePresence>
  )
}

const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  fullWidthTabs = true,
  onTabChange,
  className,
}) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].title)

  useEffect(() => {
    onTabChange && onTabChange(selectedTab)
  }, [selectedTab])

  return (
    <MotionConfig transition={{ ease: 'easeInOut' }}>
      <Tabs.Root activationMode="manual" value={selectedTab} onValueChange={setSelectedTab}>
        <Tabs.List className={cn('flex mb-6 lg:mb-11', className)}>
          {tabs.map((tab) => {
            return (
              <Tabs.Trigger
                key={tab.title}
                className={cn(
                  'relative flex items-center justify-center gap-2 h-10 select-none text-sm/6 text-grey-text transition hover:text-default-text data-[state=active]:text-default-text',
                  {
                    'w-full': fullWidthTabs,
                    'px-4 pt-2 text-sm/8 pb-4': !fullWidthTabs,
                  },
                )}
                value={tab.title}
              >
                {tab.icon && <Icon name={tab.icon} />}
                {tab.title}

                {selectedTab == tab.title ? (
                  <motion.div
                    layoutId="underline"
                    className={classNames(underlineClasses, 'bg-primary-green z-10')}
                  />
                ) : (
                  <div className={classNames(underlineClasses, 'bg-border-grey')} />
                )}

                <div className={classNames(underlineClasses, 'bg-border-grey')} />
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>
        {tabs.map((tab) => (
          <TabContent key={tab.title} value={tab.title} selectedTab={selectedTab}>
            {tab.content}
          </TabContent>
        ))}
      </Tabs.Root>
    </MotionConfig>
  )
}

export default AnimatedTabs
