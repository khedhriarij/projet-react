// components/Quiz/QuizPlayer.js - VERSION CORRIGÉE
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizContext } from '../../../viewmodels/context/QuizContext';
import './styles/QuizPlayer.css';

export default function QuizPlayer() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { getQuizById, startQuizAttempt, submitQuizAttempt } = useQuizContext();
  
  const quiz = getQuizById(quizId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [attemptId, setAttemptId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  // Initialisation du quiz
  useEffect(() => {
    if (quiz && !quizStarted) {
      // Démarrer une nouvelle tentative
      const newAttemptId = startQuizAttempt(quiz.id);
      setAttemptId(newAttemptId);
      setTimeLeft(quiz.duration * 60);
      setQuizStarted(true);
    }
  }, [quiz, quizStarted, startQuizAttempt]);

  // Gestionnaire du timer - VERSION CORRIGÉE
  useEffect(() => {
    if (timeLeft <= 0 || !quizStarted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitOnTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizStarted]);

  // Fonction séparée pour la soumission timeout
  const handleSubmitOnTimeout = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const timeSpent = quiz.duration * 60 - timeLeft;
    const result = submitQuizAttempt(attemptId, answers, timeSpent);
    navigate(`/quiz/results/${quizId}`, { state: { attempt: result } });
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Valider si toutes les questions sont répondues
    const unansweredQuestions = quiz.questions.filter(
      q => !answers[q.id] || answers[q.id].trim() === ''
    );
    
    if (unansweredQuestions.length > 0) {
      if (!window.confirm(`Il reste ${unansweredQuestions.length} question(s) sans réponse. Souhaitez-vous soumettre quand même?`)) {
        setIsSubmitting(false);
        return;
      }
    }
    
    const timeSpent = quiz.duration * 60 - timeLeft;
    const result = submitQuizAttempt(attemptId, answers, timeSpent);
    navigate(`/quiz/results/${quizId}`, { state: { attempt: result } });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (!quiz) {
    return (
      <div className="quiz-not-found">
        <h2>Quiz non trouvé</h2>
        <p>Le quiz que vous essayez d'accéder n'existe pas.</p>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          Retour
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-player">
      {/* En-tête du quiz */}
      <div className="quiz-header">
        <div className="quiz-info">
          <h1>{quiz.title}</h1>
          <p className="quiz-description">{quiz.description}</p>
          <div className="quiz-meta">
            <span>⏱️ Durée: {quiz.duration} minutes</span>
            <span>📊 Score de passage: {quiz.passingScore}%</span>
            <span>❓ Questions: {quiz.questions.length}</span>
          </div>
        </div>
        
        <div className="quiz-controls">
          <div className={`timer ${timeLeft < 300 ? 'warning' : ''}`}>
            ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div className="progress-info">
            Question {currentQuestionIndex + 1} sur {quiz.questions.length}
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
          title={`Progression: ${Math.round(progress)}%`}
        ></div>
      </div>

      {/* Conteneur de la question */}
      <div className="question-container">
        <div className="question-header">
          <h2>Question {currentQuestionIndex + 1}</h2>
          <span className="points">
            ({currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''})
          </span>
        </div>
        
        <div className="question-text">
          <p>{currentQuestion.questionText}</p>
        </div>

        {/* Affichage des réponses */}
        <div className="answers-container">
          {currentQuestion.questionType === 'multiple_choice' && (
            <div className="multiple-choice-answers">
              {currentQuestion.options.map((option, index) => (
                <label 
                  key={index} 
                  className={`answer-option ${
                    answers[currentQuestion.id] === option ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleAnswer(currentQuestion.id, option)}
                    className="answer-input"
                  />
                  <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
                  <span className="option-text">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.questionType === 'true_false' && (
            <div className="true-false-answers">
              <label className={`answer-option ${answers[currentQuestion.id] === 'true' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value="true"
                  checked={answers[currentQuestion.id] === 'true'}
                  onChange={() => handleAnswer(currentQuestion.id, 'true')}
                />
                <span className="option-text">✅ Vrai</span>
              </label>
              <label className={`answer-option ${answers[currentQuestion.id] === 'false' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value="false"
                  checked={answers[currentQuestion.id] === 'false'}
                  onChange={() => handleAnswer(currentQuestion.id, 'false')}
                />
                <span className="option-text">❌ Faux</span>
              </label>
            </div>
          )}

          {currentQuestion.questionType === 'text' && (
            <div className="text-answer">
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                placeholder="Entrez votre réponse ici..."
                rows={5}
                className="answer-textarea"
              />
            </div>
          )}
        </div>

        {/* Indication de réponse */}
        {answers[currentQuestion.id] && (
          <div className="answer-feedback">
            <span className="answered-indicator">✓ Réponse enregistrée</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="navigation-controls">
        <button 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn btn-secondary btn-prev"
        >
          ← Question précédente
        </button>
        
        <div className="navigation-center">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`btn ${isSubmitting ? 'btn-disabled' : 'btn-danger'}`}
          >
            {isSubmitting ? 'Soumission en cours...' : 'Soumettre le quiz'}
          </button>
        </div>

        <button 
          onClick={handleNext}
          disabled={currentQuestionIndex === quiz.questions.length - 1}
          className="btn btn-secondary btn-next"
        >
          Question suivante →
        </button>
      </div>

      {/* Vue d'ensemble des questions */}
      <div className="questions-overview">
        <h4>Vue d'ensemble des questions</h4>
        <div className="questions-grid">
          {quiz.questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => handleJumpToQuestion(index)}
              className={`question-indicator ${
                index === currentQuestionIndex ? 'current' : ''
              } ${answers[question.id] ? 'answered' : 'unanswered'} ${
                index < currentQuestionIndex ? 'visited' : ''
              }`}
              title={`Question ${index + 1}${answers[question.id] ? ' - Répondu' : ' - Non répondu'}`}
            >
              {index + 1}
              {answers[question.id] && <span className="checkmark">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="quiz-instructions">
        <h4>Instructions importantes:</h4>
        <ul>
          <li>Chaque question a un nombre de points indiqué</li>
          <li>Le score de passage est de {quiz.passingScore}%</li>
          <li>Vous pouvez naviguer entre les questions</li>
          <li>Vos réponses sont sauvegardées automatiquement</li>
          <li>Le quiz se soumet automatiquement à la fin du temps</li>
        </ul>
      </div>
    </div>
  );
}