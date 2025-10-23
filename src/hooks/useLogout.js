// hooks/useLogout.js
import { useEffect, useState } from 'react'
import { projectAuth, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { user, dispatch } = useAuthContext()
  
  const logout = async () => {
    setError(null)
    setIsPending(true)

    try {
      // Mettre à jour le statut online dans Firestore
      if (user) {
        try {
          await projectFirestore.collection('users').doc(user.uid).update({
            online: false
          })
        } catch (firestoreError) {
          console.error("Erreur lors de la mise à jour du statut online:", firestoreError)
          // On ne bloque pas la déconnexion même en cas d'erreur Firestore
        }
      }

      // Sign out
      await projectAuth.signOut()
      
      // Dispatch logout action
      dispatch({ type: 'LOGOUT' })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      } 
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { logout, error, isPending }
}