import React, { useState } from 'react';
import { EmailService } from '../models/services/EmailService';
import './TestEmailNotification.css';

const TestEmailNotification = () => {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const testEmail = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const testData = {
        studentName: 'Jean Dupont',
        courseTitle: 'React.js Avancé - Test de Notification',
        finalScore: 95,
        certificateUrl: 'https://example.com/certificate-test.pdf',
        verificationUrl: `${window.location.origin}/verify-certificate/TEST-123`,
        certificateId: 'TEST-123',
        platformName: 'EduPlatform'
      };

      const result = await EmailService.sendCertificateEmail(
        'test@example.com',
        testData,
        testData.certificateUrl
      );

      setTestResult({
        success: result.success,
        message: result.message || result.error
      });

    } catch (error) {
      console.error('Erreur test email:', error);
      setTestResult({
        success: false,
        message: 'Erreur lors du test: ' + error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="test-email-container">
      <div className="test-email-card">
        <h3 className="test-email-title">Test des Notifications Email</h3>
        
        <div className="test-email-description">
          <p>Cette fonctionnalité simule l'envoi d'une notification de certificat.</p>
          <p>Les données sont enregistrées dans Firestore pour tracking.</p>
        </div>

        <div className="test-email-actions">
          <button 
            onClick={testEmail}
            disabled={loading}
            className={`test-email-btn ${loading ? 'loading' : ''}`}
          >
            {loading ? 'Test en cours...' : 'Tester la Notification'}
          </button>
        </div>

        {testResult && (
          <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
            <div className="result-icon">
              {testResult.success ? '✅' : '❌'}
            </div>
            <div className="result-message">
              <strong>{testResult.success ? 'Succès' : 'Erreur'}:</strong>
              <span>{testResult.message}</span>
            </div>
          </div>
        )}

        <div className="test-email-info">
          <h4>Ce qui se passe lors du test :</h4>
          <ul>
            <li>Enregistrement des données dans Firestore</li>
            <li>Affichage des détails dans la console</li>
            <li>Simulation d'envoi d'email</li>
            <li>Tracking de la notification</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestEmailNotification;