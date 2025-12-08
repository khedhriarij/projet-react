import React from 'react';
import { useCertificate } from '../../../viewmodels/hooks/useCertificate';
import './CertificateList.css';

const CertificateList = ({ userId }) => {
  const { certificates, loading, error } = useCertificate(userId);

  if (loading) return <div className="loading">Chargement des certificats...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="certificate-list">
      <h2>Mes Certificats ({certificates.length})</h2>
      
      {certificates.length === 0 ? (
        <div className="empty-state">
          <p>Aucun certificat généré pour le moment</p>
          <span>Complétez vos cours pour obtenir des certificats !</span>
        </div>
      ) : (
        <div className="certificates-grid">
          {certificates.map(certificate => (
            <div key={certificate.id} className="certificate-card">
              <div className="card-header">
                <h3>{certificate.courseTitle}</h3>
                <span className="score">{certificate.finalScore}%</span>
              </div>
              
              <div className="card-body">
                <p>Décerné à: <strong>{certificate.studentName}</strong></p>
                <p>Date: {new Date(certificate.issueDate).toLocaleDateString('fr-FR')}</p>
                <p className="certificate-id">ID: {certificate.certificateId}</p>
              </div>
              
              <div className="card-actions">
                <button 
                  className="btn-download"
                  onClick={() => window.open(certificate.downloadUrl, '_blank')}
                >
                  📄 Télécharger PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificateList;