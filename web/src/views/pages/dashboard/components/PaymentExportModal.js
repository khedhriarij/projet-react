// src/pages/dashboard/components/PaymentExportModal.js
import React, { useState } from 'react';

const PaymentExportModal = ({ payments, onClose }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [includeFields, setIncludeFields] = useState([
    'id', 'studentName', 'courseName', 'amount', 'status', 'createdAt'
  ]);

  const exportData = () => {
    const dataToExport = payments.map(payment => {
      const row = {};
      if (includeFields.includes('id')) row['ID'] = payment.id;
      if (includeFields.includes('studentName')) row['Étudiant'] = payment.studentName;
      if (includeFields.includes('studentEmail')) row['Email'] = payment.studentEmail;
      if (includeFields.includes('courseName')) row['Cours'] = payment.courseName;
      if (includeFields.includes('amount')) row['Montant'] = payment.amount;
      if (includeFields.includes('originalAmount')) row['Prix Original'] = payment.originalAmount;
      if (includeFields.includes('discount')) row['Réduction'] = payment.discount;
      if (includeFields.includes('status')) row['Statut'] = payment.status;
      if (includeFields.includes('paymentMethod')) row['Méthode'] = payment.paymentMethod;
      if (includeFields.includes('transactionId')) row['ID Transaction'] = payment.transactionId;
      if (includeFields.includes('createdAt')) row['Date Création'] = payment.createdAt;
      if (includeFields.includes('completedAt')) row['Date Complétion'] = payment.completedAt;
      return row;
    });

    if (exportFormat === 'csv') {
      exportToCSV(dataToExport);
    } else if (exportFormat === 'excel') {
      exportToExcel(dataToExport);
    } else if (exportFormat === 'json') {
      exportToJSON(dataToExport);
    }
  };

  const exportToCSV = (data) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    downloadFile(csvContent, 'paiements.csv', 'text/csv');
  };

  const exportToJSON = (data) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'paiements.json', 'application/json');
  };

  const exportToExcel = (data) => {
    // Pour Excel, on utilise CSV comme solution simple
    // Dans une vraie application, vous utiliseriez une bibliothèque comme SheetJS
    exportToCSV(data);
  };

  const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleField = (field) => {
    setIncludeFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const fieldLabels = {
    id: 'ID Paiement',
    studentName: 'Nom Étudiant',
    studentEmail: 'Email Étudiant',
    courseName: 'Nom du Cours',
    amount: 'Montant',
    originalAmount: 'Prix Original',
    discount: 'Réduction',
    status: 'Statut',
    paymentMethod: 'Méthode de Paiement',
    transactionId: 'ID Transaction',
    createdAt: 'Date de Création',
    completedAt: 'Date de Complétion'
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content export-modal">
        <div className="modal-header">
          <h3>Exporter les Données de Paiement</h3>
          <button className="btn-icon close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="export-options">
            {/* Format d'export */}
            <div className="option-group">
              <label>Format d'export</label>
              <div className="format-options">
                {['csv', 'excel', 'json'].map(format => (
                  <label key={format} className="format-option">
                    <input
                      type="radio"
                      value={format}
                      checked={exportFormat === format}
                      onChange={(e) => setExportFormat(e.target.value)}
                    />
                    <span>{format.toUpperCase()}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Période */}
            <div className="option-group">
              <label>Période</label>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="filter-select"
              >
                <option value="all">Toutes les données</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
              </select>
            </div>

            {/* Champs à inclure */}
            <div className="option-group">
              <label>Champs à inclure</label>
              <div className="fields-grid">
                {Object.entries(fieldLabels).map(([field, label]) => (
                  <label key={field} className="field-option">
                    <input
                      type="checkbox"
                      checked={includeFields.includes(field)}
                      onChange={() => toggleField(field)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Aperçu */}
            <div className="option-group">
              <label>Aperçu des données ({payments.length} enregistrements)</label>
              <div className="preview-table">
                <table>
                  <thead>
                    <tr>
                      {includeFields.map(field => (
                        <th key={field}>{fieldLabels[field]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(0, 3).map((payment, index) => (
                      <tr key={index}>
                        {includeFields.map(field => (
                          <td key={field}>
                            {payment[field] || 'N/A'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payments.length > 3 && (
                  <div className="preview-more">
                    ... et {payments.length - 3} autres enregistrements
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={exportData}>
            📥 Exporter les données
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentExportModal;