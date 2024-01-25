import { Pagination, PayoutStatus, SortDirection } from '@nofrixion/moneymoov'
import { useEffect, useState } from 'react'

import { LocalPayout } from '../../../../types/LocalTypes'
import { DoubleSortByPayouts, SortByPayouts } from '../../../../types/Sort'
import { cn } from '../../../../utils'
import { formatAmount, formatDateWithYear } from '../../../../utils/formatters'
import { payoutStatusToStatus } from '../../../../utils/parsers'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../atoms/Table/Table'
import Checkbox from '../../Checkbox/Checkbox'
import ColumnHeader from '../../ColumnHeader/ColumnHeader'
import { Loader } from '../../Loader/Loader'
import { Status } from '../../molecules'
import Pager from '../../Pager/Pager'
import EmptyState from '../../PaymentRequestTable/EmptyState'
import TagList from '../../Tags/TagList/TagList'
import { PayoutAuthoriseForm } from '../../utils/PayoutAuthoriseForm'

export interface PayoutsTableProps extends React.HTMLAttributes<HTMLDivElement> {
  payouts: LocalPayout[] | undefined
  pagination: Pick<Pagination, 'pageSize' | 'totalSize'>
  onPageChange: (page: number) => void
  onSort: (sortInfo: DoubleSortByPayouts) => void
  onPayoutClicked?: (payout: LocalPayout) => void
  isLoading?: boolean
  selectedPayoutId: string | undefined
  status: PayoutStatus
  onAddPayoutForAuthorise: (payoutId: string) => void
  onRemovePayoutForAuthorise: (payoutId: string) => void
  selectedPayouts: string[]
  isLoadingMetrics: boolean
  payoutsExist: boolean
  isUserAuthoriser: boolean
  onPageSizeChange: (pageSize: number) => void
}

const PayoutsTable: React.FC<PayoutsTableProps> = ({
  payouts,
  pagination,
  onPageChange,
  onSort,
  onPayoutClicked,
  isLoading = false,
  selectedPayoutId,
  status,
  onAddPayoutForAuthorise,
  onRemovePayoutForAuthorise,
  selectedPayouts,
  isLoadingMetrics,
  payoutsExist,
  isUserAuthoriser,
  onPageSizeChange,
  ...props
}) => {
  const [allPayoutsSelected, setAllPayoutsSelected] = useState(false)
  const [sortBy, setSortBy] = useState<DoubleSortByPayouts>({
    primary: {
      name: 'created',
      direction: SortDirection.NONE,
    },
  })

  const onPayoutClickedHandler = (
    event: React.MouseEvent<HTMLTableRowElement | HTMLButtonElement | HTMLDivElement, MouseEvent>,
    payout: LocalPayout,
  ) => {
    onPayoutClicked && onPayoutClicked(payout)
  }

  const togglePayoutAuthoriseStatus = (payoutId: string, checked: boolean) => {
    if (checked) {
      onAddPayoutForAuthorise(payoutId)
    } else {
      setAllPayoutsSelected(false)
      onRemovePayoutForAuthorise(payoutId)
    }
  }

  const toggleAllPayoutAuthoriseStatuses = (checked: boolean) => {
    if (checked) {
      setAllPayoutsSelected(true)

      payouts &&
        payouts.map((payout) => {
          onAddPayoutForAuthorise(payout.id)
        })
    } else {
      setAllPayoutsSelected(false)
      payouts &&
        payouts.map((payout) => {
          onRemovePayoutForAuthorise(payout.id)
        })
    }
  }

  const handleOnSort = (sortInfo: SortByPayouts) => {
    // If primary sort is the same as the new sort, then we need to toggle the direction
    // If primary sort is different, then we need to set the new sort as primary and the old primary as secondary
    if (sortBy.primary.name === sortInfo.name) {
      setSortBy((sortBy) => {
        const newSort = {
          primary: sortInfo,
          secondary: sortBy.secondary,
        }
        onSort(newSort)
        return newSort
      })
    } else {
      setSortBy((sortBy) => {
        const newSort = {
          primary: sortInfo,
          secondary: sortBy.primary,
        }
        onSort(newSort)
        return newSort
      })
    }
  }

  useEffect(() => {
    let allSelected = true
    payouts &&
      payouts.map((payout) => {
        if (!selectedPayouts.includes(payout.id)) {
          allSelected = false
          return
        }
      })
    setAllPayoutsSelected(allSelected)
  }, [selectedPayouts, payouts])

  return (
    <div className="flex justify-center w-full" {...props}>
      {((payoutsExist && !payouts) || (payouts && payouts.length > 0)) && (
        <div className="flex flex-col gap-6 w-full">
          <>
            <Table {...props}>
              <TableHeader>
                <TableRow className="hover:bg-transparent cursor-auto">
                  {isUserAuthoriser && status && status === PayoutStatus.PENDING_APPROVAL && (
                    <TableHead
                      className="w-0"
                      onClick={() => toggleAllPayoutAuthoriseStatuses(!allPayoutsSelected)}
                    >
                      <Checkbox
                        value={allPayoutsSelected}
                        onChange={(value) => {
                          toggleAllPayoutAuthoriseStatuses(value)
                        }}
                      />
                    </TableHead>
                  )}
                  <TableHead className="w-[150px]">
                    <ColumnHeader
                      label="Status"
                      sortDirection={
                        sortBy.primary.name === 'status' ? sortBy.primary.direction : undefined
                      }
                      onSort={(direction) => handleOnSort({ name: 'status', direction })}
                    />
                  </TableHead>
                  <TableHead>
                    <ColumnHeader
                      label={'Created'}
                      sortDirection={
                        sortBy.primary.name === 'created' ? sortBy.primary.direction : undefined
                      }
                      onSort={(direction) => handleOnSort({ name: 'created', direction })}
                    />
                  </TableHead>
                  <TableHead>
                    <ColumnHeader
                      label={'Scheduled'}
                      sortDirection={
                        sortBy.primary.name === 'scheduleDate'
                          ? sortBy.primary.direction
                          : undefined
                      }
                      onSort={(direction) => handleOnSort({ name: 'scheduleDate', direction })}
                    />
                  </TableHead>
                  <TableHead>
                    <ColumnHeader
                      label={'Payee'}
                      sortDirection={
                        sortBy.primary.name === 'counterPartyName'
                          ? sortBy.primary.direction
                          : undefined
                      }
                      onSort={(direction) => handleOnSort({ name: 'counterPartyName', direction })}
                    />
                  </TableHead>
                  <TableHead className="text-right px-0">
                    <ColumnHeader
                      label={'Amount'}
                      sortDirection={
                        sortBy.primary.name === 'amount' ? sortBy.primary.direction : undefined
                      }
                      onSort={(direction) => handleOnSort({ name: 'amount', direction })}
                    />
                  </TableHead>
                  <TableHead>{/* Currency */}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {((isLoading && payoutsExist) || (payoutsExist && !payouts)) &&
                  Array.from(Array(12)).map((_, index) => (
                    <TableRow
                      key={`pr-placeholder-${index}`}
                      className="animate-pulse border-b border-[#F1F2F3]"
                    >
                      <TableCell className="w-48 py-6">
                        <div className="w-full h-2 bg-[#E0E9EB] rounded-lg" />
                      </TableCell>

                      <TableCell className="w-48">
                        <div className="w-full h-2 bg-[#E0E9EB] rounded-lg" />
                      </TableCell>

                      <TableCell className="w-48">
                        <div className="w-full h-2 bg-[#E0E9EB] rounded-lg" />
                      </TableCell>

                      <TableCell className="w-48">
                        <div className="w-full h-2 bg-[#E0E9EB] rounded-lg" />
                      </TableCell>

                      <TableCell className="w-48">
                        <div className="w-1/4 ml-auto h-2 bg-[#E0E9EB] rounded-lg" />
                      </TableCell>

                      <TableCell className="p-0"></TableCell>

                      <TableCell className="w-0">
                        <div className="w-1/2 ml-auto h-2 bg-[#E0E9EB] rounded-lg" />
                      </TableCell>
                    </TableRow>
                  ))}

                {!isLoading &&
                  payouts &&
                  payouts.length > 0 &&
                  payouts?.map((payout, index) => (
                    <TableRow
                      className={cn(
                        'cursor-pointer transition-all ease-in-out hover:bg-[#F6F8F9] hover:border-[#E1E5EA]',
                        {
                          'bg-[#F6F8F9] border-[#E1E5EA]':
                            selectedPayoutId === payout.id ||
                            (selectedPayouts.includes(payout.id) &&
                              status === PayoutStatus.PENDING_APPROVAL),
                        },
                      )}
                      key={`${payout}-${index}`}
                      onClick={(event) => onPayoutClickedHandler(event, payout)}
                    >
                      {isUserAuthoriser && status && status === PayoutStatus.PENDING_APPROVAL && (
                        <TableCell
                          onClick={(event) => {
                            event.stopPropagation()
                            togglePayoutAuthoriseStatus(
                              payout.id,
                              !selectedPayouts.includes(payout.id),
                            )
                          }}
                        >
                          <Checkbox
                            value={selectedPayouts.includes(payout.id)}
                            onChange={(value) => {
                              togglePayoutAuthoriseStatus(payout.id, value)
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell className="w-48">
                        <Status size="small" variant={payoutStatusToStatus(payout.status)} />
                      </TableCell>
                      <TableCell className="w-48">
                        {payout.inserted && formatDateWithYear(new Date(payout.inserted))}
                      </TableCell>
                      <TableCell className="w-48">
                        {payout.scheduled && payout.scheduled === true
                          ? payout.scheduleDate && formatDateWithYear(new Date(payout.scheduleDate))
                          : 'Immediately'}
                      </TableCell>
                      <TableCell className="w-48">
                        <div className="truncate">{payout.destination?.name}</div>
                      </TableCell>
                      <TableCell className="text-right truncate tabular-nums font-medium text-base/5 py-4 px-6 w-48">
                        {formatAmount(payout.amount)}
                      </TableCell>
                      <TableCell className="pl-0 text-grey-text font-normal text-sm">
                        {payout.currency}
                      </TableCell>
                      <TableCell>
                        <div className="flex ml-auto justify-items-end items-center w-fit">
                          <TagList labels={payout.tags.map((tag) => tag.name)} />
                          {payout.status === PayoutStatus.PENDING_APPROVAL && isUserAuthoriser && (
                            <PayoutAuthoriseForm id={payout.id} size="x-small" className="pl-4" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Pager
              onPageChange={onPageChange}
              pageSize={pagination.pageSize}
              totalRecords={pagination.totalSize}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        </div>
      )}

      {((isLoadingMetrics && !payouts) || (!payouts && !payoutsExist)) && (
        <div className=" justify-center items-center">
          <Loader className="mt-12" />
        </div>
      )}

      {!isLoadingMetrics && payouts !== undefined && payouts?.length === 0 && (
        <EmptyState state="nothingFound" description="No payouts were found" />
      )}
    </div>
  )
}

export { PayoutsTable }
