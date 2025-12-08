// src/viewmodels/context/QuizContext.js
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
  const [isInitialized, setIsInitialized] = useState(false); // ✅ Nouvel état pour suivre l'initialisation

  // Charger depuis localStorage
  useEffect(() => {
    const savedQuizzes = localStorage.getItem('eduplatform_quizzes');
    const savedAttempts = localStorage.getItem('eduplatform_quiz_attempts');
    const savedInitialized = localStorage.getItem('eduplatform_quizzes_initialized');
    
    if (savedQuizzes) setQuizzes(JSON.parse(savedQuizzes));
    if (savedAttempts) setQuizAttempts(JSON.parse(savedAttempts));
    if (savedInitialized) setIsInitialized(JSON.parse(savedInitialized));
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('eduplatform_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('eduplatform_quiz_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  useEffect(() => {
    localStorage.setItem('eduplatform_quizzes_initialized', JSON.stringify(isInitialized));
  }, [isInitialized]);

  // Mémoized functions
  const calculateTotalPoints = useCallback((questions) => {
    return questions.reduce((total, question) => total + (question.points || 1), 0);
  }, []);

  const getQuizById = useCallback((quizId) => {
    return quizzes.find(quiz => quiz.id === quizId);
  }, [quizzes]);

  // Fonction pour vérifier si un quiz existe déjà
  const quizExists = useCallback((courseId, title) => {
    return quizzes.some(quiz => quiz.courseId === courseId && quiz.title === title);
  }, [quizzes]);

  // Fonction pour associer un quiz à un cours (avec vérification de doublon)
  const addQuizToCourse = useCallback((courseId, quizData) => {
    // Vérifier si le quiz existe déjà
    if (quizExists(courseId, quizData.title)) {
      console.log(`Quiz "${quizData.title}" existe déjà pour le cours ${courseId}`);
      return null; // Ne pas créer de doublon
    }

    const newQuiz = {
      id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID plus unique
      courseId: courseId,
      ...quizData,
      createdAt: new Date().toISOString(),
      totalPoints: calculateTotalPoints(quizData.questions),
      isActive: true,
      attempts: 0,
      averageScore: 0,
    };
    setQuizzes(prev => [...prev, newQuiz]);
    return newQuiz.id;
  }, [calculateTotalPoints, quizExists]);

  // Fonction pour récupérer les quiz d'un cours
  const getQuizzesByCourse = useCallback((courseId) => {
    return quizzes.filter(quiz => quiz.courseId === courseId);
  }, [quizzes]);

  // Fonction pour vérifier si l'utilisateur peut passer un quiz
  const canUserTakeQuiz = useCallback((quizId, userId) => {
    const quiz = getQuizById(quizId);
    const userAttempts = quizAttempts.filter(
      attempt => attempt.quizId === quizId && attempt.userId === userId
    ); 
    return quiz && quiz.isActive && userAttempts.length < 3;
  }, [getQuizById, quizAttempts]);

  // ✅ FONCTION ADDQUIZ CORRIGÉE - Vérifie les doublons
  const addQuiz = useCallback((quizData) => {
    // Vérifier si un quiz similaire existe déjà
    const existingQuiz = quizzes.find(quiz => 
      quiz.title === quizData.title && 
      quiz.courseId === quizData.courseId
    );

    if (existingQuiz) {
      console.warn('Un quiz avec le même titre existe déjà pour ce cours');
      // Option: Mettre à jour l'existant au lieu de créer un doublon
      return existingQuiz.id;
    }

    const newQuiz = {
      id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID plus unique
      ...quizData,
      createdAt: new Date().toISOString(),
      totalPoints: calculateTotalPoints(quizData.questions),
      isActive: true,
      attempts: 0,
      averageScore: 0,
    };
    
    setQuizzes(prev => [...prev, newQuiz]);
    return newQuiz.id;
  }, [quizzes, calculateTotalPoints]);

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
  const startQuizAttempt = useCallback((quizId, userId = 'current_user') => {
    const attemptId = `attempt_${Date.now()}`;
    const newAttempt = {
      id: attemptId,
      quizId,
      userId: userId,
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

  // ✅ FONCTION INITIALIZEDEMOQUIZZES CORRIGÉE - Ne s'exécute qu'une fois
  const initializeDemoQuizzes = useCallback(() => {
    if (isInitialized) {
      console.log('Quiz de démonstration déjà initialisés');
      return;
    }

    const demoQuizzes = [
      {
        courseId: 1,
        title: "Quiz - Bases de React",
        description: "Testez vos connaissances sur les concepts fondamentaux de React",
        duration: 20,
        passingScore: 70,
        questions: [
          {
            id: "q1_" + Date.now(),
            questionText: "Qu'est-ce qu'un composant React?",
            questionType: "multiple_choice",
            options: [
              "Une fonction qui retourne du JSX",
              "Une classe JavaScript",
              "Un élément HTML",
              "Les deux premières réponses"
            ],
            correctAnswer: "Les deux premières réponses",
            points: 1
          },
          {
            id: "q2_" + Date.now(),
            questionText: "Quel hook est utilisé pour gérer l'état local?",
            questionType: "multiple_choice",
            options: [
              "useEffect",
              "useState",
              "useContext",
              "useReducer"
            ],
            correctAnswer: "useState",
            points: 1
          }
        ]
      },
      {
        courseId: 1,
        title: "Quiz - Hooks Avancés",
        description: "Évaluez votre maîtrise des Hooks React avancés",
        duration: 30,
        passingScore: 80,
        questions: [
          {
            id: "q3_" + Date.now(),
            questionText: "Quel hook permet de partager des données sans passer par les props?",
            questionType: "multiple_choice",
            options: [
              "useState",
              "useEffect",
              "useContext",
              "useMemo"
            ],
            correctAnswer: "useContext",
            points: 2
          }
        ]
      }
    ];

    // Ajouter seulement les quiz qui n'existent pas
    let addedCount = 0;
    demoQuizzes.forEach(demoQuiz => {
      if (!quizExists(demoQuiz.courseId, demoQuiz.title)) {
        addQuizToCourse(demoQuiz.courseId, demoQuiz);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setIsInitialized(true);
      console.log(`${addedCount} quiz de démonstration ajoutés`);
    }
  }, [isInitialized, quizExists, addQuizToCourse]);

  // ✅ Initialiser UNE SEULE FOIS au chargement
  useEffect(() => {
    if (quizzes.length === 0 && !isInitialized) {
      initializeDemoQuizzes();
    }
  }, [quizzes.length, isInitialized, initializeDemoQuizzes]);

  // ✅ FONCTION POUR NETTOYER LES DOUBLONS EXISTANTS
  const removeDuplicateQuizzes = useCallback(() => {
    const uniqueQuizzes = [];
    const seen = new Set();

    quizzes.forEach(quiz => {
      const key = `${quiz.courseId}_${quiz.title}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueQuizzes.push(quiz);
      }
    });

    if (uniqueQuizzes.length < quizzes.length) {
      const removedCount = quizzes.length - uniqueQuizzes.length;
      setQuizzes(uniqueQuizzes);
      console.log(`${removedCount} doublons supprimés`);
      return removedCount;
    }
    return 0;
  }, [quizzes]);

  // Nettoyer les doublons existants au chargement
  useEffect(() => {
    if (quizzes.length > 0) {
      const removed = removeDuplicateQuizzes();
      if (removed > 0) {
        console.log(`Nettoyage effectué: ${removed} quiz en double supprimés`);
      }
    }
  }, [quizzes.length, removeDuplicateQuizzes]);

  const value = {
    // Quiz CRUD
    quizzes,
    addQuiz,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    toggleQuizStatus,
    getAllQuizzes,
    getQuizStats,
    
    // Quiz attempts
    quizAttempts,
    startQuizAttempt,
    submitQuizAttempt,
    getQuizAttempts: (quizId) => quizAttempts.filter(attempt => attempt.quizId === quizId),
    
    // Nouvelles fonctions pour l'association cours-quiz
    addQuizToCourse,
    getQuizzesByCourse,
    canUserTakeQuiz,
    initializeDemoQuizzes,
    removeDuplicateQuizzes, // ✅ Exposer la fonction de nettoyage
    isInitialized
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};