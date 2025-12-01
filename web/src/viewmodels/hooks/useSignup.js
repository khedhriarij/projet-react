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
      // Créer l'utilisateur Firebase Auth
      const res = await projectAuth.createUserWithEmailAndPassword(email, password);
      
      if (!res.user) {
        throw new Error('Impossible de créer le compte');
      }

      // Upload de l'image de profil
      let photoURL = null;
      if (thumbnail) {
        const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
        const img = await projectStorage.ref(uploadPath).put(thumbnail);
        photoURL = await img.ref.getDownloadURL();
      }

      // Mettre à jour le profil utilisateur
      await res.user.updateProfile({
        displayName,
        photoURL
      });

      // Créer le document utilisateur dans Firestore
      await projectFirestore.collection('users').doc(res.user.uid).set({
        online: true,
        displayName,
        photoURL,
        email,
        role: 'student', // Rôle par défaut
        createdAt: new Date()
      });

      // Créer le profil utilisateur
      await projectFirestore.collection('userProfiles').doc(res.user.uid).set({
        displayName,
        email,
        role: 'student',
        photoURL,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Dispatch login
      dispatch({ type: 'LOGIN', payload: res.user });

      setIsPending(false);
      return true;

    } catch (err) {
      console.error('Erreur signup:', err);
      setError(err.message);
      setIsPending(false);
      return false;
    }
  };

  return { signup, isPending, error };
};