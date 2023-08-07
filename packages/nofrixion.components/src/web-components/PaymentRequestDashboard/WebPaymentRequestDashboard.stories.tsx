import { html } from 'lit-html'
import { apiUrls } from '../../utils/constants'

import './WebPaymentRequestDashboard'
import { string } from 'prop-types'

export default {
  title: 'Payment Request Dashboard',
  argTypes: {
    token: {
      control: {
        type: 'text',
      },
    },
    merchantId: {
      control: {
        type: 'text',
      },
    },
    apiUrl: {
      control: { type: 'select' },
      options: Object.values(apiUrls),
    },
  },
}

interface TemplateProps {
  token: string
  merchantId: string
  apiUrl: string
}

//👇 We create a “template” of how args map to rendering
const Template = ({ token, merchantId, apiUrl }: TemplateProps) =>
  html`<payment-request-dashboard
    .token=${token}
    .merchantId=${merchantId}
    .apiUrl=${apiUrl}
  ></payment-request-dashboard>`

//👇 Each story then reuses that template
export const Showcase = Template.bind({})

Showcase.args = {
  token: 'eyJhbGciOiJIUz...',
  merchantId: 'Enter merchant id...',
  apiUrl: apiUrls.dev,
}
