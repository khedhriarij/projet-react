// src/models/services/EmailService.js
import { projectFirestore as db } from './firebase/config';

export const EmailService = {
  async sendCertificateEmail(userEmail, certificateData, pdfUrl) {
    try {
      // Stocker les données d'email dans Firestore pour tracking
      const emailRecord = {
        to: userEmail,
        studentName: certificateData.studentName,
        courseTitle: certificateData.courseTitle,
        finalScore: certificateData.finalScore,
        certificateUrl: pdfUrl,
        verificationUrl: `${window.location.origin}/verify-certificate/${certificateData.certificateId}`,
        status: 'pending',
        createdAt: new Date()
      };

      // Sauvegarder dans Firestore pour historique
      await db.collection('emailNotifications').add(emailRecord);
      
      console.log('Notification enregistree pour:', userEmail);
      
      // Pour l'instant, on log juste l'email (à remplacer par un vrai service d'email plus tard)
      this.logEmailPreview(emailRecord);
      
      return { 
        success: true, 
        message: 'Notification de certificat enregistree' 
      };
      
    } catch (error) {
      console.error('Erreur enregistrement email:', error);
      return { 
        success: false, 
        error: 'Echec de l\'enregistrement de la notification' 
      };
    }
  },

  // Méthode pour logger les détails de l'email (développement)
  logEmailPreview(emailData) {
    console.log('=== EMAIL PRET A ETRE ENVOYE ===');
    console.log('A:', emailData.to);
    console.log('Sujet: Votre certificat "' + emailData.courseTitle + '" est pret');
    console.log('Certificat:', emailData.certificateUrl);
    console.log('Verification:', emailData.verificationUrl);
    console.log('==============================');
  },

  async sendWelcomeCertificate(userId, certificateData, pdfUrl) {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        console.warn('Utilisateur non trouve pour envoi email');
        return { success: false, error: 'Utilisateur non trouve' };
      }
      
      const userData = userDoc.data();
      const userEmail = userData.email;
      
      if (!userEmail) {
        console.warn('Email utilisateur non disponible');
        return { success: false, error: 'Email non disponible' };
      }

      console.log('Envoi notification certificat a:', userEmail);
      return await this.sendCertificateEmail(userEmail, certificateData, pdfUrl);
      
    } catch (error) {
      console.error('Erreur envoi notification:', error);
      return { 
        success: false, 
        error: `Erreur notification: ${error.message}` 
      };
    }
  },

  // Méthode pour récupérer l'historique des emails
  async getEmailHistory(userId) {
    try {
      const querySnapshot = await db.collection('emailNotifications')
        .where('to', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur recuperation historique emails:', error);
      return [];
    }
  }
};