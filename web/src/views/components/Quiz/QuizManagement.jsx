// src/components/Quiz/QuizManagement.jsx - VERSION CORRIGÉE
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import QuizList from './QuizList';
import QuizBuilder from './QuizBuilder';
import './styles/QuizManagement.css';

const QuizManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list');

  // Navigation unifiée
  const handleNavigation = (tab) => {
    setActiveTab(tab);
    switch(tab) {
      case 'list':
        navigate('/admin/quiz');
        break;
      case 'create':
        navigate('/admin/quiz/create');
        break;
      default:
        navigate('/admin/quiz');
    }
  };

  return (
    <div className="quiz-management">
      <div className="quiz-management-content">
        
        {/* Header unifié */}
        <div className="quiz-management-header">
          <h1>Gestion des Quiz</h1>
          <p>Créez, modifiez et gérez vos quiz en un seul endroit</p>
        </div>

        {/* Navigation simplifiée */}
        <div className="quiz-management-nav">
          <button 
            className={`nav-tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => handleNavigation('list')}
          >
            📋 Liste des Quiz
          </button>
          <button 
            className={`nav-tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => handleNavigation('create')}
          >
            ➕ Créer un Quiz
          </button>
        </div>

        {/* Contenu */}
        <div className="management-content">
          <Routes>
            <Route path="/" element={<QuizList onNavigate={handleNavigation} />} />
            <Route path="/create" element={<QuizBuilder onNavigate={handleNavigation} />} />
            <Route path="/edit/:quizId" element={<QuizBuilder onNavigate={handleNavigation} />} />
            <Route path="*" element={<Navigate to="/admin/quiz" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default QuizManagement;