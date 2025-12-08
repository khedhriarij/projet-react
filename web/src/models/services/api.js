import axios from 'axios';

// Configuration dynamique selon l'environnement
const getBaseURL = () => {
  // Priorité aux variables d'environnement
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback intelligent
  if (process.env.NODE_ENV === 'production') {
    // En production, utilise l'URL de votre backend déployé
    return 'https://votre-api-production.com/api';
  }
  
  // En développement
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000, // 15 secondes - raisonnable pour la plupart des requêtes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    // Chercher le token dans plusieurs endroits
    const token = localStorage.getItem('token') || 
                  sessionStorage.getItem('token') ||
                  localStorage.getItem('userToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log uniquement en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`➡️ API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const { response, code, message } = error;
    
    // Log détaillé en développement seulement
    if (process.env.NODE_ENV === 'development') {
      console.error('🔴 API Error:', {
        url: error.config?.url,
        status: response?.status,
        code,
        message,
        data: response?.data
      });
    }
    
    // Gestion des erreurs spécifiques
    if (response) {
      switch (response.status) {
        case 401:
          // Token expiré ou invalide
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Rediriger vers login seulement si on est sur une page protégée
          if (!window.location.pathname.includes('/login') &&
              !window.location.pathname.includes('/signup')) {
            window.location.href = '/login?session=expired';
          }
          break;
          
        case 403:
          // Accès interdit
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Accès non autorisé - Rôle insuffisant');
          }
          break;
          
        case 404:
          // Ressource non trouvée
          if (process.env.NODE_ENV === 'development') {
            console.warn('🔍 Ressource non trouvée');
          }
          break;
          
        case 500:
          // Erreur serveur
          console.error('💥 Erreur serveur - Contactez l\'administrateur');
          break;
      }
    } else if (code === 'ECONNABORTED') {
      // Timeout
      console.warn('⏱️ La requête a expiré. Vérifiez votre connexion.');
    } else if (message === 'Network Error') {
      // Erreur réseau - probablement le backend est éteint
      console.warn('🌐 Impossible de joindre le serveur. Vérifiez que le backend est démarré.');
      
      // Ne pas rediriger, permettre au frontend de fonctionner avec données mockées
      // Le composant gérera le fallback
    }
    
    // Rejeter l'erreur pour que les composants puissent la gérer
    return Promise.reject(error);
  }
);

/**
 * Helper pour gérer les erreurs API de manière cohérente
 * @param {Error} error - L'erreur axios
 * @returns {Object} - Format standardisé d'erreur
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Le serveur a répondu avec un code d'erreur
    return {
      success: false,
      status: error.response.status,
      message: error.response.data?.message || 
               error.response.data?.error || 
               `Erreur ${error.response.status}`,
      data: error.response.data,
      isNetworkError: false
    };
  }
  
  if (error.request) {
    // La requête a été faite mais pas de réponse
    return {
      success: false,
      status: 0,
      message: 'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
      data: null,
      isNetworkError: true
    };
  }
  
  // Erreur lors de la configuration de la requête
  return {
    success: false,
    status: -1,
    message: error.message || 'Erreur inconnue',
    data: null,
    isNetworkError: false
  };
};

/**
 * Fonction pour vérifier si le backend est accessible
 * @returns {Promise<boolean>} - true si le backend répond
 */
export const checkBackendHealth = async () => {
  try {
    await api.get('/health');
    return true;
  } catch (error) {
    return false;
  }
};

export default api;