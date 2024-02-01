import { useRef, useState } from 'react'

import { cn } from '../../../../utils'
import { Loader } from '../../Loader/Loader'

export interface LoadedFileDetails {
  name: string
  message: string
}

export interface FileInputProps {
  onFileAdded: (file: File) => void
  isLoading?: boolean
  isError?: boolean
  setIsError?: (isError: boolean) => void
  setIsLoading?: (isLoading: boolean) => void
  templateContent?: string
  templateName?: string
  children?: React.ReactNode
}

const FileInput = ({
  onFileAdded,
  isLoading,
  isError,
  setIsError,
  setIsLoading,
  templateContent,
  templateName,
  children,
}: FileInputProps) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleClick = () => {
    hiddenFileInput.current && hiddenFileInput.current.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]

    if (file) {
      onFileAdded(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)

    const file = event.dataTransfer.files && event.dataTransfer.files[0]

    if (file) {
      setIsLoading && setIsLoading(true)
      onFileAdded(file)
    }
  }

  const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true)
    event.preventDefault()
    event.stopPropagation()
  }

  const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(false)
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <div>
      <div
        className={cn('border border-dashed rounded-lg bg-main-grey py-20 h-[12.5rem]', {
          'border-control-grey-hover border-solid': isDragging,
        })}
        onDrop={handleDrop}
        onDragEnter={onDragEnter}
        onDragOver={onDragEnter}
        onDragLeave={onDragLeave}
      >
        {isLoading && (
          <div className="font-normal text-sm w-fit mx-auto items-center">
            <Loader className="h-9 w-9 mx-auto stroke-[#2E3338]" />
            <div className="w-fit mx-auto mt-4">Uploading file</div>
          </div>
        )}
        {!isError && !isLoading && !children && (
          <>
            <div className="font-normal text-sm w-fit mx-auto">
              <div className="w-fit">Drop your CSV file here or</div>
              <button className="underline hover:no-underline mt-1" onClick={handleClick}>
                upload it from your device
              </button>
            </div>
            <input
              type="file"
              accept="text/csv"
              onChange={handleFileChange}
              ref={hiddenFileInput}
              className="hidden"
            />
          </>
        )}

        {isError && (
          <div className="font-normal text-sm w-fit mx-auto items-center">
            <div className="w-fit mx-auto">
              {/* // Create a new SVG icon for this */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
              >
                <path
                  d="M26.6258 4.55042C26.3664 4.08102 25.986 3.68972 25.5242 3.41722C25.0624 3.1447 24.536 3.00098 23.9998 3.00098C23.4634 3.00098 22.937 3.1447 22.4752 3.41722C22.0134 3.68972 21.633 4.08102 21.3738 4.55042L1.87369 40.5504C1.62153 41.0072 1.49283 41.5218 1.50031 42.0434C1.50778 42.565 1.65117 43.0758 1.91632 43.525C2.18148 43.9744 2.5592 44.3468 3.01226 44.6056C3.4653 44.8642 3.97798 45.0004 4.4997 45.0004H43.4998C44.0214 45.0004 44.5342 44.8642 44.9872 44.6056C45.4402 44.3468 45.818 43.9744 46.0832 43.525C46.3482 43.0758 46.4916 42.565 46.4992 42.0434C46.5066 41.5218 46.3778 41.0072 46.1258 40.5504L26.6258 4.55042Z"
                  stroke="#2E3338"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 30V16.5"
                  stroke="#2E3338"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 37.5C23.5858 37.5 23.25 37.1642 23.25 36.75C23.25 36.3358 23.5858 36 24 36"
                  stroke="#2E3338"
                  strokeWidth="2"
                />
                <path
                  d="M24 37.5C24.4142 37.5 24.75 37.1642 24.75 36.75C24.75 36.3358 24.4142 36 24 36"
                  stroke="#2E3338"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="w-fit mx-auto mt-4">The file could not be uploaded</div>
            <div className="w-fit mx-auto mt-2">
              <button
                className="underline hover:no-underline mt-1"
                onClick={() => setIsError && setIsError(false)}
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {children}
      </div>
      {!children && (
        <div className="flex text-xs text-grey-text mt-4 w-fit mx-auto items-center">
          <div>Which format to use?</div>{' '}
          <div className="ml-2">
            <a
              href={'data:text/csv;charset=utf-8,' + encodeURIComponent(templateContent ?? '')}
              download={templateName ?? 'template.csv'}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Download an invoice CSV template
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileInput
