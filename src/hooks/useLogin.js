// hooks/useLogin.js - VERSION OPTIMISÉE
import { useState, useEffect } from 'react'
import { projectAuth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setError(null)
    setIsPending(true)
  
    try {
      // Login direct - pas de mise à jour Firestore immédiate
      const res = await projectAuth.signInWithEmailAndPassword(email, password)
      
      // Dispatch immédiat pour navigation rapide
      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) {
      console.log('❌ Code erreur Firebase:', err.code)
      
      let errorMessage = 'Une erreur est survenue lors de la connexion'
      
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte trouvé avec cet email'
          break
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect'
          break
        case 'auth/invalid-email':
          errorMessage = 'Format d\'email invalide'
          break
        case 'auth/user-disabled':
          errorMessage = 'Ce compte a été désactivé'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives. Réessayez plus tard'
          break
        default:
          errorMessage = 'Erreur de connexion'
      }

      if (!isCancelled) {
        setError(errorMessage)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { login, isPending, error }
}