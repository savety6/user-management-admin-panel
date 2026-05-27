import { useState, useRef, useEffect } from 'react'
import { Pencil, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EditableCellProps {
  value: string
  onSave: (newValue: string) => Promise<void>
  validate?: (value: string) => string | undefined
  type?: 'text' | 'email'
  className?: string
  inputClassName?: string
}

export default function EditableCell({
  value,
  onSave,
  validate,
  type = 'text',
  className,
  inputClassName,
}: EditableCellProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  const startEdit = () => {
    setDraft(value)
    setError(undefined)
    setEditing(true)
  }

  const commit = async () => {
    const trimmed = draft.trim()
    if (trimmed === value) { setEditing(false); return }
    if (!trimmed) { setDraft(value); setEditing(false); return }

    if (validate) {
      const err = validate(trimmed)
      if (err) { setError(err); inputRef.current?.focus(); return }
    }

    setSaving(true)
    setError(undefined)
    try {
      await onSave(trimmed)
      setEditing(false)
    } catch {
      setError('Could not save')
      setDraft(value)
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
          onChange={(e) => { setDraft(e.target.value); setError(undefined) }}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          disabled={saving}
          className={cn(
            'w-full min-w-0 rounded-md border bg-white px-2 py-0.5 text-[13px] outline-none transition-all',
            'border-indigo-400 ring-2 ring-indigo-100',
            error && 'border-red-400 ring-red-100 focus:ring-red-100',
            saving && 'opacity-60',
            inputClassName,
          )}
        />
        {saving && (
          <Loader2
            size={11}
            className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-indigo-400 pointer-events-none"
          />
        )}
        {error && (
          <span className="absolute top-full left-0 mt-1 z-20 whitespace-nowrap rounded border border-red-100 bg-white px-1.5 py-0.5 text-[11px] text-red-500 shadow-sm">
            {error}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="group/editable flex min-w-0 items-center gap-1">
      <span className={cn('min-w-0 truncate', className)}>{value}</span>
      <button
        type="button"
        onClick={startEdit}
        onDoubleClick={startEdit}
        tabIndex={-1}
        title="Edit"
        className={cn(
          'flex shrink-0 size-[18px] items-center justify-center rounded',
          'opacity-0 group-hover/editable:opacity-100',
          'text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50',
          'transition-all duration-100',
        )}
      >
        <Pencil size={10} />
      </button>
    </div>
  )
}
