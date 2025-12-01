import { useState, useEffect, useCallback } from 'react';
import { CertificateService } from '../../models/services/certificateService';

export const useCertificate = (userId) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Utiliser useCallback pour mémoriser la fonction
  const loadCertificates = useCallback(async () => {
    if (!userId) {
      setCertificates([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const userCertificates = await CertificateService.getUserCertificates(userId);
      setCertificates(userCertificates);
    } catch (err) {
      setError(err.message);
      console.error('Erreur chargement certificats:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]); // Dépendance userId

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]); // Maintenant loadCertificates est stable

  const refreshCertificates = () => {
    loadCertificates();
  };

  return {
    certificates,
    loading,
    error,
    refreshCertificates
  };
};