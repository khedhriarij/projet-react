// components/Quiz/QuizList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuizContext } from '../../context/QuizContext';
import './styles/QuizList.css';

export default function QuizList() {
  const { 
    quizzes, 
    deleteQuiz, 
    toggleQuizStatus, 
    duplicateQuiz, 
    getQuizStats,
    getAllQuizzes 
  } = useQuizContext();
  
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);

  useEffect(() => {
    const filtered = getAllQuizzes({
      status: filter === 'all' ? null : filter,
      search: searchTerm,
      sortBy: sortBy
    });
    setFilteredQuizzes(filtered);
  }, [quizzes, filter, searchTerm, sortBy, getAllQuizzes]);

  const handleDeleteQuiz = (quizId, quizTitle) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le quiz "${quizTitle}" ? Cette action est irréversible.`)) {
      deleteQuiz(quizId);
    }
  };

  const handleToggleStatus = (quizId, currentStatus) => {
    toggleQuizStatus(quizId);
  };

  const handleDuplicateQuiz = (quizId) => {
    const newQuizId = duplicateQuiz(quizId);
    if (newQuizId) {
      alert('Quiz dupliqué avec succès !');
    }
  };

  const getAttemptStats = (quizId) => {
    const stats = getQuizStats(quizId);
    return {
      totalAttempts: stats.totalAttempts,
      averageScore: stats.averageScore,
      passRate: stats.passRate
    };
  };

  return (
    <div className="quiz-list">
      <div className="quiz-list-header">
        <h1>Gestion des Quiz</h1>
        <div className="header-actions">
          <Link to="/admin/quiz/create" className="btn btn-primary">
            + Créer un Quiz
          </Link>
        </div>
      </div>

      <div className="quiz-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher un quiz..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Tous ({quizzes.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Actifs ({quizzes.filter(q => q.isActive).length})
            </button>
            <button 
              className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
              onClick={() => setFilter('inactive')}
            >
              Inactifs ({quizzes.filter(q => !q.isActive).length})
            </button>
          </div>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="createdAt">Date de création</option>
            <option value="title">Titre</option>
            <option value="attempts">Tentatives</option>
            <option value="averageScore">Score moyen</option>
          </select>
        </div>
      </div>

      <div className="quizzes-table-container">
        {filteredQuizzes.length === 0 ? (
          <div className="no-quizzes">
            <div className="no-quizzes-icon">📝</div>
            <h3>Aucun quiz trouvé</h3>
            <p>
              {searchTerm || filter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche' 
                : 'Créez votre premier quiz pour commencer'
              }
            </p>
            {!searchTerm && filter === 'all' && (
              <Link to="/admin/quiz/create" className="btn btn-primary">
                Créer un Quiz
              </Link>
            )}
          </div>
        ) : (
          <table className="quizzes-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Description</th>
                <th>Questions</th>
                <th>Durée</th>
                <th>Score de passage</th>
                <th>Tentatives</th>
                <th>Score moyen</th>
                <th>Statut</th>
                <th>Créé le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuizzes.map(quiz => {
                const stats = getAttemptStats(quiz.id);
                
                return (
                  <tr key={quiz.id} className="quiz-row">
                    <td className="quiz-title">
                      <strong>{quiz.title}</strong>
                    </td>
                    <td className="quiz-description">
                      {quiz.description && quiz.description.length > 50 
                        ? `${quiz.description.substring(0, 50)}...` 
                        : quiz.description || 'Aucune description'
                      }
                    </td>
                    <td className="quiz-questions">
                      <span className="badge">{quiz.questions?.length || 0}</span>
                    </td>
                    <td className="quiz-duration">
                      {quiz.duration} min
                    </td>
                    <td className="quiz-passing-score">
                      <span className="passing-badge">{quiz.passingScore}%</span>
                    </td>
                    <td className="quiz-attempts">
                      {stats.totalAttempts}
                    </td>
                    <td className="quiz-average">
                      <div className="score-display">
                        <span className={`score ${stats.averageScore >= quiz.passingScore ? 'good' : 'poor'}`}>
                          {stats.averageScore}%
                        </span>
                        <div className="score-bar">
                          <div 
                            className="score-fill" 
                            style={{ width: `${stats.averageScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="quiz-status">
                      <span 
                        className={`status-badge ${quiz.isActive ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleStatus(quiz.id, quiz.isActive)}
                        style={{cursor: 'pointer'}}
                      >
                        {quiz.isActive ? '🟢 Actif' : '🔴 Inactif'}
                      </span>
                    </td>
                    <td className="quiz-created">
                      {new Date(quiz.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="quiz-actions">
                      <div className="action-buttons">
                        <Link 
                          to={`/quiz/${quiz.id}`}
                          className="btn-icon preview"
                          title="Prévisualiser"
                          target="_blank"
                        >
                          👁️
                        </Link>
                        
                        <Link 
                          to={`/admin/quiz/edit/${quiz.id}`}
                          className="btn-icon edit"
                          title="Modifier"
                        >
                          ✏️
                        </Link>
                        
                        <button 
                          onClick={() => handleDuplicateQuiz(quiz.id)}
                          className="btn-icon duplicate"
                          title="Dupliquer"
                        >
                          📋
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                          className="btn-icon delete"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="quiz-stats">
        <div className="stat-card">
          <h3>📊 Statistiques Globales</h3>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-number">{quizzes.length}</span>
              <span className="stat-label">Quiz créés</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {quizzes.reduce((total, quiz) => total + getQuizStats(quiz.id).totalAttempts, 0)}
              </span>
              <span className="stat-label">Tentatives totales</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {quizzes.filter(q => q.isActive).length}
              </span>
              <span className="stat-label">Quiz actifs</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {quizzes.reduce((total, quiz) => total + (quiz.questions?.length || 0), 0)}
              </span>
              <span className="stat-label">Questions totales</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}