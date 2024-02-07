import { Pagination, UserMetrics, UserRoleAndUserInvite, UserStatus } from '@nofrixion/moneymoov'
import * as Tabs from '@radix-ui/react-tabs'

import { SystemError } from '../../../../types/LocalTypes'
import { DoubleSortByUsersAndInvites } from '../../../../types/Sort'
import { Button, Icon } from '../../atoms'
import DashboardTab from '../../DashboardTab/DashboardTab'
import SystemErrorModal from '../../Modals/SystemErrorModal/SystemErrorModal'
import UserTable from '../../organisms/UsersTable/UserTable'
import ScrollArea from '../../ScrollArea/ScrollArea'
import { Toaster } from '../../Toast/Toast'

export interface UserDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  users: UserRoleAndUserInvite[] | undefined
  pagination: Pick<Pagination, 'pageSize' | 'totalSize'>
  isLoading: boolean
  selectedUserId: string | undefined
  metrics?: UserMetrics
  isLoadingMetrics: boolean
  status: UserStatus
  onPageChange: (page: number) => void
  sortBy: DoubleSortByUsersAndInvites
  onSort: (sortInfo: DoubleSortByUsersAndInvites) => void
  onUserClicked?: (user: UserRoleAndUserInvite) => void
  onInviteUser: () => void
  onResendInvitation?: (inviteID?: string) => void
  setStatus?: (status: UserStatus) => void
  systemError?: SystemError
  isSystemErrorOpen?: boolean
  onCloseSystemError?: () => void
  onPageSizeChange: (pageSize: number) => void
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  users,
  pagination,
  isLoading = false,
  selectedUserId,
  metrics,
  isLoadingMetrics,
  status,
  onPageChange,
  sortBy,
  onSort,
  onInviteUser,
  onUserClicked,
  onResendInvitation,
  setStatus,
  systemError,
  isSystemErrorOpen = false,
  onCloseSystemError,
  onPageSizeChange,
}) => {
  const handlOnCloseSystemErrorModal = () => {
    if (onCloseSystemError) {
      onCloseSystemError()
    }
  }

  return (
    <>
      <div className="font-inter bg-main-grey text-default-text h-full">
        <div className="flex gap-8 justify-between items-center mb-8 md:mb-[68px] md:px-4">
          <span className="leading-8 font-medium text-2xl md:text-[1.75rem]">Users</span>
          <div className="flex">
            <Button size="large" onClick={onInviteUser} className="w-10 h-10 md:w-full md:h-full">
              <span className="hidden md:inline-block">Invite user</span>
              <Icon name="add/16" className="md:hidden" />
            </Button>
          </div>
        </div>

        <ScrollArea hideScrollbar>
          <Tabs.Root
            defaultValue={UserStatus.All}
            onValueChange={(value) => setStatus && setStatus(value as UserStatus)}
            value={status}
          >
            {/* Keep the Tab to still get accessibility functions through the keyboard */}
            <Tabs.List className="flex shrink-0 gap-x-4 mb-4">
              <DashboardTab
                status={UserStatus.All}
                isLoading={isLoadingMetrics}
                totalRecords={metrics?.all ?? 0}
              />
              <DashboardTab
                status={UserStatus.Invited}
                isLoading={isLoadingMetrics}
                totalRecords={metrics?.invited ?? 0}
              />
              <DashboardTab
                status={UserStatus.RolePending}
                isLoading={isLoadingMetrics}
                totalRecords={metrics?.rolePending ?? 0}
              />
              <DashboardTab
                status={UserStatus.Active}
                isLoading={isLoadingMetrics}
                totalRecords={metrics?.active ?? 0}
              />
            </Tabs.List>
            <Tabs.Content value=""></Tabs.Content>
          </Tabs.Root>
        </ScrollArea>

        <div className="flex-row bg-white rounded-lg px-7 py-8">
          <UserTable
            users={users}
            pagination={{
              pageSize: pagination.pageSize,
              totalSize: pagination.totalSize,
            }}
            onPageChange={onPageChange}
            sortBy={sortBy}
            onSort={onSort}
            isLoading={isLoading}
            onUserClicked={onUserClicked}
            selectedUserId={selectedUserId}
            onResendInvitation={onResendInvitation}
            onPageSizeChange={onPageSizeChange}
          />
        </div>

        {/* System error modal */}
        <SystemErrorModal
          open={isSystemErrorOpen}
          title={systemError?.title}
          message={systemError?.message}
          onDismiss={handlOnCloseSystemErrorModal}
        />

        <Toaster positionY="top" positionX="right" duration={3000} />
      </div>
    </>
  )
}

export { UserDashboard }
