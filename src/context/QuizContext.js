// context/QuizContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

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
    
    if (savedQuizzes) {
      try {
        setQuizzes(JSON.parse(savedQuizzes));
      } catch (error) {
        console.error('Error parsing quizzes from localStorage:', error);
        setQuizzes([]);
      }
    }
    
    if (savedAttempts) {
      try {
        setQuizAttempts(JSON.parse(savedAttempts));
      } catch (error) {
        console.error('Error parsing quiz attempts from localStorage:', error);
        setQuizAttempts([]);
      }
    }
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('eduplatform_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('eduplatform_quiz_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  const calculateTotalPoints = (questions) => {
    return questions.reduce((total, question) => total + (question.points || 1), 0);
  };

  // CRÉER un quiz
  const addQuiz = (quizData) => {
    const newQuiz = {
      id: `quiz_${Date.now()}`,
      ...quizData,
      createdAt: new Date().toISOString(),
      totalPoints: calculateTotalPoints(quizData.questions),
      isActive: true,
      attempts: 0,
      averageScore: 0,
      courseId: quizData.courseId || null // Lier le quiz à un cours si nécessaire
    };
    
    setQuizzes(prev => [...prev, newQuiz]);
    return newQuiz.id;
  };

  // LIRE - Obtenir un quiz par ID
  const getQuizById = (quizId) => {
    return quizzes.find(quiz => quiz.id === quizId);
  };

  // METTRE À JOUR un quiz
  const updateQuiz = (quizId, quizData) => {
    setQuizzes(prev => prev.map(quiz => {
      if (quiz.id === quizId) {
        const updatedQuiz = { 
          ...quiz, 
          ...quizData,
          // Recalculer le total des points si les questions changent
          totalPoints: quizData.questions ? calculateTotalPoints(quizData.questions) : quiz.totalPoints
        };
        return updatedQuiz;
      }
      return quiz;
    }));
  };

  // SUPPRIMER un quiz
  const deleteQuiz = (quizId) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
    // Supprimer aussi les tentatives associées à ce quiz
    setQuizAttempts(prev => prev.filter(attempt => attempt.quizId !== quizId));
  };

  // BASculer l'état actif/inactif d'un quiz
  const toggleQuizStatus = (quizId) => {
    setQuizzes(prev => prev.map(quiz => {
      if (quiz.id === quizId) {
        return { ...quiz, isActive: !quiz.isActive };
      }
      return quiz;
    }));
  };

  // DUPLIQUER un quiz
  const duplicateQuiz = (quizId) => {
    const quiz = getQuizById(quizId);
    if (!quiz) return null;

    const duplicatedQuiz = {
      ...quiz,
      id: `quiz_${Date.now()}`,
      title: `${quiz.title} (Copie)`,
      createdAt: new Date().toISOString(),
      attempts: 0,
      averageScore: 0,
      isActive: false // Désactiver par défaut la copie
    };

    // Dupliquer aussi les questions avec de nouveaux IDs
    if (duplicatedQuiz.questions) {
      duplicatedQuiz.questions = duplicatedQuiz.questions.map(question => ({
        ...question,
        id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
    }

    setQuizzes(prev => [...prev, duplicatedQuiz]);
    return duplicatedQuiz.id;
  };

  // OBTENIR les statistiques d'un quiz
  const getQuizStats = (quizId) => {
    const quiz = getQuizById(quizId);
    const attempts = getQuizAttempts(quizId);
    
    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0 
      ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / totalAttempts)
      : 0;
    
    const passRate = totalAttempts > 0
      ? Math.round((attempts.filter(attempt => attempt.passed).length / totalAttempts) * 100)
      : 0;

    const completionRate = totalAttempts > 0
      ? Math.round((attempts.filter(attempt => attempt.completedAt).length / totalAttempts) * 100)
      : 0;

    return {
      totalAttempts,
      averageScore,
      passRate,
      completionRate,
      totalQuestions: quiz?.questions?.length || 0,
      totalPoints: quiz?.totalPoints || 0
    };
  };

  // OBTENIR tous les quiz (avec filtrage optionnel)
  const getAllQuizzes = (filters = {}) => {
    let filteredQuizzes = [...quizzes];
    
    // Filtrer par statut actif/inactif
    if (filters.status === 'active') {
      filteredQuizzes = filteredQuizzes.filter(quiz => quiz.isActive);
    } else if (filters.status === 'inactive') {
      filteredQuizzes = filteredQuizzes.filter(quiz => !quiz.isActive);
    }
    
    // Filtrer par recherche
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredQuizzes = filteredQuizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm) ||
        quiz.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Trier
    if (filters.sortBy) {
      filteredQuizzes.sort((a, b) => {
        switch (filters.sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'createdAt':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'attempts':
            return b.attempts - a.attempts;
          case 'averageScore':
            return b.averageScore - a.averageScore;
          default:
            return 0;
        }
      });
    }
    
    return filteredQuizzes;
  };

  // GESTION DES TENTATIVES DE QUIZ
  const startQuizAttempt = (quizId) => {
    const attemptId = `attempt_${Date.now()}`;
    const newAttempt = {
      id: attemptId,
      quizId,
      userId: 'current_user', // À remplacer par l'ID utilisateur réel
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
  };

  const submitQuizAttempt = (attemptId, userAnswers, timeSpent) => {
    const attempt = quizAttempts.find(a => a.id === attemptId);
    if (!attempt) throw new Error('Attempt not found');

    const quiz = getQuizById(attempt.quizId);
    if (!quiz) throw new Error('Quiz not found');

    let score = 0;
    const answers = [];

    quiz.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      const pointsEarned = isCorrect ? (question.points || 1) : 0;
      
      score += pointsEarned;
      answers.push({
        questionId: question.id,
        userAnswer,
        isCorrect,
        pointsEarned
      });
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
    const quizAttemptsForQuiz = getQuizAttempts(quiz.id);
    const newAverage = quizAttemptsForQuiz.length > 0 
      ? (quizAttemptsForQuiz.reduce((sum, a) => sum + a.percentage, 0) + percentage) / (quizAttemptsForQuiz.length + 1)
      : percentage;

    updateQuiz(quiz.id, {
      attempts: quizAttemptsForQuiz.length + 1,
      averageScore: Math.round(newAverage * 10) / 10
    });

    return updatedAttempt;
  };

  const getQuizAttempts = (quizId) => {
    if (quizId) {
      return quizAttempts.filter(attempt => attempt.quizId === quizId);
    }
    return quizAttempts;
  };

  const getQuizzesByCourse = (courseId) => {
    return quizzes.filter(quiz => quiz.courseId === courseId);
  };

  // OBTENIR les tentatives d'un utilisateur
  const getUserQuizAttempts = (userId) => {
    return quizAttempts.filter(attempt => attempt.userId === userId);
  };

  // SUPPRIMER les tentatives d'un quiz
  const deleteQuizAttempts = (quizId) => {
    setQuizAttempts(prev => prev.filter(attempt => attempt.quizId !== quizId));
  };

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
    getQuizAttempts,
    getUserQuizAttempts,
    deleteQuizAttempts,
    
    // Relations
    getQuizzesByCourse
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};