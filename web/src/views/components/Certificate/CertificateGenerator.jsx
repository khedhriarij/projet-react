import React, { useState } from 'react';
import { CertificateService } from '../../../models/services/certificateService'; // ✅ Correction du chemin
import { generateProfessionalCertificatePDF, downloadPDF } from '../../Utils/certificateUtils'; // ✅ Correction du nom de fonction
import './CertificateGenerator.css';

const CertificateGenerator = ({ userId, courseId, courseTitle, finalScore }) => {
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateCertificate = async () => {
    if (!studentName.trim()) {
      alert('Veuillez entrer votre nom');
      return;
    }

    setLoading(true);
    try {
      const certificateData = {
        userId,
        courseId,
        studentName: studentName.trim(),
        courseTitle,
        finalScore,
        issueDate: new Date().toISOString(),
        completionDate: new Date().toISOString(),
        duration: 'Non spécifié', // Ajoutez ces champs requis
        level: 'Tous niveaux',
        category: 'Général',
        instructor: 'Instructeur Platform',
        platformName: 'EduPlatform'
      };

      // Utilisez la méthode du service qui génère automatiquement le PDF
      const result = await CertificateService.createCertificate(certificateData);
      
      // Télécharger le PDF généré
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      }
      
      alert('✅ Certificat généré avec succès!');
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la génération: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="certificate-generator">
      <h3>🎓 Obtenir votre certificat</h3>
      <input
        type="text"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        placeholder="Votre nom pour le certificat"
        className="certificate-input"
      />
      <button 
        onClick={handleGenerateCertificate}
        disabled={loading || !studentName.trim()}
        className="generate-btn"
      >
        {loading ? '🔄 Génération...' : '📄 Générer le certificat'}
      </button>
    </div>
  );
};

export default CertificateGenerator;