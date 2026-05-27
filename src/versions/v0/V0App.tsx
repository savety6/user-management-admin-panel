import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import './v0.css'

interface V0AppProps {
  basePath: string
}

export default function V0App({ basePath }: V0AppProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div data-ui-version="v0" className="v0-app flex h-full w-full overflow-hidden">
        <Sidebar basePath={basePath} />
        <main className="min-w-0 flex-1 overflow-hidden">
          <div className="page-enter h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster richColors position="bottom-right" />
    </TooltipProvider>
  )
}
