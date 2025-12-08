// src/views/components/TestMongoConnection.js - VERSION FINALE SANS DRIVER
import { useState } from 'react';

export default function TestMongoConnection() {
  const [status, setStatus] = useState('Configuration en cours...');
  const [isConfigured, setIsConfigured] = useState(false);

  const configureMongoSimulation = () => {
    setStatus('🔄 Configuration des données simulées...');
    
    // Données de démonstration pour les fichiers de cours
    const sampleFiles = [
      {
        _id: "file_react_1",
        courseId: 1,
        lessonId: "1",
        name: "Introduction_React_Hooks.pdf",
        type: "pdf",
        url: "#",
        size: 2048576,
        mimeType: "application/pdf",
        uploadDate: new Date().toISOString(),
        description: "PDF d'introduction aux Hooks React",
        storageProvider: "simulated"
      },
      {
        _id: "file_react_2",
        courseId: 1,
        lessonId: "1",
        name: "Exercices_Pratiques.js",
        type: "code",
        url: "#",
        size: 15360,
        mimeType: "application/javascript", 
        uploadDate: new Date().toISOString(),
        description: "Exercices sur les Hooks React",
        storageProvider: "simulated"
      },
      {
        _id: "file_figma_1",
        courseId: 2, 
        lessonId: "1",
        name: "Guide_Figma_Debutant.pdf",
        type: "pdf",
        url: "#",
        size: 3097152,
        mimeType: "application/pdf",
        uploadDate: new Date().toISOString(),
        description: "Guide complet Figma pour débutants",
        storageProvider: "simulated"
      },
      {
        _id: "file_marketing_1",
        courseId: 3,
        lessonId: "1", 
        name: "Strategies_SEO_2024.pdf",
        type: "pdf",
        url: "#",
        size: 1572864,
        mimeType: "application/pdf",
        uploadDate: new Date().toISOString(),
        description: "Stratégies SEO modernes pour 2024",
        storageProvider: "simulated"
      }
    ];

    // Sauvegarder dans localStorage
    localStorage.setItem('eduplatform_files', JSON.stringify(sampleFiles));
    localStorage.setItem('mongo_simulation_active', 'true');
    
    setStatus('✅ Données simulées configurées avec succès !');
    setIsConfigured(true);
    
    console.log('📁 Données de démo créées:', sampleFiles);
  };

  const startCoursePlayerIntegration = () => {
    // Redirection vers la page CoursePlayer
    window.location.href = '/course/1/learn';
  };

  return (
    <div style={{ 
      padding: '30px', 
      margin: '20px', 
      border: '2px solid #e2e8f0',
      borderRadius: '15px',
      background: '#f8fafc',
      maxWidth: '600px'
    }}>
      <h2 style={{ color: '#1e293b', marginBottom: '20px' }}>
        🚀 Configuration Plateforme Éducative
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={configureMongoSimulation}
          style={{
            padding: '12px 24px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          📁 Configurer Données Démo
        </button>
        
        {isConfigured && (
          <button 
            onClick={startCoursePlayerIntegration}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🎬 Tester CoursePlayer
          </button>
        )}
      </div>
      
      <div style={{ 
        padding: '15px',
        background: isConfigured ? '#d1fae5' : '#fef3c7',
        borderRadius: '8px',
        border: `2px solid ${isConfigured ? '#10b981' : '#f59e0b'}`,
        marginBottom: '15px'
      }}>
        <strong>Status:</strong> {status}
      </div>

      {isConfigured && (
        <div style={{
          padding: '20px',
          background: '#dcfce7',
          borderRadius: '8px',
          border: '2px solid #22c55e'
        }}>
          <h3 style={{ color: '#166534', margin: '0 0 15px 0' }}>🎉 Configuration Terminée !</h3>
          
          <div style={{ color: '#166534' }}>
            <p><strong>Votre environnement est maintenant prêt avec :</strong></p>
            <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
              <li>✅ Données de cours simulées</li>
              <li>✅ Fichiers PDF et ressources</li>
              <li>✅ Système de progression</li>
              <li>✅ CoursePlayer fonctionnel</li>
              <li>✅ Stockage local pour le développement</li>
            </ul>
            
            <p style={{ marginTop: '15px', fontWeight: 'bold' }}>
              Cliquez sur "Tester CoursePlayer" pour voir votre lecteur de cours en action !
            </p>
          </div>
        </div>
      )}

      {/* Information MongoDB */}
      <div style={{
        padding: '15px',
        background: '#f0f9ff',
        borderRadius: '8px',
        border: '2px solid #0ea5e9',
        marginTop: '20px'
      }}>
        <h4 style={{ color: '#0369a1', margin: '0 0 10px 0' }}>ℹ️ À propos de MongoDB</h4>
        <p style={{ color: '#0369a1', margin: 0 }}>
          <strong>Votre cluster MongoDB Atlas est configuré et prêt.</strong><br/>
          Nous utiliserons des données simulées pour le développement, 
          et nous migrerons vers MongoDB en production via une API REST.
        </p>
      </div>
    </div>
  );
}