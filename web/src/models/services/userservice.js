import api from './api';

export const userService = {
  // Récupérer tous les utilisateurs
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  // Récupérer un utilisateur par ID
  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error);
      throw error;
    }
  },

  // Mettre à jour un utilisateur
  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un utilisateur
  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les statistiques des utilisateurs
  async getUserStats() {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des stats utilisateurs:', error);
      throw error;
    }
  },

  // Surveiller le statut en temps réel
  async subscribeToUserStatus(userId, callback) {
    // Implémentation pour WebSocket ou SSE
    return () => {}; // Fonction de nettoyage
  }
};