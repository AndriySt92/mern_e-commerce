import { Navbar } from '../components'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="relative z-50 pt-20">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Layout
