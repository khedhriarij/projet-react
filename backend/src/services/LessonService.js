// backend/services/LessonService.js - SERVICE COMPLET
const Lesson = require('models/Lesson');

class LessonService {
  // Créer une nouvelle leçon
  async createLesson(lessonData) {
    try {
      const lesson = new Lesson(lessonData);
      const savedLesson = await lesson.save();
      console.log('📘 Leçon créée:', savedLesson._id);
      return savedLesson;
    } catch (error) {
      console.error('Erreur création leçon:', error);
      throw error;
    }
  }

  // Récupérer toutes les leçons d'un cours
  async getCourseLessons(courseId) {
    try {
      const lessons = await Lesson.find({ courseId: parseInt(courseId) })
        .sort({ sectionId: 1, lessonNumber: 1 });
      console.log(`📚 ${lessons.length} leçons trouvées pour cours ${courseId}`);
      return lessons;
    } catch (error) {
      console.error('Erreur récupération leçons:', error);
      return [];
    }
  }

  // Récupérer une leçon spécifique
  async getLessonById(lessonId) {
    try {
      return await Lesson.findById(lessonId);
    } catch (error) {
      console.error('Erreur récupération leçon:', error);
      return null;
    }
  }

  // Mettre à jour une leçon
  async updateLesson(lessonId, updateData) {
    try {
      const updatedLesson = await Lesson.findByIdAndUpdate(
        lessonId,
        updateData,
        { new: true }
      );
      console.log('✏️ Leçon mise à jour:', lessonId);
      return updatedLesson;
    } catch (error) {
      console.error('Erreur mise à jour leçon:', error);
      throw error;
    }
  }

  // Supprimer une leçon
  async deleteLesson(lessonId) {
    try {
      await Lesson.findByIdAndDelete(lessonId);
      console.log('🗑️ Leçon supprimée:', lessonId);
      return true;
    } catch (error) {
      console.error('Erreur suppression leçon:', error);
      return false;
    }
  }

  // Générer des données de démonstration
  async generateDemoLessons() {
    const demoLessons = [
      {
        courseId: 1,
        sectionId: "section1",
        lessonNumber: 1,
        title: "Introduction aux Hooks React",
        description: "Découvrez les bases des Hooks React et leur importance",
        duration: "45min",
        videoUrl: "https://www.youtube.com/embed/dGcsHMXbSOA",
        videoProvider: "youtube",
        videoId: "dGcsHMXbSOA",
        pdfUrl: "https://firebasestorage.googleapis.com/v0/b/eduplatform-app.appspot.com/o/sample.pdf?alt=media",
        resources: [
          {
            type: "pdf",
            title: "Support de cours PDF",
            url: "https://firebasestorage.googleapis.com/v0/b/eduplatform-app.appspot.com/o/sample.pdf?alt=media",
            description: "PDF complet du cours"
          },
          {
            type: "exercise",
            title: "Exercices pratiques",
            url: "#",
            description: "Exercices sur les Hooks"
          }
        ],
        isPremium: false
      },
      {
        courseId: 1,
        sectionId: "section1",
        lessonNumber: 2,
        title: "useState et useEffect en profondeur",
        description: "Plongez dans les deux Hooks les plus importants",
        duration: "1h 20min",
        videoUrl: "https://www.youtube.com/embed/0ZJgIjIuY7U",
        videoProvider: "youtube",
        videoId: "0ZJgIjIuY7U",
        pdfUrl: "https://firebasestorage.googleapis.com/v0/b/eduplatform-app.appspot.com/o/react-hooks-guide.pdf?alt=media",
        isPremium: false
      }
    ];

    try {
      await Lesson.deleteMany({ courseId: { $in: [1, 2, 3] } });
      const inserted = await Lesson.insertMany(demoLessons);
      console.log(`✅ ${inserted.length} leçons de démo créées`);
      return inserted;
    } catch (error) {
      console.error('Erreur création données démo:', error);
      throw error;
    }
  }
}

module.exports = LessonService;
const LessonService = require('./services/LessonService');
const lessonService = new LessonService();

async function createLesson() {
  try {
    const newLesson = await lessonService.createLesson({
      courseId: 1,
      sectionId: "section1",
      lessonNumber: 3,
      title: "React Context en pratique",
      description: "Apprenez à utiliser le Context pour gérer l'état global",
      duration: "50min",
      videoUrl: "https://www.youtube.com/embed/abc123XYZ",
      videoProvider: "youtube",
      pdfUrl: "https://firebasestorage.googleapis.com/v0/b/eduplatform-app.appspot.com/o/react-context.pdf?alt=media",
      resources: [
        {
          type: "pdf",
          title: "Guide React Context",
          url: "https://firebasestorage.googleapis.com/v0/b/eduplatform-app.appspot.com/o/react-context.pdf?alt=media",
          description: "PDF complet du cours",
        }
      ],
      isPremium: false
    });

    console.log("Leçon créée ✅ :", newLesson._id);
  } catch (error) {
    console.error("Erreur création leçon ❌ :", error);
  }
}

createLesson();
