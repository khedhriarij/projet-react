// src/pages/dashboard/AdminDashboard.js
import React from 'react';
//import { Link } from 'react-router-dom';
import { useAdminDashboard } from './hooks/useAdminDashboard';
import CourseModal from './components/CourseModal';
import CoursesTab from './components/CoursesTab';
import OverviewTab from './components/OverviewTab';
import UsersTab from './components/UsersTab';
import PaymentsTab from './components/PaymentsTab';
import QuizTab from './components/QuizTab'; // Nouveau composant pour les quiz
import './admindashboard.css';

const AdminDashboard = () => {
  const {
    user,
    isAdmin,
    courses,
    activeTab,
    setActiveTab,
    showNewCourseForm,
    newCourse,
    defaultImages,
    handleInputChange,
    handleImageUrlChange,
    handleSelectDefaultImage,
    handleSubmitCourse,
    handleDeleteCourse,
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
        return <OverviewTab courses={courses} />;
      case 'courses':
        return (
          <CoursesTab 
            courses={courses}
            onNewCourse={handleNewCourseClick}
            onDeleteCourse={handleDeleteCourse}
          />
        );
      case 'quizzes': // Nouvel onglet pour les quiz
        return <QuizTab />;
      case 'users':
        return <UsersTab />;
      case 'payments':
        return <PaymentsTab />;
      default:
        return <OverviewTab courses={courses} />;
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