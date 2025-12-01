// src/models/services/userProfileService.js
import { projectFirestore as db } from './firebase/config';

export const UserProfileService = {
  // Récupérer le profil utilisateur
  async getUserProfile(userId) {
    try {
      const profileDoc = await db.collection('userProfiles').doc(userId).get();
      if (profileDoc.exists) {
        return profileDoc.data();
      }
      return null;
    } catch (error) {
      throw new Error(`Erreur récupération profil: ${error.message}`);
    }
  },

  // Mettre à jour le profil utilisateur
  async updateUserProfile(userId, profileData) {
    try {
      await db.collection('userProfiles').doc(userId).set({
        ...profileData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (error) {
      throw new Error(`Erreur mise à jour profil: ${error.message}`);
    }
  },

  // Créer le profil initial AVEC RÔLE
  async createUserProfile(userId, userData, role = 'student') {
    try {
      const profileData = {
        displayName: userData.displayName || '',
        email: userData.email,
        role: role, // 'student', 'teacher', 'admin'
        phoneNumber: userData.phoneNumber || '',
        bio: userData.bio || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await db.collection('userProfiles').doc(userId).set(profileData);
      return profileData;
    } catch (error) {
      throw new Error(`Erreur création profil: ${error.message}`);
    }
  },

  // Mettre à jour le rôle utilisateur
  async updateUserRole(userId, newRole) {
    try {
      await db.collection('userProfiles').doc(userId).update({
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      throw new Error(`Erreur mise à jour rôle: ${error.message}`);
    }
  },

  // Récupérer tous les utilisateurs (pour admin)
  async getAllUsers() {
    try {
      const querySnapshot = await db.collection('userProfiles').get();
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Erreur récupération utilisateurs: ${error.message}`);
    }
  },

  // Rechercher utilisateurs par rôle
  async getUsersByRole(role) {
    try {
      const querySnapshot = await db.collection('userProfiles')
        .where('role', '==', role)
        .get();
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Erreur récupération utilisateurs par rôle: ${error.message}`);
    }
  }
};