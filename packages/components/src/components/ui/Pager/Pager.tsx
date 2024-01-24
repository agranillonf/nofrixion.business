import classNames from 'classnames'
import { useEffect, useState } from 'react'

import { Icon } from '../atoms'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '../atoms/DropDown/DropDown'

export interface PagerProps {
  pageSize: number
  totalRecords: number
  onPageChange: (pageNumber: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const Pager = ({ pageSize, totalRecords, onPageChange, onPageSizeChange }: PagerProps) => {
  console.log('onpagesizechange', onPageSizeChange)
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

  useEffect(() => {
    setTotalPages(Math.ceil(totalRecords / pageSize))

    if (currentPage <= 1) {
      setFromRecord(1)
      setToRecord(getToRecord())
    } else if (currentPage < totalPages) {
      setFromRecord(pageSize * currentPage - pageSize + 1)
      setToRecord(pageSize * currentPage)
    } else {
      setFromRecord(pageSize * currentPage - pageSize + 1)
      setToRecord(totalRecords)
    }

    onPageChange(currentPage)
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
    console.log('show', show)
    return classNames('border-grey-highlighted', {
      'cursor-pointer hover:stroke-control-grey-hover': show,
    })
  }

  const pageSizes = [20, 50, 100]

  return (
    <div className="flex flex-row items-center justify-between">
      <div>
        {/* <SelectPageSize
          value={pageSize.toString()}
          defaultValue="20"
          onValueChange={(newPageSize) => onPageSizeChange(parseInt(newPageSize))}
        /> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer flex flex-row items-center gap-5 p-2 rounded border-solid border-[1px] border-[#D5DBDD]">
              <span className="text-sm">{pageSize}</span>
              <Icon name="arrow-down/12" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent
              sideOffset={5}
              align="center"
              className="bg-white px-0 py-2 rounded shadow-[0_0_8px_0_rgba(4,41,49,0.10)]"
            >
              {/* <motion.div
            className="mx-4 bg-white rounded-lg shadow-[0px_0px_8px_rgba(4,_41,_49,_0.1)] py-3 pl-4 pr-4"
            initial={{ opacity: 0.5, y: -5, scaleX: 1, scaleY: 1 }}
            animate={{ opacity: 1, y: 0, scaleX: 1, scaleY: 1 }}
          > */}
              {pageSizes.map((pageSizeOption, index) => (
                <DropdownMenuItem
                  key={index}
                  onSelect={() => {
                    onPageSizeChange(pageSizeOption)
                  }}
                  className="py-2 px-5 hover:bg-gray-100"
                >
                  {pageSizeOption}
                </DropdownMenuItem>
              ))}
              {/* </motion.div> */}
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
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
