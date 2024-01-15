import { useEffect, useState } from 'react'

import { LocalInvoice } from '../../../../types/LocalTypes'
import { DoubleSort, Sort } from '../../../../types/Sort'
import ColumnHeader, { SortDirection } from '../../ColumnHeader/ColumnHeader'
import ImportInvoiceRow from '../../molecules/ImportInvoiceRow/ImportInvoiceRow'
import Switch from '../../Switch/Switch'

export interface ImportInvoiceTableProps {
  invoices: LocalInvoice[]
  selectedInvoices: string[]
  setSelectedInvoices: React.Dispatch<React.SetStateAction<string[]>>
}

type SortByInvoicesOptions = Extract<
  keyof LocalInvoice,
  'InvoiceNumber' | 'InvoiceDate' | 'DueDate' | 'TotalAmount' | 'Contact'
>
type DoubleSortByInvoices = DoubleSort<SortByInvoicesOptions>

const ImportInvoiceTable: React.FC<ImportInvoiceTableProps> = ({
  invoices,
  selectedInvoices,
  setSelectedInvoices,
}) => {
  const [stateMainSwitch, setStateMainSwitch] = useState<'all' | 'none'>('all')

  const [sortBy, setSortBy] = useState<DoubleSortByInvoices>({
    primary: {
      name: 'InvoiceNumber',
      direction: SortDirection.NONE,
    },
  })

  const handleOnSort = (sortInfo: Sort<SortByInvoicesOptions>) => {
    // If primary sort is the same as the new sort, then we need to toggle the direction
    // If primary sort is different, then we need to set the new sort as primary and the old primary as secondary
    if (sortBy.primary.name === sortInfo.name) {
      setSortBy((sortBy) => {
        const newSort = {
          primary: sortInfo,
          secondary: sortBy.secondary,
        }
        return newSort
      })
    } else {
      setSortBy((sortBy) => {
        const newSort = {
          primary: sortInfo,
          secondary: sortBy.primary,
        }
        return newSort
      })
    }
  }

  const sortByInvoices = (sortBy: DoubleSortByInvoices) => {
    const { primary, secondary } = sortBy

    const compare = (a: LocalInvoice, b: LocalInvoice) => {
      if (primary.direction === SortDirection.NONE) {
        return 0
      }

      const aValue = a[primary.name]
      const bValue = b[primary.name]

      if (aValue === bValue) {
        if (secondary) {
          const secondaryAValue = a[secondary.name]
          const secondaryBValue = b[secondary.name]

          if (secondaryAValue === secondaryBValue) {
            return 0
          }

          return secondary.direction === SortDirection.ASC
            ? secondaryAValue < secondaryBValue
              ? -1
              : 1
            : secondaryAValue < secondaryBValue
            ? 1
            : -1
        }

        return 0
      }

      return primary.direction === SortDirection.ASC
        ? aValue < bValue
          ? -1
          : 1
        : aValue < bValue
        ? 1
        : -1
    }

    return compare
  }

  useEffect(() => {
    if (selectedInvoices.length === 0) {
      setStateMainSwitch('none')
    } else if (selectedInvoices.length === invoices.length) {
      setStateMainSwitch('all')
    }
  }, [selectedInvoices])

  return (
    <div>
      <div className="flex gap-x-6 w-full mb-8">
        <div className="w-[5.5rem]">
          <ColumnHeader
            label="Invoice"
            sortDirection={
              sortBy.primary.name === 'InvoiceNumber' ? sortBy.primary.direction : undefined
            }
            onSort={(direction) => handleOnSort({ name: 'InvoiceNumber', direction })}
          />
        </div>
        <div className="w-[7.5rem]">
          <ColumnHeader
            label="Invoice Date"
            sortDirection={
              sortBy.primary.name === 'InvoiceDate' ? sortBy.primary.direction : undefined
            }
            onSort={(direction) => handleOnSort({ name: 'InvoiceDate', direction })}
          />
        </div>
        <div className="w-[7.5rem]">
          <ColumnHeader
            label="Due Date"
            sortDirection={sortBy.primary.name === 'DueDate' ? sortBy.primary.direction : undefined}
            onSort={(direction) => handleOnSort({ name: 'DueDate', direction })}
          />
        </div>
        <div className="w-[7.5rem]">
          <ColumnHeader
            label="Amount"
            sortDirection={
              sortBy.primary.name === 'TotalAmount' ? sortBy.primary.direction : undefined
            }
            onSort={(direction) => handleOnSort({ name: 'TotalAmount', direction })}
          />
        </div>
        <div className="w-[12.5rem] ml-10">
          <ColumnHeader
            label="Contact"
            sortDirection={sortBy.primary.name === 'Contact' ? sortBy.primary.direction : undefined}
            onSort={(direction) => handleOnSort({ name: 'Contact', direction })}
          />
        </div>
        <div className="w-[12.5rem]">
          <ColumnHeader label="Account" />
        </div>
        <div className="w-[7.5rem]">
          <ColumnHeader label="Reference" />
        </div>
        <div className="ml-auto">
          <Switch
            value={stateMainSwitch === 'all'}
            onChange={(newValue) => {
              if (newValue) {
                setStateMainSwitch('all')
                setSelectedInvoices(invoices.map((invoice) => invoice.InvoiceNumber))
              } else {
                setStateMainSwitch('none')
                setSelectedInvoices([])
              }
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-8">
        {invoices.sort(sortByInvoices(sortBy)).map((invoice, i) => (
          <ImportInvoiceRow
            key={`invoice-${i}`}
            isSelected={selectedInvoices?.includes(invoice.InvoiceNumber)}
            onSelectedChange={(value) => {
              if (value) {
                setSelectedInvoices((prev) => [...prev, invoice.InvoiceNumber])
              } else {
                setSelectedInvoices((prev) => prev.filter((id) => id !== invoice.InvoiceNumber))
              }
            }}
            className="pb-4"
            {...invoice}
          />
        ))}
      </div>
    </div>
  )
}

export default ImportInvoiceTable
