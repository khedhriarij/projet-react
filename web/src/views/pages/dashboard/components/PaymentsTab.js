// pages/dashboard/PaymentsTab.js
import React from 'react';

const PaymentsTab = () => {
  return (
    <div className="payments-tab">
      <h2>Gestion des Paiements</h2>
      <div className="coming-soon">
        <p>🚧 Intégration Paymee en cours de développement</p>
        <div className="features-list">
          <h4>Fonctionnalités à venir :</h4>
          <ul>
            <li>Historique des transactions</li>
            <li>Statuts des paiements</li>
            <li>Rapports financiers</li>
            <li>Export des données</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentsTab;