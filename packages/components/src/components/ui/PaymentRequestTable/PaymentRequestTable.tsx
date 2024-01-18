import { PaymentResult } from '@nofrixion/moneymoov'
import classNames from 'classnames'
import { useCallback, useState } from 'react'

import { LocalPaymentRequestTableColumns } from '../../../types/LocalEnums'
import { Column, LocalPaymentRequest, SystemError } from '../../../types/LocalTypes'
import { DoubleSortByPaymentRequests, SortByPaymentRequests } from '../../../types/Sort'
import { cn } from '../../../utils'
import ColumnHeader from '../ColumnHeader/ColumnHeader'
import { Loader } from '../Loader/Loader'
import SystemErrorModal from '../Modals/SystemErrorModal/SystemErrorModal'
import EditColumns from '../molecules/EditColumns/EditColumns'
import Pager from '../Pager/Pager'
import PaymentRequestMobileCard from '../PaymentRequestMobileCard/PaymentRequestMobileCard'
import PaymentRequestRow from '../PaymentRequestRow/PaymentRequestRow'
import TableScrollbar from '../TableScrollbar/TableScrollbar'
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
  columns?: Column[]
  setColumns?: (columns: Column[]) => void
}

const commonThClasses = 'px-4 pb-4 font-normal'

const PaymentRequestTable = ({
  paymentRequests,
  sortBy,
  onPaymentRequestClicked,
  onPaymentRequestDuplicateClicked,
  onPaymentRequestDeleteClicked,
  onPaymentRequestCopyLinkClicked,
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
  columns,
  setColumns,
  pageSize,
  onPageChanged,
  totalRecords,
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

  const isColumnSelected = (columnId: LocalPaymentRequestTableColumns) => {
    return columns && columns.find((x) => x.id == columnId)?.selected
  }

  const scrollbarRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setScrollbarVisible(true)
    } else {
      setScrollbarVisible(false)
    }
  }, [])

  const [scrollbarVisible, setScrollbarVisible] = useState<boolean>(false)

  return (
    <div className="flex justify-center w-full">
      {((paymentRequestsExist && !paymentRequests) ||
        (paymentRequests && paymentRequests.length > 0)) && (
        <div className="hidden lg:flex flex-col w-full ">
          {/* Show table when loading so the skeletons are visible */}
          {/* or else show the table when has payment requests */}
          <TableScrollbar ref={scrollbarRef}>
            <div className={cn(scrollbarVisible ? 'mb-10' : 'mb-0')}>
              {/* <div className="mb-10"> */}
              <table className="hidden lg:table table-fixed text-left w-full  bg-white">
                <colgroup>
                  {isColumnSelected(LocalPaymentRequestTableColumns.Created) && <col />}
                  {isColumnSelected(LocalPaymentRequestTableColumns.For) && <col />}
                  {isColumnSelected(LocalPaymentRequestTableColumns.Requested) && <col />}
                  {isColumnSelected(LocalPaymentRequestTableColumns.Paid) && (
                    <>
                      <col />
                      <col />
                    </>
                  )}
                  {isColumnSelected(LocalPaymentRequestTableColumns.PaymentAttempts) && <col />}
                  {isColumnSelected(LocalPaymentRequestTableColumns.OrderId) && <col />}
                  {isColumnSelected(LocalPaymentRequestTableColumns.PaymentRequestId) && <col />}
                  {isColumnSelected(LocalPaymentRequestTableColumns.Tags) && <col />}
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    {isColumnSelected(LocalPaymentRequestTableColumns.Created) && (
                      <th
                        className={classNames(
                          commonThClasses,
                          '2xl:w-36 xl:w-28 lg:w-24 text-left',
                        )}
                      >
                        <ColumnHeader
                          label="Created"
                          sortDirection={
                            sortBy?.primary.name === 'created'
                              ? sortBy.primary.direction
                              : undefined
                          }
                          onSort={(direction) => handleOnSort({ name: 'created', direction })}
                        />
                      </th>
                    )}
                    {isColumnSelected(LocalPaymentRequestTableColumns.For) && (
                      <th
                        className={classNames(
                          commonThClasses,
                          '2xl:w-44 xl:w-32 lg:w-24 text-left',
                        )}
                      >
                        <ColumnHeader
                          label="For"
                          sortDirection={
                            sortBy?.primary.name === 'title' ? sortBy.primary.direction : undefined
                          }
                          onSort={(direction) => handleOnSort({ name: 'title', direction })}
                        />
                      </th>
                    )}
                    {isColumnSelected(LocalPaymentRequestTableColumns.Requested) && (
                      <th
                        className={classNames(
                          commonThClasses,
                          '2xl:w-44 xl:w-36 lg:w-32 text-right pr-0',
                        )}
                      >
                        <ColumnHeader
                          label="Requested"
                          sortDirection={
                            sortBy?.primary.name === 'amount' ? sortBy.primary.direction : undefined
                          }
                          onSort={(direction) => handleOnSort({ name: 'amount', direction })}
                        />
                      </th>
                    )}
                    {isColumnSelected(LocalPaymentRequestTableColumns.Paid) && (
                      <>
                        <th
                          className={classNames(
                            commonThClasses,
                            '2xl:w-44 xl:w-40 lg:w-28 text-right',
                          )}
                        >
                          <ColumnHeader label="Paid" />
                        </th>

                        <th className={classNames('pb-11 2xl:w-32 xl:w-28 lg:w-24')}></th>
                      </>
                    )}

                    {isColumnSelected(LocalPaymentRequestTableColumns.PaymentAttempts) && (
                      <th className={classNames(commonThClasses, 'w-64')}>
                        <ColumnHeader label="Payment Attempts" />
                      </th>
                    )}
                    {isColumnSelected(LocalPaymentRequestTableColumns.OrderId) && (
                      <th
                        className={classNames(
                          commonThClasses,
                          '2xl:w-44 xl:w-32 lg:w-28 text-left',
                        )}
                      >
                        <ColumnHeader label="Order ID" />
                      </th>
                    )}
                    {isColumnSelected(LocalPaymentRequestTableColumns.PaymentRequestId) && (
                      <th className={classNames(commonThClasses, 'w-80')}>
                        <ColumnHeader label="Payment Request ID" />
                      </th>
                    )}

                    {/* 
                Tags column 
                However, it's used to display the
                pagination component in the table header
              */}
                    {isColumnSelected(LocalPaymentRequestTableColumns.Tags) && (
                      <th className={classNames(commonThClasses, '2xl:w-52 xl:w-32')}></th>
                    )}
                    <th
                      className={classNames(
                        commonThClasses,
                        'bg-gradient-to-l from-white via-white to-transparent sticky right-0 pr-2',
                        isColumnSelected(LocalPaymentRequestTableColumns.Tags) || scrollbarVisible
                          ? 'w-14'
                          : 'w-full',
                      )}
                    >
                      <div className="float-right">
                        {/*Will contain export icon here later */}
                        <div className="w-4 h-4" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {((isLoading && paymentRequestsExist) ||
                    (paymentRequestsExist && !paymentRequests)) &&
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
                        {isColumnSelected(LocalPaymentRequestTableColumns.Created) && (
                          <td className="py-6">
                            <div className="w-1/2 ml-4 h-2 bg-[#E0E9EB] rounded-lg" />
                          </td>
                        )}

                        {/* For */}
                        {isColumnSelected(LocalPaymentRequestTableColumns.For) && (
                          <td className="py-6">
                            <div className="w-1/2 ml-4 h-2 bg-[#E0E9EB] rounded-lg" />
                          </td>
                        )}

                        {/* Amount */}
                        {isColumnSelected(LocalPaymentRequestTableColumns.Requested) && (
                          <td className="px-0 py-6 text-right">
                            <div className="w-3/4 ml-auto h-2 bg-[#E0E9EB] rounded-l-lg" />
                          </td>
                        )}

                        {/* Paid */}
                        {/* Status */}
                        {isColumnSelected(LocalPaymentRequestTableColumns.Paid) && (
                          <>
                            <td className="px-0 py-6">
                              <div className="w-1/2 ml-auto h-2 bg-[#E0E9EB] rounded-l-lg" />
                            </td>

                            <td className="px-0 py-6">
                              <div className="w-1/2 h-2 bg-[#E0E9EB] rounded-r-lg mr-4" />
                            </td>
                          </>
                        )}

                        {/* Payment Attempts */}
                        {isColumnSelected(LocalPaymentRequestTableColumns.PaymentAttempts) && (
                          <td className="px-0 py-6">
                            <div className="w-1/2 h-2 bg-[#E0E9EB] rounded-r-lg mr-4" />
                          </td>
                        )}

                        {/* Extra */}
                        {isColumnSelected(LocalPaymentRequestTableColumns.Tags) && (
                          <td className="py-6">
                            <div className="w-full ml-auto h-2 bg-[#E0E9EB] rounded-lg mr-2" />
                          </td>
                        )}
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
                        onOpenPaymentPage={() =>
                          onOpenPaymentPage && onOpenPaymentPage(paymentRequest)
                        }
                        selected={selectedPaymentRequestID === paymentRequest.id}
                        columns={columns}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </TableScrollbar>

          {!isLoading && paymentRequests && paymentRequests.length > 0 && (
            <div className="hidden lg:flex pt-2 mt-6 justify-between">
              {columns && setColumns && (
                <EditColumns columns={columns} setColumns={setColumns}></EditColumns>
              )}
              <Pager
                pageSize={pageSize}
                totalRecords={totalRecords}
                onPageChange={(newPage) => onPageChanged && onPageChanged(newPage)}
              />
            </div>
          )}
        </div>
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
