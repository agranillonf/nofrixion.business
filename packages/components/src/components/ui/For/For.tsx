import { cn } from '../../../utils'

export interface ForProps {
  title?: string
  customerName?: string
}

const For = ({ title, customerName }: ForProps) => {
  return (
    <>
      <div className="flex flex-col">
        <p className={cn('truncate text-13px', { 'text-disabled-text': !title })}>
          {title ? title : 'Untitled'}
        </p>
        <p
          className={cn(
            'truncate break-all text-xs ',
            customerName ? 'text-grey-text' : 'text-disabled-text',
          )}
        >
          {customerName ? customerName : 'Anonymous'}
        </p>
      </div>
    </>
  )
}

export default For
