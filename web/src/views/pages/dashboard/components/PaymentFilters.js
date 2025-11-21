// src/pages/dashboard/components/PaymentFilters.js
import React, { useState } from 'react';

const PaymentFilters = ({ filters, onFiltersChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      paymentMethod: 'all',
      dateRange: 'all',
      search: ''
    });
  };

  return (
    <div className="payment-filters">
      <div className="filters-header">
        <h4>Filtres</h4>
        <button 
          className="btn btn-text"
          onClick={clearFilters}
        >
          Effacer tous les filtres
        </button>
      </div>

      <div className="filters-grid">
        {/* Recherche */}
        <div className="filter-group">
          <label>Recherche</label>
          <input
            type="text"
            placeholder="Rechercher par étudiant, cours, transaction..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />
        </div>

        {/* Statut */}
        <div className="filter-group">
          <label>Statut</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Complété</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoué</option>
            <option value="refunded">Remboursé</option>
          </select>
        </div>

        {/* Méthode de paiement */}
        <div className="filter-group">
          <label>Méthode de paiement</label>
          <select
            value={filters.paymentMethod}
            onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes les méthodes</option>
            <option value="paymee">Paymee</option>
            <option value="card">Carte bancaire</option>
            <option value="wallet">Porte-monnaie</option>
          </select>
        </div>

        {/* Période */}
        <div className="filter-group">
          <label>Période</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="filter-select"
          >
            <option value="all">Toute période</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
          </select>
        </div>
      </div>

      <button 
        className="btn btn-text advanced-toggle"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? '▼' : '▶'} Filtres avancés
      </button>

      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Montant minimum</label>
              <input
                type="number"
                placeholder="0 TND"
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Montant maximum</label>
              <input
                type="number"
                placeholder="1000 TND"
                className="filter-input"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentFilters;