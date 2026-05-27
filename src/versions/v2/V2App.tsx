import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import V2Sidebar from './components/V2Sidebar'
import V2TopBar from './components/V2TopBar'
import './v2.css'

export default function V2App() {
  return (
    <TooltipProvider delayDuration={300}>
      <div data-ui-version="v2" className="v2-app">
        <div className="v2-layout">
          <V2Sidebar />
          <div className="v2-main">
            <V2TopBar />
            <div className="v2-content">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors position="bottom-right" />
    </TooltipProvider>
  )
}
