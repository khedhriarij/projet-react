// src/utils/certificateUtils.js
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const generateProfessionalCertificatePDF = async (certificateData) => {
  return new Promise(async (resolve) => {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Couleurs de la plateforme
    const primaryColor = [59, 130, 246];
    const secondaryColor = [139, 92, 246];
    const accentColor = [16, 185, 129];
    const goldColor = [212, 175, 55]; // Nouvelle couleur or
    const textDark = [31, 41, 55];
    const textLight = [107, 114, 128];
    
    // 🔥 NOUVEAU : Fond premium avec texture
    pdf.setFillColor(255, 253, 245); // Beige très clair élégant
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Bordure décorative OR
    pdf.setDrawColor(...goldColor);
    pdf.setLineWidth(3);
    pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);
    
    // Pattern de fond discret
    pdf.setFillColor(248, 250, 252);
    for (let i = 0; i < pageWidth; i += 40) {
      for (let j = 0; j < pageHeight; j += 40) {
        pdf.circle(i, j, 0.5, 'F');
      }
    }

    // En-tête avec logo
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 35, 'F');
    
    pdf.setFontSize(20);
    pdf.setTextColor(255, 255, 255);
    pdf.text('EDUPLATFORM - CERTIFICATION OFFICIELLE', pageWidth / 2, 22, { align: 'center' });
    
    // Titre principal avec effet premium
    pdf.setFontSize(36);
    pdf.setTextColor(...goldColor);
    pdf.text('CERTIFICAT DE RÉUSSITE', pageWidth / 2, 65, { align: 'center' });
    
    // Sous-titre
    pdf.setFontSize(14);
    pdf.setTextColor(...textLight);
    pdf.text('Décerné avec distinction à', pageWidth / 2, 85, { align: 'center' });
    
    // Nom de l'étudiant avec style élégant
    pdf.setFontSize(32);
    pdf.setTextColor(...textDark);
    const studentName = certificateData.studentName.toUpperCase();
    pdf.text(studentName, pageWidth / 2, 115, { align: 'center' });
    
    // Description du cours
    pdf.setFontSize(16);
    pdf.setTextColor(...textLight);
    pdf.text('a complété avec excellence le cours', pageWidth / 2, 135, { align: 'center' });
    
    // Titre du cours
    pdf.setFontSize(22);
    pdf.setTextColor(...secondaryColor);
    const courseTitle = `"${certificateData.courseTitle}"`;
    pdf.text(courseTitle, pageWidth / 2, 155, { align: 'center' });
    
    // Informations détaillées
    const infoY = 175;
    pdf.setFontSize(12);
    pdf.setTextColor(...textDark);
    
    pdf.text(`Score final: ${certificateData.finalScore}%`, 50, infoY);
    pdf.text(`Date d'émission: ${new Date(certificateData.issueDate).toLocaleDateString('fr-FR')}`, pageWidth - 50, infoY, { align: 'right' });
    
    pdf.text(`Durée: ${certificateData.duration}`, 50, infoY + 15);
    pdf.text(`Niveau: ${certificateData.level}`, pageWidth - 50, infoY + 15, { align: 'right' });
    
    // 🔥 NOUVEAU : QR Code RÉEL pour vérification
    try {
      const verificationUrl = `${window.location.origin}/verify-certificate/${certificateData.certificateId}`;
      const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 120,
        margin: 1,
        color: {
          dark: '#1f2937',
          light: '#FFFFFF'
        }
      });
      
      pdf.addImage(qrDataUrl, 'PNG', pageWidth / 2 - 25, infoY + 25, 50, 50);
      
      pdf.setFontSize(9);
      pdf.setTextColor(...textLight);
      pdf.text('Scannez pour vérifier l\'authenticité', pageWidth / 2, infoY + 80, { align: 'center' });
      
    } catch (error) {
      console.warn('QR Code generation failed, using placeholder');
      pdf.setDrawColor(...textLight);
      pdf.rect(pageWidth / 2 - 25, infoY + 25, 50, 50);
      pdf.text('QR CODE', pageWidth / 2, infoY + 50, { align: 'center' });
    }
    
    // ID du certificat
    pdf.setFontSize(9);
    pdf.setTextColor(...textLight);
    pdf.text(`ID: ${certificateData.certificateId}`, pageWidth / 2, infoY + 95, { align: 'center' });
    
    // Pied de page avec signatures AVEC IMAGES
    const footerY = pageHeight - 50;
    
    // Signature instructeur
    pdf.setDrawColor(...textLight);
    pdf.line(60, footerY, 140, footerY);
    pdf.setFontSize(10);
    pdf.text(certificateData.instructor, 100, footerY + 5, { align: 'center' });
    pdf.setFontSize(8);
    pdf.text('Instructeur Certifié', 100, footerY + 12, { align: 'center' });
    
    // Signature plateforme
    pdf.line(pageWidth - 140, footerY, pageWidth - 60, footerY);
    pdf.setFontSize(10);
    pdf.text('Dr. Sophie Martin', pageWidth - 100, footerY + 5, { align: 'center' });
    pdf.setFontSize(8);
    pdf.text('Directrice Académique EduPlatform', pageWidth - 100, footerY + 12, { align: 'center' });

    // 🔥 NOUVEAU : Tampon officiel
    pdf.setFillColor(255, 0, 0, 0.1); // Rouge transparent
    pdf.setDrawColor(220, 38, 38); // Rouge vif
    pdf.setLineWidth(1);
    pdf.circle(pageWidth / 2, footerY - 40, 25, 'S');
    pdf.setFontSize(12);
    pdf.setTextColor(220, 38, 38);
    pdf.text('OFFICIEL', pageWidth / 2, footerY - 40, { align: 'center' });
    pdf.setFontSize(8);
    pdf.text('EDUPLATFORM', pageWidth / 2, footerY - 30, { align: 'center' });
    
    // Mention légale
    pdf.setFontSize(8);
    pdf.setTextColor(...textLight);
    pdf.text('Ce certificat est délivré électroniquement et peut être vérifié en ligne à tout moment', pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    resolve(pdf.output('blob'));
  });
};