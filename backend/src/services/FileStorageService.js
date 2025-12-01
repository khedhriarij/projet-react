const File = require('../models/File');

class FileStorageService {
  async storeFileMetadata(fileData) {
    try {
      const file = new File(fileData);
      const savedFile = await file.save();
      console.log('📁 Fichier stocké dans MongoDB:', savedFile._id);
      return savedFile;
    } catch (error) {
      console.error('Erreur stockage métadonnées:', error);
      throw error;
    }
  }

  async getCourseFiles(courseId) {
    try {
      const files = await File.find({ courseId: parseInt(courseId) })
        .sort({ uploadDate: -1 });
      console.log(`📂 ${files.length} fichiers trouvés pour le cours ${courseId}`);
      return files;
    } catch (error) {
      console.error('Erreur récupération fichiers:', error);
      return [];
    }
  }

  async getFileById(fileId) {
    try {
      return await File.findById(fileId);
    } catch (error) {
      console.error('Erreur récupération fichier:', error);
      return null;
    }
  }

  async deleteFile(fileId) {
    try {
      await File.findByIdAndDelete(fileId);
      console.log('🗑️ Fichier supprimé:', fileId);
      return true;
    } catch (error) {
      console.error('Erreur suppression fichier:', error);
      return false;
    }
  }
}

module.exports = FileStorageService;