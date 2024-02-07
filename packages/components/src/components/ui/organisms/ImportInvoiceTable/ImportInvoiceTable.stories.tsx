import { Meta, StoryFn } from '@storybook/react'

import { localInvoices } from '../../../../utils/mockedData'
import ImportInvoiceTable from './ImportInvoiceTable'

export default {
  title: 'Organisms/Import Invoice Table',
  component: ImportInvoiceTable,
} as Meta<typeof ImportInvoiceTable>

const Template: StoryFn<typeof ImportInvoiceTable> = (args) => <ImportInvoiceTable {...args} />

export const Showcase = Template.bind({})
Showcase.args = {
  invoices: localInvoices,
}
