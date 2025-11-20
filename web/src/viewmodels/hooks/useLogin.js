// hooks/useLogin.js - VERSION CORRIGÉE
import { useState, useEffect } from 'react'
import { projectAuth } from '../../models/services/firebase/config';
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
      // Login direct
      const res = await projectAuth.signInWithEmailAndPassword(email, password)
      
      // Dispatch IMMÉDIAT - ne dépend pas de isCancelled
      dispatch({ type: 'LOGIN', payload: res.user })

      // Mise à jour de l'état SEULEMENT si pas annulé
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
        case 'auth/network-request-failed':
          errorMessage = 'Problème de connexion internet'
          break
        default:
          errorMessage = err.message || 'Erreur de connexion'
      }

      // Mise à jour de l'état SEULEMENT si pas annulé
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