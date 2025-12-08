// src/pages/dashboard/components/PaymentTable.js
import React from 'react';

const PaymentTable = ({ payments, onViewDetails, onRefund }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'Complété', class: 'success' },
      pending: { label: 'En attente', class: 'warning' },
      failed: { label: 'Échoué', class: 'danger' },
      refunded: { label: 'Remboursé', class: 'info' }
    };
    
    const config = statusConfig[status] || { label: status, class: 'default' };
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  const getPaymentMethodBadge = (method) => {
    return <span className="method-badge">{method}</span>;
  };

  return (
    <div className="payment-table-container">
      <div className="table-header">
        <h4>Historique des Paiements ({payments.length})</h4>
      </div>

      <div className="table-responsive">
        <table className="data-table payment-table">
          <thead>
            <tr>
              <th>ID Transaction</th>
              <th>Étudiant</th>
              <th>Cours</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Méthode</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id}>
                <td>
                  <div className="transaction-id">
                    <strong>{payment.transactionId}</strong>
                    <small>{payment.paymeeToken}</small>
                  </div>
                </td>
                <td>
                  <div className="student-info">
                    <strong>{payment.studentName}</strong>
                    <small>{payment.studentEmail}</small>
                  </div>
                </td>
                <td>
                  <div className="course-info">
                    <strong>{payment.courseName}</strong>
                    {payment.discount > 0 && (
                      <small className="discount-text">
                        Promotion: -{payment.discount} TND
                      </small>
                    )}
                  </div>
                </td>
                <td>
                  <div className="amount-info">
                    <strong className="amount">{payment.amount} TND</strong>
                    {payment.originalAmount > payment.amount && (
                      <del className="original-amount">
                        {payment.originalAmount} TND
                      </del>
                    )}
                  </div>
                </td>
                <td>{getStatusBadge(payment.status)}</td>
                <td>{getPaymentMethodBadge(payment.paymentMethod)}</td>
                <td>
                  <div className="date-info">
                    <div>{formatDate(payment.createdAt)}</div>
                    {payment.completedAt && (
                      <small className="completed-date">
                        Complété: {formatDate(payment.completedAt)}
                      </small>
                    )}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon view-btn"
                      onClick={() => onViewDetails(payment)}
                      title="Voir détails"
                    >
                      👁️
                    </button>
                    
                    {payment.status === 'completed' && !payment.refunded && (
                      <button
                        className="btn-icon refund-btn"
                        onClick={() => onRefund(payment.id)}
                        title="Rembourser"
                      >
                        💸
                      </button>
                    )}
                    
                    <button
                      className="btn-icon"
                      onClick={() => navigator.clipboard.writeText(payment.transactionId)}
                      title="Copier l'ID"
                    >
                      📋
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <h4>Aucun paiement trouvé</h4>
            <p>Aucun paiement ne correspond à vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTable;