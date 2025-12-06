// src/pages/dashboard/hooks/useAdminDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../../../viewmodels/hooks/useAuthContext';
import { useAdmin } from '../../../../viewmodels/hooks/UseAdmin';
import { useCourseContext } from '../../../../viewmodels/context/CourContext';

export const useAdminDashboard = () => {
  const { user } = useAuthContext();
  const { isAdmin } = useAdmin();
  const { courses, addCourse, deleteCourse, updateCourse } = useCourseContext();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // États pour les données dynamiques
  const [quizzes, setQuizzes] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalQuizzes: 0,
    activeQuizzes: 0,
    totalUsers: 0,
    totalPayments: 0,
    monthlyGrowth: 0,
    conversionRate: 0
  });
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    category: '',
    instructor: '',
    originalPrice: '',
    price: '',
    description: '',
    level: 'Intermédiaire',
    duration: '10h 00min',
    image: '/images/default-course.jpg',
    discountPercentage: 0,
    hasPromotion: false,
    status: 'draft'
  });

  // Simuler des données dynamiques (à remplacer par des appels API réels)
  useEffect(() => {
    if (!isAdmin) return;
    
    setIsLoading(true);
    
    // Simuler des données de quiz dynamiques
    const mockQuizzes = [
      {
        id: '1',
        title: 'Quiz React Avancé',
        courseId: 'react-course',
        questions: 15,
        isActive: true,
        updatedAt: new Date().toISOString(),
        participants: 45
      },
      {
        id: '2',
        title: 'Quiz JavaScript Fondamental',
        courseId: 'js-course',
        questions: 20,
        isActive: true,
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        participants: 78
      }
    ];
    setQuizzes(mockQuizzes);
    
    // Simuler des données d'utilisateurs dynamiques
    const mockUsers = [
      {
        id: '1',
        email: 'john@example.com',
        displayName: 'John Doe',
        role: 'student',
        createdAt: new Date(Date.now() - 2592000000).toISOString(),
        lastLogin: new Date(Date.now() - 86400000).toISOString(),
        enrolledCourses: ['react-course', 'js-course']
      },
      {
        id: '2',
        email: 'jane@example.com',
        displayName: 'Jane Smith',
        role: 'student',
        createdAt: new Date(Date.now() - 1728000000).toISOString(),
        lastLogin: new Date().toISOString(),
        enrolledCourses: ['react-course']
      }
    ];
    setUsers(mockUsers);
    
    // Simuler des données de paiements dynamiques
    const mockPayments = [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        courseId: 'react-course',
        courseTitle: 'React Avancé',
        amount: 299,
        status: 'completed',
        paymentDate: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: '2',
        userId: '2',
        userName: 'Jane Smith',
        courseId: 'react-course',
        courseTitle: 'React Avancé',
        amount: 299,
        status: 'completed',
        paymentDate: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    setPayments(mockPayments);
    
    setIsLoading(false);
    setLastUpdated(new Date().toISOString());
  }, [isAdmin, courses]);

  // Calculer les statistiques en temps réel
  useEffect(() => {
    if (!courses.length) return;
    
    const calculateStats = () => {
      // Calculer le nombre d'étudiants par cours
      const courseEnrollments = {};
      users.forEach(user => {
        if (user.enrolledCourses) {
          user.enrolledCourses.forEach(courseId => {
            if (!courseEnrollments[courseId]) {
              courseEnrollments[courseId] = 0;
            }
            courseEnrollments[courseId]++;
          });
        }
      });
      
      // Calculer les revenus par cours
      const courseRevenues = {};
      payments.forEach(payment => {
        if (payment.status === 'completed' && payment.courseId) {
          if (!courseRevenues[payment.courseId]) {
            courseRevenues[payment.courseId] = 0;
          }
          courseRevenues[payment.courseId] += payment.amount || 0;
        }
      });
      
      // Ajouter les données dynamiques aux cours
      const enhancedCourses = courses.map(course => ({
        ...course,
        enrollmentCount: courseEnrollments[course.id] || 0,
        revenue: courseRevenues[course.id] || 0
      }));
      
      // Calculer les statistiques globales
      const totalRevenue = enhancedCourses.reduce((sum, course) => sum + (course.revenue || 0), 0);
      const totalStudents = enhancedCourses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyRevenue = payments.reduce((sum, payment) => {
        if (payment.status === 'completed' && payment.paymentDate) {
          const paymentDate = new Date(payment.paymentDate);
          if (paymentDate.getMonth() === currentMonth && 
              paymentDate.getFullYear() === currentYear) {
            return sum + (payment.amount || 0);
          }
        }
        return sum;
      }, 0);
      
      const activeQuizzes = quizzes.filter(quiz => quiz.isActive !== false).length;
      const completedPayments = payments.filter(p => p.status === 'completed').length;
      
      return {
        totalRevenue,
        monthlyRevenue,
        totalStudents,
        totalCourses: courses.length,
        totalQuizzes: quizzes.length,
        activeQuizzes,
        totalUsers: users.length,
        totalPayments: completedPayments,
        monthlyGrowth: 12.5, // À calculer dynamiquement
        conversionRate: totalStudents > 0 ? 
          ((totalStudents / (users.length * 4)) * 100).toFixed(1) : 0
      };
    };
    
    setStats(calculateStats());
  }, [courses, users, payments, quizzes]);

  const defaultImages = [
    { url: '/images/react.jpg', label: 'React' },
    { url: '/images/figma.webp', label: 'Figma' },
    { url: '/images/marketing-digital.jpg', label: 'Marketing' },
    { url: '/images/python.jpeg', label: 'Python' },
    { url: '/images/adobe.jpg', label: 'Adobe' },
    { url: '/images/agile.jpeg', label: 'Agile' },
    { url: '/images/ai.jpeg', label: 'Intelligence Artificielle' }, 
    { url: '/images/cour.png', label: 'Cours Général' },
    { url: '/images/default-course.jpg', label: 'Défaut' }
  ];

  const calculateDiscountPercentage = (originalPrice, promoPrice) => {
    const original = parseFloat(originalPrice);
    const promo = parseFloat(promoPrice);
    
    if (!original || !promo || original <= 0 || promo <= 0) {
      return 0;
    }
    
    if (promo >= original) {
      return 0;
    }
    
    const discount = ((original - promo) / original) * 100;
    return Math.round(discount);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setNewCourse(prev => {
      const updatedCourse = {
        ...prev,
        [name]: value
      };
      
      if (name === 'originalPrice' || name === 'price') {
        const originalPrice = name === 'originalPrice' ? value : prev.originalPrice;
        const promoPrice = name === 'price' ? value : prev.price;
        
        if (originalPrice && promoPrice) {
          const original = parseFloat(originalPrice);
          const promo = parseFloat(promoPrice);
          
          if (promo >= original) {
            updatedCourse.discountPercentage = 0;
            updatedCourse.hasPromotion = false;
          } else {
            const discountPercentage = calculateDiscountPercentage(original, promo);
            updatedCourse.discountPercentage = discountPercentage;
            updatedCourse.hasPromotion = discountPercentage > 0;
          }
        } else {
          updatedCourse.discountPercentage = 0;
          updatedCourse.hasPromotion = false;
        }
      }
      
      return updatedCourse;
    });
  };

  const handleImageUrlChange = (e) => {
    const { value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      image: value || '/images/default-course.jpg'
    }));
  };

  const handleSelectDefaultImage = (imageUrl) => {
    setNewCourse(prev => ({
      ...prev,
      image: imageUrl
    }));
  };

  const handleSubmitCourse = (e) => {
    e.preventDefault();
    
    if (!newCourse.title || !newCourse.category || !newCourse.instructor || !newCourse.originalPrice) {
      alert('❌ Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const originalPrice = parseFloat(newCourse.originalPrice);
    const promoPrice = parseFloat(newCourse.price) || originalPrice;
    
    if (promoPrice > originalPrice) {
      alert('❌ Le prix promotionnel ne peut pas être supérieur au prix original');
      return;
    }
    
    if (originalPrice <= 0) {
      alert('❌ Le prix original doit être supérieur à 0');
      return;
    }

    const courseData = {
      title: newCourse.title,
      category: newCourse.category,
      instructor: newCourse.instructor,
      price: promoPrice,
      originalPrice: newCourse.hasPromotion ? originalPrice : null,
      description: newCourse.description,
      level: newCourse.level,
      duration: newCourse.duration,
      image: newCourse.image,
      discountPercentage: newCourse.discountPercentage,
      status: newCourse.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      enrollmentCount: 0,
      revenue: 0
    };

    try {
      addCourse(courseData);
      
      setNewCourse({
        title: '',
        category: '',
        instructor: '',
        originalPrice: '',
        price: '',
        description: '',
        level: 'Intermédiaire',
        duration: '10h 00min',
        image: '/images/default-course.jpg',
        discountPercentage: 0,
        hasPromotion: false,
        status: 'draft'
      });
      
      setShowNewCourseForm(false);
      alert('✅ Cours créé avec succès !');
      
    } catch (error) {
      console.error('❌ Erreur lors de la création du cours:', error);
      alert('❌ Erreur lors de la création du cours');
    }
  };

  const handleUpdateCourse = useCallback((courseId, courseData) => {
    try {
      const updatedData = {
        ...courseData,
        updatedAt: new Date().toISOString()
      };
      
      if (updateCourse) {
        updateCourse(courseId, updatedData);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du cours:', error);
      alert('❌ Erreur lors de la mise à jour du cours');
    }
  }, [updateCourse]);

  const handleUpdateQuiz = useCallback((quizId, quizData) => {
    try {
      const updatedData = {
        ...quizData,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Quiz updated:', quizId, updatedData);
      
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du quiz:', error);
      alert('❌ Erreur lors de la mise à jour du quiz');
    }
  }, []);

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      deleteCourse(courseId);
      alert('✅ Cours supprimé avec succès !');
    }
  };

  const handleNewCourseClick = () => {
    setShowNewCourseForm(true);
  };

  const handleCloseModal = () => {
    setShowNewCourseForm(false);
    setNewCourse({
      title: '',
      category: '',
      instructor: '',
      originalPrice: '',
      price: '',
      description: '',
      level: 'Intermédiaire',
      duration: '10h 00min',
      image: '/images/default-course.jpg',
      discountPercentage: 0,
      hasPromotion: false,
      status: 'draft'
    });
  };

  // Fonction pour rafraîchir manuellement les données
  const refreshData = () => {
    setLastUpdated(new Date().toISOString());
  };

  return {
    user,
    isAdmin,
    courses: courses.map(course => ({
      ...course,
      enrollmentCount: users.filter(u => 
        u.enrolledCourses && u.enrolledCourses.includes(course.id)
      ).length,
      revenue: payments
        .filter(p => p.courseId === course.id && p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0)
    })),
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
  };
};