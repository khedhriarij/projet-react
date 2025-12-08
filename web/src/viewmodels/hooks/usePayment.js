// À créer : hooks/usePayment.js
import { useState } from 'react';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const initiatePayment = async (courseId, amount) => {
    setIsProcessing(true);
    try {
      // Intégration API Paymee Sandbox
      const response = await fetch('https://sandbox.paymee.tn/api/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_SANDBOX_TOKEN'
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'TND',
          order_id: `course_${courseId}_${Date.now()}`,
          return_url: `${window.location.origin}/payment-success`,
          cancel_url: `${window.location.origin}/payment-cancel`
        })
      });
      
      const data = await response.json();
      // Redirection vers le checkout Paymee
      window.location.href = data.payment_url;
    } catch (error) {
      console.error('Erreur de paiement:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return { initiatePayment, isProcessing };
};