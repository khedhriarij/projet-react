// src/viewmodels/hooks/useMyCourses.js - VERSION CORRIGÉE
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from './useAuthContext';
import { useCoursePurchase } from './useCoursePurchase';
import { useCourseContext } from '../context/CourContext';

export const useMyCourses = () => {
  const { user } = useAuthContext();
  const { getPurchasedCourses, getCourseProgress } = useCoursePurchase();
  const { getCourseById } = useCourseContext();
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMyCourses = useCallback(async () => {
    if (!user) {
      setCourses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Chargement des cours achetés pour:', user.id);
      
      const purchased = getPurchasedCourses();
      console.log('Cours achetés bruts:', purchased);
      
      // Vérifier si des cours ont été achetés
      if (!purchased || purchased.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      // Enrichir avec les données des cours et progression
      const enrichedCourses = purchased.map(purchase => {
        console.log('Traitement du cours:', purchase.courseId);
        
        const courseDetails = getCourseById ? getCourseById(purchase.courseId) : null;
        const progress = getCourseProgress ? getCourseProgress(purchase.courseId) : 0;
        
        console.log('Détails du cours:', courseDetails);
        console.log('Progression:', progress);

        // Données par défaut si les détails du cours ne sont pas trouvés
        const defaultCourse = {
          title: `Cours ${purchase.courseId}`,
          instructor: 'Formateur inconnu',
          image: '/images/default-course.jpg',
          category: 'Non catégorisé',
          duration: 'Durée inconnue',
          level: 'Niveau inconnu'
        };

        return {
          courseId: purchase.courseId,
          purchasedAt: purchase.purchasedAt,
          lastAccessed: purchase.lastAccessed || purchase.purchasedAt,
          completedLessons: purchase.completedLessons || [],
          progress: progress || 0,
          
          // Fusionner avec les détails du cours ou utiliser les valeurs par défaut
          ...defaultCourse,
          ...courseDetails
        };
      }).filter(course => course !== null); // Filtrer les cours null

      console.log('Cours enrichis:', enrichedCourses);
      setCourses(enrichedCourses);

    } catch (err) {
      console.error('Erreur détaillée:', err);
      setError(`Erreur lors du chargement de vos cours: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user, getPurchasedCourses, getCourseById, getCourseProgress]);

  useEffect(() => {
    loadMyCourses();
  }, [loadMyCourses]);

  const refreshCourses = () => {
    loadMyCourses();
  };

  return {
    courses,
    loading,
    error,
    refreshCourses
  };
};