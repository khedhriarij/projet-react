// src/pages/dashboard/components/StatsCards.js
import React, { useMemo } from 'react';

const StatsCards = ({ stats, payments = [], users = [], courses = [], isLoading = false }) => {
  
  // Fonction pour calculer les statistiques dynamiques avec useMemo
  const dynamicStats = useMemo(() => {
    if (isLoading || !stats || !payments || !users || !courses) {
      return {
        activeUsersThisMonth: 0,
        uniqueInstructors: 0,
        monthlyGrowthPercentage: 0,
        studentGrowthPercentage: 0,
        courseGrowthPercentage: 0,
        conversionGrowthPercentage: 0,
        averageCourseRating: 0,
        completionRate: 0
      };
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Calculer les dates pour les comparaisons
    const getPreviousMonthYear = () => {
      if (currentMonth === 0) {
        return { month: 11, year: currentYear - 1 };
      }
      return { month: currentMonth - 1, year: currentYear };
    };

    const prevMonthYear = getPreviousMonthYear();

    // 1. Utilisateurs actifs ce mois-ci (dernière connexion < 30 jours)
    const activeUsersThisMonth = users.filter(user => {
      if (!user.lastLogin) return false;
      const lastLogin = new Date(user.lastLogin);
      const diffTime = Math.abs(currentDate - lastLogin);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    }).length;

    // 2. Formateurs uniques avec vérification
    const uniqueInstructors = [...new Set(
      courses
        .filter(course => course.instructor && course.instructor.trim() !== '')
        .map(course => course.instructor)
    )].length;

    // 3. Revenu du mois précédent
    const previousMonthRevenue = payments.reduce((sum, payment) => {
      if (payment.status === 'completed' && payment.paymentDate) {
        try {
          const paymentDate = new Date(payment.paymentDate);
          if (paymentDate.getMonth() === prevMonthYear.month && 
              paymentDate.getFullYear() === prevMonthYear.year) {
            return sum + (parseFloat(payment.amount) || 0);
          }
        } catch (error) {
          console.error('Erreur de date de paiement:', error);
        }
      }
      return sum;
    }, 0);

    const monthlyGrowthPercentage = previousMonthRevenue > 0 ? 
      ((stats.monthlyRevenue - previousMonthRevenue) / previousMonthRevenue * 100) : 
      stats.monthlyRevenue > 0 ? 100 : 0;

    // 4. Étudiants du mois précédent
    const previousMonthStudents = users.filter(user => {
      if (user.createdAt) {
        try {
          const createdAt = new Date(user.createdAt);
          return createdAt.getMonth() === prevMonthYear.month && 
                 createdAt.getFullYear() === prevMonthYear.year;
        } catch (error) {
          return false;
        }
      }
      return false;
    }).length;

    const studentGrowthPercentage = previousMonthStudents > 0 ? 
      ((stats.totalStudents - previousMonthStudents) / previousMonthStudents * 100) : 
      stats.totalStudents > 0 ? 100 : 0;

    // 5. Cours du mois précédent
    const previousMonthCourses = courses.filter(course => {
      if (course.createdAt) {
        try {
          const createdAt = new Date(course.createdAt);
          return createdAt.getMonth() === prevMonthYear.month && 
                 createdAt.getFullYear() === prevMonthYear.year;
        } catch (error) {
          return false;
        }
      }
      return false;
    }).length;

    const courseGrowthPercentage = previousMonthCourses > 0 ? 
      ((stats.totalCourses - previousMonthCourses) / previousMonthCourses * 100) : 
      stats.totalCourses > 0 ? 100 : 0;

    // 6. Taux de conversion du mois précédent (calculé dynamiquement)
    const previousMonthVisitors = 100; // À remplacer par vos données d'analytics réelles
    const previousMonthPayments = payments.filter(payment => {
      if (payment.status === 'completed' && payment.paymentDate) {
        try {
          const paymentDate = new Date(payment.paymentDate);
          return paymentDate.getMonth() === prevMonthYear.month && 
                 paymentDate.getFullYear() === prevMonthYear.year;
        } catch (error) {
          return false;
        }
      }
      return false;
    }).length;

    const previousMonthConversion = previousMonthVisitors > 0 ? 
      (previousMonthPayments / previousMonthVisitors * 100) : 0;

    const currentMonthVisitors = 150; // À remplacer par vos données d'analytics réelles
    const currentMonthPayments = payments.filter(payment => {
      if (payment.status === 'completed' && payment.paymentDate) {
        try {
          const paymentDate = new Date(payment.paymentDate);
          return paymentDate.getMonth() === currentMonth && 
                 paymentDate.getFullYear() === currentYear;
        } catch (error) {
          return false;
        }
      }
      return false;
    }).length;

    const currentMonthConversion = currentMonthVisitors > 0 ? 
      (currentMonthPayments / currentMonthVisitors * 100) : 0;

    const conversionGrowthPercentage = previousMonthConversion > 0 ? 
      ((currentMonthConversion - previousMonthConversion) / previousMonthConversion * 100) : 
      currentMonthConversion > 0 ? 100 : 0;

    // 7. Note moyenne des cours
    const averageCourseRating = courses.length > 0 ? 
      courses.reduce((sum, course) => sum + (parseFloat(course.rating) || 0), 0) / courses.length : 0;

    // 8. Taux de complétion (simplifié - à adapter selon votre modèle)
    const totalEnrollments = stats.totalEnrollments || 0;
    const completedEnrollments = stats.completedEnrollments || 0;
    const completionRate = totalEnrollments > 0 ? 
      (completedEnrollments / totalEnrollments * 100) : 0;

    return {
      activeUsersThisMonth,
      uniqueInstructors,
      monthlyGrowthPercentage: parseFloat(monthlyGrowthPercentage.toFixed(1)),
      studentGrowthPercentage: parseFloat(studentGrowthPercentage.toFixed(1)),
      courseGrowthPercentage: parseFloat(courseGrowthPercentage.toFixed(1)),
      conversionGrowthPercentage: parseFloat(conversionGrowthPercentage.toFixed(1)),
      averageCourseRating: parseFloat(averageCourseRating.toFixed(1)),
      completionRate: parseFloat(completionRate.toFixed(1)),
      currentMonthConversion: parseFloat(currentMonthConversion.toFixed(1)),
      previousMonthRevenue,
      previousMonthStudents,
      previousMonthCourses
    };
  }, [stats, payments, users, courses, isLoading]);

  // Fonctions utilitaires
  const getTrendColor = (percentage) => {
    const value = parseFloat(percentage);
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  };

  const formatPercentage = (percentage) => {
    const value = parseFloat(percentage);
    if (value > 0) return `+${value.toFixed(1)}%`;
    if (value < 0) return `${value.toFixed(1)}%`;
    return '0%';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const isValidStat = (value) => {
    return value !== undefined && value !== null && !isNaN(value);
  };

  // Squelette de chargement
  if (isLoading) {
    return (
      <div className="stats-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="stat-card loading">
            <div className="stat-header">
              <div className="stat-icon skeleton"></div>
              <div className="stat-trend skeleton"></div>
            </div>
            <div className="stat-value skeleton"></div>
            <div className="stat-label skeleton"></div>
            <div className="stat-subtitle skeleton"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stats-grid">
      {/* Carte des revenus */}
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon revenue">💰</div>
          {isValidStat(dynamicStats.monthlyGrowthPercentage) && (
            <div className={`stat-trend ${getTrendColor(dynamicStats.monthlyGrowthPercentage)}`}>
              {formatPercentage(dynamicStats.monthlyGrowthPercentage)}
            </div>
          )}
        </div>
        <div className="stat-value">
          {isValidStat(stats?.totalRevenue) ? 
            formatCurrency(stats.totalRevenue) : 
            formatCurrency(0)
          }
        </div>
        <div className="stat-label">Revenus Totaux</div>
        <div className="stat-subtitle">
          {isValidStat(stats?.monthlyRevenue) ? 
            `${formatCurrency(stats.monthlyRevenue)} ce mois` : 
            'Chargement...'
          }
        </div>
        
        {/* Barre de progression pour le mois */}
        {isValidStat(stats?.totalRevenue) && stats.totalRevenue > 0 && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${Math.min(100, (stats.monthlyRevenue / stats.totalRevenue) * 100)}%`,
                backgroundColor: '#10b981'
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Carte des étudiants */}
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon students">👥</div>
          {isValidStat(dynamicStats.studentGrowthPercentage) && (
            <div className={`stat-trend ${getTrendColor(dynamicStats.studentGrowthPercentage)}`}>
              {formatPercentage(dynamicStats.studentGrowthPercentage)}
            </div>
          )}
        </div>
        <div className="stat-value">
          {isValidStat(stats?.totalStudents) ? 
            stats.totalStudents.toLocaleString('fr-TN') : '0'
          }
        </div>
        <div className="stat-label">Étudiants Actifs</div>
        <div className="stat-subtitle">
          {isValidStat(dynamicStats.activeUsersThisMonth) ? 
            `${dynamicStats.activeUsersThisMonth} actifs ce mois` : 
            'Chargement...'
          }
        </div>
        
        {/* Indicateur d'activité */}
        {dynamicStats.activeUsersThisMonth > 0 && (
          <div className="activity-indicator">
            <div className="active-dots">
              {[...Array(Math.min(Math.ceil(dynamicStats.activeUsersThisMonth / 20), 5))].map((_, i) => (
                <span key={i} className="active-dot"></span>
              ))}
            </div>
            <span className="activity-text">
              {dynamicStats.activeUsersThisMonth} actifs (30 derniers jours)
            </span>
          </div>
        )}
      </div>

      {/* Carte des cours */}
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon courses">📚</div>
          {isValidStat(dynamicStats.courseGrowthPercentage) && (
            <div className={`stat-trend ${getTrendColor(dynamicStats.courseGrowthPercentage)}`}>
              {formatPercentage(dynamicStats.courseGrowthPercentage)}
            </div>
          )}
        </div>
        <div className="stat-value">
          {isValidStat(stats?.totalCourses) ? 
            stats.totalCourses.toLocaleString('fr-TN') : '0'
          }
        </div>
        <div className="stat-label">Cours Disponibles</div>
        <div className="stat-subtitle">
          {isValidStat(dynamicStats.uniqueInstructors) ? 
            `${dynamicStats.uniqueInstructors} formateurs` : 
            'Chargement...'
          }
        </div>
        
        {/* Distribution par catégorie */}
        {courses.length > 0 && (
          <div className="category-distribution">
            <div className="category-tags">
              {Array.from(new Set(courses
                .filter(c => c.category && c.category.trim() !== '')
                .map(c => c.category)))
                .slice(0, 3)
                .map((category, i) => (
                <span key={i} className="category-tag">
                  {category}
                </span>
              ))}
              {Array.from(new Set(courses.map(c => c.category))).length > 3 && (
                <span className="category-tag more">
                  +{Array.from(new Set(courses.map(c => c.category))).length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Carte du taux de conversion */}
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon conversion">📈</div>
          {isValidStat(dynamicStats.conversionGrowthPercentage) && (
            <div className={`stat-trend ${getTrendColor(dynamicStats.conversionGrowthPercentage)}`}>
              {formatPercentage(dynamicStats.conversionGrowthPercentage)}
            </div>
          )}
        </div>
        <div className="stat-value">
          {isValidStat(dynamicStats.currentMonthConversion) ? 
            `${dynamicStats.currentMonthConversion.toFixed(1)}%` : 
            '0%'
          }
        </div>
        <div className="stat-label">Taux de Conversion</div>
        <div className="stat-subtitle">
          {isValidStat(stats?.totalPayments) ? 
            `${stats.totalPayments} paiements réussis` : 
            'Aucun paiement'
          }
        </div>
        
        {/* Indicateur de performance */}
        {isValidStat(dynamicStats.currentMonthConversion) && (
          <div className="performance-indicator">
            <div className="performance-bar">
              <div 
                className="performance-fill" 
                style={{ 
                  width: `${Math.min(100, dynamicStats.currentMonthConversion)}%`,
                  backgroundColor: dynamicStats.currentMonthConversion > 20 ? 
                    '#10b981' : dynamicStats.currentMonthConversion > 10 ? 
                    '#f59e0b' : '#ef4444'
                }}
              ></div>
            </div>
            <span className="performance-text">
              {dynamicStats.currentMonthConversion > 20 ? 'Excellent' : 
               dynamicStats.currentMonthConversion > 10 ? 'Bon' : 
               'À améliorer'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCards;