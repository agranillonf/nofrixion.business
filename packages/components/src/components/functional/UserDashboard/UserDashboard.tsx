import {
  SortDirection,
  useResendUserInvitation,
  UserMetrics,
  UserRoleAndUserInvite,
  UserStatus,
  useUsersAndInvites,
  useUsersAndInvitesMetrics,
} from '@nofrixion/moneymoov'
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { SystemError } from '../../../types/LocalTypes'
import { DoubleSortByUsersAndInvites } from '../../../types/Sort'
import { UserDashboard as UIUserDashboard } from '../../ui/pages/UserDashboard/UserDashboard'
import { makeToast } from '../../ui/Toast/Toast'
import InviteUserModal from '../InviteUserModal/InviteUserModal'
import UserDetailsModal from '../UserDetailsModal/UserDetailsModal'

export interface UserDashboardProps {
  token?: string // Example: "eyJhbGciOiJIUz..."
  apiUrl?: string // Example: "https://api.nofrixion.com/api/v1"
  merchantId: string
  merchantName: string
}

const UserDashboard = ({
  token,
  apiUrl = 'https://api.nofrixion.com/api/v1',
  merchantId,
  merchantName,
}: UserDashboardProps) => {
  const queryClient = useQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <UserDashboardMain
        token={token}
        merchantId={merchantId}
        merchantName={merchantName}
        apiUrl={apiUrl}
      />
    </QueryClientProvider>
  )
}

const UserDashboardMain = ({
  token,
  apiUrl = 'https://api.nofrixion.com/api/v1',
  merchantId,
  merchantName,
}: UserDashboardProps) => {
  const [status, setStatus] = useState<UserStatus>(UserStatus.All)
  const [users, setUsers] = useState<UserRoleAndUserInvite[] | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState<number>(0)
  const [sortBy, setSortBy] = useState<DoubleSortByUsersAndInvites>({
    primary: {
      direction: SortDirection.NONE,
      name: 'lastModified',
    },
  })

  const [selectedUser, setSelectedUser] = useState<UserRoleAndUserInvite | undefined>(undefined)
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined)
  const [metrics, setMetrics] = useState<UserMetrics | undefined>(undefined)
  const [inviteUserClicked, setInviteUserClicked] = useState(false)

  const [systemError, setSystemError] = useState<SystemError | undefined>(undefined)
  const [isSystemErrorOpen, setIsSystemErrorOpen] = useState<boolean>(false)
  const [pageSize, setPageSize] = useState(20)

  const { data: usersResponse, isLoading: isLoadingUsers } = useUsersAndInvites(
    {
      merchantId: merchantId,
      pageNumber: page,
      pageSize: pageSize,
      sortBy: sortBy,
      status: status,
    },
    { apiUrl: apiUrl, authToken: token },
  )

  const { data: metricsResponse, isLoading: isLoadingMetrics } = useUsersAndInvitesMetrics(
    {
      merchantId: merchantId,
    },
    { apiUrl: apiUrl, authToken: token },
  )

  const { resendUserInvitation } = useResendUserInvitation({ apiUrl: apiUrl, authToken: token })

  useEffect(() => {
    setPage(1)
    setUsers(undefined)
  }, [merchantId])

  useEffect(() => {
    if (usersResponse?.status === 'success') {
      setUsers(usersResponse.data.content)
      setTotalRecords(usersResponse.data.totalSize)
    } else if (usersResponse?.status === 'error') {
      console.error(usersResponse.error)
      handleApiError()
    }
  }, [usersResponse])

  useEffect(() => {
    if (metricsResponse?.status === 'success') {
      setMetrics(metricsResponse.data)
    } else if (metricsResponse?.status === 'error') {
      console.error(metricsResponse.error)
      handleApiError()
    }
  }, [metricsResponse])

  const handleApiError = () => {
    handleSystemErrorMessage({
      title: "This page's data cannot be loaded at the moment",
      message:
        'An error occurred while trying to retrieve the data. Please try again later, or contact support if the error persists.',
    })
  }

  const onPageChange = (page: number) => {
    setPage(page)
  }

  const onUserRowClicked = (user: UserRoleAndUserInvite) => {
    setSelectedUser(user)
    setSelectedUserId(user.userID)
  }

  const onInviteUser = () => {
    setInviteUserClicked(true)
  }

  const onResendInvitation = async (inviteID?: string) => {
    if (!inviteID) {
      return
    }

    const response = await resendUserInvitation(inviteID)

    if (response.status === 'success') {
      makeToast('success', 'Invitation resent successfully.')
    } else if (response.status === 'error') {
      handleSystemErrorMessage({
        title: 'Resending user invitation has failed ',
        message: response.error.detail,
      })
      console.error(response.error)
    }
  }

  const onDismissUserDetailsModal = () => {
    setSelectedUser(undefined)
    setSelectedUserId(undefined)
  }

  const onCloseSystemErrorModal = () => {
    setIsSystemErrorOpen(false)
  }

  const handleSystemErrorMessage = (systemError: SystemError) => {
    setSystemError(systemError)
    setIsSystemErrorOpen(true)
  }

  return (
    <div>
      <UIUserDashboard
        users={users}
        pagination={{
          pageSize: pageSize,
          totalSize: totalRecords,
        }}
        onPageChange={onPageChange}
        sortBy={sortBy}
        onSort={setSortBy}
        isLoading={isLoadingUsers}
        onUserClicked={onUserRowClicked}
        selectedUserId={selectedUserId}
        onInviteUser={onInviteUser}
        onResendInvitation={onResendInvitation}
        metrics={metrics}
        isLoadingMetrics={isLoadingMetrics}
        status={status}
        setStatus={setStatus}
        systemError={systemError}
        isSystemErrorOpen={isSystemErrorOpen}
        onCloseSystemError={onCloseSystemErrorModal}
        onPageSizeChange={setPageSize}
      />

      {merchantId && (
        <InviteUserModal
          merchantID={merchantId}
          apiUrl={apiUrl}
          token={token}
          isOpen={inviteUserClicked}
          onDismiss={() => {
            setInviteUserClicked(false)
          }}
        />
      )}

      {merchantId && (
        <UserDetailsModal
          merchantId={merchantId}
          merchantName={merchantName}
          apiUrl={apiUrl}
          token={token}
          user={selectedUser}
          open={!!selectedUser}
          onDismiss={onDismissUserDetailsModal}
          onSystemError={handleSystemErrorMessage}
        />
      )}
    </div>
  )
}

export default UserDashboard
