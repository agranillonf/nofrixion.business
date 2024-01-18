import {
  DoubleSortByPaymentRequests,
  DoubleSortByPayouts,
  SortByPaymentRequests,
} from '../../../types/Sort'
import { SortDirection } from '../../ui/ColumnHeader/ColumnHeader'
import { SelectSorter, TSorterOptions } from '../../ui/molecules'
import AmountFilter from '../AmountFilter/AmountFilter'
import DateRangePicker, { DateRange } from '../DateRangePicker/DateRangePicker'
import SearchBar from '../SearchBar/SearchBar'
import TagFilter, { FilterableTag } from '../TagFilter/TagFilter'

export interface FilterControlsRowProps {
  dateRange: DateRange
  setDateRange: (dateRange: DateRange) => void
  searchFilter: string
  setSearchFilter: (value: string) => void
  currency?: string
  setCurrency?: (currency?: string) => void
  minAmount?: number
  setMinAmount?: (minAmount?: number) => void
  maxAmount?: number
  setMaxAmount?: (maxAmount?: number) => void
  tags: FilterableTag[]
  setTags: (tags: FilterableTag[]) => void
  sortBy?: DoubleSortByPayouts | DoubleSortByPaymentRequests
  onSort: (sortBy: DoubleSortByPayouts | SortByPaymentRequests) => void
  firstDate?: Date
}

const FilterControlsRow = ({
  dateRange,
  setDateRange,
  searchFilter,
  setSearchFilter,
  currency,
  setCurrency,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  tags,
  setTags,
  sortBy,
  onSort,
  firstDate,
}: FilterControlsRowProps) => {
  const onValueChanged = (value: TSorterOptions) => {
    switch (value) {
      case 'mostRecentFirst':
        onSort({ name: 'created', direction: SortDirection.DESC })
        break
      case 'oldestFirst':
        onSort({ name: 'created', direction: SortDirection.ASC })
        break
      case 'amountHighToLow':
        onSort({ name: 'amount', direction: SortDirection.DESC })
        break
      case 'amountLowToHigh':
        onSort({ name: 'amount', direction: SortDirection.ASC })
        break
    }
  }

  const getSorterValue = () => {
    if (sortBy?.primary.name == 'created' && sortBy.primary.direction === SortDirection.DESC) {
      return 'mostRecentFirst'
    } else if (
      sortBy?.primary.name == 'created' &&
      sortBy.primary.direction === SortDirection.ASC
    ) {
      return 'oldestFirst'
    } else if (
      sortBy?.primary.name == 'amount' &&
      sortBy.primary.direction === SortDirection.DESC
    ) {
      return 'amountHighToLow'
    } else if (sortBy?.primary.name == 'amount' && sortBy.primary.direction === SortDirection.ASC) {
      return 'amountLowToHigh'
    } else {
      return 'mostRecentFirst'
    }
  }

  return (
    <div className="flex md:w-auto md:flex justify-between md:p-3 bg-white rounded-lg">
      <DateRangePicker firstDate={firstDate} dateRange={dateRange} onDateChange={setDateRange} />

      <div className="md:hidden">
        <SelectSorter
          className="text-right"
          value={getSorterValue()}
          onValueChange={onValueChanged}
        />
      </div>

      <div className="hidden md:inline-flex flex-row space-x-2">
        <SearchBar value={searchFilter} setValue={setSearchFilter} />

        <AmountFilter
          currency={currency}
          setCurrency={setCurrency}
          minAmount={minAmount}
          setMinAmount={setMinAmount}
          maxAmount={maxAmount}
          setMaxAmount={setMaxAmount}
        />

        <TagFilter tags={tags} setTags={setTags} />
      </div>
    </div>
  )
}

export default FilterControlsRow
