import { Users, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  type: 'no-users' | 'no-results'
  onClearFilters?: () => void
  onInviteUser?: () => void
}

export default function EmptyState({ type, onClearFilters, onInviteUser }: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted mb-4">
          <SearchX size={22} className="text-muted-foreground" />
        </div>
        <h3 className="text-[15px] font-semibold text-foreground mb-1">No results found</h3>
        <p className="text-sm text-muted-foreground mb-5 max-w-xs">
          No users match your current filters. Try adjusting your search or clearing the filters.
        </p>
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear all filters
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-indigo-50 mb-4">
        <Users size={22} className="text-indigo-600" />
      </div>
      <h3 className="text-[15px] font-semibold text-foreground mb-1">No users yet</h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-xs">
        Get started by inviting your first team member to the platform.
      </p>
      <Button size="sm" onClick={onInviteUser}>
        Invite a user
      </Button>
    </div>
  )
}
