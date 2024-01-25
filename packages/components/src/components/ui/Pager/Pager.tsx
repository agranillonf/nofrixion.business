import classNames from 'classnames'
import { useEffect, useState } from 'react'

import { Icon } from '../atoms'
import PageSizesDropdown from '../molecules/PageSizesDropdown/PageSizesDropdown'

export interface PagerProps {
  pageSize: number
  totalRecords: number
  onPageChange: (pageNumber: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const Pager = ({ pageSize, totalRecords, onPageChange, onPageSizeChange }: PagerProps) => {
  const getToRecord = () => {
    if (pageSize > totalRecords) {
      return totalRecords
    } else {
      return pageSize
    }
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [fromRecord, setFromRecord] = useState(1)
  const [toRecord, setToRecord] = useState(getToRecord())
  const [totalPages, setTotalPages] = useState(Math.ceil(totalRecords / pageSize))

  const reset = (page: number) => {
    setTotalPages(Math.ceil(totalRecords / pageSize))

    if (page <= 1) {
      setFromRecord(1)
      setToRecord(getToRecord())
    } else if (page < totalPages) {
      setFromRecord(pageSize * page - pageSize + 1)
      setToRecord(pageSize * page)
    } else {
      setFromRecord(pageSize * page - pageSize + 1)
      setToRecord(totalRecords)
    }

    onPageChange(page)
  }
  useEffect(() => {
    if (pageSize > totalRecords) {
      setCurrentPage(1)
      reset(1)
    } else {
      reset(currentPage)
    }
  }, [currentPage, pageSize, totalRecords, totalPages, toRecord, fromRecord])

  useEffect(() => {
    setTotalPages(Math.ceil(totalRecords / pageSize))

    if (totalRecords < toRecord) {
      // Reset to first page
      setCurrentPage(1)
    }
  }, [totalRecords])

  const goToBeginning = async () => {
    setCurrentPage(1)
  }

  const goToEnd = async () => {
    setCurrentPage(totalPages)
  }

  const decrementPageNumber = async () => {
    if (currentPage <= 1) {
      setCurrentPage(1)
    } else {
      setCurrentPage(currentPage - 1)
    }
  }

  const incrementPageNumber = async () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const svgClassNames = (show: boolean) => {
    return classNames('border-grey-highlighted', {
      'cursor-pointer hover:stroke-control-grey-hover': show,
    })
  }

  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        <PageSizesDropdown pageSize={pageSize} onPageSizeChange={onPageSizeChange} />
      </div>

      <div className="flex items-center space-x-1 text-[#73808C] text-sm justify-end whitespace-nowrap select-none">
        <div className="text-default-text">
          {fromRecord}-{toRecord}
        </div>
        <div>of</div>
        <div>{totalRecords}</div>
        <button onClick={() => goToBeginning()}>
          <Icon name="begin-arrow/12" className={svgClassNames(currentPage > 1)} />
        </button>
        <button onClick={() => decrementPageNumber()}>
          <Icon name="left-arrow/12" className={svgClassNames(currentPage > 1)} />
        </button>
        <button onClick={() => incrementPageNumber()}>
          <Icon name="right-arrow/12" className={svgClassNames(currentPage < totalPages)} />
        </button>
        <button onClick={() => goToEnd()}>
          <Icon name="end-arrow/12" className={svgClassNames(currentPage < totalPages)} />
        </button>
      </div>
    </div>
  )
}

export default Pager
