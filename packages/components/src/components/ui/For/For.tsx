import { cn } from '../../../utils'

export interface ForProps {
  title?: string
  customerName?: string
}

const For = ({ title, customerName }: ForProps) => {
  return (
    <>
      {title || customerName ? (
        <div className="flex flex-col">
          {title && <p className="truncate text-13px">{title}</p>}
          {customerName && (
            <p
              className={cn(' truncate break-all', title ? 'text-xs text-grey-text' : 'text-13px')}
            >
              {customerName}
            </p>
          )}
        </div>
      ) : (
        <div>
          <p className="truncate text-13px">Anonymous</p>
        </div>
      )}
    </>
  )
}

export default For
