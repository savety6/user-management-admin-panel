import { DropdownMenu as R } from 'radix-ui'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

const menuStyle: React.CSSProperties = {
  background: '#152033',
  border: '1px solid rgba(148, 163, 184, 0.14)',
  borderRadius: '0.625rem',
  padding: '4px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
  minWidth: '152px',
  zIndex: 50,
  outline: 'none',
}

const itemBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 10px',
  fontSize: '0.8125rem',
  borderRadius: 6,
  cursor: 'pointer',
  outline: 'none',
  border: 'none',
  width: '100%',
  textAlign: 'left',
  background: 'transparent',
}

export default function V2ActionMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <R.Root>
      <R.Trigger asChild>
        <button className="v2-table-kebab v2-btn-icon">
          <MoreHorizontal size={15} strokeWidth={1.75} />
        </button>
      </R.Trigger>
      <R.Portal>
        <R.Content align="end" sideOffset={4} style={menuStyle}>
          <R.Item
            className="v2-raw-item"
            style={{ ...itemBase, color: '#DDE6F4' }}
            onSelect={onEdit}
          >
            <Pencil size={13} strokeWidth={1.75} />
            Edit user
          </R.Item>
          <R.Separator style={{ height: 1, background: 'rgba(148,163,184,0.10)', margin: '4px 0' }} />
          <R.Item
            className="v2-raw-item-danger"
            style={{ ...itemBase, color: '#F87171' }}
            onSelect={onDelete}
          >
            <Trash2 size={13} strokeWidth={1.75} />
            Delete user
          </R.Item>
        </R.Content>
      </R.Portal>
    </R.Root>
  )
}
