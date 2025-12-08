// src/pages/dashboard/components/PaymentStats.js
import React, { useMemo } from 'react';

const PaymentStats = ({ payments }) => {
  const stats = useMemo(() => {
    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const completedPayments = payments.filter(p => p.status === 'completed').length;
    const failedPayments = payments.filter(p => p.status === 'failed').length;
    const refundedPayments = payments.filter(p => p.status === 'refunded').length;

    const monthlyRevenue = payments
      .filter(p => p.status === 'completed' && 
        new Date(p.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, p) => sum + p.amount, 0);

    const conversionRate = payments.length > 0 
      ? ((completedPayments / payments.length) * 100).toFixed(1)
      : 0;

    return {
      totalRevenue,
      monthlyRevenue,
      pendingPayments,
      completedPayments,
      failedPayments,
      refundedPayments,
      conversionRate,
      totalTransactions: payments.length
    };
  }, [payments]);

  return (
    <div className="payment-stats-grid">
      <div className="stat-card revenue">
        <div className="stat-icon">💰</div>
        <div className="stat-content">
          <h3>Revenu Total</h3>
          <div className="stat-number">{stats.totalRevenue.toFixed(2)} TND</div>
          <div className="stat-subtitle">
            {stats.monthlyRevenue.toFixed(2)} TND ce mois
          </div>
        </div>
      </div>

      <div className="stat-card transactions">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <h3>Transactions</h3>
          <div className="stat-number">{stats.totalTransactions}</div>
          <div className="stat-subtitle">
            {stats.completedPayments} complétées
          </div>
        </div>
      </div>

      <div className="stat-card conversion">
        <div className="stat-icon">📈</div>
        <div className="stat-content">
          <h3>Taux de Conversion</h3>
          <div className="stat-number">{stats.conversionRate}%</div>
          <div className="stat-subtitle">
            Taux de réussite
          </div>
        </div>
      </div>

      <div className="stat-card status">
        <div className="stat-content">
          <div className="status-breakdown">
            <div className="status-item completed">
              <span className="status-dot"></span>
              <span>Complétés: {stats.completedPayments}</span>
            </div>
            <div className="status-item pending">
              <span className="status-dot"></span>
              <span>En attente: {stats.pendingPayments}</span>
            </div>
            <div className="status-item failed">
              <span className="status-dot"></span>
              <span>Échoués: {stats.failedPayments}</span>
            </div>
            <div className="status-item refunded">
              <span className="status-dot"></span>
              <span>Remboursés: {stats.refundedPayments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStats;