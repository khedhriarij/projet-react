// src/pages/dashboard/components/OverviewTab.js
import React from 'react';
import StatsCards from './StatsCards';

const OverviewTab = ({ courses }) => {
  // Données mockées pour les stats
  const stats = {
    totalRevenue: 125000,
    monthlyRevenue: 25000,
    totalStudents: 1560,
    totalCourses: courses.length,
    totalInstructors: 8,
    activeUsers: 42,
    conversionRate: 15.5,
    monthlyGrowth: 12.5
  };

  const popularCourses = [
    {
      id: 1,
      title: "React Avancé - Les Hooks et Context API",
      category: "Développement",
      instructor: "Ahmed Ben Ali",
      enrollmentCount: 1240,
      revenue: 110360
    },
    {
      id: 2,
      title: "UI/UX Design avec Figma",
      category: "Design",
      instructor: "Sarah Trabelsi",
      enrollmentCount: 890,
      revenue: 61410
    },
    {
      id: 3,
      title: "Marketing Digital 2024",
      category: "Business", 
      instructor: "Mohamed Dridi",
      enrollmentCount: 1560,
      revenue: 123240
    }
  ];

  return (
    <div className="overview-tab">
      <StatsCards stats={stats} />
      
      {/* Graphiques Simplifiés */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Revenus Mensuels</h3>
          <div className="simple-chart">
            <div className="chart-bars">
              {[
                { month: 'Jan', revenue: 12000 },
                { month: 'Fév', revenue: 19000 },
                { month: 'Mar', revenue: 15000 },
                { month: 'Avr', revenue: 22000 },
                { month: 'Mai', revenue: 18000 },
                { month: 'Jun', revenue: 25000 }
              ].map((item, index) => (
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
          <h3>Répartition par Catégorie</h3>
          <div className="simple-pie">
            <div className="pie-chart">
              <div className="pie-segment development"></div>
              <div className="pie-segment design"></div>
              <div className="pie-segment business"></div>
              <div className="pie-segment marketing"></div>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <span className="legend-color development"></span>
                <span>Développement (40%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color design"></span>
                <span>Design (25%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color business"></span>
                <span>Business (20%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color marketing"></span>
                <span>Marketing (15%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cours Populaires */}
      <div className="popular-courses">
        <h3>Cours les Plus Populaires</h3>
        <div className="courses-list">
          {popularCourses.map((course, index) => (
            <div key={course.id} className="popular-course-item">
              <span className="rank">#{index + 1}</span>
              <div className="course-image-placeholder"></div>
              <div className="course-info">
                <h4>{course.title}</h4>
                <p>{course.category} • {course.instructor}</p>
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

export default OverviewTab;