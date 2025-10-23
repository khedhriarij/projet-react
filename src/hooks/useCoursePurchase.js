// hooks/useCoursePurchase.js
import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useCoursePurchase = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuthContext();

  // Simulate payment - always returns true for now
  const purchaseCourse = async (courseId, courseData) => {
    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, always return success
      const success = true;
      
      if (success && user) {
        // Store purchased course in localStorage (replace with Firebase later)
        const purchasedCourses = JSON.parse(localStorage.getItem(`purchasedCourses_${user.uid}`) || '[]');
        
        const newPurchase = {
          courseId,
          purchasedAt: new Date().toISOString(),
          progress: 0,
          completedLessons: [],
          ...courseData
        };
        
        // Check if course already purchased
        if (!purchasedCourses.find(course => course.courseId === courseId)) {
          purchasedCourses.push(newPurchase);
          localStorage.setItem(`purchasedCourses_${user.uid}`, JSON.stringify(purchasedCourses));
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Purchase error:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if user has purchased a course
  const hasPurchasedCourse = (courseId) => {
    if (!user) return false;
    
    const purchasedCourses = JSON.parse(localStorage.getItem(`purchasedCourses_${user.uid}`) || '[]');
    return purchasedCourses.some(course => course.courseId === courseId);
  };

  // Get user's purchased courses
  const getPurchasedCourses = () => {
    if (!user) return [];
    
    return JSON.parse(localStorage.getItem(`purchasedCourses_${user.uid}`) || '[]');
  };

  // Update course progress
  const updateCourseProgress = (courseId, lessonId, isCompleted) => {
    if (!user) return;

    const purchasedCourses = JSON.parse(localStorage.getItem(`purchasedCourses_${user.uid}`) || '[]');
    const courseIndex = purchasedCourses.findIndex(course => course.courseId === courseId);
    
    if (courseIndex !== -1) {
      let course = purchasedCourses[courseIndex];
      
      if (isCompleted) {
        // Add lesson to completed if not already there
        if (!course.completedLessons.includes(lessonId)) {
          course.completedLessons.push(lessonId);
        }
      } else {
        // Remove lesson from completed
        course.completedLessons = course.completedLessons.filter(id => id !== lessonId);
      }
      
      // Calculate progress percentage
      const totalLessons = 10; // This should come from course data
      course.progress = Math.round((course.completedLessons.length / totalLessons) * 100);
      
      purchasedCourses[courseIndex] = course;
      localStorage.setItem(`purchasedCourses_${user.uid}`, JSON.stringify(purchasedCourses));
      
      return course.progress;
    }
  };

  return {
    purchaseCourse,
    hasPurchasedCourse,
    getPurchasedCourses,
    updateCourseProgress,
    isProcessing
  };
};