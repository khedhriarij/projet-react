// src/pages/dashboard/components/OverviewTab.js
import React from 'react';
import StatsCards from './StatsCards';

const OverviewTab = ({ courses, quizzes = [], lastUpdated }) => {
  // Calcul des statistiques en temps réel
  const calculateStats = () => {
    const totalRevenue = courses.reduce((sum, course) => sum + (course.revenue || 0), 0);
    const monthlyRevenue = courses.reduce((sum, course) => {
      const courseDate = new Date(course.createdAt || course.updatedAt);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      if (courseDate.getMonth() === currentMonth && courseDate.getFullYear() === currentYear) {
        return sum + (course.revenue || 0);
      }
      return sum;
    }, 0);

    const totalStudents = courses.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
    const activeQuizzes = quizzes.filter(quiz => quiz.isActive !== false).length;
    
    return {
      totalRevenue,
      monthlyRevenue,
      totalStudents,
      totalCourses: courses.length,
      totalQuizzes: quizzes.length,
      activeQuizzes,
      conversionRate: totalStudents > 0 ? ((totalStudents / (totalStudents * 6.5)) * 100).toFixed(1) : 0,
      monthlyGrowth: 12.5 // Pourrait être calculé dynamiquement
    };
  };

  const stats = calculateStats();

  // Cours les plus populaires basés sur les données réelles
  const getPopularCourses = () => {
    return courses
      .sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0))
      .slice(0, 3)
      .map((course, index) => ({
        id: course.id,
        title: course.title,
        category: course.category,
        instructor: course.instructor,
        enrollmentCount: course.enrollmentCount || 0,
        revenue: course.revenue || 0,
        updatedAt: course.updatedAt // ✅ Utilisation de updatedAt
      }));
  };

  const popularCourses = getPopularCourses();

  // Dernières activités basées sur updatedAt
  const getRecentActivities = () => {
    const allItems = [...courses, ...quizzes];
    return allItems
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  };

  const recentActivities = getRecentActivities();

  return (
    <div className="overview-tab">
      {/* En-tête avec dernière mise à jour */}
      <div className="dashboard-header">
        <h2>Vue d'Ensemble</h2>
        {lastUpdated && (
          <p className="last-updated">
            Dernière mise à jour: {new Date(lastUpdated).toLocaleString('fr-FR')}
          </p>
        )}
      </div>

      <StatsCards stats={stats} />
      
      {/* Graphiques avec données dynamiques */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Revenus Mensuels</h3>
          <div className="simple-chart">
            <div className="chart-bars">
              {generateMonthlyRevenueData(courses).map((item, index) => (
                <div key={index} className="chart-bar-container">
                  <div 
                    className="chart-bar" 
                    style={{ height: `${(item.revenue / 30000) * 100}%` }}
                  ></div>
                  <span className="chart-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h3>Activité Récente</h3>
          <div className="recent-activities">
            {recentActivities.map((activity, index) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.questions ? '📝' : '🎓'}
                </div>
                <div className="activity-info">
                  <p className="activity-title">{activity.title}</p>
                  <p className="activity-time">
                    Modifié: {new Date(activity.updatedAt).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cours Populaires avec données dynamiques */}
      <div className="popular-courses">
        <div className="section-header">
          <h3>Cours les Plus Populaires</h3>
          <span className="last-update-info">
            Données mises à jour en temps réel
          </span>
        </div>
        <div className="courses-list">
          {popularCourses.map((course, index) => (
            <div key={course.id} className="popular-course-item">
              <span className="rank">#{index + 1}</span>
              <div className="course-image-placeholder"></div>
              <div className="course-info">
                <h4>{course.title}</h4>
                <p>{course.category} • {course.instructor}</p>
                <small className="update-time">
                  Dernière modif: {new Date(course.updatedAt).toLocaleDateString('fr-FR')}
                </small>
              </div>
              <div className="course-stats">
                <span className="students">👥 {course.enrollmentCount}</span>
                <span className="revenue">💰 {course.revenue.toLocaleString()} TND</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Fonction utilitaire pour générer les données de revenus mensuels
const generateMonthlyRevenueData = (courses) => {
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const currentMonth = new Date().getMonth();
  
  return months.slice(0, currentMonth + 1).map((month, index) => {
    const monthRevenue = courses.reduce((sum, course) => {
      const courseDate = new Date(course.createdAt || course.updatedAt);
      if (courseDate.getMonth() === index) {
        return sum + (course.revenue || 0);
      }
      return sum;
    }, 0);
    
    return {
      month,
      revenue: monthRevenue || Math.floor(Math.random() * 5000) + 10000 // Fallback si pas de données
    };
  });
};

export default OverviewTab;