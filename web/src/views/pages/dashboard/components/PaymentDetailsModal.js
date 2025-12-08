// src/pages/dashboard/components/PaymentDetailsModal.js
import React from 'react';

const PaymentDetailsModal = ({ payment, onClose, onRefund }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: { label: 'Complété', color: '#22c55e', icon: '✅' },
      pending: { label: 'En attente', color: '#f59e0b', icon: '⏳' },
      failed: { label: 'Échoué', color: '#ef4444', icon: '❌' },
      refunded: { label: 'Remboursé', color: '#3b82f6', icon: '💸' }
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(payment.status);

  return (
    <div className="modal-overlay">
      <div className="modal-content payment-details-modal">
        <div className="modal-header">
          <h3>Détails du Paiement</h3>
          <button className="btn-icon close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* En-tête avec statut */}
          <div className="payment-header">
            <div className="payment-status" style={{ borderLeftColor: statusConfig.color }}>
              <div className="status-icon">{statusConfig.icon}</div>
              <div className="status-info">
                <h4 style={{ color: statusConfig.color }}>{statusConfig.label}</h4>
                <p>Transaction {payment.transactionId}</p>
              </div>
            </div>
            <div className="payment-amount">
              <div className="amount-main">{payment.amount} TND</div>
              {payment.discount > 0 && (
                <div className="amount-discount">
                  Économie: {payment.discount} TND
                </div>
              )}
            </div>
          </div>

          <div className="details-grid">
            {/* Informations étudiant */}
            <div className="detail-section">
              <h4>👤 Informations Étudiant</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <label>Nom complet:</label>
                  <span>{payment.studentName}</span>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{payment.studentEmail}</span>
                </div>
              </div>
            </div>

            {/* Informations cours */}
            <div className="detail-section">
              <h4>📚 Informations Cours</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <label>Cours:</label>
                  <span>{payment.courseName}</span>
                </div>
                <div className="detail-item">
                  <label>Prix original:</label>
                  <span>{payment.originalAmount} TND</span>
                </div>
                {payment.discount > 0 && (
                  <div className="detail-item">
                    <label>Réduction:</label>
                    <span className="discount-highlight">-{payment.discount} TND</span>
                  </div>
                )}
              </div>
            </div>

            {/* Informations transaction */}
            <div className="detail-section">
              <h4>💳 Informations Transaction</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <label>ID Transaction:</label>
                  <span className="code">{payment.transactionId}</span>
                </div>
                <div className="detail-item">
                  <label>Token Paymee:</label>
                  <span className="code">{payment.paymeeToken}</span>
                </div>
                <div className="detail-item">
                  <label>Méthode:</label>
                  <span className="method-badge">{payment.paymentMethod}</span>
                </div>
                <div className="detail-item">
                  <label>Devise:</label>
                  <span>{payment.currency}</span>
                </div>
              </div>
            </div>

            {/* Horodatages */}
            <div className="detail-section">
              <h4>🕒 Horodatages</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <label>Créé le:</label>
                  <span>{formatDate(payment.createdAt)}</span>
                </div>
                {payment.completedAt && (
                  <div className="detail-item">
                    <label>Complété le:</label>
                    <span>{formatDate(payment.completedAt)}</span>
                  </div>
                )}
                {payment.refundedAt && (
                  <div className="detail-item">
                    <label>Remboursé le:</label>
                    <span>{formatDate(payment.refundedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Raison d'échec */}
          {payment.failureReason && (
            <div className="detail-section error-section">
              <h4>❌ Raison de l'échec</h4>
              <div className="error-message">
                {payment.failureReason}
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <div className="action-group">
            <button 
              className="btn btn-secondary"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(payment, null, 2))}
            >
              📋 Copier les détails
            </button>
            <button 
              className="btn"
              onClick={() => window.print()}
            >
              🖨️ Imprimer
            </button>
          </div>
          
          <div className="action-group">
            {payment.status === 'completed' && !payment.refunded && (
              <button 
                className="btn btn-warning"
                onClick={() => onRefund(payment.id)}
              >
                💸 Demander un remboursement
              </button>
            )}
            <button 
              className="btn btn-primary"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;