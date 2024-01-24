import { Payrun } from '@nofrixion/moneymoov'

import { Status } from '../../molecules'

export interface PayrunDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  payruns: Payrun[] | undefined
  onPayrunClick?: (payrun: Payrun) => void
}

const PayrunDashboard: React.FC<PayrunDashboardProps> = ({ payruns, onPayrunClick }) => {
  return (
    <>
      <div className="font-inter bg-main-grey text-default-text h-full">
        <h3 className="text-xl/8 font-semibold mb-6 md:px-4">Unpaid payruns</h3>
        <div className="flex flex-col gap-5">
          {payruns?.map((payrun) => {
            return (
              <button
                key={`payrun-row-${payrun.id}`}
                className="bg-white px-6 py-4 rounded-lg flex"
                onClick={() => {
                  if (!onPayrunClick) {
                    console.warn('Please implement `onPayrunClick`')
                    return
                  }

                  onPayrunClick(payrun)
                }}
              >
                <span className="mr-2 md:mr-6 text-sm/6 font-semibold">{payrun.name}</span>
                <Status variant={'draft'} />
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

export { PayrunDashboard }
