// pages/dashboard/UserDashboard.js
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './UserDashboard.css';

export default function UserDashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    currentCourses: [],
    recommendedCourses: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  // Données mockées - À remplacer par Firebase
  useEffect(() => {
    const mockData = {
      stats: {
        enrolledCourses: 3,
        completedCourses: 1,
        totalHours: 15,
        certificates: 1
      },
      currentCourses: [
        {
          id: 1,
          title: "React Avancé - Les Hooks et Context API",
          progress: 65,
          lastActivity: "Il y a 2 jours",
          nextLesson: "useReducer et useContext",
          image: "/images/react.jpg"
        },
        {
          id: 2,
          title: "UI/UX Design avec Figma",
          progress: 30,
          lastActivity: "Il y a 1 semaine",
          nextLesson: "Design System",
          image: "/images/figma.webp"
        },
        {
          id: 3,
          title: "Marketing Digital 2024",
          progress: 0,
          lastActivity: "Pas encore commencé",
          nextLesson: "Introduction au SEO",
          image: "/images/marketing-digital.jpg"
        }
      ],
      recommendedCourses: [
        {
          id: 4,
          title: "Python & Data Science",
          category: "Développement",
          description: "Devenez data scientist avec Python",
          icon: "🐍"
        },
        {
          id: 5,
          title: "Adobe Photoshop Pro",
          category: "Design",
          description: "Maîtrisez Photoshop de A à Z",
          icon: "🎨"
        },
        {
          id: 6,
          title: "Gestion de Projet Agile",
          category: "Business",
          description: "Méthodologies Agile, Scrum, Kanban",
          icon: "📊"
        }
      ],
      recentActivity: [
        {
          id: 1,
          type: 'course_progress',
          title: 'React Avancé',
          description: 'Vous avez terminé le chapitre "Les Hooks Personnalisés"',
          time: 'Il y a 2 jours',
          icon: '📚'
        },
        {
          id: 2,
          type: 'quiz_completed',
          title: 'Quiz UI/UX Design',
          description: 'Score: 85% - Excellent travail!',
          time: 'Il y a 3 jours',
          icon: '🎯'
        },
        {
          id: 3,
          type: 'certificate_earned',
          title: 'Certificat obtenu',
          description: 'Félicitations! Vous avez obtenu le certificat JavaScript',
          time: 'Il y a 1 semaine',
          icon: '🏆'
        }
      ]
    };

    setDashboardData(mockData);
    setLoading(false);
  }, []);

  const handleContinueCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleExploreCourse = (courseId) => {
    navigate(`/course/${courseId}`);
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
      {/* En-tête */}
      <div className="dashboard-header">
        <h1>Mon Tableau de Bord</h1>
        <p className="welcome-message">
          Bonjour {user?.displayName || user?.email?.split('@')[0]}! 👋 
          Prêt pour votre session d'apprentissage d'aujourd'hui ?
        </p>
      </div>

      {/* Statistiques */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-number">{dashboardData.stats.enrolledCourses}</div>
          <div className="stat-label">Cours Inscrits</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-number">{dashboardData.stats.completedCourses}</div>
          <div className="stat-label">Cours Terminés</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-number">{dashboardData.stats.totalHours}h</div>
          <div className="stat-label">Heures d'Apprentissage</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-number">{dashboardData.stats.certificates}</div>
          <div className="stat-label">Certificats</div>
        </div>
      </div>

      {/* Cours en cours */}
      <div className="current-courses">
        <div className="section-header">
          <h2>Mes Cours en Cours</h2>
          <Link to="/my-courses" className="view-all">
            Voir tous mes cours →
          </Link>
        </div>
        
        <div className="courses-grid">
          {dashboardData.currentCourses.map(course => (
            <div key={course.id} className="course-progress-card">
              <div className="course-progress-header">
                <div className="course-progress-info">
                  <h4>{course.title}</h4>
                  <p>Prochaine leçon: {course.nextLesson}</p>
                  <p className="last-activity">{course.lastActivity}</p>
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
      </div>

      {/* Activité récente */}
      <div className="recent-activity">
        <div className="section-header">
          <h2>Activité Récente</h2>
        </div>
        
        <div className="activity-list">
          {dashboardData.recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.icon}
              </div>
              <div className="activity-content">
                <h4>{activity.title}</h4>
                <p>{activity.description}</p>
              </div>
              <div className="activity-time">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cours recommandés */}
      <div className="recommended-courses">
        <div className="section-header">
          <h2>Cours Recommandés pour Vous</h2>
          <Link to="/catalog" className="view-all">
            Explorer le catalogue →
          </Link>
        </div>
        
        <div className="recommendations-grid">
          {dashboardData.recommendedCourses.map(course => (
            <div key={course.id} className="recommendation-card">
              <div className="recommendation-icon">{course.icon}</div>
              <h4>{course.title}</h4>
              <p>{course.description}</p>
              <button 
                className="explore-btn"
                onClick={() => handleExploreCourse(course.id)}
              >
                Découvrir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}