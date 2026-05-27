import { Outlet } from 'react-router-dom'
import './v1.css'

export default function V1App() {
  return (
    <div data-ui-version="v1" className="v1-app h-full w-full overflow-auto">
      <Outlet />
    </div>
  )
}
