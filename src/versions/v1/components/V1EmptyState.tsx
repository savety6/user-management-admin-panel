import { Construction } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function V1EmptyState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-10">
      <div
        className="v1-placeholder flex w-full max-w-md flex-col items-center gap-4 rounded-xl p-10 text-center"
      >
        <div
          className="flex size-12 items-center justify-center rounded-xl"
          style={{ background: 'var(--v1-primary-surface)' }}
        >
          <Construction size={22} strokeWidth={1.5} style={{ color: 'var(--v1-primary)' }} />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold" style={{ color: 'var(--v1-text)' }}>
            Coming soon
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: 'var(--v1-text-muted)' }}>
            This section is not yet implemented in v1. Head over to Users to get started.
          </p>
        </div>
        <Link
          to="/v1/users"
          className="rounded-lg px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--v1-primary)' }}
        >
          Go to Users
        </Link>
      </div>
    </div>
  )
}
