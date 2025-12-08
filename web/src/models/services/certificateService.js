// services/CertificateService.js
import { projectFirestore as db, projectStorage, timestamp } from './firebase/config';
import { generateProfessionalCertificatePDF } from '../../Utils/certificateUtils';
import { EmailService } from './EmailService';

export const CertificateService = {
  
  /** 🔹 Générer certificateId unique */
  generateUniqueCertificateId() {
    return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
  },

  /** 🔹 Upload PDF vers Storage */
  async uploadCertificatePDF(pdfBlob, certificateId) {
    try {
      const storageRef = projectStorage.ref(`certificates/${certificateId}.pdf`);

      const snapshot = await storageRef.put(pdfBlob, {
        customMetadata: {
          createdAt: new Date().toISOString(),
          certificateId: certificateId,
          type: "course-certificate"
        }
      });

      return await snapshot.ref.getDownloadURL();

    } catch (error) {
      console.error("❌ Erreur upload PDF :", error);
      throw new Error(error.message);
    }
  },

  /** 🔹 Vérifier si certificat existe déjà */
  async checkCertificateExists(userId, courseId) {
    const query = await db.collection("certificates")
      .where("userId", "==", userId)
      .where("courseId", "==", courseId)
      .limit(1)
      .get();

    return !query.empty;
  },

  /** 🔹 Création complète du certificat */
  async createCertificate(certificateData) {
    try {
      const certificateRef = db.collection("certificates").doc();
      const certificateId = this.generateUniqueCertificateId();

      const finalCertificate = {
        ...certificateData,
        id: certificateRef.id,
        certificateId: certificateId,
        status: "issued",
        verified: false,
        verificationCount: 0,
        createdAt: timestamp.now(),
        updatedAt: timestamp.now(),
        verificationUrl: `${window.location.origin}/verify-certificate/${certificateId}`
      };

      // 🔥 Sauvegarde Firestore
      await certificateRef.set(finalCertificate);

      // 🔥 Génération PDF professionnelle
      const pdfBlob = await generateProfessionalCertificatePDF(finalCertificate);

      // 🔥 Upload Storage
      const downloadUrl = await this.uploadCertificatePDF(pdfBlob, certificateId);

      await certificateRef.update({
        downloadUrl,
        pdfGeneratedAt: timestamp.now(),
        fileSize: pdfBlob.size
      });

      // 🔥 Envoi email
      await EmailService.sendCertificateEmail(
        finalCertificate.userEmail,
        finalCertificate,
        downloadUrl
      );

      return {
        success: true,
        ...finalCertificate,
        downloadUrl
      };

    } catch (error) {
      console.error("❌ Erreur createCertificate:", error);
      throw new Error(error.message);
    }
  },

  /** 🔹 Vérifier certificat */
  async verifyCertificate(certificateId) {
    const query = await db.collection("certificates")
      .where("certificateId", "==", certificateId)
      .limit(1)
      .get();

    if (query.empty) return { isValid: false };

    const doc = query.docs[0];
    const data = doc.data();

    await doc.ref.update({
      verified: true,
      lastVerifiedAt: timestamp.now(),
      verificationCount: (data.verificationCount || 0) + 1
    });

    return {
      isValid: true,
      certificate: data
    };
  },

  /** 🔹 Tous certificats d'un utilisateur */
  async getUserCertificates(userId) {
    const snapshot = await db.collection("certificates")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(doc => doc.data());
  }
};
