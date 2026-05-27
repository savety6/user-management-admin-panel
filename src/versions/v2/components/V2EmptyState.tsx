import { Construction } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function V2EmptyState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-10">
      <div
        className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl p-10 text-center"
        style={{
          background: 'var(--v2-surface)',
          border: '1px solid var(--v2-border)',
        }}
      >
        <div
          className="flex size-14 items-center justify-center rounded-2xl"
          style={{ background: 'var(--v2-accent-dim)' }}
        >
          <Construction size={24} strokeWidth={1.5} style={{ color: 'var(--v2-accent)' }} />
        </div>
        <div>
          <h3
            className="text-[15px] font-bold"
            style={{ color: 'var(--v2-text)', fontFamily: "'Syne', system-ui" }}
          >
            Coming soon
          </h3>
          <p className="mt-1.5 text-[12.5px] leading-relaxed" style={{ color: 'var(--v2-text-muted)' }}>
            This section is not yet implemented in v2.
          </p>
        </div>
        <Link
          to="/v2/users"
          className="v2-btn-primary"
          style={{ textDecoration: 'none' }}
        >
          Go to Users
        </Link>
      </div>
    </div>
  )
}
