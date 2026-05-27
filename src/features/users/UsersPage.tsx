import { useState } from 'react'
import { UserPlus, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useGetUsersQuery } from './usersApi'
import type { User } from './types'
import StatsBar from './components/StatsBar'
import FilterToolbar, { type FilterState } from './components/FilterToolbar'
import UsersTable from './components/UsersTable'
import EditUserModal from './components/EditUserModal'
import DeleteUserDialog from './components/DeleteUserDialog'

export default function UsersPage() {
  const { data: users = [], isLoading, isFetching, refetch } = useGetUsersQuery()
  const [filters, setFilters] = useState<FilterState>({ search: '', role: 'all', status: 'all' })
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const filteredCount = users.filter((u) => {
    const q = filters.search.toLowerCase()
    const matchSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.company.name.toLowerCase().includes(q)
    return matchSearch
  }).length

  const handleDelete = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (user) setDeletingUser(user)
  }

  const handleInvite = () => {
    toast.success('Invitation sent!', {
      description: 'Check your inbox to complete the setup.',
    })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Page header */}
      <div className="px-8 pt-8 pb-0 shrink-0">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-foreground leading-tight">
              Users
            </h1>
            <p className="text-[13.5px] text-muted-foreground mt-0.5">
              Manage your team members, roles, and access permissions.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-[13px] gap-1.5"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <Button
              size="sm"
              className="h-9 text-[13px] gap-1.5"
              onClick={handleInvite}
            >
              <UserPlus size={14} />
              Invite User
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        {!isLoading && users.length > 0 && <StatsBar users={users} />}

        <Separator className="mt-6" />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-8 pt-5 pb-8">
        <div className="space-y-4">
          <FilterToolbar
            filters={filters}
            onFiltersChange={(f) => setFilters(f)}
            totalCount={users.length}
            filteredCount={filteredCount}
          />
          <UsersTable
            users={users}
            isLoading={isLoading}
            filters={filters}
            onEditAccess={(user) => setEditingUser(user)}
            onDelete={handleDelete}
            onClearFilters={() => setFilters({ search: '', role: 'all', status: 'all' })}
          />
        </div>
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
