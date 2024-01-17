import { Meta, StoryFn } from '@storybook/react'

import { Popover, PopoverContent, PopoverTrigger } from './Popover'

export default {
  title: 'Atoms/Popover',
  component: Popover,
} as Meta<typeof Popover>

const Template: StoryFn<{
  subText?: string
}> = ({ ...args }) => {
  return (
    <Popover {...args}>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  )
}

export const Showcase = Template.bind({})
Showcase.args = {}
