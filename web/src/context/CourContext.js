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
      discountPercentage: 31,
      hasPromotion: true,
      objectives: [
        "Maîtriser les Hooks React (useState, useEffect, useContext, etc.)",
        "Comprendre et utiliser Context API efficacement",
        "Implémenter Redux pour la gestion d'état globale",
        "Créer des composants réutilisables et performants",
        "Développer des applications React complètes"
      ],
      includes: [
        "12 heures de vidéo à la demande",
        "15 articles",
        "10 ressources téléchargeables",
        "Accès complet à vie",
        "Certificat de fin de cours",
        "Support Q&A"
      ],
      languages: ["Français", "Anglais"],
      lastUpdated: new Date().toISOString(),
      ratingCount: 124,
      sections: [
        {
          title: "Introduction aux Hooks React",
          description: "Découvrez les bases des Hooks React et leur importance",
          lessons: [
            {
              title: "Introduction aux Hooks React",
              duration: "45min",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              description: "Découvrez les bases des Hooks React et pourquoi ils ont révolutionné la façon de développer avec React.",
              premium: false
            },
            {
              title: "useState et useEffect en profondeur",
              duration: "1h 20min",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              description: "Plongez dans les deux Hooks les plus importants : useState pour la gestion d'état et useEffect pour les effets de bord.",
              premium: false
            }
          ]
        },
        {
          title: "Context API et useReducer",
          description: "Apprenez à gérer l'état global de votre application",
          lessons: [
            {
              title: "Context API et useReducer",
              duration: "1h 30min",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              description: "Apprenez à gérer l'état global de votre application sans bibliothèque externe.",
              premium: true
            }
          ]
        }
      ]
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
      hasPromotion: true,
      objectives: [
        "Créer des interfaces utilisateur modernes et intuitives",
        "Maîtriser Figma pour le prototypage avancé",
        "Développer un design system cohérent",
        "Concevoir des expériences utilisateur optimales"
      ],
      includes: [
        "8 heures de vidéo à la demande",
        "12 articles",
        "8 ressources téléchargeables",
        "Accès complet à vie",
        "Certificat de fin de cours",
        "Fichiers source Figma"
      ],
      languages: ["Français"],
      lastUpdated: new Date().toISOString(),
      ratingCount: 89,
      sections: [
        {
          title: "Introduction à Figma",
          description: "Découvrez l'interface et les fonctionnalités de base",
          lessons: [
            {
              title: "Découverte de l'interface Figma",
              duration: "30min",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              description: "Apprenez à naviguer dans l'interface de Figma et découvrez ses principales fonctionnalités.",
              premium: false
            }
          ]
        }
      ]
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
      hasPromotion: true,
      objectives: [
        "Maîtriser les stratégies SEO modernes",
        "Optimiser les campagnes sur les réseaux sociaux",
        "Développer des stratégies d'email marketing efficaces",
        "Analyser les données avec Google Analytics"
      ],
      includes: [
        "10 heures de vidéo à la demande",
        "20 articles",
        "15 ressources téléchargeables",
        "Accès complet à vie",
        "Certificat de fin de cours",
        "Modèles de campagnes"
      ],
      languages: ["Français", "Arabe"],
      lastUpdated: new Date().toISOString(),
      ratingCount: 156,
      sections: [
        {
          title: "Fondamentaux du Marketing Digital",
          description: "Comprenez les bases du marketing digital moderne",
          lessons: [
            {
              title: "Introduction au Marketing Digital",
              duration: "45min",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              description: "Découvrez les principes fondamentaux du marketing digital et son importance en 2024.",
              premium: false
            }
          ]
        }
      ]
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
      hasPromotion: true,
      objectives: [
        "Maîtriser Python pour la data science",
        "Utiliser Pandas pour la manipulation de données",
        "Créer des visualisations avec Matplotlib",
        "Implémenter des algorithmes de machine learning"
      ],
      includes: [
        "15 heures de vidéo à la demande",
        "25 articles",
        "20 ressources téléchargeables",
        "Accès complet à vie",
        "Certificat de fin de cours",
        "Datasets d'entraînement"
      ],
      languages: ["Français", "Anglais"],
      lastUpdated: new Date().toISOString(),
      ratingCount: 210,
      sections: [
        {
          title: "Introduction à Python pour la Data Science",
          description: "Apprenez les bases de Python pour l'analyse de données",
          lessons: [
            {
              title: "Installation et environnement Python",
              duration: "30min",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              description: "Configurez votre environnement de développement pour la data science avec Python.",
              premium: false
            }
          ]
        }
      ]
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
      hasPromotion: true,
      objectives: [
        "Maîtriser l'interface et les outils de Photoshop",
        "Effectuer des retouches photo professionnelles",
        "Créer des montages avancés",
        "Préparer des fichiers pour l'impression et le web"
      ],
      includes: [
        "9 heures de vidéo à la demande",
        "15 articles",
        "12 ressources téléchargeables",
        "Accès complet à vie",
        "Certificat de fin de cours",
        "Pinceaux et actions personnalisés"
      ],
      languages: ["Français"],
      lastUpdated: new Date().toISOString(),
      ratingCount: 75,
      sections: [
        {
          title: "Découverte de Photoshop",
          description: "Prenez en main l'interface et les outils de base",
          lessons: [
            {
              title: "Interface et outils de base",
              duration: "40min",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              description: "Découvrez l'interface de Photoshop et ses principaux outils.",
              premium: false
            }
          ]
        }
      ]
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
      hasPromotion: true,
      objectives: [
        "Comprendre les méthodologies Agile",
        "Maîtriser Scrum et ses artefacts",
        "Implémenter Kanban pour la gestion de flux",
        "Devenir chef de projet Agile certifié"
      ],
      includes: [
        "7 heures de vidéo à la demande",
        "18 articles",
        "10 ressources téléchargeables",
        "Accès complet à vie",
        "Certificat de fin de cours",
        "Modèles de documents Agile"
      ],
      languages: ["Français", "Anglais"],
      lastUpdated: new Date().toISOString(),
      ratingCount: 98,
      sections: [
        {
          title: "Introduction aux Méthodologies Agile",
          description: "Découvrez les principes et valeurs Agile",
          lessons: [
            {
              title: "Manifeste Agile et principes",
              duration: "35min",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              description: "Comprenez les fondements du manifeste Agile et ses 12 principes.",
              premium: false
            }
          ]
        }
      ]
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
      createdAt: new Date().toISOString(),
      // Nouveaux champs avec valeurs par défaut
      objectives: courseData.objectives || [
        "Objectif d'apprentissage 1",
        "Objectif d'apprentissage 2"
      ],
      includes: courseData.includes || [
        "Accès complet à vie",
        "Certificat de fin de cours"
      ],
      languages: courseData.languages || ["Français"],
      lastUpdated: new Date().toISOString(),
      ratingCount: 0,
      sections: courseData.sections || [
        {
          title: "Introduction",
          description: "Section d'introduction au cours",
          lessons: [
            {
              title: "Première leçon",
              duration: "30min",
              videoUrl: "",
              description: "Description de la première leçon",
              premium: false
            }
          ]
        }
      ]
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

    // Mettre à jour la date de dernière modification
    courseData.lastUpdated = new Date().toISOString();

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

  // Fonction pour mettre à jour les métriques (évaluations, etc.)
  const updateCourseMetrics = (courseId, metrics) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId ? { ...course, ...metrics } : course
    ));
  };

  const value = {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    updateCourseMetrics
  };

  console.log('🔄 CourseContext rendu avec:', courses.length, 'cours');

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};