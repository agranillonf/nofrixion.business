import { Meta, StoryFn } from '@storybook/react'

import For from './For'

export default {
  title: 'UI/For',
  component: For,
  argTypes: {
    name: { control: 'text' },
    email: { control: 'text' },
  },
} as Meta<typeof For>

const Template: StoryFn<typeof For> = (args) => <For {...args} />

export const Primary = Template.bind({})
Primary.args = {
  title: 'Monthly support',
  customerName: 'Daniel Kowalski',
}

export const NoName = Template.bind({})
NoName.args = {
  title: 'Monthly support',
}

export const NoTitle = Template.bind({})
NoTitle.args = {
  customerName: 'Daniel Kowalski',
}

export const NoTitleAndName = Template.bind({})
NoTitleAndName.args = {}
