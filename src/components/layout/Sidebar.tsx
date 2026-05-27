import type { ElementType } from 'react'
import {
  Hexagon,
  ChevronUp,
  X,
} from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  type AppRoute,
  PRIMARY_NAV,
  SECONDARY_NAV,
  getRouteHref,
  isRouteActive,
} from './navigation'

interface SidebarProps {
  basePath: string
  isOpen?: boolean
  onClose?: () => void
}

interface NavItemProps {
  href: string
  label: string
  icon: ElementType
  isActive: boolean
}

function NavItem({ href, label, icon: Icon, isActive }: NavItemProps) {
  return (
    <NavLink
      to={href}
      className={cn(
        'relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 text-left outline-none',
        isActive
          ? 'bg-[var(--app-sidebar-item-active-bg)] text-[var(--app-sidebar-item-active-text)]'
          : 'text-[var(--app-sidebar-item-text)] hover:bg-[var(--app-sidebar-item-hover-bg)] hover:text-[var(--app-sidebar-item-hover-text)]',
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[var(--app-sidebar-item-indicator)]" />
      )}
      <Icon
        size={15}
        strokeWidth={isActive ? 2 : 1.75}
        className={isActive ? 'text-[var(--app-sidebar-item-indicator)]' : 'text-current'}
      />
      <span className="leading-none">{label}</span>
    </NavLink>
  )
}

function isItemActive(pathname: string, basePath: string, route: AppRoute) {
  const normalizedPathname = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname
  return isRouteActive(normalizedPathname, basePath, route)
}

export default function Sidebar({ basePath, isOpen = false, onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        'v0-sidebar-shell sidebar-scroll flex h-full w-60 shrink-0 flex-col overflow-y-auto',
        isOpen && 'open',
      )}
      style={{ background: 'var(--sidebar)', borderRight: '1px solid var(--sidebar-border)' }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid var(--sidebar-border)' }}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
          <Hexagon size={14} strokeWidth={2.5} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-white tracking-tight">AdminPanel</div>
          <div className="mt-0.5 text-[10px] text-[var(--app-sidebar-meta-text)]">Enterprise · v0</div>
        </div>
        <button
          onClick={onClose}
          className="v0-mobile-close flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
          style={{ color: '#9CA3AF', display: 'none' }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col px-3 pt-4 pb-2">
        <p className="mb-2 px-3 text-[10px] font-semibold tracking-widest text-[var(--app-sidebar-section-label)] uppercase">
          Management
        </p>
        <div className="flex flex-col gap-0.5">
          {PRIMARY_NAV.map((item) => (
            <NavItem
              key={item.id}
              href={getRouteHref(basePath, item.id)}
              label={item.label}
              icon={item.icon}
              isActive={isItemActive(location.pathname, basePath, item.id)}
            />
          ))}
        </div>

        <div className="mt-auto pt-4">
          <p className="mb-2 px-3 text-[10px] font-semibold tracking-widest text-[var(--app-sidebar-section-label)] uppercase">
            System
          </p>
          <div className="flex flex-col gap-0.5">
            {SECONDARY_NAV.map((item) => (
              <NavItem
                key={item.id}
                href={getRouteHref(basePath, item.id)}
                label={item.label}
                icon={item.icon}
                isActive={isItemActive(location.pathname, basePath, item.id)}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* User profile */}
      <div style={{ borderTop: '1px solid var(--sidebar-border)' }} className="px-3 py-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[var(--app-sidebar-item-hover-bg)]">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-white">Admin User</div>
            <div className="truncate text-[11px] text-[var(--app-sidebar-meta-text)]">admin@panel.dev</div>
          </div>
          <ChevronUp size={13} className="shrink-0 text-[var(--app-sidebar-section-label)]" />
        </button>
      </div>
    </aside>
  )
}
