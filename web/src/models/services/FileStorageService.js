// Service frontend qui appelle l'API backend Express
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class FileStorageService {
  
  // Récupérer les fichiers d'un cours
  async getCourseFiles(courseId) {
    try {
      console.log(`Chargement fichiers cours ${courseId} depuis API backend...`);
      
      const response = await fetch(`${API_BASE_URL}/files/courses/${courseId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      console.log(`${result.data.length} fichiers chargés pour cours ${courseId}`);
      return result.data;
    } catch (error) {
      console.error('Erreur chargement fichiers depuis API:', error);
      // Fallback vers les données de démonstration
      return this.getDemoFiles(courseId);
    }
  }

  // Stocker les métadonnées d'un fichier
  async storeFileMetadata(fileData) {
    try {
      console.log('Envoi métadonnées fichier vers API...', fileData.name);
      
      const response = await fetch(`${API_BASE_URL}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileData),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      console.log('Fichier enregistré via API:', result.data._id);
      return result.data;
    } catch (error) {
      console.error('Erreur enregistrement fichier:', error);
      throw error;
    }
  }

  // Récupérer un fichier spécifique
  async getFileById(fileId) {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${fileId}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    } catch (error) {
      console.error('Erreur récupération fichier:', error);
      return null;
    }
  }

  // Télécharger un fichier (obtenir l'URL de téléchargement)
  async downloadFile(fileId) {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${fileId}/download`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data.downloadUrl;
    } catch (error) {
      console.error('Erreur téléchargement fichier:', error);
      throw error;
    }
  }

  // Test de connexion à l'API backend
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const result = await response.json();
      
      console.log('Test connexion API réussi:', result);
      return result.status === 'OK';
    } catch (error) {
      console.error('Test connexion API échoué:', error);
      return false;
    }
  }

  // Données de démonstration (fallback si API indisponible)
  getDemoFiles(courseId) {
    const demoFiles = {
      1: [
        {
          _id: "demo_1",
          courseId: 1,
          lessonId: "1",
          name: "Introduction_React_Hooks.pdf",
          type: "pdf",
          url: "#",
          size: 2048576,
          mimeType: "application/pdf",
          description: "PDF d'introduction aux Hooks React",
          uploadDate: new Date().toISOString(),
          storageProvider: "demo"
        },
        {
          _id: "demo_2",
          courseId: 1,
          lessonId: "1", 
          name: "Exercices_Hooks.js",
          type: "code",
          url: "#",
          size: 10240,
          mimeType: "application/javascript",
          description: "Exercices sur les Hooks React",
          uploadDate: new Date().toISOString(),
          storageProvider: "demo"
        }
      ],
      2: [
        {
          _id: "demo_3",
          courseId: 2,
          lessonId: "1",
          name: "Guide_Figma_Debutant.pdf",
          type: "pdf",
          url: "#",
          size: 3097152,
          mimeType: "application/pdf",
          description: "Guide complet Figma pour débutants",
          uploadDate: new Date().toISOString(),
          storageProvider: "demo"
        }
      ]
    };
    
    console.log(`Utilisation données démo pour cours ${courseId}`);
    return demoFiles[courseId] || [];
  }

  // Ajouter des fichiers de démonstration via l'API backend
  async addDemoFiles() {
    try {
      const response = await fetch(`${API_BASE_URL}/files/demo-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      console.log(`${result.data.length} fichiers de démo ajoutés via API`);
      return result;
    } catch (error) {
      console.error('Erreur ajout fichiers démo:', error);
      throw error;
    }
  }
}

// Instance singleton
const fileStorageService = new FileStorageService();
export default fileStorageService;