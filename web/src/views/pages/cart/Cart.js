import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../viewmodels/context/CartContext';
import { useCoursePurchase } from '../../../viewmodels/hooks/useCoursePurchase';
import { useAuthContext } from '../../../viewmodels/hooks/useAuthContext';
import './cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { cartItems, removeFromCart, clearCart, getTotalPrice } = useCart();
  // ✅ FIX: Add purchaseCart to the destructuring
  const { purchaseCourse, purchaseCart } = useCoursePurchase();
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      alert('Veuillez vous connecter pour finaliser votre commande');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    setProcessing(true);

    try {
      const totalAmount = getTotalPrice();
      const success = await purchaseCart(cartItems, totalAmount); // ✅ Use purchaseCart
      
      if (success) {
        clearCart();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erreur lors du paiement: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  // ✅ You can remove handleMultipleCoursesPurchase function now since purchaseCart handles it

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <div className="cart-header">
          <h1>Votre Panier</h1>
        </div>
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛒</div>
          <h3>Votre panier est vide</h3>
          <p>Ajoutez des cours à votre panier pour commencer votre apprentissage</p>
          <button 
            onClick={() => navigate('/catalog')}
            className="btn btn-primary"
          >
            Explorer le catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Votre Panier ({cartItems.length} cours)</h1>
        <button 
          onClick={clearCart}
          className="clear-cart-btn"
        >
          Vider le panier
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.cartId} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <div className="cart-item-meta">
                  <span className="instructor">Formateur: {item.instructor}</span>
                  <span className="category">{item.category}</span>
                  <span className="level">Niveau: {item.level}</span>
                </div>
                <div className="cart-item-price">
                  {item.price} TND
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.cartId)}
                className="remove-item-btn"
              >
                ✕ Supprimer
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Résumé de la commande</h3>
          <div className="summary-details">
            <div className="summary-row">
              <span>Sous-total ({cartItems.length} cours)</span>
              <span>{getTotalPrice()} TND</span>
            </div>
            <div className="summary-row">
              <span>Économies</span>
              <span className="savings">0 TND</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span className="total-price">{getTotalPrice()} TND</span>
            </div>
          </div>
          
          <div className="cart-actions">
            <button
              onClick={handleCheckout}
              disabled={processing}
              className="checkout-btn"
            >
              {processing ? 'Traitement...' : `Finaliser la commande - ${getTotalPrice()} TND`}
            </button>
            <button
              onClick={() => navigate('/catalog')}
              className="continue-shopping-btn"
            >
              Continuer vos achats
            </button>
          </div>

          <div className="cart-guarantee">
            <div className="guarantee-item">✅ 30 jours satisfait ou remboursé</div>
            <div className="guarantee-item">✅ Accès à vie au contenu</div>
            <div className="guarantee-item">✅ Certificat d'achèvement</div>
          </div>
        </div>
      </div>
    </div>
  );
}