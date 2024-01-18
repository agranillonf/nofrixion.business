import { Meta, StoryFn } from '@storybook/react'

import AnimatedTabs from './AnimatedTabs'

export default {
  title: 'Molecules/Animated Tabs',
  component: AnimatedTabs,
} as Meta<typeof AnimatedTabs>

const Template: StoryFn<typeof AnimatedTabs> = (args) => <AnimatedTabs {...args} />

export const Showcase = Template.bind({})
Showcase.args = {
  tabs: [
    {
      title: 'Tab 1',
      content: 'Tab 1 Content',
    },
    {
      title: 'Tab 2',
      content: 'Tab 2 Content',
    },
  ],
}
