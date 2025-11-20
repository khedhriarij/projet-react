// src/pages/dashboard/components/StatsCards.js
import React from 'react';

const StatsCards = ({ stats }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-trend positive">+{stats.monthlyGrowth}%</div>
        </div>
        <div className="stat-value">{stats.totalRevenue.toLocaleString()} TND</div>
        <div className="stat-label">Revenus Totaux</div>
        <div className="stat-subtitle">{stats.monthlyRevenue.toLocaleString()} TND ce mois</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon students">👥</div>
          <div className="stat-trend positive">+12%</div>
        </div>
        <div className="stat-value">{stats.totalStudents}</div>
        <div className="stat-label">Étudiants Actifs</div>
        <div className="stat-subtitle">{stats.activeUsers} en ligne</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon courses">📚</div>
          <div className="stat-trend positive">+5%</div>
        </div>
        <div className="stat-value">{stats.totalCourses}</div>
        <div className="stat-label">Cours Disponibles</div>
        <div className="stat-subtitle">{stats.totalInstructors} formateurs</div>
      </div>

      <div className="stat-card">
        <div className="stat-header">
          <div className="stat-icon conversion">📈</div>
          <div className="stat-trend positive">+8%</div>
        </div>
        <div className="stat-value">{stats.conversionRate}%</div>
        <div className="stat-label">Taux de Conversion</div>
        <div className="stat-subtitle">Performance moyenne</div>
      </div>
    </div>
  );
};

export default StatsCards;