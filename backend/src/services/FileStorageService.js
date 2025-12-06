// backend/services/StorageService.js
const admin = require('../config/firebase');
const bucket = admin.storage().bucket();

class StorageService {
  async uploadFile(file, destination) {
    try {
      const blob = bucket.file(destination);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      });
      
      return new Promise((resolve, reject) => {
        blobStream.on('error', reject);
        blobStream.on('finish', async () => {
          // Rendre le fichier public
          await blob.makePublic();
          
          // Générer URL signée (optionnel)
          const [signedUrl] = await blob.getSignedUrl({
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 jours
          });
          
          resolve({
            url: `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
            signedUrl,
            contentType: file.mimetype,
            size: file.size
          });
        });
        
        blobStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Erreur upload:', error);
      throw error;
    }
  }
  
  async deleteFile(fileUrl) {
    try {
      const fileName = fileUrl.split('/').pop();
      await bucket.file(fileName).delete();
      return true;
    } catch (error) {
      console.error('Erreur suppression:', error);
      throw error;
    }
  }
  
  async generateSignedUrl(filePath, expiresInHours = 24) {
    try {
      const file = bucket.file(filePath);
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresInHours * 60 * 60 * 1000
      });
      
      return signedUrl;
    } catch (error) {
      console.error('Erreur génération URL signée:', error);
      throw error;
    }
  }
}

module.exports = StorageService;