// src/pages/dashboard/hooks/useAdminDashboard.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../../../viewmodels/hooks/useAuthContext';
import { useAdmin } from '../../../../viewmodels/hooks/UseAdmin';
import { useCourseContext } from '../../../../viewmodels/context/CourContext';
import api from '../../../../models/services/api';

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
  const [isLoading, setIsLoading] = useState({
    users: false,
    courses: false,
    stats: false,
    payments: false,
    allData: true // Nouvel état pour indiquer le chargement global
  });
  
  const [dataLoaded, setDataLoaded] = useState({
    users: false,
    payments: false,
    quizzes: false
  });
  
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

  // Fonction pour récupérer les utilisateurs depuis l'API
  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    
    try {
      setIsLoading(prev => ({ ...prev, users: true }));
      const response = await api.get('/users');
      
      if (response.data && response.data.success) {
        // Transformer les données de l'API pour correspondre à votre interface
        const formattedUsers = response.data.data.map(user => ({
          id: user._id || user.uid,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || '',
          role: user.role || 'student',
          online: false, // À implémenter avec WebSocket si nécessaire
          active: true,
          createdAt: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A',
          lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Jamais',
          enrolledCourses: user.enrolledCourses || [],
          purchases: user.purchases || []
        }));
        
        setUsers(formattedUsers);
        console.log(`${formattedUsers.length} utilisateurs chargés depuis l'API`);
        setDataLoaded(prev => ({ ...prev, users: true }));
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
      // Fallback vers des données mockées si l'API échoue
      const mockUsers = [
        {
          id: '1',
          displayName: "Ahmed Ben Salah",
          email: "ahmed@example.com",
          role: "student",
          online: true,
          active: true,
          createdAt: "2024-01-15",
          lastLogin: "2024-01-20"
        },
        {
          id: '2', 
          displayName: "Sarah Trabelsi",
          email: "sarah@example.com",
          role: "instructor",
          online: false,
          active: true,
          createdAt: "2024-01-10",
          lastLogin: "2024-01-18"
        }
      ];
      setUsers(mockUsers);
      setDataLoaded(prev => ({ ...prev, users: true }));
    } finally {
      setIsLoading(prev => ({ ...prev, users: false }));
    }
  }, [isAdmin]);

  // Fonction pour récupérer les paiements
  const fetchPayments = useCallback(async () => {
    if (!isAdmin) return;
    
    try {
      setIsLoading(prev => ({ ...prev, payments: true }));
      const response = await api.get('/payments');
      if (response.data && response.data.success) {
        const formattedPayments = response.data.data.map(payment => ({
          id: payment._id,
          userId: payment.userId,
          userName: payment.userName || 'Utilisateur',
          courseId: payment.courseId,
          courseTitle: payment.courseTitle || 'Cours',
          amount: payment.amount || 0,
          status: payment.status || 'pending',
          paymentDate: payment.createdAt ? new Date(payment.createdAt).toLocaleString() : 'N/A',
          reference: payment.reference || '',
          paymentMethod: payment.paymentMethod || 'Paymee'
        }));
        setPayments(formattedPayments);
        setDataLoaded(prev => ({ ...prev, payments: true }));
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des paiements:', error);
      setDataLoaded(prev => ({ ...prev, payments: true }));
    } finally {
      setIsLoading(prev => ({ ...prev, payments: false }));
    }
  }, [isAdmin]);

  // Fonction pour récupérer les quizzes
  const fetchQuizzes = useCallback(async () => {
    if (!isAdmin) return;
    
    try {
      // Simuler des données de quiz (à remplacer par une API réelle)
      const mockQuizzes = [
        {
          id: '1',
          title: 'Quiz React Avancé',
          courseId: 'react-course',
          questions: 15,
          isActive: true,
          updatedAt: new Date().toISOString(),
          participants: 45
        }
      ];
      setQuizzes(mockQuizzes);
      setDataLoaded(prev => ({ ...prev, quizzes: true }));
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des quizzes:', error);
      setDataLoaded(prev => ({ ...prev, quizzes: true }));
    }
  }, [isAdmin]);

  // Vérifier si toutes les données sont chargées
  const checkAllDataLoaded = useCallback(() => {
    const allLoaded = dataLoaded.users && dataLoaded.payments && dataLoaded.quizzes;
    if (allLoaded) {
      setIsLoading(prev => ({ ...prev, allData: false }));
    }
  }, [dataLoaded]);

  // Vérifier périodiquement si toutes les données sont chargées
  useEffect(() => {
    checkAllDataLoaded();
  }, [dataLoaded, checkAllDataLoaded]);

  // Récupérer les données initiales
  useEffect(() => {
    if (!isAdmin) return;
    
    const loadInitialData = async () => {
      setIsLoading(prev => ({ ...prev, allData: true }));
      
      await Promise.all([
        fetchUsers(),
        fetchPayments(),
        fetchQuizzes()
      ]);
      
      setLastUpdated(new Date().toISOString());
    };
    
    loadInitialData();
  }, [isAdmin, fetchUsers, fetchPayments, fetchQuizzes]);

  // Calculer les statistiques en temps réel
  useEffect(() => {
    if (!courses.length || isLoading.allData) return;
    
    const calculateStats = () => {
      // Calculer le nombre d'étudiants
      const studentUsers = users.filter(u => u.role === 'student');
      
      // Calculer les revenus
      const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0);
      
      // Calculer les revenus du mois en cours
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
      
      // Compter les cours avec des étudiants inscrits
      const coursesWithStudents = courses.filter(course => {
        return users.some(user => 
          user.enrolledCourses && 
          user.enrolledCourses.some(ec => ec.courseId === course.id)
        );
      });
      
      return {
        totalRevenue,
        monthlyRevenue,
        totalStudents: studentUsers.length,
        totalCourses: courses.length,
        activeCourses: coursesWithStudents.length,
        totalQuizzes: quizzes.length,
        activeQuizzes: quizzes.filter(quiz => quiz.isActive !== false).length,
        totalUsers: users.length,
        totalPayments: payments.filter(p => p.status === 'completed').length,
        monthlyGrowth: calculateMonthlyGrowth(),
        conversionRate: calculateConversionRate(studentUsers.length, users.length)
      };
    };
    
    setStats(calculateStats());
  }, [courses, users, payments, quizzes, isLoading.allData]);

  const calculateMonthlyGrowth = () => {
    // Logique pour calculer la croissance mensuelle
    // À implémenter avec des données historiques
    return 12.5; // Valeur par défaut
  };

  const calculateConversionRate = (students, totalUsers) => {
    if (totalUsers === 0) return 0;
    return ((students / totalUsers) * 100).toFixed(1);
  };

  // Fonction pour mettre à jour le rôle d'un utilisateur
  const handleUpdateUserRole = useCallback(async (userId, newRole) => {
    try {
      const response = await api.put(`/users/${userId}`, { role: newRole });
      
      if (response.data && response.data.success) {
        // Mettre à jour localement
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
        
        alert('✅ Rôle mis à jour avec succès !');
        return true;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du rôle:', error);
      alert('❌ Erreur lors de la mise à jour du rôle');
      return false;
    }
  }, []);

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = useCallback(async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      return;
    }
    
    try {
      const response = await api.delete(`/users/${userId}`);
      
      if (response.data && response.data.success) {
        // Supprimer localement
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        alert('✅ Utilisateur supprimé avec succès !');
        return true;
      }
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'utilisateur:', error);
      alert('❌ Erreur lors de la suppression de l\'utilisateur');
      return false;
    }
  }, []);

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
    setDataLoaded({
      users: false,
      payments: false,
      quizzes: false
    });
    setIsLoading(prev => ({ ...prev, allData: true }));
    
    fetchUsers();
    fetchPayments();
    fetchQuizzes();
    
    setLastUpdated(new Date().toISOString());
  };

  return {
    user,
    isAdmin,
    courses: courses.map(course => ({
      ...course,
      enrollmentCount: users.filter(u => 
        u.enrolledCourses && u.enrolledCourses.some(ec => ec.courseId === course.id)
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
    handleUpdateUserRole,
    handleDeleteUser,
    handleNewCourseClick,
    handleCloseModal,
    refreshData,
    fetchUsers,
    fetchPayments
  };
};