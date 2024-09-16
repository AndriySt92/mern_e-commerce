import type React from 'react'
import { Navigate } from 'react-router-dom'

interface Props {
  children: React.ReactNode
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const user = { role: 'customer' }
  return user ? children : <Navigate to={'/login'} />
}

export default PrivateRoute
