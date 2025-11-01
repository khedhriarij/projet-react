// src/context/QuizContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const QuizContext = createContext();

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizAttempts, setQuizAttempts] = useState([]);

  // Charger depuis localStorage
  useEffect(() => {
    const savedQuizzes = localStorage.getItem('eduplatform_quizzes');
    const savedAttempts = localStorage.getItem('eduplatform_quiz_attempts');
    
    if (savedQuizzes) setQuizzes(JSON.parse(savedQuizzes));
    if (savedAttempts) setQuizAttempts(JSON.parse(savedAttempts));
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('eduplatform_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('eduplatform_quiz_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  // Mémoized functions
  const calculateTotalPoints = useCallback((questions) => {
    return questions.reduce((total, question) => total + (question.points || 1), 0);
  }, []);

  const addQuiz = useCallback((quizData) => {
    const newQuiz = {
      id: `quiz_${Date.now()}`,
      ...quizData,
      createdAt: new Date().toISOString(),
      totalPoints: calculateTotalPoints(quizData.questions),
      isActive: true,
      attempts: 0,
      averageScore: 0,
    };
    
    setQuizzes(prev => [...prev, newQuiz]);
    return newQuiz.id;
  }, [calculateTotalPoints]);

  const getQuizById = useCallback((quizId) => {
    return quizzes.find(quiz => quiz.id === quizId);
  }, [quizzes]);

  const updateQuiz = useCallback((quizId, quizData) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === quizId 
        ? { 
            ...quiz, 
            ...quizData,
            totalPoints: quizData.questions ? calculateTotalPoints(quizData.questions) : quiz.totalPoints,
            updatedAt: new Date().toISOString()
          }
        : quiz
    ));
  }, [calculateTotalPoints]);

  const deleteQuiz = useCallback((quizId) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
    setQuizAttempts(prev => prev.filter(attempt => attempt.quizId !== quizId));
  }, []);

  const toggleQuizStatus = useCallback((quizId) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === quizId ? { ...quiz, isActive: !quiz.isActive } : quiz
    ));
  }, []);

  const duplicateQuiz = useCallback((quizId) => {
    const quiz = getQuizById(quizId);
    if (!quiz) return null;

    const duplicatedQuiz = {
      ...quiz,
      id: `quiz_${Date.now()}`,
      title: `${quiz.title} (Copie)`,
      createdAt: new Date().toISOString(),
      attempts: 0,
      averageScore: 0,
      isActive: false,
      questions: quiz.questions.map(q => ({
        ...q,
        id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }))
    };

    setQuizzes(prev => [...prev, duplicatedQuiz]);
    return duplicatedQuiz.id;
  }, [getQuizById]);

  const getQuizStats = useCallback((quizId) => {
    const quiz = getQuizById(quizId);
    const attempts = quizAttempts.filter(attempt => attempt.quizId === quizId);
    
    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0 
      ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts)
      : 0;
    
    const passRate = totalAttempts > 0
      ? Math.round((attempts.filter(attempt => attempt.passed).length / totalAttempts) * 100)
      : 0;

    return {
      totalAttempts,
      averageScore,
      passRate,
      totalQuestions: quiz?.questions?.length || 0,
      totalPoints: quiz?.totalPoints || 0
    };
  }, [getQuizById, quizAttempts]);

  const getAllQuizzes = useCallback((filters = {}) => {
    let filtered = [...quizzes];
    
    if (filters.status === 'active') {
      filtered = filtered.filter(quiz => quiz.isActive);
    } else if (filters.status === 'inactive') {
      filtered = filtered.filter(quiz => !quiz.isActive);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm) ||
        (quiz.description && quiz.description.toLowerCase().includes(searchTerm))
      );
    }
    
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'title': return a.title.localeCompare(b.title);
          case 'createdAt': return new Date(b.createdAt) - new Date(a.createdAt);
          case 'attempts': return b.attempts - a.attempts;
          case 'averageScore': return b.averageScore - a.averageScore;
          default: return 0;
        }
      });
    }
    
    return filtered;
  }, [quizzes]);

  // Gestion des tentatives
  const startQuizAttempt = useCallback((quizId) => {
    const attemptId = `attempt_${Date.now()}`;
    const newAttempt = {
      id: attemptId,
      quizId,
      userId: 'current_user',
      score: 0,
      totalPoints: 0,
      percentage: 0,
      answers: [],
      startedAt: new Date().toISOString(),
      completedAt: null,
      timeSpent: 0,
      passed: false
    };
    
    setQuizAttempts(prev => [...prev, newAttempt]);
    return attemptId;
  }, []);

  const submitQuizAttempt = useCallback((attemptId, userAnswers, timeSpent) => {
    const attempt = quizAttempts.find(a => a.id === attemptId);
    const quiz = getQuizById(attempt.quizId);
    
    if (!attempt || !quiz) throw new Error('Attempt or Quiz not found');

    let score = 0;
    const answers = [];

    quiz.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      const pointsEarned = isCorrect ? (question.points || 1) : 0;
      
      score += pointsEarned;
      answers.push({ questionId: question.id, userAnswer, isCorrect, pointsEarned });
    });

    const percentage = Math.round((score / quiz.totalPoints) * 100);
    const passed = percentage >= quiz.passingScore;

    const updatedAttempt = {
      ...attempt,
      score,
      totalPoints: quiz.totalPoints,
      percentage,
      answers,
      completedAt: new Date().toISOString(),
      timeSpent,
      passed
    };

    setQuizAttempts(prev => prev.map(a => a.id === attemptId ? updatedAttempt : a));

    // Mettre à jour les stats du quiz
    const quizAttemptsForQuiz = quizAttempts.filter(a => a.quizId === quiz.id);
    const newAverage = quizAttemptsForQuiz.length > 0 
      ? (quizAttemptsForQuiz.reduce((sum, a) => sum + a.percentage, 0) + percentage) / (quizAttemptsForQuiz.length + 1)
      : percentage;

    updateQuiz(quiz.id, {
      attempts: quizAttemptsForQuiz.length + 1,
      averageScore: Math.round(newAverage * 10) / 10
    });

    return updatedAttempt;
  }, [quizAttempts, getQuizById, updateQuiz]);

  const value = {
    // Quiz CRUD
    quizzes,
    addQuiz,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    toggleQuizStatus,
    duplicateQuiz,
    getAllQuizzes,
    getQuizStats,
    
    // Quiz attempts
    quizAttempts,
    startQuizAttempt,
    submitQuizAttempt,
    getQuizAttempts: (quizId) => quizAttempts.filter(attempt => attempt.quizId === quizId),
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};