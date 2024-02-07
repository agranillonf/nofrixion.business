import { IconNames } from '@nofrixion/components/src/components/ui/atoms/Icon/Icon'
import { LocalUserRoles } from '@nofrixion/components/src/types/LocalTypes'

import { getRoute } from './utils/utils'

const NOFRIXION_API_URL = '/api'
const NOFRIXION_BFF_URL = '/bff'

const NOFRIXION_BUSINESS_GITHUB_URL = 'https://github.com/nofrixion/nofrixion.business/pull/'

interface INavItem {
  leftIcon: IconNames
  label: string
  href: string
  isActive?: boolean
  isHidden?: boolean
  isHome?: boolean
  minimumRequiredRole: LocalUserRoles
}

const navItems: INavItem[] = [
  {
    leftIcon: 'dashboard/16',
    label: 'Dashboard',
    href: getRoute('/home'),
    isHome: true,
    minimumRequiredRole: LocalUserRoles.User,
  },
  {
    leftIcon: 'current-accounts/16',
    label: 'Current Accounts',
    href: 'current-accounts',
    minimumRequiredRole: LocalUserRoles.User,
  },
  {
    leftIcon: 'incoming/16',
    label: 'Accounts Receivable',
    href: 'accounts-receivable',
    minimumRequiredRole: LocalUserRoles.PaymentRequestor,
  },
  {
    leftIcon: 'outgoing/16',
    label: 'Accounts Payable',
    href: 'accounts-payable',
    minimumRequiredRole: LocalUserRoles.User,
  },
]

export { navItems, NOFRIXION_API_URL, NOFRIXION_BFF_URL, NOFRIXION_BUSINESS_GITHUB_URL }
