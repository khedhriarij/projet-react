import React, { useState, useEffect } from 'react';
import { CertificateService } from '../../../../models/services/certificateService';
import './AdminCertificateManager.css';

const AdminCertificateManager = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await CertificateService.getAllCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des certificats');
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter(cert =>
    searchTerm === '' ||
    cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewCertificate = (url) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="admin-certificate-manager">
      <div className="page-header">
        <h1>📊 Gestion des Certificats</h1>
        <p>Administrez tous les certificats de la plateforme</p>
      </div>

      <div className="control-bar">
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par étudiant, cours ou ID..."
          className="search-input"
        />
        <button onClick={loadCertificates} className="btn btn-primary" disabled={loading}>
          {loading ? 'Chargement...' : 'Actualiser'}
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement des certificats...</p>
        </div>
      )}

      <div className="certificates-list">
        {filteredCertificates.map(cert => (
          <div key={cert.id} className="certificate-item">
            <div className="certificate-header">
              <h3>{cert.studentName}</h3>
              <span className="score-badge">{cert.finalScore}%</span>
            </div>
            <p className="course-title">{cert.courseTitle}</p>
            <div className="certificate-meta">
              <span className="certificate-id">ID: {cert.certificateId}</span>
              <span className="certificate-date">
                {new Date(cert.createdAt?.toDate?.() || cert.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className="certificate-actions">
              <button 
                onClick={() => viewCertificate(cert.downloadUrl)}
                className="btn btn-view"
                disabled={!cert.downloadUrl}
              >
                👁️ Voir
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredCertificates.length === 0 && (
        <div className="empty-state">
          <p>Aucun certificat trouvé</p>
        </div>
      )}
    </div>
  );
};

export default AdminCertificateManager;