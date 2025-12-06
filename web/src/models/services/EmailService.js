// services/EmailService.js
import { projectFirestore as db } from './firebase/config';

export const EmailService = {
  
  /** 🔹 Envoi email certificat */
  async sendCertificateEmail(userEmail, certificateData, pdfUrl) {
    try {

      const emailPayload = {
        to: userEmail,
        subject: `🎓 Votre certificat est disponible - ${certificateData.courseTitle}`,
        html: this.buildCertificateEmailTemplate(certificateData, pdfUrl),
        sentAt: new Date().toISOString(),
        status: "queued"
      };

      // 🔥 Envoi via Cloud Function (recommandé)
      await fetch("https://us-central1-YOUR-PROJECT.cloudfunctions.net/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload)
      });

      // 🔥 Logging Firestore
      await db.collection("email_logs").add({
        ...emailPayload,
        certificateId: certificateData.certificateId,
        createdAt: new Date()
      });

      return { success: true };

    } catch (error) {
      console.error("❌ Erreur Email:", error);
      return { success: false };
    }
  },

  /** 🔹 Template HTML */
  buildCertificateEmailTemplate(data, downloadUrl) {
    return `
      <div style="padding:20px; font-family:Arial; background:#f5f7fa">
        <h2 style="color:#1a73e8;">🎉 Félicitations ${data.studentName} !</h2>
        <p>Vous venez d'obtenir votre certificat pour :</p>

        <h3 style="color:#000">${data.courseTitle}</h3>

        <p><b>Score final :</b> ${data.finalScore}%</p>
        <p><b>Date d'émission :</b> ${new Date().toLocaleDateString()}</p>

        <br/>

        <a href="${downloadUrl}" style="
          background:#1a73e8;
          padding:12px 20px;
          color:white;
          text-decoration:none;
          border-radius:8px;
          font-weight:bold;
        ">📄 Télécharger le certificat</a>

        <br/><br/>

        <p>Vous pouvez vérifier l'authenticité du certificat ici :</p>

        <a href="${data.verificationUrl}">
          ${data.verificationUrl}
        </a>

        <br/><br/>
        <p style="font-size:12px; color:#888;">Email automatique généré par EduPlatform.</p>
      </div>
    `;
  }
};
