import { LocalInvoice } from '../../../../types/LocalTypes'
import { cn } from '../../../../utils'
import { formatAmount, formatDateWithYear } from '../../../../utils/formatters'
import { formatCurrency } from '../../../../utils/uiFormaters'
import { Popover, PopoverContent, PopoverTrigger } from '../../atoms/Popover/Popover'
import Contact from '../../Contact/Contact'
import Switch from '../../Switch/Switch'

export type ImportInvoiceRowProps = LocalInvoice & {
  isSelected?: boolean
  onSelectedChange?: (selected: boolean) => void
  className?: string
}

const ImportInvoiceRow: React.FC<ImportInvoiceRowProps> = ({
  InvoiceNumber,
  PaymentTerms,
  InvoiceDate,
  DueDate,
  Currency,
  TotalAmount,
  Subtotal,
  Discounts,
  Taxes,
  OutstandingAmount,
  Contact: contact,
  RemittanceEmail,
  DestinationIban,
  DestinationAccountNumber,
  DestinationSortCode,
  Reference,
  isSelected,
  onSelectedChange,
  className,
}) => {
  const destinationAccount = DestinationIban
    ? DestinationIban.replace(' ', '')
    : DestinationAccountNumber && DestinationSortCode
    ? `${DestinationAccountNumber} - ${DestinationSortCode}`
    : '-'

  const renderPopupItem = (label: string, value: string) => (
    <div className="flex justify-between items-center w-full">
      <span className="text-grey-text text-xs">{label}</span>
      <span className="font-medium text-sm/4">{value}</span>
    </div>
  )

  return (
    <div
      className={cn(
        'flex text-sm/4 text-default-text gap-x-6 border-b border-border-grey transition',
        {
          'text-disabled-text': !isSelected,
        },
        className,
      )}
    >
      <div className="flex flex-col w-[5.5rem]">
        <span className="mb-2">{InvoiceNumber}</span>
        <span
          className={cn('text-xs text-grey-text transition', {
            'text-disabled-text': !isSelected,
          })}
        >
          {PaymentTerms}
        </span>
      </div>

      <span className="w-[7.5rem]">{formatDateWithYear(new Date(InvoiceDate), 'cardinal')}</span>

      <span className="w-[7.5rem]">{formatDateWithYear(new Date(DueDate), 'cardinal')}</span>

      <span className="w-[7.5rem] font-medium flex flex-col items-end">
        <Popover>
          <PopoverTrigger className="text-sm/5">
            {formatCurrency(Currency)}
            <span className="border-b-[0.094rem] border-dashed border-border-grey-highlighted pb-[0.125rem]">
              {formatAmount(TotalAmount)}
            </span>
          </PopoverTrigger>
          <PopoverContent className="bg-white" sideOffset={8}>
            <div className="flex flex-col gap-y-4">
              {Subtotal !== undefined &&
                renderPopupItem('Subtotal', `${formatCurrency(Currency)}${formatAmount(Subtotal)}`)}

              {Discounts !== undefined &&
                renderPopupItem(
                  'Discounts',
                  `- ${formatCurrency(Currency)}${formatAmount(Discounts)}`,
                )}

              {Taxes !== undefined &&
                renderPopupItem('Taxes', `${formatCurrency(Currency)}${formatAmount(Taxes)}`)}
            </div>
          </PopoverContent>
        </Popover>
        {OutstandingAmount !== undefined && (
          <span className="text-xs font-normal text-grey-text mt-2 text-end">
            {formatCurrency(Currency)}
            {OutstandingAmount} outstanding
          </span>
        )}
      </span>

      <div className="w-[12.5rem] ml-10">
        <Contact
          name={contact}
          email={RemittanceEmail}
          size="normal"
          emailClassName={cn('transition', {
            'text-disabled-text': !isSelected,
          })}
        />
      </div>

      {/* TODO: Better Support GBP UI for import (no design yet) */}
      <span className="w-[12.5rem] truncate" title={destinationAccount}>
        {destinationAccount}
      </span>

      <span className="w-[7.5rem]">{Reference}</span>

      <div className="ml-auto">
        <Switch
          value={isSelected ?? false}
          onChange={(value) => {
            onSelectedChange && onSelectedChange(value)
          }}
        />
      </div>
    </div>
  )
}

export default ImportInvoiceRow
