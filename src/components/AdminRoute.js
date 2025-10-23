// components/AdminRoute.js - CORRECTION
import { useAdmin } from '../hooks/UseAdmin' 
import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useAdmin()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        Vérification des permissions...
      </div>
    )
  }

  return isAdmin ? children : <Navigate to="/" replace />
}