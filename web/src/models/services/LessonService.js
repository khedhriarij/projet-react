// frontend/src/models/services/LessonService.js - SERVICE FRONTEND
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class LessonService {
  
  // Récupérer les leçons d'un cours
  async getCourseLessons(courseId) {
    try {
      console.log(`📚 Chargement leçons cours ${courseId}...`);
      
      const response = await fetch(`${API_BASE_URL}/lessons/course/${courseId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      console.log(`${result.data.length} leçons chargées`);
      return result;
    } catch (error) {
      console.error('Erreur chargement leçons:', error);
      // Fallback vers données de démonstration
      return this.getDemoLessons(courseId);
    }
  }

  // Récupérer une leçon spécifique
  async getLesson(lessonId) {
    try {
      const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      return result.data;
    } catch (error) {
      console.error('Erreur récupération leçon:', error);
      return null;
    }
  }

  // Données de démonstration
  getDemoLessons(courseId) {
    const demoLessons = {
      1: [
        {
          _id: "demo_lesson_1",
          courseId: 1,
          sectionId: "section1",
          lessonNumber: 1,
          title: "Introduction aux Hooks React",
          description: "Découvrez les bases des Hooks React et leur importance",
          duration: "45min",
          videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
          videoProvider: "youtube",
          pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          resources: [
            {
              type: "pdf",
              title: "Support de cours PDF",
              url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
              description: "PDF complet du cours"
            }
          ],
          isPremium: false
        },
        {
          _id: "demo_lesson_2",
          courseId: 1,
          sectionId: "section1",
          lessonNumber: 2,
          title: "useState et useEffect en profondeur",
          description: "Plongez dans les deux Hooks les plus importants",
          duration: "1h 20min",
          videoUrl: "https://www.youtube.com/embed/0ZJgIjIuY7U",
          videoProvider: "youtube",
          pdfUrl: "https://www.africau.edu/images/default/sample.pdf",
          isPremium: false
        }
      ]
    };

    const lessons = demoLessons[courseId] || [];
    
    return {
      success: true,
      data: lessons,
      sections: {
        section1: lessons
      },
      count: lessons.length
    };
  }

  // Tester la connexion à l'API
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const result = await response.json();
      return result.status === 'OK';
    } catch (error) {
      console.error('Test connexion échoué:', error);
      return false;
    }
  }

  // Créer des données de démonstration
  async createDemoData() {
    try {
      const response = await fetch(`${API_BASE_URL}/lessons/demo`, {
        method: 'POST'
      });
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      console.log(`${result.data.length} leçons de démo créées`);
      return result;
    } catch (error) {
      console.error('Erreur création démo:', error);
      throw error;
    }
  }
}

// Instance singleton
const lessonService = new LessonService();
export default lessonService;