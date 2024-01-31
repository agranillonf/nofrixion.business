import { Meta, StoryFn } from '@storybook/react'

import { PayrunDetails } from './PayrunDetails'

export default {
  title: 'Pages/Payrun Details',
  component: PayrunDetails,
  args: {},
} as Meta<typeof PayrunDetails>

const Template: StoryFn<typeof PayrunDetails> = (args) => {
  return (
    <div className="bg-main-grey">
      <PayrunDetails {...args} />
    </div>
  )
}

export const Showcase = Template.bind({})
Showcase.args = {}
