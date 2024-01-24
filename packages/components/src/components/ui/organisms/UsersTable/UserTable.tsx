import { Pagination, UserRoleAndUserInvite, UserStatus } from '@nofrixion/moneymoov'
import { sub } from 'date-fns'

import { DoubleSortByUsersAndInvites, SortByUsersAndInvites } from '../../../../types/Sort'
import { cn } from '../../../../utils'
import { formatDateWithYearAndTime } from '../../../../utils/formatters'
import { userRoleToDisplay, userStatusToStatus } from '../../../../utils/parsers'
import { Button } from '../../atoms'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../atoms/Table/Table'
import ColumnHeader from '../../ColumnHeader/ColumnHeader'
import { Loader } from '../../Loader/Loader'
import { Status } from '../../molecules'
import Pager from '../../Pager/Pager'
import EmptyState from '../../PaymentRequestTable/EmptyState'
import { makeToast } from '../../Toast/Toast'

export interface UserTableProps extends React.HTMLAttributes<HTMLDivElement> {
  users: UserRoleAndUserInvite[] | undefined
  pagination: Pick<Pagination, 'pageSize' | 'totalSize'>
  onPageChange: (page: number) => void
  sortBy: DoubleSortByUsersAndInvites
  onSort: (sortInfo: DoubleSortByUsersAndInvites) => void
  onUserClicked?: (user: UserRoleAndUserInvite) => void
  onResendInvitation?: (inviteID?: string) => void
  isLoading?: boolean
  selectedUserId: string | undefined
  onPageSizeChange: (pageSize: number) => void
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  pagination,
  onPageChange,
  sortBy,
  onSort,
  onUserClicked,
  isLoading,
  selectedUserId,
  onResendInvitation,
  onPageSizeChange,
  ...props
}: UserTableProps) => {
  const onUserClickedHandler = (
    event: React.MouseEvent<HTMLTableRowElement | HTMLButtonElement | HTMLDivElement, MouseEvent>,
    user: UserRoleAndUserInvite,
  ) => {
    if (user.status !== UserStatus.Invited) {
      onUserClicked && onUserClicked(user)
    }
  }

  const isExpired = (date: Date) => {
    return new Date(date).getTime() < new Date(sub(new Date(), { days: 3 })).getTime()
      ? true
      : false
  }

  const onCopyLinkClickedHandler = (
    event: React.MouseEvent<HTMLTableRowElement | HTMLButtonElement | HTMLDivElement, MouseEvent>,
    inviteId?: string,
  ) => {
    event.stopPropagation()
    const url = `${import.meta.env.VITE_PUBLIC_PORTAL_URL}/Home/Register?userInviteID=${inviteId}`
    navigator.clipboard.writeText(url)
    makeToast('success', 'Link copied to clipboard')
  }

  const handleOnSort = (sortInfo: SortByUsersAndInvites) => {
    // If primary sort is the same as the new sort, then we need to toggle the direction
    // If primary sort is different, then we need to set the new sort as primary and the old primary as secondary
    if (sortBy.primary.name === sortInfo.name) {
      const newSort = {
        primary: sortInfo,
        secondary: sortBy.secondary,
      }
      onSort(newSort)
    } else {
      const newSort = {
        primary: sortInfo,
        secondary: sortBy.primary,
      }
      onSort(newSort)
    }
  }

  return (
    <div className="flex justify-center w-full" {...props}>
      {users && users.length > 0 && (
        <>
          <Table {...props}>
            <TableHeader>
              <TableRow className="hover:bg-transparent cursor-auto">
                <TableHead className="w-[150px]">
                  <ColumnHeader
                    label={'Status'}
                    sortDirection={
                      sortBy.primary.name === 'status' ? sortBy.primary.direction : undefined
                    }
                    onSort={(direction) => handleOnSort({ name: 'status', direction })}
                  />
                </TableHead>
                <TableHead>
                  <ColumnHeader
                    label={'User Name'}
                    sortDirection={
                      sortBy.primary.name === 'name' ? sortBy.primary.direction : undefined
                    }
                    onSort={(direction) => handleOnSort({ name: 'name', direction })}
                  />
                </TableHead>
                <TableHead>
                  <ColumnHeader
                    label={'Role'}
                    sortDirection={
                      sortBy.primary.name === 'role' ? sortBy.primary.direction : undefined
                    }
                    onSort={(direction) => handleOnSort({ name: 'role', direction })}
                  />
                </TableHead>
                <TableHead>
                  <ColumnHeader
                    label={'Last Modified'}
                    sortDirection={
                      sortBy.primary.name === 'lastModified' ? sortBy.primary.direction : undefined
                    }
                    onSort={(direction) => handleOnSort({ name: 'lastModified', direction })}
                  />
                </TableHead>
                <TableHead>{/* Action buttons */}</TableHead>
                <TableHead>
                  <Pager
                    onPageChange={onPageChange}
                    pageSize={pagination.pageSize}
                    totalRecords={pagination.totalSize}
                    onPageSizeChange={onPageSizeChange}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from(Array(12)).map((_, index) => (
                  <TableRow
                    key={`pr-placeholder-${index}`}
                    className="animate-pulse border-b border-[#F1F2F3]"
                  >
                    <TableCell className="w-48 py-6">
                      <div className="w-full h-2 bg-[#E0E9EB] rounded-lg" />
                    </TableCell>

                    <TableCell className="w-48">
                      <div className="w-full h-2 bg-[#E0E9EB] rounded-lg" />
                    </TableCell>

                    <TableCell className="w-48">
                      <div className="w-full ml-auto h-2 bg-[#E0E9EB] rounded-lg" />
                    </TableCell>

                    <TableCell className="pl-0">
                      <div className="w-1/3 h-2 bg-[#E0E9EB] rounded-lg" />
                    </TableCell>

                    <TableCell className="w-0"></TableCell>

                    <TableCell className="w-0"></TableCell>
                  </TableRow>
                ))}

              {!isLoading &&
                users &&
                users.length > 0 &&
                users?.map((user, index) => (
                  <TableRow
                    className={cn('cursor-pointer transition-all ease-in-out', {
                      'hover:bg-white': user.status === UserStatus.Invited,
                      'bg-[#F6F8F9] border-[#E1E5EA]':
                        selectedUserId && selectedUserId === user.userID,
                      'cursor-default': user.status === UserStatus.Invited,
                    })}
                    key={`${user}-${index}`}
                    onClick={(event) => onUserClickedHandler(event, user)}
                  >
                    <TableCell className="w-48">
                      <Status size="small" variant={userStatusToStatus(user.status)} />
                    </TableCell>
                    <TableCell className="w-48">
                      {user.name !== '' ? user.name : user.emailAddress}
                    </TableCell>
                    <TableCell className="w-48">{userRoleToDisplay(user.roleType)}</TableCell>
                    <TableCell>
                      {user.lastModified && formatDateWithYearAndTime(new Date(user.lastModified))}
                    </TableCell>
                    <TableCell className="pl-0 text-grey-text font-normal text-sm text-right">
                      {user.status === UserStatus.Invited &&
                        user.inviteID &&
                        isExpired(user.lastModified) && (
                          <Status variant="expired_link" className="stroke-none" />
                        )}
                      {user.status === UserStatus.Invited &&
                        user.inviteID &&
                        !isExpired(user.lastModified) && (
                          <Button
                            variant="secondary"
                            size="small"
                            className="w-fit"
                            onClick={(event) => onCopyLinkClickedHandler(event, user.inviteID)}
                          >
                            Copy link
                          </Button>
                        )}
                    </TableCell>
                    <TableCell className="text-right w-0">
                      {user.status === UserStatus.Invited && user.inviteID && (
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => onResendInvitation && onResendInvitation(user.inviteID)}
                        >
                          Resend invitation
                        </Button>
                      )}
                      {user.status === UserStatus.RolePending && (
                        <Button variant="primary" size="small" className="w-fit">
                          Set role
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </>
      )}

      {isLoading && !users && (
        <div className=" justify-center items-center">
          <Loader className="mt-12" />
        </div>
      )}

      {!isLoading && users !== undefined && users?.length === 0 && (
        <EmptyState state="nothingFound" description="No users were found" />
      )}
    </div>
  )
}

export default UserTable
