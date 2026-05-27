import { useState } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import Sidebar, { type Route } from '@/components/layout/Sidebar'
import UsersPage from '@/features/users/UsersPage'

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-[18px] font-semibold text-foreground mb-1.5">{title}</h2>
        <p className="text-[13.5px] text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default function App() {
  const [route, setRoute] = useState<Route>('users')

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-full w-full overflow-hidden">
        <Sidebar active={route} onNavigate={setRoute} />
        <main className="flex-1 min-w-0 overflow-hidden">
          {route === 'users' && <UsersPage />}
          {route === 'dashboard' && (
            <PlaceholderPage title="Overview" description="Dashboard metrics coming soon." />
          )}
          {route === 'teams' && (
            <PlaceholderPage title="Teams" description="Team management coming soon." />
          )}
          {route === 'roles' && (
            <PlaceholderPage title="Roles & Permissions" description="Role management coming soon." />
          )}
          {route === 'audit' && (
            <PlaceholderPage title="Audit Log" description="Activity log coming soon." />
          )}
          {route === 'settings' && (
            <PlaceholderPage title="Settings" description="System settings coming soon." />
          )}
        </main>
      </div>
      <Toaster richColors position="bottom-right" />
    </TooltipProvider>
  )
}
