// backend/scripts/seedLessons.js - SCRIPT DE PEUPLEMENT
const mongoose = require('mongoose');
const LessonService = require('../services/LessonService');
require('dotenv').config();

const lessonService = new LessonService();

async function seedDatabase() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Générer les données de démonstration
    const lessons = await lessonService.generateDemoLessons();
    
    console.log(`🎉 ${lessons.length} leçons créées avec succès !`);
    console.log('📊 Exemple de leçon créée:');
    console.log(lessons[0]);

    mongoose.disconnect();
    console.log('🔌 Déconnexion de MongoDB');
    
  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    process.exit(1);
  }
}

seedDatabase();