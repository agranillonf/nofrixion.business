import { cn } from '../../../utils'
import { Icon } from '../atoms'

export enum SortDirection {
  NONE = 'NONE',
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface ColumnHeaderProps {
  label: string
  sortDirection?: SortDirection
  onSort?: (event: SortDirection) => void
  className?: string
  spanClassName?: string
}

const ColumnHeader = ({
  label,
  sortDirection,
  onSort,
  className,
  spanClassName,
}: ColumnHeaderProps) => {
  const doSort = () => {
    if (sortDirection === SortDirection.NONE) {
      onSort && onSort(SortDirection.DESC)
    } else if (sortDirection === SortDirection.DESC) {
      onSort && onSort(SortDirection.ASC)
    } else {
      onSort && onSort(SortDirection.DESC)
    }
  }

  return (
    <button
      className={cn(
        'inline-flex text-sm text-grey-text transition items-center group relative',
        {
          'hover:text-grey-text-hover': onSort,
          'cursor-auto': !onSort,
        },
        className,
      )}
      onClick={doSort}
      disabled={!onSort}
    >
      <span className={cn('select-none uppercase', spanClassName)}>{label}</span>

      {onSort && (
        <div
          className="absolute -right-4 space-y-1 w-2.5 transition opacity-0 group-hover:opacity-100 data-[direction-selected='true']:opacity-100"
          data-direction-selected={sortDirection != SortDirection.NONE}
        >
          {sortDirection == SortDirection.ASC && (
            <Icon name="sort-up/12" className="stroke-control-grey-hover" />
          )}

          {sortDirection == SortDirection.DESC && (
            <Icon name="sort-down/12" className="stroke-control-grey-hover" />
          )}
        </div>
      )}
    </button>
  )
}

export default ColumnHeader
