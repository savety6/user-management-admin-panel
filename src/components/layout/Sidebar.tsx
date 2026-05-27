import {
  LayoutDashboard,
  Users,
  UsersRound,
  ShieldCheck,
  FileText,
  Settings,
  Hexagon,
  ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type Route = 'dashboard' | 'users' | 'teams' | 'roles' | 'audit' | 'settings'

interface SidebarProps {
  active: Route
  onNavigate: (route: Route) => void
}

const PRIMARY_NAV = [
  { id: 'dashboard' as Route, label: 'Overview', icon: LayoutDashboard },
  { id: 'users' as Route, label: 'Users', icon: Users },
  { id: 'teams' as Route, label: 'Teams', icon: UsersRound },
  { id: 'roles' as Route, label: 'Roles & Permissions', icon: ShieldCheck },
  { id: 'audit' as Route, label: 'Audit Log', icon: FileText },
]

const SECONDARY_NAV = [
  { id: 'settings' as Route, label: 'Settings', icon: Settings },
]

interface NavItemProps {
  id: Route
  label: string
  icon: React.ElementType
  isActive: boolean
  onClick: () => void
}

function NavItem({ label, icon: Icon, isActive, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 text-left outline-none',
        isActive
          ? 'text-white bg-white/8'
          : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-white/4',
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-[#818CF8]" />
      )}
      <Icon
        size={15}
        strokeWidth={isActive ? 2 : 1.75}
        className={isActive ? 'text-[#818CF8]' : 'text-current'}
      />
      <span className="leading-none">{label}</span>
    </button>
  )
}

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside
      className="sidebar-scroll flex h-full w-60 shrink-0 flex-col overflow-y-auto"
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
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-white tracking-tight">AdminPanel</div>
          <div className="text-[10px] text-[#6B7280] mt-0.5">Enterprise · v1.0</div>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col px-3 pt-4 pb-2">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#4B5563]">
          Management
        </p>
        <div className="flex flex-col gap-0.5">
          {PRIMARY_NAV.map((item) => (
            <NavItem
              key={item.id}
              {...item}
              isActive={active === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>

        <div className="mt-auto pt-4">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#4B5563]">
            System
          </p>
          <div className="flex flex-col gap-0.5">
            {SECONDARY_NAV.map((item) => (
              <NavItem
                key={item.id}
                {...item}
                isActive={active === item.id}
                onClick={() => onNavigate(item.id)}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* User profile */}
      <div style={{ borderTop: '1px solid var(--sidebar-border)' }} className="px-3 py-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/4 text-left">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-white">Admin User</div>
            <div className="truncate text-[11px] text-[#6B7280]">admin@panel.dev</div>
          </div>
          <ChevronUp size={13} className="shrink-0 text-[#4B5563]" />
        </button>
      </div>
    </aside>
  )
}
