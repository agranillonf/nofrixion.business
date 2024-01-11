import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { Column } from '../../../../types/LocalTypes'
import SelectColumns from './SelectColumns'

export default {
  title: 'Molecules/SelectColumns',
  component: SelectColumns,
} as Meta<typeof SelectColumns>

const Template: StoryFn<typeof SelectColumns> = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'name', label: 'Name', selected: true },
    { id: 'email', label: 'Email', selected: true },
    { id: 'phone', label: 'Phone', selected: true },
  ])
  console.log('columns', columns)

  return <SelectColumns columns={columns} setColumns={setColumns} className="mt-60" />
}

export const ShowCase = Template.bind({})
