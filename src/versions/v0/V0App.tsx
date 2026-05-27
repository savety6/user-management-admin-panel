import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import './v0.css'

interface V0AppProps {
  basePath: string
}

export default function V0App({ basePath }: V0AppProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <TooltipProvider delayDuration={300}>
      <div data-ui-version="v0" className="v0-app flex h-full w-full overflow-hidden">
        {sidebarOpen && (
          <div className="v0-mobile-overlay" onClick={() => setSidebarOpen(false)} />
        )}
        <Sidebar basePath={basePath} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0 flex-1 flex flex-col overflow-hidden">
          <div className="v0-mobile-topbar">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
              style={{ color: '#9CA3AF' }}
            >
              <Menu size={18} strokeWidth={1.75} />
            </button>
            <span className="text-[13px] font-semibold text-white">AdminPanel</span>
          </div>
          <main className="min-w-0 flex-1 overflow-hidden">
            <div className="page-enter h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Toaster richColors position="bottom-right" />
    </TooltipProvider>
  )
}
