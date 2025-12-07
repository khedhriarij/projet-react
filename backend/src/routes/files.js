const express = require('express');
const router = express.Router();
const FileStorageService = require('../services/FileStorageService');

const fileStorageService = new FileStorageService();

// GET /api/files/courses/:courseId - Fichiers d'un cours
router.get('/courses/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log(`📥 Requête fichiers pour le cours: ${courseId}`);
    
    const files = await fileStorageService.getCourseFiles(courseId);
    
    res.json({ 
      success: true, 
      data: files,
      count: files.length 
    });
  } catch (error) {
    console.error('❌ Erreur route fichiers:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST /api/files - Ajouter un fichier
router.post('/', async (req, res) => {
  try {
    const fileData = req.body;
    console.log('📁 Ajout fichier:', fileData.name);
    
    const savedFile = await fileStorageService.storeFileMetadata(fileData);
    
    res.json({ 
      success: true, 
      data: savedFile,
      message: 'Fichier ajouté avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur ajout fichier:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/files/:fileId - Récupérer un fichier spécifique
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await fileStorageService.getFileById(fileId);
    
    if (!file) {
      return res.status(404).json({ 
        success: false, 
        error: 'Fichier non trouvé' 
      });
    }
    
    res.json({ 
      success: true, 
      data: file 
    });
  } catch (error) {
    console.error('❌ Erreur récupération fichier:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;