// components/Quiz/QuizResults.js
import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useQuizContext } from '../../context/QuizContext';
import './QuizResults.css';

export default function QuizResults() {
  const { quizId } = useParams();
  const location = useLocation();
  const { getQuizById, getQuizAttempts } = useQuizContext();
  
  const quiz = getQuizById(quizId);
  const attempts = getQuizAttempts(quizId);
  const latestAttempt = location.state?.attempt || attempts[attempts.length - 1];

  if (!quiz || !latestAttempt) {
    return <div className="results-not-found">Résultats non disponibles</div>;
  }

  const isPassed = latestAttempt.passed;

  return (
    <div className="quiz-results">
      <div className={`results-header ${isPassed ? 'passed' : 'failed'}`}>
        <div className="results-icon">
          {isPassed ? '🎉' : '😔'}
        </div>
        <h1>{isPassed ? 'Quiz Réussi!' : 'Quiz Échoué'}</h1>
        <div className="score-display">
          <span className="score">{latestAttempt.percentage}%</span>
          <span className="score-detail">
            {latestAttempt.score} / {latestAttempt.totalPoints} points
          </span>
        </div>
        <p>
          {isPassed 
            ? `Félicitations! Vous avez dépassé le score de passage de ${quiz.passingScore}%.`
            : `Le score de passage était de ${quiz.passingScore}%. Continuez à vous entraîner!`
          }
        </p>
      </div>

      <div className="results-actions">
        <Link to={`/quiz/${quizId}`} className="btn btn-primary">
          Repasser le quiz
        </Link>
        <Link to="/catalog" className="btn btn-secondary">
          Retour au catalogue
        </Link>
        {isPassed && (
          <button className="btn btn-success">
            📜 Télécharger le certificat
          </button>
        )}
      </div>
    </div>
  );
}