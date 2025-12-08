// src/viewmodels/hooks/useUserProfile.js
import { useState, useEffect, useCallback } from 'react';
import { UserProfileService } from '../../models/services/userProfileService';
import { useAuthContext } from './useAuthContext';
import { projectFirestore as db } from '../../models/services/firebase/config';

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const determineDefaultRole = async () => {
    try {
      // Vérifier s'il y a déjà des utilisateurs dans la base
      const usersSnapshot = await db.collection('userProfiles').limit(1).get();
      
      // Si aucun utilisateur existe, le premier devient admin
      // Sinon, par défaut c'est un étudiant
      return usersSnapshot.empty ? 'admin' : 'student';
    } catch (error) {
      console.error('Erreur détermination rôle:', error);
      return 'student'; // Par défaut étudiant en cas d'erreur
    }
  };

  const loadProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      let userProfile = await UserProfileService.getUserProfile(user.uid);
      
      if (!userProfile) {
        // Déterminer le rôle par défaut
        const defaultRole = await determineDefaultRole();
        
        // Créer le profil avec le rôle approprié
        const newProfile = await UserProfileService.createUserProfile(
          user.uid, 
          {
            displayName: user.displayName || '',
            email: user.email
          },
          defaultRole // Passer le rôle déterminé
        );
        
        setProfile(newProfile);
        console.log(`✅ Profil créé avec rôle: ${defaultRole}`);
      } else {
        setProfile(userProfile);
        console.log(`✅ Profil chargé - Rôle: ${userProfile.role}`);
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur chargement profil:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateProfile = async (profileData) => {
    if (!user) return false;
    
    try {
      setLoading(true);
      await UserProfileService.updateUserProfile(user.uid, profileData);
      setProfile(prev => ({ ...prev, ...profileData }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (newRole) => {
    if (!user) return false;
    
    try {
      setLoading(true);
      await UserProfileService.updateUserRole(user.uid, newRole);
      setProfile(prev => ({ ...prev, role: newRole }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    updateUserRole,
    refreshProfile: loadProfile
  };
};