import { useState, useMemo } from 'react'
import { MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import type { User } from '../types'
import { useUpdateUserMutation } from '../usersApi'
import {
  getUserRole,
  getUserStatus,
  type UserRole,
  type UserStatus,
} from '../utils'
import type { FilterState } from './FilterToolbar'
import UserAvatar from './UserAvatar'
import EditableCell from './EditableCell'
import EmptyState from './EmptyState'

const STATUS_STYLES: Record<UserStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  pending: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50',
  suspended: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-50',
}

const ROLE_STYLES: Record<UserRole, string> = {
  admin: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50',
  editor: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50',
  viewer: 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100',
}

const STATUS_DOT: Record<UserStatus, string> = {
  active: 'bg-emerald-500',
  pending: 'bg-amber-500',
  suspended: 'bg-red-500',
}

const ROLE_LABELS: Record<UserRole, string> = { admin: 'Admin', editor: 'Editor', viewer: 'Viewer' }
const STATUS_LABELS: Record<UserStatus, string> = { active: 'Active', pending: 'Pending', suspended: 'Suspended' }

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const validateEmail = (v: string) => (emailRegex.test(v) ? undefined : 'Invalid email address')
const validateUsername = (v: string) => (/^\S+$/.test(v) ? undefined : 'No spaces allowed')
const validateName = (v: string) => (v.trim().length > 0 ? undefined : 'Name is required')

type SortKey = 'id' | 'name' | 'email' | 'company' | 'city' | 'role' | 'status'
type SortDir = 'asc' | 'desc'

const PAGE_SIZE = 6

interface UsersTableProps {
  users: User[]
  isLoading: boolean
  filters: FilterState
  onEditAccess: (user: User) => void
  onDelete: (userId: number) => void
  onClearFilters: () => void
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell className="pl-4 w-10"><Skeleton className="h-4 w-4 rounded" /></TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-3.5 w-36" /></TableCell>
      <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-3.5 w-24" /></TableCell>
      <TableCell><Skeleton className="h-3.5 w-20" /></TableCell>
      <TableCell><Skeleton className="h-7 w-7 rounded-md" /></TableCell>
    </TableRow>
  )
}

export default function UsersTable({
  users,
  isLoading,
  filters,
  onEditAccess,
  onDelete,
  onClearFilters,
}: UsersTableProps) {
  const [updateUser] = useUpdateUserMutation()
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(1)

  const handleUpdate = async (user: User, patch: Partial<User>, label: string) => {
    await updateUser({ ...user, ...patch }).unwrap()
    toast.success(`${label} updated`, { duration: 2000 })
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase()
    return users.filter((u) => {
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.company.name.toLowerCase().includes(q) ||
        u.address.city.toLowerCase().includes(q)
      const role = getUserRole(u.id)
      const status = getUserStatus(u.id)
      return (
        matchSearch &&
        (filters.role === 'all' || role === filters.role) &&
        (filters.status === 'all' || status === filters.status)
      )
    })
  }, [users, filters])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: string | number, bv: string | number
      switch (sortKey) {
        case 'id': av = a.id; bv = b.id; break
        case 'name': av = a.name; bv = b.name; break
        case 'email': av = a.email; bv = b.email; break
        case 'company': av = a.company.name; bv = b.company.name; break
        case 'city': av = a.address.city; bv = b.address.city; break
        case 'role': av = getUserRole(a.id); bv = getUserRole(b.id); break
        case 'status': av = getUserStatus(a.id); bv = getUserStatus(b.id); break
        default: av = a.id; bv = b.id
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const allSelected = paginated.length > 0 && paginated.every((u) => selected.has(u.id))
  const someSelected = paginated.some((u) => selected.has(u.id)) && !allSelected

  const toggleAll = () => {
    if (allSelected) setSelected((s) => { const n = new Set(s); paginated.forEach((u) => n.delete(u.id)); return n })
    else setSelected((s) => { const n = new Set(s); paginated.forEach((u) => n.add(u.id)); return n })
  }
  const toggleOne = (id: number) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  const selectedCount = [...selected].filter((id) => paginated.some((u) => u.id === id)).length

  function SortHead({ col, label, className }: { col: SortKey; label: string; className?: string }) {
    return (
      <TableHead className={className}>
        <button
          onClick={() => handleSort(col)}
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-semibold transition-colors',
            sortKey === col ? 'text-indigo-600' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {label}
          {sortKey === col
            ? sortDir === 'asc'
              ? <ArrowUp size={12} className="text-indigo-500" />
              : <ArrowDown size={12} className="text-indigo-500" />
            : <ArrowUpDown size={12} className="opacity-30" />}
        </button>
      </TableHead>
    )
  }

  return (
    <div className="rounded-xl border border-[#E9EAEC] bg-white overflow-hidden">
      {/* Bulk selection banner */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-indigo-50 border-b border-indigo-100 text-sm">
          <span className="font-medium text-indigo-700">
            {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-100">
              Change Role
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50">
              <Trash2 size={12} className="mr-1" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB] border-b border-[#E9EAEC]">
            <TableHead className="pl-4 w-10">
              <Checkbox
                checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <SortHead col="name" label="User" className="min-w-[180px]" />
            <SortHead col="email" label="Email" className="min-w-[200px]" />
            <SortHead col="role" label="Role" />
            <SortHead col="status" label="Status" />
            <SortHead col="company" label="Company" />
            <SortHead col="city" label="Location" />
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            : paginated.length === 0
              ? (
                <TableRow>
                  <TableCell colSpan={8} className="p-0">
                    <EmptyState
                      type={users.length === 0 ? 'no-users' : 'no-results'}
                      onClearFilters={onClearFilters}
                    />
                  </TableCell>
                </TableRow>
              )
              : paginated.map((user) => {
                const role = getUserRole(user.id)
                const status = getUserStatus(user.id)
                const isSelected = selected.has(user.id)

                return (
                  <TableRow
                    key={user.id}
                    className={cn(
                      'group border-b border-[#F3F4F6] transition-colors',
                      isSelected ? 'bg-indigo-50/50' : 'hover:bg-[#FAFBFF]',
                    )}
                  >
                    <TableCell className="pl-4 w-10">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleOne(user.id)}
                        aria-label={`Select ${user.name}`}
                      />
                    </TableCell>

                    {/* User: avatar + editable name + editable @username */}
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-0">
                        <UserAvatar name={user.name} size="md" className="shrink-0" />
                        <div className="min-w-0 space-y-0.5">
                          <EditableCell
                            value={user.name}
                            validate={validateName}
                            onSave={(v) => handleUpdate(user, { name: v }, 'Name')}
                            className="text-[13.5px] font-medium text-foreground"
                            inputClassName="font-medium"
                          />
                          <EditableCell
                            value={user.username}
                            validate={validateUsername}
                            onSave={(v) => handleUpdate(user, { username: v }, 'Username')}
                            className="text-[11.5px] text-muted-foreground font-mono"
                            inputClassName="text-[11.5px] font-mono py-0"
                          />
                        </div>
                      </div>
                    </TableCell>

                    {/* Editable email */}
                    <TableCell>
                      <EditableCell
                        value={user.email}
                        type="email"
                        validate={validateEmail}
                        onSave={(v) => handleUpdate(user, { email: v }, 'Email')}
                        className="text-[13px] text-muted-foreground"
                      />
                    </TableCell>

                    {/* Role badge */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-[11px] font-medium px-2 py-0.5', ROLE_STYLES[role])}
                      >
                        {ROLE_LABELS[role]}
                      </Badge>
                    </TableCell>

                    {/* Status badge */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[11px] font-medium px-2 py-0.5 flex items-center gap-1.5 w-fit',
                          STATUS_STYLES[status],
                        )}
                      >
                        <span className={cn('size-1.5 rounded-full shrink-0', STATUS_DOT[status])} />
                        {STATUS_LABELS[status]}
                      </Badge>
                    </TableCell>

                    {/* Company */}
                    <TableCell className="text-[13px] text-foreground">{user.company.name}</TableCell>

                    {/* Location */}
                    <TableCell className="text-[13px] text-muted-foreground">{user.address.city}</TableCell>

                    {/* Actions kebab */}
                    <TableCell className="pr-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              'size-7 text-muted-foreground',
                              'opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100',
                              'hover:text-foreground hover:bg-muted transition-opacity',
                            )}
                          >
                            <MoreHorizontal size={14} />
                            <span className="sr-only">Row actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            className="text-[13px] gap-2"
                            onClick={() => onEditAccess(user)}
                          >
                            <Pencil size={13} />
                            Edit user
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-[13px] gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={() => onDelete(user.id)}
                          >
                            <Trash2 size={13} />
                            Delete user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
        </TableBody>
      </Table>

      {/* Pagination */}
      {!isLoading && sorted.length > PAGE_SIZE && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E9EAEC]">
          <p className="text-[13px] text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length} users
          </p>
          <Pagination className="w-auto mx-0">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={cn('h-8 text-[13px]', page === 1 && 'pointer-events-none opacity-40')}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                    className="h-8 w-8 text-[13px]"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={cn('h-8 text-[13px]', page === totalPages && 'pointer-events-none opacity-40')}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
