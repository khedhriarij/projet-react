import React from 'react';
import { useAuthContext } from '../../../viewmodels/hooks/useAuthContext'; // ✅ CORRECTION
import CertificateList from '../../components/Certificate/CertificateList';
import './CertificatePage.css';

const CertificatePage = () => {
  const { user } = useAuthContext(); // ✅ CORRECTION

  return (
    <div className="certificate-page">
      <div className="page-header">
        <h1>🎓 Mes Certifications</h1>
        <p>Consultez et téléchargez tous vos certificats obtenus</p>
      </div>

      <div className="certificate-content">
        {user ? (
          <CertificateList userId={user.uid} />
        ) : (
          <div className="login-prompt">
            <p>Veuillez vous connecter pour voir vos certificats</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificatePage;