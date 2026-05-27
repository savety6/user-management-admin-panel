import { useState, useMemo, useRef, useEffect } from 'react'
import {
  UserPlus, RefreshCw, Search, X,
  ArrowUp, ArrowDown, ArrowUpDown,
  Pencil, Trash2, Loader2,
  Users, UserCheck, Clock, UserX,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import type { User } from '@/features/users/types'
import V2ActionMenu from '../components/V2ActionMenu'
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from '@/features/users/usersApi'
import {
  getUserRole,
  getUserStatus,
  type UserRole,
  type UserStatus,
} from '@/features/users/utils'
import EditUserModal from '@/features/users/components/EditUserModal'
import DeleteUserDialog from '@/features/users/components/DeleteUserDialog'

// ─── constants ────────────────────────────────────────────
const PAGE_SIZE = 6

type SortKey = 'id' | 'name' | 'email' | 'company' | 'city' | 'role' | 'status'
type SortDir = 'asc' | 'desc'

const AVATAR_COLORS = [
  '#6B8FFF', '#22D3C8', '#F5A623', '#F87171',
  '#A78BFA', '#EC4899', '#34D399', '#FB923C',
  '#38BDF8', '#84CC16',
]

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const validateEmail  = (v: string) => (emailRegex.test(v) ? undefined : 'Invalid email')
const validateUsername = (v: string) => (/^\S+$/.test(v) ? undefined : 'No spaces allowed')
const validateName  = (v: string) => (v.trim().length > 0 ? undefined : 'Name is required')

// ─── small components ──────────────────────────────────────

function V2Avatar({ name, userId }: { name: string; userId: number }) {
  const initials = name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const color = AVATAR_COLORS[(userId - 1) % AVATAR_COLORS.length]
  return (
    <div className="v2-avatar" style={{ width: 34, height: 34, background: color, fontSize: '11px' }}>
      {initials}
    </div>
  )
}

function V2StatusBadge({ status }: { status: UserStatus }) {
  const labels: Record<UserStatus, string> = { active: 'Active', pending: 'Pending', suspended: 'Suspended' }
  return (
    <span className={`v2-badge v2-badge-${status}`}>
      <span className="v2-badge-dot" />
      {labels[status]}
    </span>
  )
}

function V2RoleBadge({ role }: { role: UserRole }) {
  const labels: Record<UserRole, string> = { admin: 'Admin', editor: 'Editor', viewer: 'Viewer' }
  return (
    <span className={`v2-badge v2-role-${role}`}>
      {labels[role]}
    </span>
  )
}

interface V2EditableCellProps {
  value: string
  onSave: (v: string) => Promise<void>
  validate?: (v: string) => string | undefined
  type?: 'text' | 'email'
  className?: string
  mono?: boolean
}

function V2EditableCell({ value, onSave, validate, type = 'text', className = '', mono = false }: V2EditableCellProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (!editing) setDraft(value) }, [value, editing])
  useEffect(() => { if (editing) { inputRef.current?.focus(); inputRef.current?.select() } }, [editing])

  const commit = async () => {
    const trimmed = draft.trim()
    if (trimmed === value) { setEditing(false); return }
    if (!trimmed) { setDraft(value); setEditing(false); return }
    if (validate) { const err = validate(trimmed); if (err) { setError(err); inputRef.current?.focus(); return } }
    setSaving(true); setError(undefined)
    try { await onSave(trimmed); setEditing(false) }
    catch { setError('Could not save'); setDraft(value) }
    finally { setSaving(false) }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); commit() }
    if (e.key === 'Escape') { setDraft(value); setEditing(false); setError(undefined) }
  }

  if (editing) {
    return (
      <div className="relative min-w-0">
        <input
          ref={inputRef}
          type={type}
          value={draft}
          onChange={e => { setDraft(e.target.value); setError(undefined) }}
          onBlur={commit}
          onKeyDown={handleKey}
          disabled={saving}
          className={`v2-edit-input${error ? ' error' : ''} ${mono ? 'font-mono' : ''}`}
          style={{ fontSize: 'inherit', opacity: saving ? 0.6 : 1 }}
        />
        {saving && (
          <Loader2 size={11} className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin" style={{ color: 'var(--v2-accent)' }} />
        )}
        {error && (
          <span className="absolute top-full left-0 mt-1 z-20 whitespace-nowrap rounded-md px-2 py-1 text-[11px]"
            style={{ background: 'var(--v2-surface-3)', color: 'var(--v2-suspended-color)', border: '1px solid var(--v2-suspended-dim)' }}>
            {error}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="v2-editable-wrap">
      <span className={`min-w-0 truncate ${className}`}>{value}</span>
      <button type="button" tabIndex={-1} onClick={() => { setDraft(value); setError(undefined); setEditing(true) }}
        className="v2-edit-trigger">
        <Pencil size={10} />
      </button>
    </div>
  )
}

function V2SkeletonRow() {
  return (
    <tr className="v2-table-row">
      <td className="pl-4 py-3.5 w-10">
        <div className="h-4 w-4 rounded" style={{ background: 'var(--v2-surface-3)' }} />
      </td>
      {[140, 160, 70, 70, 110, 80].map((w, i) => (
        <td key={i} className="py-3.5 px-4">
          {i === 0 ? (
            <div className="flex items-center gap-3">
              <div className="size-[34px] rounded-full shrink-0" style={{ background: 'var(--v2-surface-3)' }} />
              <div className="space-y-1.5">
                <div className="h-3 rounded" style={{ width: 100, background: 'var(--v2-surface-3)' }} />
                <div className="h-2.5 rounded" style={{ width: 70, background: 'var(--v2-surface-3)' }} />
              </div>
            </div>
          ) : (
            <div className="h-3 rounded" style={{ width: w, background: 'var(--v2-surface-3)' }} />
          )}
        </td>
      ))}
      <td className="py-3.5 px-4 w-10" />
    </tr>
  )
}

// ─── stats row ─────────────────────────────────────────────
function V2Stats({ users }: { users: User[] }) {
  const active    = users.filter(u => getUserStatus(u.id) === 'active').length
  const pending   = users.filter(u => getUserStatus(u.id) === 'pending').length
  const suspended = users.filter(u => getUserStatus(u.id) === 'suspended').length

  const stats = [
    { label: 'Total Users',  value: users.length, icon: Users,     color: 'var(--v2-text)',          iconBg: 'var(--v2-surface-3)',   iconColor: 'var(--v2-text-muted)' },
    { label: 'Active',       value: active,        icon: UserCheck, color: 'var(--v2-active-color)',   iconBg: 'var(--v2-active-dim)',   iconColor: 'var(--v2-active-color)' },
    { label: 'Pending',      value: pending,       icon: Clock,     color: 'var(--v2-pending-color)',  iconBg: 'var(--v2-pending-dim)',  iconColor: 'var(--v2-pending-color)' },
    { label: 'Suspended',    value: suspended,     icon: UserX,     color: 'var(--v2-suspended-color)',iconBg: 'var(--v2-suspended-dim)',iconColor: 'var(--v2-suspended-color)' },
  ]

  return (
    <div className="v2-stats">
      {stats.map(({ label, value, icon: Icon, color, iconBg, iconColor }) => (
        <div key={label} className="v2-stat-item">
          <div>
            <div className="v2-stat-number" style={{ color }}>{value}</div>
            <div className="v2-stat-label">{label}</div>
          </div>
          <div className="v2-stat-icon" style={{ background: iconBg }}>
            <Icon size={16} style={{ color: iconColor }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── filter bar ────────────────────────────────────────────
interface FilterState { search: string; role: string; status: string }

function V2FilterBar({
  filters, onChange, total, filtered: filteredCount,
}: { filters: FilterState; onChange: (f: FilterState) => void; total: number; filtered: number }) {
  const update = (p: Partial<FilterState>) => onChange({ ...filters, ...p })
  const hasActive = filters.search !== '' || filters.role !== 'all' || filters.status !== 'all'

  return (
    <div className="v2-filter-bar">
      <div className="v2-filter-input-wrap" style={{ minWidth: 260 }}>
        <Search size={13} strokeWidth={2} style={{ color: 'var(--v2-text-faint)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search users…"
          value={filters.search}
          onChange={e => update({ search: e.target.value })}
          style={{ marginLeft: '0.5rem' }}
        />
        {filters.search && (
          <button onClick={() => update({ search: '' })} style={{ color: 'var(--v2-text-faint)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
            <X size={13} />
          </button>
        )}
      </div>

      <select className="v2-filter-select" value={filters.role} onChange={e => update({ role: e.target.value })}>
        <option value="all">All Roles</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </select>

      <select className="v2-filter-select" value={filters.status} onChange={e => update({ status: e.target.value })}>
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="suspended">Suspended</option>
      </select>

      {hasActive && (
        <button className="v2-clear-btn" onClick={() => onChange({ search: '', role: 'all', status: 'all' })}>
          Clear filters
        </button>
      )}

      <span className="ml-auto text-[12px]" style={{ color: 'var(--v2-text-faint)' }}>
        {filteredCount === total ? `${total} users` : `${filteredCount} of ${total} users`}
      </span>
    </div>
  )
}

// ─── main page ─────────────────────────────────────────────
export default function V2UsersPage() {
  const { data: users = [], isLoading, isFetching, refetch } = useGetUsersQuery()
  const [updateUser] = useUpdateUserMutation()

  const [filters, setFilters]       = useState<FilterState>({ search: '', role: 'all', status: 'all' })
  const [sortKey, setSortKey]       = useState<SortKey>('id')
  const [sortDir, setSortDir]       = useState<SortDir>('asc')
  const [page, setPage]             = useState(1)
  const [selected, setSelected]     = useState<Set<number>>(new Set())
  const [editingUser, setEditingUser]   = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const handleUpdate = async (user: User, patch: Partial<User>, label: string) => {
    await updateUser({ ...user, ...patch }).unwrap()
    toast.success(`${label} updated`, { duration: 2000 })
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase()
    return users.filter(u => {
      const matchSearch = !q
        || u.name.toLowerCase().includes(q)
        || u.email.toLowerCase().includes(q)
        || u.username.toLowerCase().includes(q)
        || u.company.name.toLowerCase().includes(q)
        || u.address.city.toLowerCase().includes(q)
      return matchSearch
        && (filters.role === 'all' || getUserRole(u.id) === filters.role)
        && (filters.status === 'all' || getUserStatus(u.id) === filters.status)
    })
  }, [users, filters])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: string | number, bv: string | number
      switch (sortKey) {
        case 'name':    av = a.name;           bv = b.name;           break
        case 'email':   av = a.email;          bv = b.email;          break
        case 'company': av = a.company.name;   bv = b.company.name;   break
        case 'city':    av = a.address.city;   bv = b.address.city;   break
        case 'role':    av = getUserRole(a.id); bv = getUserRole(b.id); break
        case 'status':  av = getUserStatus(a.id); bv = getUserStatus(b.id); break
        default:        av = a.id;             bv = b.id
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const allSelected = paginated.length > 0 && paginated.every(u => selected.has(u.id))
  const someSelected = paginated.some(u => selected.has(u.id)) && !allSelected
  const selectedCount = [...selected].filter(id => paginated.some(u => u.id === id)).length

  const toggleAll = () => setSelected(s => {
    const n = new Set(s)
    if (allSelected) paginated.forEach(u => n.delete(u.id))
    else paginated.forEach(u => n.add(u.id))
    return n
  })
  const toggleOne = (id: number) => setSelected(s => {
    const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n
  })

  function SortHead({ col, label, width }: { col: SortKey; label: string; width?: number }) {
    const active = sortKey === col
    return (
      <th style={{ width }}>
        <button className={`v2-th-btn${active ? ' active' : ''}`} onClick={() => handleSort(col)}>
          {label}
          {active
            ? sortDir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />
            : <ArrowUpDown size={11} style={{ opacity: 0.3 }} />}
        </button>
      </th>
    )
  }

  const startIdx = (currentPage - 1) * PAGE_SIZE

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="text-[1.375rem] font-extrabold tracking-tight leading-none"
            style={{ color: 'var(--v2-text)', fontFamily: "'Syne', system-ui" }}
          >
            Users
          </h1>
          <p className="text-[13px] mt-1.5" style={{ color: 'var(--v2-text-muted)' }}>
            Manage team members, roles, and access permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="v2-btn-outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            className="v2-btn-primary"
            onClick={() => toast.success('Invitation sent!', { description: 'Check your inbox.' })}
          >
            <UserPlus size={13} strokeWidth={2.5} />
            Invite User
          </button>
        </div>
      </div>

      {/* Stats */}
      {!isLoading && users.length > 0 && <V2Stats users={users} />}

      {/* Filter bar */}
      <V2FilterBar
        filters={filters}
        onChange={f => { setFilters(f); setPage(1) }}
        total={users.length}
        filtered={filtered.length}
      />

      {/* Table */}
      <div className="v2-table-wrap">
        {/* Bulk banner */}
        {selectedCount > 0 && (
          <div className="v2-bulk-banner">
            <span className="text-[13px] font-semibold" style={{ color: 'var(--v2-accent)' }}>
              {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button className="v2-btn-outline" style={{ height: 28, fontSize: '0.75rem', padding: '0 0.625rem' }}>
                Change Role
              </button>
              <button
                className="v2-btn-outline"
                style={{ height: 28, fontSize: '0.75rem', padding: '0 0.625rem', borderColor: 'var(--v2-suspended-dim)', color: 'var(--v2-suspended-color)' }}
              >
                <Trash2 size={11} />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        <table className="v2-table">
          <thead>
            <tr className="v2-table-head">
              <th className="pl-4 w-10">
                <Checkbox
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onCheckedChange={toggleAll}
                />
              </th>
              <SortHead col="name"    label="User"     />
              <SortHead col="email"   label="Email"    />
              <SortHead col="role"    label="Role"     />
              <SortHead col="status"  label="Status"   />
              <SortHead col="company" label="Company"  />
              <SortHead col="city"    label="Location" />
              <th className="w-10 pr-4" />
            </tr>
          </thead>

          <tbody>
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => <V2SkeletonRow key={i} />)
              : paginated.length === 0
                ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-[13px]" style={{ color: 'var(--v2-text-faint)' }}>
                      {users.length === 0
                        ? 'No users found.'
                        : (
                          <span>
                            No results.{' '}
                            <button
                              className="underline"
                              style={{ color: 'var(--v2-accent)', background: 'none', border: 'none', cursor: 'pointer' }}
                              onClick={() => setFilters({ search: '', role: 'all', status: 'all' })}
                            >
                              Clear filters
                            </button>
                          </span>
                        )}
                    </td>
                  </tr>
                )
                : paginated.map(user => {
                  const role    = getUserRole(user.id)
                  const status  = getUserStatus(user.id)
                  const isSel   = selected.has(user.id)

                  return (
                    <tr key={user.id} className={`v2-table-row${isSel ? ' selected' : ''}`}>
                      {/* Checkbox */}
                      <td className="pl-4 w-10">
                        <Checkbox checked={isSel} onCheckedChange={() => toggleOne(user.id)} />
                      </td>

                      {/* User */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <V2Avatar name={user.name} userId={user.id} />
                          <div className="min-w-0 space-y-0.5">
                            <V2EditableCell
                              value={user.name}
                              validate={validateName}
                              onSave={v => handleUpdate(user, { name: v }, 'Name')}
                              className="text-[13px] font-medium"
                            />
                            <V2EditableCell
                              value={user.username}
                              validate={validateUsername}
                              onSave={v => handleUpdate(user, { username: v }, 'Username')}
                              className="text-[11px] font-mono"
                              mono
                            />
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3">
                        <V2EditableCell
                          value={user.email}
                          type="email"
                          validate={validateEmail}
                          onSave={v => handleUpdate(user, { email: v }, 'Email')}
                          className="text-[12.5px]"
                        />
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        <V2RoleBadge role={role} />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <V2StatusBadge status={status} />
                      </td>

                      {/* Company */}
                      <td className="px-4 py-3">
                        <span className="text-[13px]" style={{ color: 'var(--v2-text)' }}>
                          {user.company.name}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3">
                        <span className="text-[12.5px]" style={{ color: 'var(--v2-text-muted)' }}>
                          {user.address.city}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="pr-4 py-3 w-10">
                        <V2ActionMenu
                          onEdit={() => setEditingUser(user)}
                          onDelete={() => setDeletingUser(user)}
                        />
                      </td>
                    </tr>
                  )
                })}
          </tbody>
        </table>

        {/* Pagination */}
        {!isLoading && sorted.length > PAGE_SIZE && (
          <div className="v2-pagination">
            <span className="text-[12px]" style={{ color: 'var(--v2-text-faint)' }}>
              Showing {startIdx + 1}–{Math.min(startIdx + PAGE_SIZE, sorted.length)} of {sorted.length} users
            </span>
            <div className="flex items-center gap-1">
              <button className="v2-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeft size={13} />
                Previous
              </button>
              <div className="flex items-center gap-0.5 mx-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`v2-page-num${currentPage === i + 1 ? ' active' : ''}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button className="v2-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                Next
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditUserModal
        user={editingUser}
        open={editingUser !== null}
        onClose={() => setEditingUser(null)}
      />
      <DeleteUserDialog
        user={deletingUser}
        open={deletingUser !== null}
        onClose={() => setDeletingUser(null)}
      />
    </div>
  )
}
