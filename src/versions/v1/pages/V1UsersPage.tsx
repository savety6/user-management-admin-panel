import { useState, useMemo } from 'react'
import { Download, UserPlus, Search, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useGetUsersQuery } from '@/features/users/usersApi'
import { getUserRole, getUserStatus } from '@/features/users/utils'
import type { UserRole, UserStatus } from '@/features/users/utils'

const PAGE_SIZE = 8

const AVATAR_COLORS = [
  '#5563EB', '#10B981', '#F59E0B', '#EF4444',
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
  '#6366F1', '#F97316',
]

const LAST_ACTIVE: Record<number, string> = {
  1: 'Just now',
  2: '8m ago',
  3: '2h ago',
  4: '6h ago',
  5: 'Yesterday',
  6: '2 days ago',
  7: '5 days ago',
  8: '1 week ago',
  9: '3 weeks ago',
  10: '2 months ago',
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}

const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Active',
  pending: 'Pending',
  suspended: 'Suspended',
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function getAvatarColor(userId: number) {
  return AVATAR_COLORS[(userId - 1) % AVATAR_COLORS.length]
}

function UserAvatar({ name, userId }: { name: string; userId: number }) {
  return (
    <div
      className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white select-none"
      style={{ background: getAvatarColor(userId) }}
    >
      {getInitials(name)}
    </div>
  )
}

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span className={`v1-status-badge v1-status-${status}`}>
      <span className="v1-status-dot" />
      {STATUS_LABELS[status]}
    </span>
  )
}

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border px-3 py-1.5 text-[13px] outline-none cursor-pointer appearance-none pr-7"
      style={{
        borderColor: 'var(--v1-border)',
        background: 'var(--v1-surface)',
        color: 'var(--v1-text-muted)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 8px center',
      }}
    >
      {children}
    </select>
  )
}

export default function V1UsersPage() {
  const { data: users = [], isLoading } = useGetUsersQuery()
  const [search, setSearch] = useState('')
  const [teamFilter, setTeamFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const teams = useMemo(
    () => [...new Set(users.map((u) => u.company.name))].sort(),
    [users],
  )

  const filtered = useMemo(() => {
    let result = users

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      )
    }
    if (teamFilter !== 'all') result = result.filter((u) => u.company.name === teamFilter)
    if (statusFilter !== 'all') result = result.filter((u) => getUserStatus(u.id) === statusFilter)
    if (roleFilter !== 'all') result = result.filter((u) => getUserRole(u.id) === roleFilter)

    return [...result].sort((a, b) => a.name.localeCompare(b.name))
  }, [users, search, teamFilter, statusFilter, roleFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIdx = (currentPage - 1) * PAGE_SIZE
  const pageUsers = filtered.slice(startIdx, startIdx + PAGE_SIZE)

  const allPageSelected =
    pageUsers.length > 0 && pageUsers.every((u) => selectedIds.has(u.id))
  const somePageSelected = pageUsers.some((u) => selectedIds.has(u.id)) && !allPageSelected

  function handleFilter(setter: (v: string) => void) {
    return (v: string) => {
      setter(v)
      setPage(1)
    }
  }

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allPageSelected) {
        pageUsers.forEach((u) => next.delete(u.id))
      } else {
        pageUsers.forEach((u) => next.add(u.id))
      }
      return next
    })
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const showStart = filtered.length === 0 ? 0 : startIdx + 1
  const showEnd = Math.min(startIdx + PAGE_SIZE, filtered.length)

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[1.125rem] font-semibold leading-tight" style={{ color: 'var(--v1-text)' }}>
            Team Members
          </h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--v1-text-muted)' }}>
            {isLoading ? 'Loading…' : `${users.length} members across your organization`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="v1-btn-secondary flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors"
            style={{ borderColor: 'var(--v1-border)', color: 'var(--v1-text-muted)', background: 'var(--v1-surface)' }}
          >
            <Download size={13} strokeWidth={2} />
            Export
          </button>
          <button
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            style={{ background: 'var(--v1-primary)' }}
          >
            <UserPlus size={13} strokeWidth={2} />
            Invite user
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div
          className="v1-filter-input flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-all"
          style={{ borderColor: 'var(--v1-border)', background: 'var(--v1-surface)', minWidth: '220px' }}
        >
          <Search size={13} strokeWidth={2} style={{ color: 'var(--v1-text-faint)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="bg-transparent text-[13px] outline-none flex-1"
            style={{ color: 'var(--v1-text)' }}
          />
        </div>

        <FilterSelect value={teamFilter} onChange={handleFilter(setTeamFilter)}>
          <option value="all">All teams</option>
          {teams.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </FilterSelect>

        <FilterSelect value={statusFilter} onChange={handleFilter(setStatusFilter)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </FilterSelect>

        <FilterSelect value={roleFilter} onChange={handleFilter(setRoleFilter)}>
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </FilterSelect>
      </div>

      {/* Table */}
      <div
        className="v1-table-container rounded-xl overflow-hidden"
        style={{ background: 'var(--v1-surface)', border: '1px solid var(--v1-border)' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-[13px]" style={{ color: 'var(--v1-text-faint)' }}>
              Loading users…
            </div>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--v1-border)' }}>
                <th className="w-10 pl-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = somePageSelected
                    }}
                    onChange={toggleSelectAll}
                    className="size-3.5 cursor-pointer"
                    style={{ accentColor: 'var(--v1-primary)' }}
                  />
                </th>
                {['User', 'Role', 'Team', 'Status', 'Last Active'].map((col) => (
                  <th
                    key={col}
                    className="py-3 px-4 text-left text-[10.5px] font-semibold uppercase tracking-widest"
                    style={{ color: 'var(--v1-text-faint)' }}
                  >
                    {col}
                  </th>
                ))}
                <th className="w-12 py-3 pr-4" />
              </tr>
            </thead>
            <tbody>
              {pageUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[13px]" style={{ color: 'var(--v1-text-faint)' }}>
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                pageUsers.map((user, idx) => {
                  const role = getUserRole(user.id)
                  const status = getUserStatus(user.id)
                  const isSelected = selectedIds.has(user.id)
                  const isLast = idx === pageUsers.length - 1

                  return (
                    <tr
                      key={user.id}
                      className="v1-table-row"
                      style={{
                        borderBottom: isLast ? 'none' : '1px solid var(--v1-border-subtle)',
                        background: isSelected ? 'var(--v1-primary-surface)' : undefined,
                      }}
                    >
                      <td className="pl-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(user.id)}
                          className="size-3.5 cursor-pointer"
                          style={{ accentColor: 'var(--v1-primary)' }}
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={user.name} userId={user.id} />
                          <div className="min-w-0">
                            <div
                              className="text-[13px] font-medium leading-tight"
                              style={{ color: 'var(--v1-text)' }}
                            >
                              {user.name}
                            </div>
                            <div
                              className="text-[11.5px] mt-0.5 leading-tight"
                              style={{ color: 'var(--v1-text-faint)' }}
                            >
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[13px]" style={{ color: 'var(--v1-text-muted)' }}>
                          {ROLE_LABELS[role]}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[13px]" style={{ color: 'var(--v1-text-muted)' }}>
                          {user.company.name}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <StatusBadge status={status} />
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[13px]" style={{ color: 'var(--v1-text-faint)' }}>
                          {LAST_ACTIVE[user.id] ?? '—'}
                        </span>
                      </td>

                      <td className="pr-4 py-3.5">
                        <button
                          className="v1-table-kebab v1-btn-icon flex size-7 items-center justify-center rounded-md transition-colors"
                          style={{ color: 'var(--v1-text-faint)' }}
                        >
                          <MoreHorizontal size={15} strokeWidth={1.75} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <span className="text-[12px]" style={{ color: 'var(--v1-text-faint)' }}>
            Showing {showStart}–{showEnd} of {filtered.length} users
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="v1-btn-secondary flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                borderColor: 'var(--v1-border)',
                color: 'var(--v1-text-muted)',
                background: 'var(--v1-surface)',
              }}
            >
              <ChevronLeft size={13} strokeWidth={2} />
              Previous
            </button>
            <span
              className="text-[12px] px-2 tabular-nums"
              style={{ color: 'var(--v1-text-muted)' }}
            >
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="v1-btn-secondary flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                borderColor: 'var(--v1-border)',
                color: 'var(--v1-text-muted)',
                background: 'var(--v1-surface)',
              }}
            >
              Next
              <ChevronRight size={13} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
