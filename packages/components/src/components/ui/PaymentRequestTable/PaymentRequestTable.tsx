import { PaymentResult } from '@nofrixion/moneymoov'
import classNames from 'classnames'

import { LocalPaymentRequest, SystemError } from '../../../types/LocalTypes'
import { DoubleSortByPaymentRequests, SortByPaymentRequests } from '../../../types/Sort'
import ColumnHeader from '../ColumnHeader/ColumnHeader'
import { Loader } from '../Loader/Loader'
import SystemErrorModal from '../Modals/SystemErrorModal/SystemErrorModal'
import Pager from '../Pager/Pager'
import PaymentRequestMobileCard from '../PaymentRequestMobileCard/PaymentRequestMobileCard'
import PaymentRequestRow from '../PaymentRequestRow/PaymentRequestRow'
import { Toaster } from '../Toast/Toast'
import EmptyState from './EmptyState'

export interface PaymentRequestTableProps {
  paymentRequests: LocalPaymentRequest[] | undefined
  pageSize: number
  totalRecords: number
  onPaymentRequestClicked?: (paymentRequest: LocalPaymentRequest) => void
  onPaymentRequestDuplicateClicked: (paymentRequest: LocalPaymentRequest) => void
  onPaymentRequestDeleteClicked: (paymentRequest: LocalPaymentRequest) => void
  onPaymentRequestCopyLinkClicked: (paymentRequest: LocalPaymentRequest) => void
  onPageChanged?: (newPage: number) => void
  sortBy?: DoubleSortByPaymentRequests
  onSort?: (sortInfo: DoubleSortByPaymentRequests) => void
  onCreatePaymentRequest?: () => void
  onOpenPaymentPage: (paymentRequest: LocalPaymentRequest) => void
  isLoading?: boolean
  isEmpty?: boolean // True when there are no payment requests at all, even when filters are not applied
  selectedPaymentRequestID?: string
  paymentRequestsExist?: boolean
  isLoadingMetrics?: boolean
  systemError?: SystemError
  isSystemErrorOpen?: boolean
  onCloseSystemError?: () => void
}

const commonThClasses = 'px-4 pb-4 font-normal'

const PaymentRequestTable = ({
  paymentRequests,
  pageSize,
  totalRecords,
  sortBy,
  onPaymentRequestClicked,
  onPaymentRequestDuplicateClicked,
  onPaymentRequestDeleteClicked,
  onPaymentRequestCopyLinkClicked,
  onPageChanged,
  onSort,
  isLoading = false,
  isEmpty = false,
  onCreatePaymentRequest,
  onOpenPaymentPage,
  selectedPaymentRequestID,
  paymentRequestsExist,
  isLoadingMetrics,
  systemError,
  isSystemErrorOpen = false,
  onCloseSystemError,
}: PaymentRequestTableProps) => {
  const onPaymentRequestClickedHandler = (
    event: React.MouseEvent<HTMLTableRowElement | HTMLButtonElement | HTMLDivElement, MouseEvent>,
    paymentRequest: LocalPaymentRequest,
  ) => {
    if (event.metaKey) {
      onOpenPaymentPage && onOpenPaymentPage(paymentRequest)
    } else {
      onPaymentRequestClicked && onPaymentRequestClicked(paymentRequest)
    }
  }

  const handleOnSort = (sortInfo: SortByPaymentRequests) => {
    // If primary sort is the same as the new sort, then we need to toggle the direction
    // If primary sort is different, then we need to set the new sort as primary and the old primary as secondary
    if (sortBy?.primary.name === sortInfo.name) {
      const newSort = {
        primary: sortInfo,
        secondary: sortBy?.secondary,
      }
      onSort && onSort(newSort)
    } else {
      const newSort = {
        primary: sortInfo,
        secondary: sortBy?.primary,
      }
      onSort && onSort(newSort)
    }
  }

  const handlOnCloseSystemErrorModal = () => {
    if (onCloseSystemError) {
      onCloseSystemError()
    }
  }

  return (
    <div className="flex justify-center w-full">
      {/* Show table when loading so the skeletons are visible */}
      {/* or else show the table when has payment requests */}
      {((paymentRequestsExist && !paymentRequests) ||
        (paymentRequests && paymentRequests.length > 0)) && (
        <table className="hidden lg:table table-fixed text-left w-full">
          <colgroup>
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col className="w-8" />
          </colgroup>
          <thead>
            <tr>
              <th className={classNames(commonThClasses, '2xl:w-36 xl:w-28 lg:w-24 text-left')}>
                <ColumnHeader
                  label="Created"
                  sortDirection={
                    sortBy?.primary.name === 'created' ? sortBy.primary.direction : undefined
                  }
                  onSort={(direction) => handleOnSort({ name: 'created', direction })}
                />
              </th>
              <th className={classNames(commonThClasses, '2xl:w-44 xl:w-32 lg:w-28 text-left')}>
                <ColumnHeader
                  label="For"
                  sortDirection={
                    sortBy?.primary.name === 'title' ? sortBy.primary.direction : undefined
                  }
                  onSort={(direction) => handleOnSort({ name: 'title', direction })}
                />
              </th>
              <th
                className={classNames(commonThClasses, '2xl:w-44 xl:w-36 lg:w-32 text-right pr-0')}
              >
                <ColumnHeader
                  label="Requested"
                  sortDirection={
                    sortBy?.primary.name === 'amount' ? sortBy.primary.direction : undefined
                  }
                  onSort={(direction) => handleOnSort({ name: 'amount', direction })}
                />
              </th>
              <th className={classNames(commonThClasses, '2xl:w-44 xl:w-40 lg:w-36 text-right')}>
                <ColumnHeader label="Paid" />
              </th>
              {/* Status */}
              <th className={classNames('pb-11 2xl:w-32 xl:w-28 lg:w-24')}></th>

              <th className={classNames(commonThClasses, 'w-64')}>
                <ColumnHeader label="Payment Attempts" />
              </th>

              {/* 
                Tags column 
                However, it's used to display the
                pagination component in the table header
              */}
              <th colSpan={2} className={classNames(commonThClasses, 'w-68')}>
                <Pager
                  pageSize={pageSize}
                  totalRecords={totalRecords}
                  onPageChange={(newPage) => onPageChanged && onPageChanged(newPage)}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {((isLoading && paymentRequestsExist) || (paymentRequestsExist && !paymentRequests)) &&
              // Create array of 12 empty rows
              // to display a loading skeleton
              // while the data is being fetched
              // from the server
              Array.from(Array(12)).map((_, index) => (
                <tr
                  key={`pr-placeholder-${index}`}
                  className="animate-pulse border-b border-[#F1F2F3]"
                >
                  {/* Created */}
                  <td className="py-6">
                    <div className="w-1/2 ml-4 h-2 bg-[#E0E9EB] rounded-lg" />
                  </td>

                  {/* For */}
                  <td>
                    <div className="w-1/2 ml-4 h-2 bg-[#E0E9EB] rounded-lg" />
                  </td>

                  {/* Amount */}
                  <td className="p-0 text-right">
                    <div className="w-3/4 ml-auto h-2 bg-[#E0E9EB] rounded-l-lg" />
                  </td>

                  {/* Paid */}
                  <td className="p-0">
                    <div className="w-1/2 ml-auto h-2 bg-[#E0E9EB] rounded-l-lg" />
                  </td>
                  {/* Status */}
                  <td className="p-0">
                    <div className="w-1/2 h-2 bg-[#E0E9EB] rounded-r-lg mr-4" />
                  </td>

                  {/* Payment Attempts */}
                  <td className="p-0">
                    <div className="w-1/2 h-2 bg-[#E0E9EB] rounded-r-lg mr-4" />
                  </td>

                  {/* Extra */}
                  <td>
                    <div className="w-full ml-auto h-2 bg-[#E0E9EB] rounded-lg mr-2" />
                  </td>
                </tr>
              ))}
            {!isLoading &&
              paymentRequests &&
              paymentRequests.length > 0 &&
              paymentRequests?.map((paymentRequest, index) => (
                <PaymentRequestRow
                  key={`pr-${index}`}
                  {...paymentRequest}
                  onClick={(event) => onPaymentRequestClickedHandler(event, paymentRequest)}
                  onDuplicate={() =>
                    onPaymentRequestDuplicateClicked &&
                    onPaymentRequestDuplicateClicked(paymentRequest)
                  }
                  onDelete={
                    paymentRequest.remoteStatus === PaymentResult.None
                      ? () =>
                          onPaymentRequestDeleteClicked &&
                          onPaymentRequestDeleteClicked(paymentRequest)
                      : undefined
                  }
                  onCopyLink={() =>
                    onPaymentRequestCopyLinkClicked &&
                    onPaymentRequestCopyLinkClicked(paymentRequest)
                  }
                  onOpenPaymentPage={() => onOpenPaymentPage && onOpenPaymentPage(paymentRequest)}
                  selected={selectedPaymentRequestID === paymentRequest.id}
                />
              ))}
          </tbody>
        </table>
      )}
      {paymentRequests && paymentRequests.length > 0 && (
        <div className="lg:hidden space-y-2 w-full">
          {paymentRequests.map((paymentRequest, index) => (
            <PaymentRequestMobileCard
              {...paymentRequest}
              key={`pr-mobile-${index}`}
              onClick={(event) => onPaymentRequestClickedHandler(event, paymentRequest)}
              onDuplicate={() =>
                onPaymentRequestDuplicateClicked && onPaymentRequestDuplicateClicked(paymentRequest)
              }
              onDelete={
                paymentRequest.paymentAttempts && paymentRequest.paymentAttempts.length > 0
                  ? undefined
                  : () =>
                      onPaymentRequestDeleteClicked && onPaymentRequestDeleteClicked(paymentRequest)
              }
              onCopyLink={() =>
                onPaymentRequestCopyLinkClicked && onPaymentRequestCopyLinkClicked(paymentRequest)
              }
              onOpenPaymentPage={() => onOpenPaymentPage && onOpenPaymentPage(paymentRequest)}
            />
          ))}
        </div>
      )}

      {((isLoadingMetrics && !paymentRequests) || (!paymentRequests && !paymentRequestsExist)) && (
        <div className=" justify-center items-center">
          <Loader className="mt-12" />
        </div>
      )}

      {isEmpty && paymentRequests && paymentRequests.length === 0 && (
        <EmptyState state="empty" onCreatePaymentRequest={onCreatePaymentRequest} />
      )}

      {/* Show empty state when contet has loaded and no there are no payment requests*/}
      {/* or also show when isEmpty property comes as `true` */}
      {!isLoadingMetrics &&
        paymentRequests !== undefined &&
        paymentRequests?.length === 0 &&
        !isEmpty && (
          // If `isEmpty` is true means that there're are no payment requests at all, no matter which tab is selected
          // Else,  there are no payment requests matching the filters
          <EmptyState state="nothingFound" onCreatePaymentRequest={onCreatePaymentRequest} />
        )}

      {/* System error modal */}
      <SystemErrorModal
        open={isSystemErrorOpen}
        title={systemError?.title}
        message={systemError?.message}
        onDismiss={handlOnCloseSystemErrorModal}
      />

      <Toaster positionY="top" positionX="right" duration={5000} />
    </div>
  )
}

export default PaymentRequestTable
