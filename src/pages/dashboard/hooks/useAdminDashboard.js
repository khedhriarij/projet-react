// src/pages/dashboard/hooks/useAdminDashboard.js
import { useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useAdmin } from '../../../hooks/UseAdmin';
import { useCourseContext } from '../../../context/CourContext';

export const useAdminDashboard = () => {
  const { user } = useAuthContext();
  const { isAdmin } = useAdmin();
  const { courses, addCourse, deleteCourse } = useCourseContext();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewCourseForm, setShowNewCourseForm] = useState(false);
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
      status: newCourse.status
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

  return {
    user,
    isAdmin,
    courses,
    activeTab,
    setActiveTab,
    showNewCourseForm,
    newCourse,
    defaultImages,
    handleInputChange,
    handleImageUrlChange,
    handleSelectDefaultImage,
    handleSubmitCourse,
    handleDeleteCourse,
    handleNewCourseClick,
    handleCloseModal
  };
};