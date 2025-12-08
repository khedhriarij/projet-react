import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CertificateService } from '../../../models/services/certificateService';
import './PublicCertificateVerification.css';

const PublicCertificateVerification = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyCertificate = async () => {
      if (!certificateId) {
        setVerificationResult({
          isValid: false,
          message: 'ID de certificat manquant dans l\'URL'
        });
        setLoading(false);
        return;
      }

      try {
        const result = await CertificateService.verifyCertificate(certificateId);
        setVerificationResult(result);
      } catch (error) {
        console.error('Erreur vérification:', error);
        setVerificationResult({
          isValid: false,
          message: 'Erreur lors de la vérification du certificat'
        });
      } finally {
        setLoading(false);
      }
    };

    verifyCertificate();
  }, [certificateId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const downloadCertificate = (downloadUrl) => {
    window.open(downloadUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="public-verification-container">
        <div className="verification-loading">
          <div className="spinner"></div>
          <p>Vérification du certificat en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-verification-container">
      <div className="verification-card">
        <div className={`verification-header ${verificationResult?.isValid ? 'valid' : 'invalid'}`}>
          <div className="status-icon">
            {verificationResult?.isValid ? '✅' : '❌'}
          </div>
          <h1 className="status-title">
            {verificationResult?.isValid ? 'Certificat Valide' : 'Certificat Invalide'}
          </h1>
        </div>

        <div className="verification-body">
          <p className="verification-message">{verificationResult?.message}</p>
          
          {verificationResult?.isValid && verificationResult.certificate && (
            <div className="certificate-details">
              <h3>Détails du Certificat</h3>
              
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Étudiant:</span>
                  <span className="value">{verificationResult.certificate.studentName}</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">Cours:</span>
                  <span className="value">{verificationResult.certificate.courseTitle}</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">Score final:</span>
                  <span className="value score">{verificationResult.certificate.finalScore}%</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">Date d'émission:</span>
                  <span className="value">
                    {formatDate(verificationResult.certificate.issueDate)}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="label">ID du certificat:</span>
                  <span className="value certificate-id">
                    {verificationResult.certificate.certificateId}
                  </span>
                </div>
              </div>

              {verificationResult.certificate.downloadUrl && (
                <div className="certificate-actions">
                  <button 
                    onClick={() => downloadCertificate(verificationResult.certificate.downloadUrl)}
                    className="btn-download"
                  >
                    📄 Télécharger le certificat
                  </button>
                </div>
              )}
            </div>
          )}

          {!verificationResult?.isValid && (
            <div className="error-guidance">
              <p>Si vous pensez qu'il s'agit d'une erreur, veuillez :</p>
              <ul>
                <li>Vérifier l'ID du certificat</li>
                <li>Contacter le support technique</li>
                <li>Vérifier auprès de votre instructeur</li>
              </ul>
            </div>
          )}
        </div>

        <div className="verification-footer">
          <p className="verification-info">
            <small>
              Vérifié le {new Date().toLocaleDateString('fr-FR')} via <strong>EduPlatform</strong>
            </small>
          </p>
          <button onClick={() => navigate('/')} className="home-link">
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicCertificateVerification;