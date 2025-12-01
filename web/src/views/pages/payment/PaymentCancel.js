// src/pages/payment/PaymentCancel.js
import { useNavigate } from 'react-router-dom';
import './payment.css';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="payment-result-page">
      <div className="payment-result-content">
        <div className="cancel-icon">⚠️</div>
        <h2>Paiement Annulé</h2>
        <p>Vous avez annulé le processus de paiement.</p>
        <div className="action-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/catalog')}
          >
            Retour au catalogue
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/my-courses')}
          >
            Voir mes cours
          </button>
        </div>
      </div>
    </div>
  );
}