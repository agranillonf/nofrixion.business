import { Meta, StoryFn } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { apiUrls } from '../../../utils/constants'
import AccountsPayableDashboard from './AccountsPayableDashboard'

const meta: Meta<typeof AccountsPayableDashboard> = {
  title: 'Functional/AccountsPayableDashboard',
  component: AccountsPayableDashboard,
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
    onUnauthorized: {
      action: 'onUnauthorized',
    },
  },
} as Meta<typeof AccountsPayableDashboard>

const Template: StoryFn<typeof AccountsPayableDashboard> = (args) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AccountsPayableDashboard {...args} />
    </QueryClientProvider>
  )
}

export const Showcase = Template.bind({})

Showcase.args = {
  token: 'Enter user token...',
  apiUrl: apiUrls.dev,
  merchantId: 'Enter merchant id...',
}

Showcase.parameters = {
  layout: 'fullscreen',
}

export default meta
