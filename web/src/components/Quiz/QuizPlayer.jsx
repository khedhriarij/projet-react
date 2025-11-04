// components/Quiz/QuizPlayer.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizContext } from '../../context/QuizContext';
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

  useEffect(() => {
    if (quiz && !attemptId) {
      const newAttemptId = startQuizAttempt(quiz.id);
      setAttemptId(newAttemptId);
      setTimeLeft(quiz.duration * 60);
    }
  }, [quiz, attemptId, startQuizAttempt]);

  // Utilisez useCallback pour mémoriser handleAutoSubmit
  const handleAutoSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const result = submitQuizAttempt(attemptId, answers, quiz.duration * 60);
    navigate(`/quiz/results/${quizId}`, { state: { attempt: result } });
  }, [isSubmitting, submitQuizAttempt, attemptId, answers, quiz, quizId, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleAutoSubmit]); // Maintenant handleAutoSubmit est dans les dépendances

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
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

  if (!quiz) {
    return <div className="quiz-not-found">Quiz non trouvé</div>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-player">
      {/* Le reste de votre JSX reste inchangé */}
      <div className="quiz-header">
        <div className="quiz-info">
          <h1>{quiz.title}</h1>
          <p>{quiz.description}</p>
        </div>
        
        <div className="quiz-controls">
          <div className="timer">
            ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          <div className="progress">
            Question {currentQuestionIndex + 1} sur {quiz.questions.length}
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="question-container">
        <div className="question-header">
          <h2>Question {currentQuestionIndex + 1}</h2>
          <span className="points">({currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''})</span>
        </div>
        
        <div className="question-text">
          <p>{currentQuestion.questionText}</p>
        </div>

        <div className="answers-container">
          {currentQuestion.questionType === 'multiple_choice' && (
            <div className="multiple-choice-answers">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="answer-option">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() => handleAnswer(currentQuestion.id, option)}
                  />
                  <span className="option-text">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.questionType === 'true_false' && (
            <div className="true-false-answers">
              <label className="answer-option">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value="true"
                  checked={answers[currentQuestion.id] === 'true'}
                  onChange={() => handleAnswer(currentQuestion.id, 'true')}
                />
                <span className="option-text">Vrai</span>
              </label>
              <label className="answer-option">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value="false"
                  checked={answers[currentQuestion.id] === 'false'}
                  onChange={() => handleAnswer(currentQuestion.id, 'false')}
                />
                <span className="option-text">Faux</span>
              </label>
            </div>
          )}

          {currentQuestion.questionType === 'text' && (
            <div className="text-answer">
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                placeholder="Entrez votre réponse..."
                rows={4}
              />
            </div>
          )}
        </div>
      </div>

      <div className="navigation-controls">
        <button 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn btn-secondary"
        >
          ← Précédent
        </button>
        
        <div className="navigation-center">
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn btn-danger"
          >
            {isSubmitting ? 'Soumission...' : 'Soumettre le quiz'}
          </button>
        </div>

        <button 
          onClick={handleNext}
          disabled={currentQuestionIndex === quiz.questions.length - 1}
          className="btn btn-secondary"
        >
          Suivant →
        </button>
      </div>

      <div className="questions-overview">
        <h4>Vue d'ensemble des questions</h4>
        <div className="questions-grid">
          {quiz.questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`question-indicator ${
                index === currentQuestionIndex ? 'current' : ''
              } ${answers[question.id] ? 'answered' : 'unanswered'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}