import { projectFirestore as db, projectStorage, timestamp } from './firebase/config';
import { generateProfessionalCertificatePDF, downloadPDF } from '../../Utils/certificateUtils';
import { EmailService } from './EmailService';
export const CertificateService = {
  async createCertificate(certificateData) {
  try {
    const certificateRef = db.collection('certificates').doc();
    const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const certificateWithId = {
      ...certificateData,
      id: certificateRef.id,
      certificateId: certificateId,
      createdAt: timestamp.now(),
      updatedAt: timestamp.now(),
      status: 'issued',
      verified: false,
      verificationCount: 0
    };
    
    // Sauvegarder d'abord dans Firestore
    await certificateRef.set(certificateWithId);
    
    // Générer le PDF dynamiquement AVEC QR Code
    console.log('📄 Génération du PDF premium en cours...');
    const pdfBlob = await generateProfessionalCertificatePDF(certificateWithId);
    
    // Uploader le PDF vers Firebase Storage
    console.log('☁️ Upload du PDF vers Firebase Storage...');
    const downloadUrl = await this.uploadCertificatePDF(pdfBlob, certificateId);
    
    // Mettre à jour le document avec l'URL du PDF
    await certificateRef.update({
      downloadUrl: downloadUrl,
      pdfGeneratedAt: timestamp.now(),
      fileSize: pdfBlob.size,
      lastAccessedAt: timestamp.now()
    });

    //  NOUVEAU : Envoyer l'email automatiquement
    console.log(' Envoi de l\'email de notification...');
    await EmailService.sendWelcomeCertificate(certificateData.userId, certificateWithId, downloadUrl);
    
    console.log(' Certificat créé avec succès!');
    console.log(' URL de téléchargement:', downloadUrl);
    console.log(' URL de vérification:', `${window.location.origin}/verify-certificate/${certificateId}`);
    
    return { 
      ...certificateWithId, 
      downloadUrl,
      success: true,
      emailSent: true
    };
  } catch (error) {
    console.error(' Erreur création certificat:', error);
    throw new Error(`Erreur création certificat: ${error.message}`);
  }
},
  async uploadCertificatePDF(pdfBlob, certificateId) {
    try {
      const storageRef = projectStorage.ref(`certificates/${certificateId}.pdf`);
      const snapshot = await storageRef.put(pdfBlob, {
        customMetadata: {
          'generatedAt': new Date().toISOString(),
          'type': 'certificate',
          'certificateId': certificateId
        }
      });
      const downloadUrl = await snapshot.ref.getDownloadURL();
      return downloadUrl;
    } catch (error) {
      console.error(' Erreur upload PDF:', error);
      throw new Error(`Erreur upload PDF: ${error.message}`);
    }
  },

  async generateCertificateForCompletedCourse(userId, courseData, userProgress = {}) {
    try {
      // Vérifier si le certificat existe déjà
      const exists = await this.checkCertificateExists(userId, courseData.id);
      if (exists) {
        throw new Error('Certificat déjà généré pour ce cours');
      }

      // Vérifier l'éligibilité (progression à 100%)
      if (userProgress.completionRate < 100) {
        throw new Error('Le cours doit être complété à 100% pour générer un certificat');
      }

      const certificateData = {
        userId: userId,
        courseId: courseData.id,
        courseTitle: courseData.title,
        studentName: userProgress.userName || 'Étudiant',
        instructor: courseData.instructor || 'Platform Instructor',
        issueDate: new Date().toISOString(),
        finalScore: userProgress.finalScore || courseData.finalScore || 100,
        completionDate: new Date().toISOString(),
        duration: courseData.duration || 'Non spécifié',
        level: courseData.level || 'Tous niveaux',
        category: courseData.category,
        platformName: 'EduPlatform',
        verificationUrl: `${window.location.origin}/verify-certificate`
      };

      return await this.createCertificate(certificateData);
    } catch (error) {
      console.error('❌ Erreur génération certificat:', error);
      throw new Error(`Erreur génération certificat: ${error.message}`);
    }
  },

  async createCertificate(certificateData) {
  try {
    const certificateRef = db.collection('certificates').doc();
    const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const certificateWithId = {
      ...certificateData,
      id: certificateRef.id,
      certificateId: certificateId,
      createdAt: timestamp.now(),
      updatedAt: timestamp.now(),
      status: 'issued',
      verified: false,
      verificationCount: 0
    };
    
    await certificateRef.set(certificateWithId);
    
    const pdfBlob = await generateProfessionalCertificatePDF(certificateWithId);
    const downloadUrl = await this.uploadCertificatePDF(pdfBlob, certificateId);
    
    await certificateRef.update({
      downloadUrl: downloadUrl,
      pdfGeneratedAt: timestamp.now(),
      fileSize: pdfBlob.size,
      lastAccessedAt: timestamp.now()
    });

    // 🔥 ENVOI DE L'EMAIL - Version simplifiée
    console.log('Envoi de la notification...');
    const emailResult = await EmailService.sendWelcomeCertificate(
      certificateData.userId, 
      certificateWithId, 
      downloadUrl
    );
    
    console.log('Certificat cree avec succes');
    
    return { 
      ...certificateWithId, 
      downloadUrl,
      notificationSent: emailResult.success,
      success: true 
    };
  } catch (error) {
    console.error('Erreur creation certificat:', error);
    throw new Error(`Erreur creation certificat: ${error.message}`);
  }
},

  async checkCertificateExists(userId, courseId) {
    try {
      const querySnapshot = await db.collection('certificates')
        .where('userId', '==', userId)
        .where('courseId', '==', courseId)
        .limit(1)
        .get();
      
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Erreur vérification certificat:', error);
      return false;
    }
  },

  async verifyCertificate(certificateId) {
    try {
      console.log(' Recherche du certificat:', certificateId);
      
      const querySnapshot = await db.collection('certificates')
        .where('certificateId', '==', certificateId)
        .limit(1)
        .get();
      
      console.log(' Résultats:', querySnapshot.size, 'certificat(s) trouvé(s)');
      
      if (querySnapshot.empty) {
        return { 
          isValid: false, 
          message: 'Certificat non trouvé ou invalide' 
        };
      }
      
      const certificateDoc = querySnapshot.docs[0];
      const certificate = certificateDoc.data();
      
      // Mettre à jour le compteur de vérifications
      await certificateDoc.ref.update({
        verified: true,
        lastVerifiedAt: timestamp.now(),
        verificationCount: (certificate.verificationCount || 0) + 1
      });
      
      return {
        isValid: true,
        certificate: {
          ...certificate,
          id: certificateDoc.id
        },
        message: ' Certificat valide et authentique'
      };
    } catch (error) {
      console.error(' Erreur vérification:', error);
      return { 
        isValid: false, 
        message: 'Erreur lors de la vérification du certificat' 
      };
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
        ...doc.data(),
        formattedDate: new Date(doc.data().createdAt?.toDate()).toLocaleDateString('fr-FR')
      }));
    } catch (error) {
      throw new Error(`Erreur récupération certificats: ${error.message}`);
    }
  },

  async getAllCertificates(limit = 50) {
    try {
      const querySnapshot = await db.collection('certificates')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Erreur récupération tous certificats: ${error.message}`);
    }
  }
};