// components/Quiz/QuizBuilder.js
import React, { useState } from 'react';
import { useQuizContext } from '../../context/QuizContext';
import './styles/QuizBuilder.css';

export default function QuizBuilder() {
  const { addQuiz } = useQuizContext();
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    duration: 30,
    passingScore: 60,
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    questionType: 'multiple_choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1
  });

  const addQuestion = () => {
    if (!currentQuestion.questionText || !currentQuestion.correctAnswer) {
      alert('Veuillez remplir tous les champs de la question');
      return;
    }

    const newQuestion = {
      id: Date.now(),
      type: currentQuestion.questionType,
      question: currentQuestion.questionText,
      points: currentQuestion.points,
      options: currentQuestion.questionType === 'multiple_choice' ? currentQuestion.options : [],
      correctAnswer: currentQuestion.correctAnswer
    };

    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    // Reset current question
    setCurrentQuestion({
      questionText: '',
      questionType: 'multiple_choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    });
  };

  const removeQuestion = (index) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!quiz.title || !quiz.description || !quiz.questions.length) {
      alert('Veuillez remplir tous les champs obligatoires et ajouter au moins une question');
      return;
    }

    addQuiz(quiz);
    alert('Quiz créé avec succès!');
    
    // Reset form
    setQuiz({
      title: '',
      description: '',
      duration: 30,
      passingScore: 60,
      questions: []
    });
  };

  return (
    <div className="quiz-builder">
      <h2>Créer un Quiz</h2>
      
      <form onSubmit={handleSubmit} className="quiz-form">
        <div className="form-section">
          <h3>Informations du quiz</h3>
          
          <div className="form-group">
            <label>Titre du quiz *</label>
            <input
              type="text"
              value={quiz.title}
              onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Titre du quiz"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={quiz.description}
              onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description du quiz"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Durée (minutes) *</label>
              <input
                type="number"
                value={quiz.duration}
                onChange={(e) => setQuiz(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                min="5"
                required
              />
            </div>

            <div className="form-group">
              <label>Score de passage (%) *</label>
              <input
                type="number"
                value={quiz.passingScore}
                onChange={(e) => setQuiz(prev => ({ ...prev, passingScore: parseInt(e.target.value) }))}
                min="0"
                max="100"
                required
              />
            </div>
          </div>
        </div>

        {/* Formulaire d'ajout de question */}
        <div className="form-section">
          <h3>Ajouter une question</h3>
          
          <div className="question-form">
            <div className="form-group">
              <label>Type de question</label>
              <select
                value={currentQuestion.questionType}
                onChange={(e) => setCurrentQuestion(prev => ({ 
                  ...prev, 
                  questionType: e.target.value 
                }))}
              >
                <option value="multiple_choice">Choix multiple</option>
                <option value="true_false">Vrai/Faux</option>
                <option value="text">Réponse texte</option>
              </select>
            </div>

            <div className="form-group">
              <label>Question *</label>
              <textarea
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                placeholder="Entrez votre question"
                required
              />
            </div>

            {currentQuestion.questionType === 'multiple_choice' && (
              <div className="options-form">
                <label>Options *</label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="option-input">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === option}
                        onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: option }))}
                        required
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.questionType === 'true_false' && (
              <div className="form-group">
                <label>Réponse correcte *</label>
                <select
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                  required
                >
                  <option value="">Sélectionnez</option>
                  <option value="true">Vrai</option>
                  <option value="false">Faux</option>
                </select>
              </div>
            )}

            {currentQuestion.questionType === 'text' && (
              <div className="form-group">
                <label>Réponse correcte *</label>
                <input
                  type="text"
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                  placeholder="Réponse attendue"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Points</label>
              <input
                type="number"
                value={currentQuestion.points}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                min="1"
              />
            </div>

            <button type="button" onClick={addQuestion} className="btn btn-secondary">
              + Ajouter cette question
            </button>
          </div>
        </div>

        {/* Liste des questions ajoutées */}
        {quiz.questions.length > 0 && (
          <div className="form-section">
            <h3>Questions ajoutées ({quiz.questions.length})</h3>
            <div className="questions-list">
              {quiz.questions.map((question, index) => (
                <div key={question.id} className="question-item">
                  <div className="question-header">
                    <span className="question-number">Question {index + 1}</span>
                    <button 
                      type="button" 
                      onClick={() => removeQuestion(index)}
                      className="btn btn-danger btn-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                  <p className="question-text">{question.question}</p>
                  <div className="question-meta">
                    <span>Type: {question.type}</span>
                    <span>Points: {question.points}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-primary">
          Créer le quiz
        </button>
      </form>
    </div>
  );
}