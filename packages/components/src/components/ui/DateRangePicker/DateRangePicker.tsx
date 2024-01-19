import './DateRangePicker.css'

import { add, endOfDay, format, isSameDay, startOfDay } from 'date-fns'
import { MouseEventHandler, useState } from 'react'
import DatePicker, { DateObject } from 'react-multi-date-picker'

import { cn } from '../../../utils'
import { getSelectRangeText } from '../../../utils/formatters'
import { SelectDateRange, type TDateRangeOptions } from '../../ui/molecules'
import DateRangeButton from './DateRangeButton'
import DateRangeInput from './DateRangeInput'

const pillClasses =
  'text-default-text leading-6 hover:text-grey-text bg-transparent text-sm whitespace-nowrap cursor-pointer select-none stroke-default-text hover:stroke-control-grey'

export type DateRange = {
  fromDate?: Date
  toDate?: Date
}

export interface DateRangeFilterProps {
  firstDate?: Date
  dateRange: DateRange
  onDateChange: (dateRange: DateRange) => void
}

const dateFormat = 'MMM do'

const DateRangePicker = ({ onDateChange, dateRange, firstDate }: DateRangeFilterProps) => {
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(dateRange)

  const selectRangeText: TDateRangeOptions | undefined =
    dateRange?.fromDate && dateRange.toDate
      ? getSelectRangeText(dateRange?.fromDate, dateRange.toDate, firstDate)
      : undefined
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const onDateChangeHandler = (fromDate: Date, toDate: Date) => {
    onDateChange &&
      onDateChange({
        fromDate,
        toDate,
      })
  }

  const onSelectRangeTextChange = (value: TDateRangeOptions) => {
    let fromDate = startOfDay(new Date())
    let toDate = new Date()

    switch (value) {
      case 'today':
        fromDate = startOfDay(new Date())
        break
      case 'yesterday':
        fromDate = startOfDay(add(new Date(), { days: -1 }))
        toDate = endOfDay(add(new Date(), { days: -1 }))
        break
      case 'last7Days':
        fromDate = startOfDay(add(new Date(), { days: -7 }))
        break
      case 'last30Days':
        fromDate = startOfDay(add(new Date(), { days: -30 }))
        break
      case 'last90Days':
        fromDate = startOfDay(add(new Date(), { days: -90 }))
        break
      case 'all':
        fromDate = firstDate ?? new Date(0)
        break
      default:
        break
    }

    onDateChangeHandler(fromDate, toDate)
  }

  return (
    <div className="md:flex md:justify-normal text-left md:w-fit">
      <SelectDateRange
        className="mr-1 text-left"
        value={selectRangeText}
        onValueChange={onSelectRangeTextChange}
        subText={
          dateRange?.fromDate != undefined && dateRange.toDate != undefined
            ? isSameDay(dateRange?.fromDate, dateRange.toDate)
              ? format(dateRange?.fromDate, dateFormat)
              : `${format(dateRange?.fromDate, dateFormat)} - ${format(
                  dateRange.toDate,
                  dateFormat,
                )}`
            : ''
        }
      />

      <div className={cn(pillClasses, 'hidden md:flex border-border-grey border-l')}>
        <DatePicker
          value={
            localDateRange && localDateRange.fromDate && localDateRange.toDate
              ? [new DateObject(localDateRange.fromDate), new DateObject(localDateRange.toDate)]
              : dateRange && dateRange.fromDate && dateRange.toDate
              ? [new DateObject(dateRange.fromDate), new DateObject(dateRange.toDate)]
              : [new DateObject(new Date()), new DateObject(new Date())]
          }
          onChange={(changes: DateObject[]) => {
            if (changes && changes.length == 2) {
              setLocalDateRange({
                fromDate: startOfDay(changes[0]?.toDate()),
                toDate: endOfDay(changes[1]?.toDate()),
              })
            }
          }}
          onClose={() => {
            if (localDateRange && localDateRange.fromDate && localDateRange.toDate) {
              onDateChangeHandler(localDateRange.fromDate, localDateRange.toDate)
            }

            setLocalDateRange(undefined)
          }}
          range
          rangeHover
          maxDate={new Date()}
          render={(value: string[], openCalendar: () => void) => {
            return <DateRangeInput value={value} openCalendar={openCalendar} />
          }}
          arrow={false}
          weekDays={weekDays}
          offsetY={13}
          renderButton={(
            direction: string,
            handleClick: MouseEventHandler<HTMLButtonElement> | undefined,
            disabled: boolean,
          ) => {
            return (
              <DateRangeButton
                direction={direction}
                handleClick={handleClick}
                disabled={disabled}
              />
            )
          }}
        />
      </div>
    </div>
  )
}

export default DateRangePicker
