import type { ElementType } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Layers,
  ChevronDown,
  LayoutDashboard,
  Users,
  UsersRound,
  ShieldCheck,
  FileText,
  Settings,
  Sparkles,
  X,
} from 'lucide-react'

interface NavItemDef {
  id: string
  label: string
  icon: ElementType
  href: string
}

const WORKSPACE_NAV: NavItemDef[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, href: '/v2/dashboard' },
]

const MANAGE_NAV: NavItemDef[] = [
  { id: 'users', label: 'Users', icon: Users, href: '/v2/users' },
  { id: 'teams', label: 'Teams', icon: UsersRound, href: '/v2/teams' },
  { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck, href: '/v2/roles' },
  { id: 'audit', label: 'Audit Log', icon: FileText, href: '/v2/audit' },
]

const SYSTEM_NAV: NavItemDef[] = [
  { id: 'settings', label: 'Settings', icon: Settings, href: '/v2/settings' },
]

function V2NavItem({ item }: { item: NavItemDef }) {
  return (
    <NavLink
      to={item.href}
      className={({ isActive }) => `v2-nav-item${isActive ? ' active' : ''}`}
    >
      {({ isActive }) => (
        <>
          <item.icon size={14} strokeWidth={isActive ? 2.25 : 1.75} />
          <span>{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

function NavSection({ label, items }: { label: string; items: NavItemDef[] }) {
  return (
    <div>
      <p className="v2-nav-section-label">{label}</p>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => (
          <V2NavItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function V2Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  return (
    <aside className={`v2-sidebar${isOpen ? ' open' : ''}`}>
      {/* Brand */}
      <div
        className="relative flex items-center gap-2.5 px-4 py-4"
        style={{ borderBottom: '1px solid var(--v2-border)' }}
      >
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #22D3C8 0%, #6B8FFF 100%)',
            boxShadow: '0 0 20px rgba(34, 211, 200, 0.25)',
          }}
        >
          <Layers size={14} strokeWidth={2.5} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className="text-[13px] font-semibold tracking-tight"
            style={{ color: 'var(--v2-text)', fontFamily: "'Syne', system-ui" }}
          >
            AdminPanel
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Sparkles size={9} style={{ color: 'var(--v2-accent)' }} />
            <span className="text-[9.5px] font-semibold" style={{ color: 'var(--v2-accent)', letterSpacing: '0.08em' }}>
              v2
            </span>
          </div>
        </div>
        <button
          className="v2-mobile-only v2-btn-icon size-7 shrink-0 rounded-lg"
          onClick={onClose}
        >
          <X size={14} />
        </button>
      </div>

      {/* Nav */}
      <nav className="relative flex flex-1 flex-col px-2.5 pt-5 pb-3 gap-5">
        <NavSection label="Workspace" items={WORKSPACE_NAV} />
        <NavSection label="Manage" items={MANAGE_NAV} />
        <div className="mt-auto">
          <NavSection label="System" items={SYSTEM_NAV} />
        </div>
      </nav>

      {/* User profile */}
      <div
        className="relative px-2.5 py-3"
        style={{ borderTop: '1px solid var(--v2-border)' }}
      >
        <button className="v2-nav-item w-full justify-start" style={{ padding: '0.5rem 0.75rem' }}>
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #22D3C8 0%, #6B8FFF 100%)',
              boxShadow: '0 0 12px rgba(34, 211, 200, 0.2)',
            }}
          >
            AD
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-[12px] font-medium" style={{ color: 'var(--v2-text)' }}>
              Admin User
            </div>
            <div className="truncate text-[10px]" style={{ color: 'var(--v2-text-faint)' }}>
              admin@panel.dev
            </div>
          </div>
          <ChevronDown size={11} className="shrink-0" style={{ color: 'var(--v2-text-faint)' }} />
        </button>
      </div>
    </aside>
  )
}
