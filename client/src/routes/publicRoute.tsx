import type React from 'react'
import { Navigate } from 'react-router-dom'

interface Props {
  children: React.ReactNode
}

const PublicRoute: React.FC<Props> = ({ children }) => {
  const user = { role: 'customer' }
  return user ? <Navigate to={'/'} /> : children
}

export default PublicRoute
