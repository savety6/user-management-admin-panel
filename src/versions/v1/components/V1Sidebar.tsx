import type { ElementType } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Cloud,
  ChevronDown,
  LayoutDashboard,
  Users,
  UsersRound,
  ShieldCheck,
  FileText,
  Settings,
  X,
} from 'lucide-react'

interface NavItemDef {
  id: string
  label: string
  icon: ElementType
  href: string
}

const WORKSPACE_NAV: NavItemDef[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, href: '/v1/dashboard' },
]

const MANAGE_NAV: NavItemDef[] = [
  { id: 'users', label: 'Users', icon: Users, href: '/v1/users' },
  { id: 'teams', label: 'Teams', icon: UsersRound, href: '/v1/teams' },
  { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck, href: '/v1/roles' },
  { id: 'audit', label: 'Audit Log', icon: FileText, href: '/v1/audit' },
]

const SYSTEM_NAV: NavItemDef[] = [
  { id: 'settings', label: 'Settings', icon: Settings, href: '/v1/settings' },
]

function SidebarItem({ item }: { item: NavItemDef }) {
  return (
    <NavLink
      to={item.href}
      className={({ isActive }) => `v1-sidebar-item${isActive ? ' active' : ''}`}
    >
      {({ isActive }) => (
        <>
          <item.icon size={14} strokeWidth={isActive ? 2 : 1.75} />
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

function SidebarSection({ label, items }: { label: string; items: NavItemDef[] }) {
  return (
    <div>
      <p
        className="mb-1 px-2 text-[10px] font-semibold tracking-widest uppercase"
        style={{ color: 'var(--v1-sidebar-section-label)' }}
      >
        {label}
      </p>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => (
          <SidebarItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function V1Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  return (
    <aside className={`v1-sidebar${isOpen ? ' open' : ''}`}>
      {/* Brand */}
      <div
        className="flex items-center gap-2.5 px-4 py-4"
        style={{ borderBottom: '1px solid var(--v1-sidebar-border)' }}
      >
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
          <Cloud size={13} strokeWidth={2.5} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="text-[13px] font-semibold tracking-tight"
            style={{ color: 'var(--v1-text)' }}
          >
            Nexus Cloud
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: 'var(--v1-text-faint)' }}>
            Enterprise
          </div>
        </div>
        <button
          className="v1-mobile-only v1-btn-icon size-7 rounded-lg shrink-0"
          style={{ color: 'var(--v1-text-faint)' }}
          onClick={onClose}
        >
          <X size={14} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col px-3 pt-5 pb-3 gap-5">
        <SidebarSection label="Workspace" items={WORKSPACE_NAV} />
        <SidebarSection label="Manage" items={MANAGE_NAV} />
        <div className="mt-auto">
          <SidebarSection label="System" items={SYSTEM_NAV} />
        </div>
      </nav>

      {/* User profile */}
      <div
        className="px-3 py-3"
        style={{ borderTop: '1px solid var(--v1-sidebar-border)' }}
      >
        <button className="v1-sidebar-item w-full justify-start">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">
            AD
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-[12px] font-medium" style={{ color: 'var(--v1-text)' }}>
              Admin User
            </div>
            <div className="truncate text-[10px]" style={{ color: 'var(--v1-text-faint)' }}>
              admin@nexuscloud.io
            </div>
          </div>
          <ChevronDown size={11} className="shrink-0" style={{ color: 'var(--v1-text-faint)' }} />
        </button>
      </div>
    </aside>
  )
}
