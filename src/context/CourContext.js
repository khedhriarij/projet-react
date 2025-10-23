// context/CourContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const CourseContext = createContext();

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Données initiales des cours
  const getInitialCourses = () => [
    {
      id: 1,
      title: "React Avancé - Les Hooks et Context API",
      description: "Maîtrisez React avec les Hooks modernes, Context API et Redux. Développez des applications complexes avec les meilleures pratiques.",
      price: 89,
      originalPrice: 129,
      category: "Développement",
      image: "/images/react.jpg",
      instructor: "Ahmed Ben Ali",
      rating: 4.8,
      students: 1240,
      duration: "12h 30min",
      level: "Intermédiaire",
      featured: true,
      status: "published",
      discountPercentage: 31, // Nouveau champ
      hasPromotion: true // Nouveau champ
    },
    {
      id: 2,
      title: "UI/UX Design avec Figma",
      description: "Apprenez à créer des interfaces utilisateur modernes et intuitives. Prototypage avancé et design system.",
      price: 69,
      originalPrice: 99,
      category: "Design",
      image: "/images/figma.webp",
      instructor: "Sarah Trabelsi",
      rating: 4.9,
      students: 890,
      duration: "8h 15min",
      level: "Débutant",
      featured: false,
      status: "published",
      discountPercentage: 30,
      hasPromotion: true
    },
    {
      id: 3,
      title: "Marketing Digital 2024",
      description: "Stratégies complètes de marketing digital: SEO, réseaux sociaux, email marketing et analytics.",
      price: 79,
      originalPrice: 119,
      category: "Business",
      image: "/images/marketing-digital.jpg",
      instructor: "Mohamed Dridi",
      rating: 4.7,
      students: 1560,
      duration: "10h 45min",
      level: "Tous niveaux",
      featured: true,
      status: "published",
      discountPercentage: 34,
      hasPromotion: true
    },
    {
      id: 4,
      title: "Python & Data Science",
      description: "Devenez data scientist avec Python. Pandas, NumPy, Matplotlib et machine learning.",
      price: 99,
      originalPrice: 149,
      category: "Développement",
      image: "/images/python.jpeg",
      instructor: "Leila Mansour",
      rating: 4.8,
      students: 2100,
      duration: "15h 20min",
      level: "Avancé",
      featured: false,
      status: "published",
      discountPercentage: 34,
      hasPromotion: true
    },
    {
      id: 5,
      title: "Adobe Photoshop Pro",
      description: "Maîtrisez Photoshop de A à Z. Retouche photo, montage avancé et création digitale.",
      price: 59,
      originalPrice: 89,
      category: "Design",
      image: "/images/adobe.jpg",
      instructor: "Youssef Guedira",
      rating: 4.6,
      students: 750,
      duration: "9h 10min",
      level: "Débutant",
      featured: false,
      status: "published",
      discountPercentage: 34,
      hasPromotion: true
    },
    {
      id: 6,
      title: "Gestion de Projet Agile",
      description: "Méthodologies Agile, Scrum, Kanban. Devenez chef de projet certifié.",
      price: 85,
      originalPrice: 125,
      category: "Business",
      image: "/images/agile.jpeg",
      instructor: "Nadia Boukadida",
      rating: 4.9,
      students: 980,
      duration: "7h 45min",
      level: "Intermédiaire",
      featured: true,
      status: "published",
      discountPercentage: 32,
      hasPromotion: true
    }
  ];

  // Charger les cours depuis le localStorage au démarrage
  useEffect(() => {
    const savedCourses = localStorage.getItem('eduplatform_courses');
    console.log('📥 Chargement des cours depuis localStorage...');
    
    if (savedCourses) {
      const parsedCourses = JSON.parse(savedCourses);
      console.log('✅ Cours chargés depuis localStorage:', parsedCourses.length);
      setCourses(parsedCourses);
    } else {
      const initialCourses = getInitialCourses();
      console.log('🆕 Initialisation avec cours par défaut:', initialCourses.length);
      setCourses(initialCourses);
      localStorage.setItem('eduplatform_courses', JSON.stringify(initialCourses));
    }
    setInitialized(true);
  }, []);

  // Sauvegarder les cours dans le localStorage à chaque modification
  useEffect(() => {
    if (initialized && courses.length > 0) {
      console.log('💾 Sauvegarde des cours dans localStorage:', courses.length);
      localStorage.setItem('eduplatform_courses', JSON.stringify(courses));
    }
  }, [courses, initialized]);

  // Fonction pour calculer le prix original basé sur le prix et le pourcentage de promotion
  const calculateOriginalPrice = (price, discountPercentage) => {
    if (!discountPercentage || discountPercentage === 0) {
      return null;
    }
    const original = Math.round(price / (1 - discountPercentage / 100));
    return original;
  };

  const addCourse = (courseData) => {
    const hasPromotion = courseData.discountPercentage > 0;
    const originalPrice = hasPromotion 
      ? calculateOriginalPrice(courseData.price, courseData.discountPercentage)
      : null;

    const newCourse = {
      id: Date.now(), // Utiliser timestamp pour ID unique
      ...courseData,
      rating: 4.5,
      students: 0,
      duration: courseData.duration || "10h 00min",
      level: courseData.level || "Intermédiaire",
      featured: false,
      originalPrice: originalPrice,
      image: courseData.image || "/images/default-course.jpg",
      status: courseData.status || "draft",
      hasPromotion: hasPromotion,
      discountPercentage: courseData.discountPercentage || 0,
      createdAt: new Date().toISOString()
    };

    console.log('➕ Ajout du nouveau cours:', newCourse);
    
    setCourses(prev => {
      const updatedCourses = [...prev, newCourse];
      console.log('📦 Total des cours après ajout:', updatedCourses.length);
      return updatedCourses;
    });
    
    return newCourse;
  };

  const updateCourse = (courseId, courseData) => {
    console.log('✏️ Mise à jour du cours:', courseId);
    
    // Recalculer le prix original si le pourcentage de promotion change
    if (courseData.discountPercentage !== undefined) {
      const hasPromotion = courseData.discountPercentage > 0;
      const currentCourse = courses.find(course => course.id === courseId);
      const price = courseData.price !== undefined ? courseData.price : currentCourse.price;
      
      courseData.originalPrice = hasPromotion 
        ? calculateOriginalPrice(price, courseData.discountPercentage)
        : null;
      courseData.hasPromotion = hasPromotion;
    }

    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, ...courseData } : course
    ));
  };

  const deleteCourse = (courseId) => {
    console.log('🗑️ Suppression du cours:', courseId);
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const getCourseById = (courseId) => {
    return courses.find(course => course.id === courseId);
  };

  const value = {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById
  };

  console.log('🔄 CourseContext rendu avec:', courses.length, 'cours');

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};