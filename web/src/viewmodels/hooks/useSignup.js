// src/viewmodels/hooks/useSignup.js - VERSION CORRIGÉE
import { useState } from 'react';
import { projectAuth, projectStorage, projectFirestore } from '../../models/services/firebase/config';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);

    try {
      console.log('1. Début de la création du compte...');
      
      // 1. Création de l'utilisateur dans Firebase Auth
      const res = await projectAuth.createUserWithEmailAndPassword(email, password);
      console.log('2. Compte Auth créé:', res.user.uid);
      
      if (!res.user) throw new Error('Impossible de créer le compte');

      // 2. Upload de la photo de profil (si elle existe)
      let photoURL = null;
      if (thumbnail) {
        console.log('3. Upload de la photo...');
        const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
        const img = await projectStorage.ref(uploadPath).put(thumbnail);
        photoURL = await img.ref.getDownloadURL();
        console.log('4. Photo uploadée:', photoURL);
      }

      // 3. Mise à jour du profil Firebase Auth
      console.log('5. Mise à jour du profil Auth...');
      await res.user.updateProfile({
        displayName,
        photoURL
      });

      // 4. Création du document utilisateur dans Firestore
      console.log('6. Tentative de création dans Firestore...');
      
      // IMPORTANT: Utilisez FieldValue.serverTimestamp() pour Firebase SDK v8
      const userData = {
        uid: res.user.uid,
        email: email,
        displayName: displayName,
        photoURL: photoURL,
        role: 'student',
        createdAt: projectFirestore.FieldValue.serverTimestamp(), // CORRECTION ICI
        lastLogin: projectFirestore.FieldValue.serverTimestamp(),
        status: 'active',
        preferences: {}
      };
      
      console.log('7. Données à sauvegarder:', userData);
      
      try {
        await projectFirestore.collection('users').doc(res.user.uid).set(userData);
        console.log('✅ Document créé avec succès dans Firestore');
      } catch (firestoreErr) {
        console.error("❌ Erreur Firestore DÉTAILLÉE:", {
          code: firestoreErr.code,
          message: firestoreErr.message,
          stack: firestoreErr.stack
        });
        
        // Option: Supprimer l'utilisateur Auth si Firestore échoue
        await res.user.delete();
        throw new Error('Échec de la création du profil: ' + firestoreErr.message);
      }

      // 5. Rafraîchir l'utilisateur
      await res.user.reload();
      const currentUser = projectAuth.currentUser;
      
      // 6. Mise à jour du contexte
      console.log('8. Mise à jour du contexte...');
      dispatch({ type: 'LOGIN', payload: currentUser });

      setIsPending(false);
      return true;

    } catch (err) {
      console.error('❌ Erreur complète lors du signup:', {
        code: err.code,
        message: err.message,
        stack: err.stack
      });
      
      // Message d'erreur plus clair
      let errorMessage = 'Erreur lors de la création du compte';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Cet email est déjà utilisé';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      } else if (err.code === 'permission-denied') {
        errorMessage = 'Permission refusée. Vérifiez vos règles Firebase';
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      setIsPending(false);
      return false;
    }
  };

  return { signup, isPending, error };
};