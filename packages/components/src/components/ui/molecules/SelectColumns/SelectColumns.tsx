import { Popover } from '@headlessui/react'

import { Column } from '../../../../types/LocalTypes'
import { cn } from '../../../../utils'
import { Icon } from '../../atoms'
import Checkbox from '../../Checkbox/Checkbox'

export interface SelectColumnsProps {
  columns: Column[]
  className?: string
  setColumns: (columns: Column[]) => void
}

const SelectColumns = ({ columns, className, setColumns }: SelectColumnsProps) => {
  return (
    <Popover className={cn('relative', className)}>
      <Popover.Button>
        <Icon name="column-edit/16" />
      </Popover.Button>

      <Popover.Panel className="absolute z-10 bottom-6 bg-white">
        <div className="rounded shadow-[0_0_8px_0_rgba(4,41,49,0.10)] px-4 pt-4">
          {columns.map((column, index) => (
            <div key={index} className="pb-4">
              <Checkbox
                label={column.label}
                value={column.selected}
                onChange={(value) => {
                  const newColumns = [...columns]
                  newColumns[index].selected = value
                  setColumns(newColumns)
                }}
              />
            </div>
          ))}
        </div>
      </Popover.Panel>
    </Popover>
  )
}

export default SelectColumns
