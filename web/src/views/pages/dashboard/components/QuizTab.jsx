// src/pages/dashboard/components/QuizTab.jsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuizContext } from '../../../../viewmodels/context/QuizContext';

const QuizTab = () => {
  const { quizzes, getQuizStats } = useQuizContext();

  const stats = useMemo(() => ({
    totalQuizzes: quizzes.length,
    activeQuizzes: quizzes.filter(q => q.isActive).length,
    totalQuestions: quizzes.reduce((total, quiz) => total + (quiz.questions?.length || 0), 0),
    totalAttempts: quizzes.reduce((total, quiz) => total + getQuizStats(quiz.id).totalAttempts, 0),
  }), [quizzes, getQuizStats]);

  const recentQuizzes = useMemo(() => 
    quizzes
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4)
  , [quizzes]);

  return (
    <div className="quiz-tab">
      <div className="tab-header">
        <div className="header-content">
          <h2>Gestion des Quiz</h2>
          <p>Créez et gérez vos quiz, questions et réponses</p>
        </div>
        <Link to="/admin/quiz" className="btn btn-primary">
          + Gérer les Quiz
        </Link>
      </div>

      <div className="quiz-stats-cards">
        <div className="stat-card">
          <div className="stat-content">
            <h3>Total des Quiz</h3>
            <div className="stat-number">{stats.totalQuizzes}</div>
            <div className="stat-trend">
              <span className="trend-up">↗</span>
              <span>Actifs: {stats.activeQuizzes}</span>
            </div>
          </div>
          <div className="stat-icon">📝</div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Questions Total</h3>
            <div className="stat-number">{stats.totalQuestions}</div>
            <div className="stat-trend">
              <span>Moyenne par quiz</span>
            </div>
          </div>
          <div className="stat-icon">❓</div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Tentatives</h3>
            <div className="stat-number">{stats.totalAttempts}</div>
            <div className="stat-trend">
              <span className="trend-up">↗</span>
              <span>Activité</span>
            </div>
          </div>
          <div className="stat-icon">📊</div>
        </div>
      </div>

      <div className="recent-quizzes">
        <h3>Quiz Récents</h3>
        {recentQuizzes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h4>Aucun quiz créé</h4>
            <p>Commencez par créer votre premier quiz</p>
            <Link to="/admin/quiz/create" className="btn btn-primary">
              Créer un Quiz
            </Link>
          </div>
        ) : (
          <div className="quizzes-grid">
            {recentQuizzes.map(quiz => (
              <div key={quiz.id} className="quiz-card">
                <div className="quiz-card-header">
                  <h4>{quiz.title}</h4>
                  <span className={`status-badge ${quiz.isActive ? 'active' : 'inactive'}`}>
                    {quiz.isActive ? '🟢 Actif' : '🔴 Inactif'}
                  </span>
                </div>
                <p className="quiz-description">
                  {quiz.description?.substring(0, 100) || 'Aucune description'}
                  {quiz.description?.length > 100 && '...'}
                </p>
                <div className="quiz-meta">
                  <span>{quiz.questions?.length || 0} questions</span>
                  <span>{quiz.duration} min</span>
                  <span>{quiz.passingScore}% passage</span>
                </div>
                <div className="quiz-actions">
                  <Link to={`/admin/quiz/edit/${quiz.id}`} className="btn btn-sm btn-outline">
                    Modifier
                  </Link>
                  <Link to={`/quiz/${quiz.id}`} className="btn btn-sm btn-outline" target="_blank">
                    Prévisualiser
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <h3>Actions Rapides</h3>
        <div className="actions-grid">
          <Link to="/admin/quiz/create" className="action-card">
            <div className="action-icon">➕</div>
            <div className="action-content">
              <h4>Créer un Quiz</h4>
              <p>Créez un nouveau quiz avec des questions</p>
            </div>
          </Link>
          
          <Link to="/admin/quiz" className="action-card">
            <div className="action-icon">📋</div>
            <div className="action-content">
              <h4>Voir Tous les Quiz</h4>
              <p>Gérez tous vos quiz en un seul endroit</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizTab;