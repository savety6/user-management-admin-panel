import { Search, Bell, Menu } from 'lucide-react'

export default function V2TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <div className="v2-topbar">
      {/* Mobile hamburger */}
      <button
        className="v2-mobile-only v2-btn-icon shrink-0"
        onClick={onMenuClick}
      >
        <Menu size={18} strokeWidth={1.75} />
      </button>
      {/* Search */}
      <div className="v2-search-wrap">
        <Search size={13} strokeWidth={2} style={{ color: 'var(--v2-text-faint)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search anything..."
          className="v2-search-input"
        />
        <kbd
          className="shrink-0 rounded px-1.5 py-0.5 text-[9.5px] font-semibold"
          style={{
            color: 'var(--v2-text-faint)',
            border: '1px solid var(--v2-border-2)',
            background: 'var(--v2-surface-2)',
            letterSpacing: '0.03em',
          }}
        >
          ⌘K
        </kbd>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <button className="v2-btn-icon relative">
        <Bell size={15} strokeWidth={1.75} />
        <span
          className="absolute right-1.5 top-1.5 size-1.5 rounded-full"
          style={{ background: 'var(--v2-accent)' }}
        />
      </button>

      {/* User */}
      <button
        className="v2-btn-icon !w-auto flex items-center gap-2 px-2"
        style={{ width: 'auto' }}
      >
        <div
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #22D3C8 0%, #6B8FFF 100%)',
            boxShadow: '0 0 12px rgba(34, 211, 200, 0.2)',
          }}
        >
          AD
        </div>
        <span className="text-[13px] font-medium" style={{ color: 'var(--v2-text)' }}>
          Admin
        </span>
      </button>
    </div>
  )
}
