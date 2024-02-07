import { Meta, StoryFn } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { apiUrls } from '../../../utils/constants'
import PayrunDetails from './PayrunDetails'

const meta: Meta<typeof PayrunDetails> = {
  title: 'Functional/PayrunDetails',
  component: PayrunDetails,
  argTypes: {
    token: {
      control: {
        type: 'text',
      },
    },
    apiUrl: {
      control: { type: 'select' },
      options: Object.values(apiUrls),
    },
    merchantId: {
      control: {
        type: 'text',
      },
    },
    payrunId: {
      control: {
        type: 'text',
      },
    },
  },
} as Meta<typeof PayrunDetails>

const Template: StoryFn<typeof PayrunDetails> = (args) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <PayrunDetails {...args} />
    </QueryClientProvider>
  )
}

export const Showcase = Template.bind({})

Showcase.args = {
  token: 'Enter user token...',
  apiUrl: apiUrls.dev,
  merchantId: 'Enter merchant id...',
  payrunId: 'Enter payrun id...',
}

Showcase.parameters = {
  layout: 'fullscreen',
}

export default meta
