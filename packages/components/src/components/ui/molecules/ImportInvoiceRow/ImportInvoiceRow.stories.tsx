import { Meta, StoryFn } from '@storybook/react'

import { localInvoices } from '../../../../utils/mockedData'
import ImportInvoiceRow from './ImportInvoiceRow'

export default {
  title: 'Molecules/ImportInvoiceRow',
  component: ImportInvoiceRow,
} as Meta<typeof ImportInvoiceRow>

const Template: StoryFn<typeof ImportInvoiceRow> = (args) => <ImportInvoiceRow {...args} />

export const Showcase = Template.bind({})
Showcase.args = localInvoices[0]
