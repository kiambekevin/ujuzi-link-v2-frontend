// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, user } = useAuth()
  const location = useLocation()

  // 1) Not logged in - send to login, remembering where they wanted to go
  if (!isLoggedIn) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  // 2) Role gate - if the route requires a specific role and the user
  //    doesn't have it, send them to their own dashboard (not a dead end)
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    const userRole = user?.role
    const hasRole = roles.includes(userRole)

    if (!hasRole) {
      // Land on a sensible dashboard for the actual role
      const fallback = {
        trainee: '/trainees_dashboard',
        employer: '/employer_dashboard',
        institution: '/institution_dashboard',
        'super-admin': '/admin'
      }[userRole] || '/'

      return <Navigate to={fallback} replace />
    }
  }

  return children
}