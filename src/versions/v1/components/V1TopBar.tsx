import { Search, Bell } from 'lucide-react'

export default function V1TopBar() {
  return (
    <div className="v1-topbar">
      {/* Search */}
      <div
        className="v1-topbar-search-wrap flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 transition-all"
        style={{
          maxWidth: '420px',
          borderColor: 'var(--v1-border)',
          background: 'var(--v1-bg)',
        }}
      >
        <Search size={14} strokeWidth={2} style={{ color: 'var(--v1-text-faint)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search anything..."
          className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--v1-text-faint)]"
          style={{ color: 'var(--v1-text)' }}
        />
        <kbd
          className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium leading-none"
          style={{
            color: 'var(--v1-text-faint)',
            border: '1px solid var(--v1-border)',
            background: 'var(--v1-surface)',
          }}
        >
          ⌘K
        </kbd>
      </div>

      <div className="flex-1" />

      {/* Notifications */}
      <button
        className="v1-btn-icon relative flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors"
        style={{ color: 'var(--v1-text-muted)' }}
      >
        <Bell size={16} strokeWidth={1.75} />
        <span
          className="absolute right-1.5 top-1.5 size-1.5 rounded-full ring-2 ring-white"
          style={{ background: '#EF4444' }}
        />
      </button>

      {/* User */}
      <button
        className="v1-btn-icon flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
      >
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
          AD
        </div>
        <span className="text-[13px] font-medium" style={{ color: 'var(--v1-text)' }}>
          Admin
        </span>
      </button>
    </div>
  )
}
