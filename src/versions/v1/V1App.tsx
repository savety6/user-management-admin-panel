import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import V1Sidebar from './components/V1Sidebar'
import V1TopBar from './components/V1TopBar'
import './v1.css'

export default function V1App() {
  return (
    <TooltipProvider delayDuration={300}>
      <div data-ui-version="v1" className="v1-app">
        <div className="v1-layout">
          <V1Sidebar />
          <div className="v1-main">
            <V1TopBar />
            <div className="v1-content">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <Toaster richColors position="bottom-right" />
    </TooltipProvider>
  )
}
