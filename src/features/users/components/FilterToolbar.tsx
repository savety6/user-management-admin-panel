import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface FilterState {
  search: string
  role: string
  status: string
}

interface FilterToolbarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  totalCount: number
  filteredCount: number
}

export default function FilterToolbar({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: FilterToolbarProps) {
  const hasActiveFilters =
    filters.search !== '' || filters.role !== 'all' || filters.status !== 'all'

  const update = (partial: Partial<FilterState>) =>
    onFiltersChange({ ...filters, ...partial })

  const clear = () => onFiltersChange({ search: '', role: 'all', status: 'all' })

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative min-w-0 w-72">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          placeholder="Search users..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="pl-9 h-9 bg-white text-sm"
        />
        {filters.search && (
          <button
            onClick={() => update({ search: '' })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Role filter */}
      <Select value={filters.role} onValueChange={(v) => update({ role: v })}>
        <SelectTrigger className="h-9 w-36 bg-white text-sm">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="editor">Editor</SelectItem>
          <SelectItem value="viewer">Viewer</SelectItem>
        </SelectContent>
      </Select>

      {/* Status filter */}
      <Select value={filters.status} onValueChange={(v) => update({ status: v })}>
        <SelectTrigger className="h-9 w-36 bg-white text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clear} className="h-9 text-sm">
          Clear filters
        </Button>
      )}

      {/* Count */}
      <span className="ml-auto text-[13px] text-muted-foreground">
        {filteredCount === totalCount
          ? `${totalCount} users`
          : `${filteredCount} of ${totalCount} users`}
      </span>
    </div>
  )
}
