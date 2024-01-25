import { Icon } from '../../atoms'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '../../atoms/DropDown/DropDown'

interface PageSizesDropdownProps {
  pageSize: number
  onPageSizeChange: (pageSize: number) => void
  pageSizes?: number[]
}

const defaultPageSizes = [10, 20, 50, 100]

const PageSizesDropdown = ({ pageSize, onPageSizeChange, pageSizes }: PageSizesDropdownProps) => {
  return (
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
          {(pageSizes ? pageSizes : defaultPageSizes).map((pageSizeOption, index) => (
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
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}

export default PageSizesDropdown
