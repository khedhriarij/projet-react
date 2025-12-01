import { projectFirestore as db, timestamp } from './firebase/config';

export const CertificateService = {
  async createCertificate(certificateData) {
    try {
      const certificateRef = db.collection('certificates').doc();
      const certificateWithId = {
        ...certificateData,
        id: certificateRef.id,
        createdAt: timestamp.now(),
        updatedAt: timestamp.now()
      };
      
      await certificateRef.set(certificateWithId);
      return certificateWithId;
    } catch (error) {
      throw new Error(`Erreur création certificat: ${error.message}`);
    }
  },

  async getUserCertificates(userId) {
    try {
      const querySnapshot = await db.collection('certificates')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Erreur récupération certificats: ${error.message}`);
    }
  },

  async checkCertificateExists(userId, courseId) {
    try {
      const querySnapshot = await db.collection('certificates')
        .where('userId', '==', userId)
        .where('courseId', '==', courseId)
        .get();
      
      return !querySnapshot.empty;
    } catch (error) {
      return false;
    }
  }
};