import { Icon, IconNames } from '@nofrixion/components/src/components/ui/atoms/Icon/Icon'
import { Link } from 'react-router-dom'

export interface NavItemProps {
  leftIcon: IconNames
  label: string
  href: string
  isActive?: boolean
}

const NavItem: React.FC<NavItemProps> = ({ leftIcon, label, href, isActive = false }) => {
  const NavItemContent = () => {
    return (
      <>
        <div className="w-4 h-4">
          <Icon name={leftIcon} />
        </div>

        <span className="ml-3">{label}</span>

        {isActive && <div className="h-1 bg-nav-accent w-full absolute left-0 bottom-0"></div>}
      </>
    )
  }

  if (isActive) {
    return (
      <div className="relative text-sm px-4 pt-2 pb-2 flex items-center 2xl:px-6 cursor-default text-nav-accent">
        <NavItemContent />
      </div>
    )
  }

  return (
    <Link
      to={href}
      className="relative text-sm px-4 pt-2 pb-2 flex items-center 2xl:px-6 hover:text-nav-accent"
    >
      <NavItemContent />
    </Link>
  )
}

export default NavItem
