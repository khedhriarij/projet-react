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
    quizzes,
    users,
    payments,
    activeTab,
    setActiveTab,
    showNewCourseForm,
    newCourse,
    defaultImages,
    lastUpdated,
    isLoading,
    stats,
    handleInputChange,
    handleImageUrlChange,
    handleSelectDefaultImage,
    handleSubmitCourse,
    handleDeleteCourse,
    handleUpdateCourse,
    handleUpdateQuiz,
    handleNewCourseClick,
    handleCloseModal,
    refreshData
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
            users={users}
            payments={payments}
            lastUpdated={lastUpdated}
            stats={stats}
            isLoading={isLoading}
            onRefresh={refreshData}
          />
        );
      case 'courses':
        return (
          <CoursesTab 
            courses={courses}
            onNewCourse={handleNewCourseClick}
            onDeleteCourse={handleDeleteCourse}
            onUpdateCourse={handleUpdateCourse}
            isLoading={isLoading}
          />
        );
      case 'quizzes':
        return (
          <QuizTab 
            quizzes={quizzes}
            onUpdateQuiz={handleUpdateQuiz}
            isLoading={isLoading}
          />
        );
      case 'users':
        return <UsersTab users={users} isLoading={isLoading} />;
      case 'payments':
        return <PaymentsTab payments={payments} isLoading={isLoading} />;
      default:
        return (
          <OverviewTab 
            courses={courses}
            quizzes={quizzes}
            users={users}
            payments={payments}
            lastUpdated={lastUpdated}
            stats={stats}
            isLoading={isLoading}
            onRefresh={refreshData}
          />
        );
    }
  };

  return (
    <div className="admin-dashboard">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Chargement des données...</p>
        </div>
      )}
      
      <div className="admin-layout">
        {/* Navigation Sidebar */}
        <nav className="admin-sidebar">
          <div className="sidebar-header">
            <h2>EduPlatform Admin</h2>
            <p>Tableau de Bord</p>
            {lastUpdated && (
              <div className="last-updated-sidebar">
                <small>Dernière mise à jour: {new Date(lastUpdated).toLocaleTimeString('fr-FR')}</small>
                <button 
                  className="refresh-btn"
                  onClick={refreshData}
                  
                >
                  
                </button>
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
              {courses.length > 0 && (
                <span className="nav-badge">{courses.length}</span>
              )}
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'quizzes' ? 'active' : ''}`}
              onClick={() => setActiveTab('quizzes')}
            >
              <span className="nav-icon">📝</span>
              <span className="nav-label">Gestion des Quiz</span>
              {quizzes.length > 0 && (
                <span className="nav-badge">{quizzes.length}</span>
              )}
            </button>

            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-label">Utilisateurs</span>
              {users.length > 0 && (
                <span className="nav-badge">{users.length}</span>
              )}
            </button>
            
            <button 
              className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <span className="nav-icon">💳</span>
              <span className="nav-label">Paiements</span>
              {payments.length > 0 && (
                <span className="nav-badge">
                  {payments.filter(p => p.status === 'completed').length}
                </span>
              )}
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
            
            <div className="header-actions">
              <button 
                className="refresh-data-btn"
                onClick={refreshData}
                disabled={isLoading}
              >
                {isLoading ? '🔄' : '🔄'} Rafraîchir
              </button>
              
              {lastUpdated && (
                <div className="last-updated-header">
                  <span className="update-indicator">🔄</span>
                  <span>Mis à jour: {new Date(lastUpdated).toLocaleString('fr-FR')}</span>
                </div>
              )}
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