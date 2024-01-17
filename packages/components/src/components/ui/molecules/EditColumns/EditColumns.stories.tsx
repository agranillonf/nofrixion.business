import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'

import { Column } from '../../../../types/LocalTypes'
import EditColumns from './EditColumns'

export default {
  title: 'Molecules/SelectColumns',
  component: EditColumns,
} as Meta<typeof EditColumns>

const Template: StoryFn<typeof EditColumns> = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'name', label: 'Name', selected: true },
    { id: 'email', label: 'Email', selected: true },
    { id: 'phone', label: 'Phone', selected: true },
  ])
  console.log('columns', columns)

  return <EditColumns columns={columns} setColumns={setColumns} className="mt-60" />
}

export const ShowCase = Template.bind({})
