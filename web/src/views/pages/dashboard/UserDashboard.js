// pages/dashboard/UserDashboard.js
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../../viewmodels/hooks/useAuthContext';
import { projectFirestore } from '../../../models/services/firebase/config';// Importez directement depuis config.js

import { useNavigate, Link } from 'react-router-dom';
import './UserDashboard.css';

export default function UserDashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  
  const [dashboardData, setDashboardData] = useState({
    stats: {
      enrolledCourses: 0,
      completedCourses: 0,
      totalHours: 0,
      certificates: 0,
      totalQuizzes: 0,
      completedQuizzes: 0,
      streak: 0,
      currentLevel: 'Débutant'
    },
    currentCourses: [],
    completedCourses: [],
    recommendedCourses: [],
    recentActivity: [],
    upcomingDeadlines: [],
    certificates: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !projectFirestore) return;

    const fetchUserDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Récupérer les données utilisateur
        const userDocRef = projectFirestore.collection('users').doc(user.uid);
        const userDoc = await userDocRef.get();
        const userData = userDoc.exists ? userDoc.data() : {};
        
        // 2. Récupérer les cours de l'utilisateur
        const userCoursesSnapshot = await projectFirestore
          .collection('userCourses')
          .where('userId', '==', user.uid)
          .get();
        
        const enrolledCourses = [];
        let completedCoursesCount = 0;
        let totalHours = 0;
        
        // 3. Pour chaque cours, récupérer les détails et la progression
        for (const userCourseDoc of userCoursesSnapshot.docs) {
          const userCourseData = userCourseDoc.data();
          
          // Récupérer les détails du cours
          const courseDocRef = projectFirestore.collection('courses').doc(userCourseData.courseId);
          const courseDoc = await courseDocRef.get();
          
          if (courseDoc.exists) {
            const courseData = courseDoc.data();
            
            // Calculer la progression
            const progressData = await calculateCourseProgress(user.uid, userCourseData.courseId);
            
            const courseInfo = {
              id: userCourseData.courseId,
              ...courseData,
              progress: progressData.percentage || 0,
              completedLessons: progressData.completedLessons || 0,
              totalLessons: progressData.totalLessons || 0,
              lastActivity: userCourseData.lastAccessed 
                ? formatTimeAgo(userCourseData.lastAccessed.toDate())
                : 'Pas encore commencé',
              enrolledAt: userCourseData.enrolledAt ? userCourseData.enrolledAt.toDate() : new Date()
            };
            
            enrolledCourses.push(courseInfo);
            
            // Mettre à jour les statistiques
            if (progressData.percentage >= 100) {
              completedCoursesCount++;
            }
            
            totalHours += courseData.duration ? parseDurationToHours(courseData.duration) : 0;
          }
        }
        
        // 4. Récupérer les certificats
        const certificatesSnapshot = await projectFirestore
          .collection('certificates')
          .where('userId', '==', user.uid)
          .get();
        
        const certificates = certificatesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // 5. Récupérer les quiz complétés
        const quizResultsSnapshot = await projectFirestore
          .collection('quizResults')
          .where('userId', '==', user.uid)
          .get();
        
        const completedQuizzes = quizResultsSnapshot.docs.map(doc => doc.data());
        
        // 6. Récupérer les activités récentes
        const recentActivities = await fetchRecentActivities(user.uid);
        
        // 7. Générer les cours recommandés basés sur les intérêts
        const recommendedCourses = await generateRecommendedCourses(
          userData.interests || [],
          enrolledCourses.map(course => course.category),
          enrolledCourses
        );
        
        // 8. Calculer les deadlines (missions/quiz à venir)
        const upcomingDeadlines = await fetchUpcomingDeadlines(user.uid);
        
        setDashboardData({
          stats: {
            enrolledCourses: enrolledCourses.length,
            completedCourses: completedCoursesCount,
            totalHours: Math.round(totalHours),
            certificates: certificates.length,
            totalQuizzes: completedQuizzes.length,
            completedQuizzes: completedQuizzes.filter(q => q.score >= (q.passingScore || 70)).length,
            streak: userData.learningStreak || 0,
            currentLevel: userData.level || 'Débutant'
          },
          currentCourses: enrolledCourses.filter(course => course.progress < 100),
          completedCourses: enrolledCourses.filter(course => course.progress >= 100),
          recommendedCourses: recommendedCourses.slice(0, 3),
          recentActivity: recentActivities.slice(0, 5),
          upcomingDeadlines: upcomingDeadlines.slice(0, 3),
          certificates: certificates.slice(0, 3)
        });
        
      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDashboardData();
  }, [user]);

  // Fonction pour calculer la progression d'un cours
  const calculateCourseProgress = async (userId, courseId) => {
    try {
      // Récupérer toutes les leçons du cours
      const lessonsSnapshot = await projectFirestore
        .collection('courses')
        .doc(courseId)
        .collection('lessons')
        .get();
      
      const totalLessons = lessonsSnapshot.docs.length;
      
      if (totalLessons === 0) return { percentage: 0, completedLessons: 0, totalLessons: 0 };
      
      // Récupérer les leçons complétées par l'utilisateur
      const completedSnapshot = await projectFirestore
        .collection('userProgress')
        .where('userId', '==', userId)
        .where('courseId', '==', courseId)
        .where('completed', '==', true)
        .get();
      
      const completedLessons = completedSnapshot.docs.length;
      
      const percentage = Math.round((completedLessons / totalLessons) * 100);
      
      return {
        percentage,
        completedLessons,
        totalLessons
      };
    } catch (error) {
      console.error('Erreur calcul progression:', error);
      return { percentage: 0, completedLessons: 0, totalLessons: 0 };
    }
  };

  // Fonction pour récupérer les activités récentes
  const fetchRecentActivities = async (userId) => {
    try {
      const activities = [];
      
      // 1. Progression de cours
      const progressSnapshot = await projectFirestore
        .collection('userProgress')
        .where('userId', '==', userId)
        .orderBy('completedAt', 'desc')
        .limit(10)
        .get();
      
      progressSnapshot.docs.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: 'lesson_completed',
          title: 'Leçon terminée',
          description: `Vous avez terminé "${data.lessonTitle || 'une leçon'}"`,
          time: formatTimeAgo(data.completedAt ? data.completedAt.toDate() : null),
          icon: '📚',
          courseId: data.courseId
        });
      });
      
      // 2. Quiz complétés
      const quizSnapshot = await projectFirestore
        .collection('quizResults')
        .where('userId', '==', userId)
        .orderBy('completedAt', 'desc')
        .limit(5)
        .get();
      
      quizSnapshot.docs.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: 'quiz_completed',
          title: 'Quiz terminé',
          description: `Score: ${data.score || 0}% - ${data.quizTitle || 'Quiz'}`,
          time: formatTimeAgo(data.completedAt ? data.completedAt.toDate() : null),
          icon: '🎯',
          passed: data.score >= (data.passingScore || 70)
        });
      });
      
      // 3. Certificats obtenus
      const certSnapshot = await projectFirestore
        .collection('certificates')
        .where('userId', '==', userId)
        .orderBy('issuedAt', 'desc')
        .limit(5)
        .get();
      
      certSnapshot.docs.forEach(doc => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          type: 'certificate_earned',
          title: 'Certificat obtenu',
          description: `Félicitations! ${data.courseTitle || 'Certificat'}`,
          time: formatTimeAgo(data.issuedAt ? data.issuedAt.toDate() : null),
          icon: '🏆'
        });
      });
      
      // Trier toutes les activités par date
      return activities.sort((a, b) => {
        const timeA = a.time === 'Inconnu' ? new Date(0) : new Date(a.time);
        const timeB = b.time === 'Inconnu' ? new Date(0) : new Date(b.time);
        return timeB - timeA;
      });
      
    } catch (error) {
      console.error('Erreur récupération activités:', error);
      return [];
    }
  };

  // Fonction pour générer des cours recommandés
  const generateRecommendedCourses = async (userInterests, enrolledCategories, enrolledCourses) => {
    try {
      // Récupérer tous les cours
      const coursesSnapshot = await projectFirestore.collection('courses').get();
      
      const allCourses = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filtrer les cours que l'utilisateur a déjà
      const enrolledCourseIds = enrolledCourses.map(course => course.id);
      
      const availableCourses = allCourses.filter(
        course => !enrolledCourseIds.includes(course.id)
      );
      
      // Si pas d'intérêts, retourner des cours populaires
      if (!userInterests || userInterests.length === 0 && enrolledCategories.length === 0) {
        return availableCourses
          .sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
          .slice(0, 6);
      }
      
      // Prioriser par intérêts et catégories similaires
      const scoredCourses = availableCourses.map(course => {
        let score = 0;
        
        // Score basé sur les intérêts
        if (userInterests && userInterests.length > 0) {
          userInterests.forEach(interest => {
            if (course.title && course.title.toLowerCase().includes(interest.toLowerCase())) {
              score += 3;
            }
            if (course.description && course.description.toLowerCase().includes(interest.toLowerCase())) {
              score += 2;
            }
          });
        }
        
        // Score basé sur les catégories similaires
        if (enrolledCategories.includes(course.category)) {
          score += 2;
        }
        
        // Score basé sur la popularité
        score += (course.enrollmentCount || 0) / 100;
        
        return { ...course, recommendationScore: score };
      });
      
      // Trier par score et retourner les meilleurs
      return scoredCourses
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, 6);
        
    } catch (error) {
      console.error('Erreur génération recommandations:', error);
      return [];
    }
  };

  // Fonction pour récupérer les deadlines
  const fetchUpcomingDeadlines = async (userId) => {
    try {
      const deadlines = [];
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      // Récupérer les missions avec deadlines
      const assignmentsSnapshot = await projectFirestore
        .collection('assignments')
        .where('assignedTo', 'array-contains', userId)
        .where('dueDate', '>=', now)
        .where('dueDate', '<=', nextWeek)
        .orderBy('dueDate', 'asc')
        .get();
      
      assignmentsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        deadlines.push({
          id: doc.id,
          type: 'assignment',
          title: data.title,
          description: data.description,
          dueDate: data.dueDate ? data.dueDate.toDate() : new Date(),
          courseId: data.courseId,
          icon: '📝'
        });
      });
      
      // Récupérer les quiz avec deadlines
      const quizzesSnapshot = await projectFirestore
        .collection('quizzes')
        .where('availableUntil', '>=', now)
        .where('availableUntil', '<=', nextWeek)
        .orderBy('availableUntil', 'asc')
        .get();
      
      quizzesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        deadlines.push({
          id: doc.id,
          type: 'quiz',
          title: data.title,
          description: `Quiz: ${data.title}`,
          dueDate: data.availableUntil ? data.availableUntil.toDate() : new Date(),
          courseId: data.courseId,
          icon: '🎯'
        });
      });
      
      return deadlines.sort((a, b) => a.dueDate - b.dueDate);
      
    } catch (error) {
      console.error('Erreur récupération deadlines:', error);
      return [];
    }
  };

  // Fonctions utilitaires
  const formatTimeAgo = (date) => {
    if (!date) return 'Inconnu';
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    if (diffHours > 0) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    if (diffMins > 0) return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    return 'À l\'instant';
  };

  const parseDurationToHours = (duration) => {
    if (!duration) return 0;
    
    // Essaie de parser différentes formats
    const hoursMatch = duration.match(/(\d+)\s*h/);
    if (hoursMatch) return parseInt(hoursMatch[1]);
    
    // Si format "hh:mm"
    const timeMatch = duration.match(/(\d+):(\d+)/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      return hours + (minutes / 60);
    }
    
    // Si juste un nombre
    const numMatch = duration.match(/(\d+)/);
    if (numMatch) return parseInt(numMatch[1]);
    
    return 0;
  };

  const handleContinueCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleExploreCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleViewCertificate = (certificateId) => {
    navigate(`/certificates/${certificateId}`);
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Chargement de votre tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* En-tête avec informations utilisateur */}
      <div className="dashboard-header">
        <div className="user-welcome">
          <h1>Mon Tableau de Bord</h1>
          <div className="user-info">
            <p className="welcome-message">
              Bonjour <strong>{user?.displayName || user?.email?.split('@')[0]}</strong>! 👋 
            </p>
            <div className="user-level">
              <span className="level-badge">Niveau {dashboardData.stats.currentLevel}</span>
              <span className="streak">🔥 {dashboardData.stats.streak} jours de suite</span>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="btn-primary" onClick={() => navigate('/catalog')}>
            Explorer les cours
          </button>
          <Link to="/profile" className="btn-secondary">
            Mon profil
          </Link>
        </div>
      </div>

      {/* Statistiques avancées */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-number">{dashboardData.stats.enrolledCourses}</div>
            <div className="stat-label">Cours Inscrits</div>
            <div className="stat-subtitle">
              {dashboardData.stats.completedCourses} terminés
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-number">{dashboardData.stats.totalHours}h</div>
            <div className="stat-label">Heures Apprises</div>
            <div className="stat-subtitle">Total cumulé</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-number">{dashboardData.stats.completedQuizzes}</div>
            <div className="stat-label">Quiz Réussis</div>
            <div className="stat-subtitle">
              sur {dashboardData.stats.totalQuizzes} tentés
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-number">{dashboardData.stats.certificates}</div>
            <div className="stat-label">Certificats</div>
            <Link to="/certificates" className="stat-subtitle">
              Voir mes certificats →
            </Link>
          </div>
        </div>
      </div>

      {/* Cours en cours avec détails */}
      <div className="current-courses">
        <div className="section-header">
          <h2>Mes Cours en Cours</h2>
          <div className="header-actions">
            <Link to="/my-courses" className="view-all">
              Voir tous mes cours →
            </Link>
            {dashboardData.currentCourses.length > 0 && (
              <div className="progress-summary">
                Progression moyenne: {Math.round(
                  dashboardData.currentCourses.reduce((sum, course) => sum + course.progress, 0) / 
                  dashboardData.currentCourses.length
                )}%
              </div>
            )}
          </div>
        </div>
        
        {dashboardData.currentCourses.length > 0 ? (
          <div className="courses-grid">
            {dashboardData.currentCourses.map(course => (
              <div key={course.id} className="course-progress-card">
                <div className="course-progress-header">
                  {course.image && (
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="course-image"
                      onError={(e) => e.target.src = '/images/default-course.jpg'}
                    />
                  )}
                  <div className="course-progress-info">
                    <h4>{course.title}</h4>
                    <p className="course-category">{course.category}</p>
                    <p className="last-activity">
                      <span className="activity-icon">🕒</span>
                      {course.lastActivity}
                    </p>
                    <div className="lesson-progress">
                      Leçon {course.completedLessons}/{course.totalLessons}
                    </div>
                  </div>
                </div>
                
                <div className="progress-section">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    <span>Progression</span>
                    <span>{course.progress}%</span>
                  </div>
                  
                  <button 
                    className="continue-btn"
                    onClick={() => handleContinueCourse(course.id)}
                  >
                    {course.progress > 0 ? 'Continuer' : 'Commencer'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h4>Vous n'avez pas encore de cours</h4>
            <p>Commencez votre parcours d'apprentissage dès maintenant</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/catalog')}
            >
              Explorer les cours
            </button>
          </div>
        )}
      </div>

      {/* Activité récente détaillée */}
      <div className="recent-activity">
        <div className="section-header">
          <h2>Activité Récente</h2>
          <Link to="/activity" className="view-all">
            Voir toutes les activités →
          </Link>
        </div>
        
        {dashboardData.recentActivity.length > 0 ? (
          <div className="activity-list">
            {dashboardData.recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.icon}
                </div>
                <div className="activity-content">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  {activity.courseId && (
                    <Link 
                      to={`/course/${activity.courseId}`}
                      className="activity-course-link"
                    >
                      Voir le cours
                    </Link>
                  )}
                </div>
                <div className="activity-time">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p>Aucune activité récente</p>
          </div>
        )}
      </div>

      {/* Cours recommandés personnalisés */}
      <div className="recommended-courses">
        <div className="section-header">
          <h2>Cours Recommandés pour Vous</h2>
          <div className="recommendation-tags">
            {user && user.interests && user.interests.slice(0, 3).map((interest, index) => (
              <span key={index} className="interest-tag">
                {interest}
              </span>
            ))}
          </div>
        </div>
        
        {dashboardData.recommendedCourses.length > 0 ? (
          <div className="recommendations-grid">
            {dashboardData.recommendedCourses.map(course => (
              <div key={course.id} className="recommendation-card">
                <div className="recommendation-header">
                  {course.image && (
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="recommendation-image"
                      onError={(e) => e.target.src = '/images/default-course.jpg'}
                    />
                  )}
                  <div className="recommendation-meta">
                    <span className="course-level">{course.level}</span>
                    <span className="course-category">{course.category}</span>
                  </div>
                </div>
                
                <div className="recommendation-content">
                  <h4>{course.title}</h4>
                  <p className="course-description">
                    {course.description ? course.description.substring(0, 100) + '...' : 'Aucune description'}
                  </p>
                  <div className="course-stats">
                    <span>👥 {course.enrollmentCount || 0} étudiants</span>
                    <span>⭐ {course.rating || '4.5'}/5</span>
                  </div>
                  
                  <div className="recommendation-actions">
                    <button 
                      className="explore-btn"
                      onClick={() => handleExploreCourse(course.id)}
                    >
                      Découvrir
                    </button>
                    {course.hasPromotion && (
                      <span className="discount-badge">
                        -{course.discountPercentage}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <p>Aucune recommandation disponible</p>
            <button 
              className="btn-primary"
              onClick={() => navigate('/catalog')}
            >
              Explorer tous les cours
            </button>
          </div>
        )}
      </div>

      {/* Deadlines et échéances */}
      {dashboardData.upcomingDeadlines.length > 0 && (
        <div className="deadlines-section">
          <div className="section-header">
            <h2>Échéances à Venir</h2>
            <span className="deadline-count">
              {dashboardData.upcomingDeadlines.length} échéance(s)
            </span>
          </div>
          
          <div className="deadlines-list">
            {dashboardData.upcomingDeadlines.map(deadline => (
              <div key={deadline.id} className="deadline-item">
                <div className="deadline-icon">
                  {deadline.icon}
                </div>
                <div className="deadline-content">
                  <h4>{deadline.title}</h4>
                  <p>{deadline.description}</p>
                  <div className="deadline-time">
                    <span className="time-icon">⏰</span>
                    Échéance: {deadline.dueDate.toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <button 
                  className="deadline-action"
                  onClick={() => navigate(`/assignment/${deadline.id}`)}
                >
                  Commencer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificats récents */}
      {dashboardData.certificates.length > 0 && (
        <div className="certificates-section">
          <div className="section-header">
            <h2>Mes Certificats Récents</h2>
            <Link to="/certificates" className="view-all">
              Voir tous →
            </Link>
          </div>
          
          <div className="certificates-grid">
            {dashboardData.certificates.map(cert => (
              <div key={cert.id} className="certificate-card">
                <div className="certificate-header">
                  <div className="certificate-icon">🏆</div>
                  <div className="certificate-info">
                    <h4>{cert.courseTitle}</h4>
                    <p>Certifié le {cert.issuedAt ? cert.issuedAt.toDate().toLocaleDateString('fr-FR') : 'Date inconnue'}</p>
                  </div>
                </div>
                <div className="certificate-actions">
                  <button 
                    className="btn-outline"
                    onClick={() => handleViewCertificate(cert.id)}
                  >
                    Voir le certificat
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => window.print()}
                  >
                    Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}