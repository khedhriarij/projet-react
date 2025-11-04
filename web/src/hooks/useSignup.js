// hooks/useSignup.js - VERSION CORRIGÉE AVEC REDIRECTION
import { useState, useEffect } from 'react'
import { projectAuth, projectStorage, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()
  const navigate = useNavigate()

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null)
    setIsPending(true)
  
    try {
      console.log('🚀 DÉBUT INSCRIPTION - Sauvegarde Firestore FORCÉE')
      
      // ÉTAPE 1 : Création du compte Auth
      const res = await projectAuth.createUserWithEmailAndPassword(email, password)
      console.log('✅ Compte Auth créé:', res.user.uid)

      // ÉTAPE 2 : Upload photo (optionnel)
      let imgUrl = null
      if (thumbnail) {
        try {
          console.log('📸 Début upload photo...')
          const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
          const img = await projectStorage.ref(uploadPath).put(thumbnail)
          imgUrl = await img.ref.getDownloadURL()
          console.log('✅ Photo uploadée:', imgUrl)
        } catch (uploadError) {
          console.warn('⚠️ Upload photo échoué, continuation sans photo:', uploadError)
          imgUrl = null
        }
      }

      // ÉTAPE 3 : Mise à jour profil Auth
      console.log('👤 Mise à jour profil Auth...')
      await res.user.updateProfile({ 
        displayName, 
        photoURL: imgUrl 
      })

      // ÉTAPE 4 : SAUVEGARDE FIRESTORE - CRITIQUE
      console.log('💾 DÉBUT SAUVEGARDE FIRESTORE...')
      
      const userData = {
        uid: res.user.uid,
        displayName: displayName,
        email: email,
        photoURL: imgUrl,
        role: 'student', 
        online: true,
        createdAt: new Date(),
        lastLogin: new Date()
      }

      console.log('📝 Données à sauvegarder:', userData)

      // SAUVEGARDE FORCÉE avec try/catch séparé
      try {
        // Méthode 1: set() avec merge false (écrase complètement)
        await projectFirestore.collection('users').doc(res.user.uid).set(userData)
        console.log('✅ PREMIÈRE SAUVEGARDE FIRESTORE RÉUSSIE')
        
        // Vérification immédiate
        const docRef = projectFirestore.collection('users').doc(res.user.uid)
        const docSnapshot = await docRef.get()
        
        if (docSnapshot.exists) {
          console.log('🔍 VÉRIFICATION: Document EXISTE dans Firestore')
          console.log('📊 Données vérifiées:', docSnapshot.data())
        } else {
          console.error('❌ VÉRIFICATION: Document NEXISTE PAS après sauvegarde!')
          throw new Error('Échec sauvegarde Firestore - document non créé')
        }
        
      } catch (firestoreError) {
        console.error('❌ ERREUR FIRESTORE PRIMAIRE:', firestoreError)
        
        // Tentative de secours
        try {
          console.log('🔄 TENTATIVE DE SECOURS...')
          await projectFirestore.collection('users').add(userData)
          console.log('✅ SAUVEGARDE DE SECOURS RÉUSSIE (méthode add)')
        } catch (backupError) {
          console.error('❌ ERREUR SAUVEGARDE SECOURS:', backupError)
          throw new Error(`Double échec Firestore: ${firestoreError.message} + ${backupError.message}`)
        }
      }

      // ÉTAPE 5 : Rechargement et dispatch
      await res.user.reload()
      const updatedUser = projectAuth.currentUser
      
      dispatch({ type: 'LOGIN', payload: updatedUser })
      console.log('🎉 INSCRIPTION TERMINÉE AVEC SUCCÈS - Firestore OK')

      // ÉTAPE 6 : REDIRECTION VERS CATALOG
      console.log('📍 Redirection vers /catalog')
      navigate('/catalog')

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }

    } 
    catch(err) {
      console.error('❌ ERREUR INSCRIPTION COMPLÈTE:', err)
      
      if (!isCancelled) {
        // Gestion améliorée des erreurs
        let errorMessage = 'Une erreur est survenue lors de l\'inscription'
        
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Cet email est déjà utilisé'
            break
          case 'auth/invalid-email':
            errorMessage = 'Format d\'email invalide'
            break
          case 'auth/weak-password':
            errorMessage = 'Le mot de passe est trop faible (minimum 6 caractères)'
            break
          case 'auth/operation-not-allowed':
            errorMessage = 'L\'inscription par email/mot de passe n\'est pas activée'
            break
          default:
            errorMessage = err.message || 'Erreur lors de l\'inscription'
        }
        
        setError(errorMessage)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { signup, error, isPending }
}