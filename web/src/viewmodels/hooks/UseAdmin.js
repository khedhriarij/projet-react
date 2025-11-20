// hooks/useAdmin.js
import { useState, useEffect } from 'react'
import { projectFirestore } from '../../models/services/firebase/config'
import { useAuthContext } from './useAuthContext'

export const useAdmin = () => {
  const { user } = useAuthContext()
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDoc = await projectFirestore.collection('users').doc(user.uid).get()
          if (userDoc.exists) {
            const userData = userDoc.data()
            setUserRole(userData.role || 'student')
          } else {
            setUserRole('student') // Rôle par défaut
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du rôle:', error)
          setUserRole('student')
        }
      }
      setLoading(false)
    }

    fetchUserRole()
  }, [user])

  const isAdmin = userRole === 'admin'
  const isStudent = userRole === 'student'

  return { isAdmin, isStudent, userRole, loading }
}