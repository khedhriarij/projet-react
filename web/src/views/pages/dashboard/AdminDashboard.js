// src/pages/dashboard/AdminDashboard.js
import React from 'react';
import { useAdminDashboard } from './hooks/useAdminDashboard';
import CourseModal from './components/CourseModal';
import CoursesTab from './components/CoursesTab';
import OverviewTab from './components/OverviewTab';
import UsersTab from './components/UsersTab';
import PaymentsTab from './components/PaymentsTab';
import QuizTab from './components/QuizTab';

import './admindashboard.css';

const AdminDashboard = () => {
  const {
    user,
    isAdmin,
    courses,
    quizzes, // Ajout des quizzes
    activeTab,
    setActiveTab,
    showNewCourseForm,
    newCourse,
    defaultImages,
    lastUpdated, // Ajout de lastUpdated
    handleInputChange,
    handleImageUrlChange,
    handleSelectDefaultImage,
    handleSubmitCourse,
    handleDeleteCourse,
    handleUpdateCourse, // Ajout de la fonction de mise à jour
    handleUpdateQuiz, // Ajout de la fonction de mise à jour des quiz
    handleNewCourseClick,
    handleCloseModal
  } = useAdminDashboard();

  if (!isAdmin) {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>Welcome</h2>
          <p>Chère admin</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            courses={courses} 
            quizzes={quizzes}
            lastUpdated={lastUpdated}
          />
        );
      case 'courses':
        return (
          <CoursesTab 
            courses={courses}
            onNewCourse={handleNewCourseClick}
            onDeleteCourse={handleDeleteCourse}
            onUpdateCourse={handleUpdateCourse} // Passage de la fonction de mise à jour
          />
        );
      case 'quizzes':
        return (
          <QuizTab 
            quizzes={quizzes}
            onUpdateQuiz={handleUpdateQuiz} // Passage de la fonction de mise à jour
          />
        );
      case 'users':
        return <UsersTab />;
      case 'payments':
        return <PaymentsTab />;
      default:
        return (
          <OverviewTab 
            courses={courses} 
            quizzes={quizzes}
            lastUpdated={lastUpdated}
          />
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-layout">
        {/* Navigation Sidebar */}
        <nav className="admin-sidebar">
          <div className="sidebar-header">
            <h2>EduPlatform Admin</h2>
            <p>Tableau de Bord</p>
            {/* Affichage de la dernière mise à jour dans la sidebar */}
            {lastUpdated && (
              <div className="last-updated-sidebar">
                <small>Dernière mise à jour: {new Date(lastUpdated).toLocaleTimeString('fr-FR')}</small>
              </div>
            )}
          </div>
          
          <div className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-label">Vue d'ensemble</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <span className="nav-icon">📚</span>
              <span className="nav-label">Gestion des Cours</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'quizzes' ? 'active' : ''}`}
              onClick={() => setActiveTab('quizzes')}
            >
              <span className="nav-icon">📝</span>
              <span className="nav-label">Gestion des Quiz</span>
            </button>

            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-label">Utilisateurs</span>
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <span className="nav-icon">💳</span>
              <span className="nav-label">Paiements</span>
            </button>
          </div>
        </nav>

        {/* Contenu Principal */}
        <main className="admin-main">
          <header className="admin-header">
            <div className="header-title">
              <h1>
                {activeTab === 'overview' && 'Vue d\'Ensemble'}
                {activeTab === 'courses' && 'Gestion des Cours'}
                {activeTab === 'users' && 'Gestion des Utilisateurs'}
                {activeTab === 'payments' && 'Gestion des Paiements'}
                {activeTab === 'quizzes' && 'Gestion des Quiz'}
              </h1>
              <p>Bienvenue, {user && user.displayName ? user.displayName : 'Administrateur'} 👋</p>
            </div>
            
            {/* Indicateur de dernière mise à jour dans le header */}
            {lastUpdated && (
              <div className="last-updated-header">
                <span className="update-indicator">🔄</span>
                <span>Mis à jour: {new Date(lastUpdated).toLocaleString('fr-FR')}</span>
              </div>
            )}
          </header>

          <div className="admin-content">
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* Modal de création de cours */}
      {showNewCourseForm && (
        <CourseModal 
          newCourse={newCourse}
          defaultImages={defaultImages}
          onInputChange={handleInputChange}
          onImageUrlChange={handleImageUrlChange}
          onSelectDefaultImage={handleSelectDefaultImage}
          onSubmitCourse={handleSubmitCourse}
          onCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AdminDashboard;