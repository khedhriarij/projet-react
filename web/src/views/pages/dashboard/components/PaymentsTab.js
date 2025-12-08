// src/pages/dashboard/components/PaymentsTab.js
import React, { useState, useMemo } from 'react';
import PaymentStats from './PaymentStats';
import PaymentFilters from './PaymentFilters';
import PaymentTable from './PaymentTable';
import PaymentDetailsModal from './PaymentDetailsModal';
import PaymentExportModal from './PaymentExportModal';
import './Payments.css';
const PaymentsTab = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    paymentMethod: 'all',
    dateRange: 'all',
    search: ''
  });

  // Données mockées - À remplacer par votre API
  const paymentsData = useMemo(() => [
    {
      id: 'PAY-001',
      studentName: 'Ahmed Ben Salah',
      studentEmail: 'ahmed@example.com',
      courseName: 'React Avancé - Les Hooks et Context API',
      amount: 89.00,
      originalAmount: 129.00,
      discount: 40.00,
      status: 'completed',
      paymentMethod: 'paymee',
      transactionId: 'TXN-789123',
      paymeeToken: 'PM-456789',
      createdAt: '2024-01-20T10:30:00',
      completedAt: '2024-01-20T10:32:15',
      refunded: false,
      currency: 'TND'
    },
    {
      id: 'PAY-002',
      studentName: 'Sarah Trabelsi',
      studentEmail: 'sarah@example.com',
      courseName: 'UI/UX Design avec Figma',
      amount: 149.00,
      originalAmount: 149.00,
      discount: 0,
      status: 'pending',
      paymentMethod: 'paymee',
      transactionId: 'TXN-789124',
      paymeeToken: 'PM-456790',
      createdAt: '2024-01-20T09:15:00',
      completedAt: null,
      refunded: false,
      currency: 'TND'
    },
    {
      id: 'PAY-003',
      studentName: 'Mohamed Dridi',
      studentEmail: 'mohamed@example.com',
      courseName: 'Marketing Digital 2024',
      amount: 199.00,
      originalAmount: 299.00,
      discount: 100.00,
      status: 'completed',
      paymentMethod: 'paymee',
      transactionId: 'TXN-789125',
      paymeeToken: 'PM-456791',
      createdAt: '2024-01-19T14:20:00',
      completedAt: '2024-01-19T14:22:30',
      refunded: false,
      currency: 'TND'
    },
    {
      id: 'PAY-004',
      studentName: 'Leila Ben Ammar',
      studentEmail: 'leila@example.com',
      courseName: 'Python & Data Science',
      amount: 179.00,
      originalAmount: 179.00,
      discount: 0,
      status: 'failed',
      paymentMethod: 'paymee',
      transactionId: 'TXN-789126',
      paymeeToken: 'PM-456792',
      createdAt: '2024-01-19T11:45:00',
      completedAt: null,
      refunded: false,
      currency: 'TND',
      failureReason: 'Fonds insuffisants'
    },
    {
      id: 'PAY-005',
      studentName: 'Karim Jlassi',
      studentEmail: 'karim@example.com',
      courseName: 'Adobe Photoshop Pro',
      amount: 99.00,
      originalAmount: 199.00,
      discount: 100.00,
      status: 'refunded',
      paymentMethod: 'paymee',
      transactionId: 'TXN-789127',
      paymeeToken: 'PM-456793',
      createdAt: '2024-01-18T16:30:00',
      completedAt: '2024-01-18T16:32:00',
      refunded: true,
      refundedAt: '2024-01-19T10:00:00',
      currency: 'TND'
    }
  ], []);

  // Filtrer les données
  const filteredPayments = useMemo(() => {
    return paymentsData.filter(payment => {
      if (filters.status !== 'all' && payment.status !== filters.status) return false;
      if (filters.paymentMethod !== 'all' && payment.paymentMethod !== filters.paymentMethod) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          payment.studentName.toLowerCase().includes(searchLower) ||
          payment.studentEmail.toLowerCase().includes(searchLower) ||
          payment.courseName.toLowerCase().includes(searchLower) ||
          payment.transactionId.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [paymentsData, filters]);

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const handleRefund = async (paymentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir rembourser ce paiement ?')) {
      try {
        // Ici, vous appelleriez votre API de remboursement Paymee
        console.log('Remboursement initié pour:', paymentId);
        alert('Demande de remboursement envoyée avec succès');
      } catch (error) {
        console.error('Erreur lors du remboursement:', error);
        alert('Erreur lors du remboursement');
      }
    }
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  return (
    <div className="payments-tab">
      <div className="tab-header">
        <div className="header-content">
          <h2>Gestion des Paiements</h2>
          <p>Gérez et suivez tous les paiements des étudiants</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleExport}
          >
            📊 Exporter les données
          </button>
          <button className="btn btn-primary">
            🔄 Synchroniser Paymee
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <PaymentStats payments={filteredPayments} />

      {/* Filtres */}
      <PaymentFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Tableau des paiements */}
      <PaymentTable 
        payments={filteredPayments}
        onViewDetails={handleViewDetails}
        onRefund={handleRefund}
      />

      {/* Modal des détails */}
      {showDetailsModal && selectedPayment && (
        <PaymentDetailsModal 
          payment={selectedPayment}
          onClose={() => setShowDetailsModal(false)}
          onRefund={handleRefund}
        />
      )}

      {/* Modal d'export */}
      {showExportModal && (
        <PaymentExportModal 
          payments={filteredPayments}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default PaymentsTab;